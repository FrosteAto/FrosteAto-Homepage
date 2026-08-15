<?php

namespace App\Service;

use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Target;

/**
 * Reads and parses EXIF metadata from an already-uploaded photo's original
 * file. Shared by PhotoExifListener (runs once, at upload time) and
 * PhotoMetadataBackfillController (re-runs the same detection on demand,
 * for photos uploaded before a given field existed).
 */
class PhotoExifReader
{
    public function __construct(
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
    ) {
    }

    public function readExif(string $imageName): ?array
    {
        $stream = null;

        try {
            $stream = $this->storage->readStream($imageName);
            $exif = @exif_read_data($stream);
        } catch (\Throwable) {
            return null;
        } finally {
            if (\is_resource($stream)) {
                fclose($stream);
            }
        }

        return false !== $exif ? $exif : null;
    }

    public function detectCameraName(array $exif): ?string
    {
        $make = isset($exif['Make']) ? trim((string) $exif['Make']) : '';
        $model = isset($exif['Model']) ? trim((string) $exif['Model']) : '';

        $name = $this->combineMakeModel($make, $model);

        // Clamped here rather than left to the caller: every consumer needs
        // this to fit Camera.name's column length before using it.
        return null !== $name ? mb_substr($name, 0, 100) : null;
    }

    private function combineMakeModel(string $make, string $model): ?string
    {
        if ('' === $model) {
            return '' !== $make ? $make : null;
        }

        if ('' === $make) {
            return $model;
        }

        // Compare against Make's first word, not the whole string: real EXIF
        // commonly has a verbose Make ("NIKON CORPORATION") whose Model
        // ("NIKON D750") only echoes the brand's first word, not the full
        // string - matching the whole Make would miss that and produce
        // "NIKON CORPORATION NIKON D750".
        $makeFirstWord = strtolower(strtok($make, ' '));
        if (str_starts_with(strtolower($model), $makeFirstWord)) {
            return $model;
        }

        return $make.' '.$model;
    }

    public function detectTakenAt(array $exif): ?\DateTimeImmutable
    {
        // DateTimeOriginal is when the shutter fired; DateTimeDigitized is
        // usually identical for straight-from-camera JPEGs. Deliberately NOT
        // falling back to the plain "DateTime" tag - that one tracks when the
        // file/metadata was last modified (e.g. by editing software), which
        // can silently misrepresent when the photo was actually taken.
        $value = $exif['DateTimeOriginal'] ?? $exif['DateTimeDigitized'] ?? null;
        if (!\is_string($value) || '' === trim($value)) {
            return null;
        }

        $date = \DateTimeImmutable::createFromFormat('Y:m:d H:i:s', trim($value));

        return false !== $date ? $date : null;
    }

    public function detectAperture(array $exif): ?string
    {
        $value = $this->parseRational($exif['FNumber'] ?? null);
        if (null === $value || $value <= 0) {
            return null;
        }

        return 'f/'.$this->trimTrailingZero(round($value, 1));
    }

    public function detectShutterSpeed(array $exif): ?string
    {
        $value = $this->parseRational($exif['ExposureTime'] ?? null);
        if (null === $value || $value <= 0) {
            return null;
        }

        if ($value >= 1) {
            return $this->trimTrailingZero(round($value, 1)).'s';
        }

        return '1/'.(int) round(1 / $value).'s';
    }

    public function detectIso(array $exif): ?int
    {
        $value = $exif['ISOSpeedRatings'] ?? null;
        // Bracketed/multi-shot modes can report ISO as an array - the first
        // value is the one that applies to this exposure.
        if (\is_array($value)) {
            $value = $value[0] ?? null;
        }

        return is_numeric($value) ? (int) $value : null;
    }

    public function detectFocalLength(array $exif): ?string
    {
        $value = $this->parseRational($exif['FocalLength'] ?? null);
        if (null === $value || $value <= 0) {
            return null;
        }

        return ((int) round($value)).'mm';
    }

    /**
     * exif_read_data() leaves rational tags (FNumber, ExposureTime,
     * FocalLength) as "numerator/denominator" strings rather than resolving
     * them to a decimal - this does that division. Accepts a plain numeric
     * value too, in case a given file/driver already resolved it.
     */
    private function parseRational(mixed $raw): ?float
    {
        if (\is_numeric($raw)) {
            return (float) $raw;
        }

        if (!\is_string($raw) || !str_contains($raw, '/')) {
            return null;
        }

        [$numerator, $denominator] = array_map('floatval', explode('/', $raw, 2));

        return 0.0 !== $denominator ? $numerator / $denominator : null;
    }

    private function trimTrailingZero(float $value): string
    {
        return rtrim(rtrim(number_format($value, 1), '0'), '.');
    }
}
