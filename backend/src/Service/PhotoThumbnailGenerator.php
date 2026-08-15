<?php

namespace App\Service;

use League\Flysystem\FilesystemOperator;
use Symfony\Component\DependencyInjection\Attribute\Target;

/**
 * Generates a pre-sized copy of an uploaded photo for fast, cheap-to-serve
 * thumbnails - grid/card/featured views use these directly instead of
 * asking Next.js's image optimizer to resize the (often much larger)
 * original on every first view, which is real CPU work and, under
 * concurrent load from a big album, was slow and occasionally timing out.
 */
class PhotoThumbnailGenerator
{
    private const MAX_WIDTH = 800;
    private const JPEG_QUALITY = 80;

    public function __construct(
        #[Target('photos.storage')] private readonly FilesystemOperator $storage,
        #[Target('photos_thumbnails.storage')] private readonly FilesystemOperator $thumbnailStorage,
    ) {
    }

    /**
     * Reads $imageName from photos.storage, writes a thumbnail of it to
     * photos_thumbnails.storage under the same name, and returns whether it
     * succeeded. Never throws - any failure (unreadable original, corrupt
     * image, unsupported format) just means no thumbnail, and callers fall
     * back to resizing the original on demand.
     */
    public function generate(string $imageName): bool
    {
        try {
            $original = $this->storage->read($imageName);
        } catch (\Throwable) {
            return false;
        }

        $image = @imagecreatefromstring($original);
        if (false === $image) {
            return false;
        }

        try {
            $orientation = $this->readOrientation($original);

            if (1 === $orientation && imagesx($image) <= self::MAX_WIDTH) {
                // Nothing to correct and no resize needed - the original
                // bytes are already exactly right, so use them as-is rather
                // than needlessly re-encode (and lose a little quality to
                // recompression) a file that doesn't need to change at all.
                $this->thumbnailStorage->write($imageName, $original);

                return true;
            }

            $image = $this->correctOrientation($image, $orientation);
            $image = $this->constrainWidth($image);

            ob_start();
            $encoded = imagejpeg($image, null, self::JPEG_QUALITY);
            $bytes = ob_get_clean();

            if (!$encoded || !\is_string($bytes)) {
                return false;
            }

            $this->thumbnailStorage->write($imageName, $bytes);

            return true;
        } catch (\Throwable) {
            return false;
        } finally {
            imagedestroy($image);
        }
    }

    /**
     * GD ignores EXIF orientation when decoding (imagecreatefromstring())
     * and strips all metadata when it re-encodes - so a portrait phone
     * photo (sensor-landscape pixels + an orientation tag saying "rotate to
     * view correctly") comes out sideways once resized, with no tag left
     * for anything downstream to correct. This physically applies the
     * rotation/flip the tag calls for before resizing, so the output bytes
     * are correct on their own regardless of what reads them.
     *
     * Standard EXIF orientation values and their required correction -
     * verified empirically against Pillow's ImageOps.exif_transpose() as a
     * reference (pixel-diffed each of the 8 cases), not just derived from
     * the spec text, since GD's imagerotate() takes the *opposite* sign
     * convention to what "orientation 6 = rotate 90 CW" reads like at first
     * glance (positive angle = counter-clockwise).
     */
    private function correctOrientation(\GdImage $image, int $orientation): \GdImage
    {
        return match ($orientation) {
            2 => $this->flip($image, \IMG_FLIP_HORIZONTAL),
            3 => $this->rotate($image, 180),
            4 => $this->flip($image, \IMG_FLIP_VERTICAL),
            5 => $this->rotate($this->flip($image, \IMG_FLIP_HORIZONTAL), 90),
            6 => $this->rotate($image, -90),
            7 => $this->rotate($this->flip($image, \IMG_FLIP_HORIZONTAL), -90),
            8 => $this->rotate($image, 90),
            default => $image,
        };
    }

    private function readOrientation(string $original): int
    {
        // exif_read_data() needs a path or stream, not a raw byte string -
        // the data:// wrapper avoids a second storage fetch just to read
        // one tag from bytes already in hand.
        $exif = @exif_read_data('data://image/jpeg;base64,'.base64_encode($original));
        if (false === $exif || !isset($exif['Orientation'])) {
            return 1;
        }

        $orientation = (int) $exif['Orientation'];

        return $orientation >= 1 && $orientation <= 8 ? $orientation : 1;
    }

    private function flip(\GdImage $image, int $mode): \GdImage
    {
        imageflip($image, $mode);

        return $image;
    }

    private function rotate(\GdImage $image, float $angle): \GdImage
    {
        $rotated = imagerotate($image, $angle, 0);
        if (false === $rotated) {
            return $image;
        }

        imagedestroy($image);

        return $rotated;
    }

    private function constrainWidth(\GdImage $image): \GdImage
    {
        $width = imagesx($image);
        if ($width <= self::MAX_WIDTH) {
            return $image;
        }

        $height = imagesy($image);
        $newHeight = (int) round($height * (self::MAX_WIDTH / $width));

        // imagecopyresampled() rather than the newer imagescale(): the
        // latter's IMG_BICUBIC/IMG_BICUBIC_FIXED modes fail outright (return
        // false) on this GD build - confirmed by testing every documented
        // mode individually, not a one-off. imagecopyresampled() is the
        // older, more battle-tested function most PHP codebases already use
        // for exactly this, and doesn't have that problem.
        $resized = imagecreatetruecolor(self::MAX_WIDTH, $newHeight);
        if (!imagecopyresampled($resized, $image, 0, 0, 0, 0, self::MAX_WIDTH, $newHeight, $width, $height)) {
            imagedestroy($resized);

            return $image;
        }

        imagedestroy($image);

        return $resized;
    }
}
