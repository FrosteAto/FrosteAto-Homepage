<?php

namespace App\Entity;

/**
 * Implemented by content entities with a draft/publish flow: a null (or
 * future-dated) publishedAt hides the entity from non-admins. See
 * PublishedContentExtension, which applies that rule at the API query
 * layer for every entity implementing this interface.
 */
interface Publishable
{
    public function getPublishedAt(): ?\DateTimeImmutable;
}
