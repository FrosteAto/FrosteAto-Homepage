<?php

namespace App\Service;

use lsolesen\pel\PelDataWindow;
use lsolesen\pel\PelIfd;
use lsolesen\pel\PelJpeg;

/**
 * Removes GPS location data from a JPEG's embedded EXIF, leaving other
 * EXIF (camera, date, exposure settings) and the image data itself
 * untouched - no recompression, so no quality loss. Always safe to call:
 * returns the input unchanged if it isn't a JPEG, has no EXIF, or has no
 * GPS data to begin with, or if anything about the file is unparseable.
 */
class PhotoGpsStripper
{
    public function strip(string $jpegBytes): string
    {
        try {
            $jpeg = new PelJpeg(new PelDataWindow($jpegBytes));
            $ifd0 = $jpeg->getExif()?->getTiff()?->getIfd();

            if (null === $ifd0 || null === $ifd0->getSubIfd(PelIfd::GPS)) {
                return $jpegBytes;
            }

            // pel exposes no removeSubIfd() - addSubIfd() replaces whatever
            // is already stored for a given type, so swapping in a fresh,
            // empty GPS IFD is the supported way to clear it. The GPS
            // pointer tag is still written on save (pel emits one for
            // every entry in its internal sub-IFD list), but it now points
            // to an IFD with zero entries - no coordinates, timestamp, or
            // any other GPS field survives.
            $ifd0->addSubIfd(new PelIfd(PelIfd::GPS));

            return $jpeg->getBytes();
        } catch (\Throwable) {
            return $jpegBytes;
        }
    }
}
