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
            $thumbnail = $this->resize($image, $original);
            if (null === $thumbnail) {
                return false;
            }

            $this->thumbnailStorage->write($imageName, $thumbnail);

            return true;
        } catch (\Throwable) {
            return false;
        } finally {
            imagedestroy($image);
        }
    }

    /**
     * @param \GdImage $image decoded form of $original, so its dimensions
     *                        can be checked without re-decoding
     */
    private function resize(\GdImage $image, string $original): ?string
    {
        $width = imagesx($image);
        $height = imagesy($image);

        if ($width <= self::MAX_WIDTH) {
            // Already small enough - use as-is rather than upscale or
            // needlessly re-encode (and potentially lose quality) a file
            // that's already the right size.
            return $original;
        }

        $newHeight = (int) round($height * (self::MAX_WIDTH / $width));

        // imagecopyresampled() rather than the newer imagescale(): the
        // latter's IMG_BICUBIC/IMG_BICUBIC_FIXED modes fail outright (return
        // false) on this GD build - confirmed by testing every documented
        // mode individually, not a one-off. imagecopyresampled() is the
        // older, more battle-tested function most PHP codebases already use
        // for exactly this, and doesn't have that problem.
        $resized = imagecreatetruecolor(self::MAX_WIDTH, $newHeight);
        $ok = imagecopyresampled($resized, $image, 0, 0, 0, 0, self::MAX_WIDTH, $newHeight, $width, $height);
        if (!$ok) {
            imagedestroy($resized);

            return null;
        }

        try {
            ob_start();
            $encoded = imagejpeg($resized, null, self::JPEG_QUALITY);
            $bytes = ob_get_clean();

            return $encoded && \is_string($bytes) ? $bytes : null;
        } finally {
            imagedestroy($resized);
        }
    }
}
