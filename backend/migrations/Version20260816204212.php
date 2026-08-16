<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260816204212 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // kcal_per_serving is required going forward, but existing rows have
        // no value - add it nullable, backfill a safe placeholder, then lock
        // it down to NOT NULL. (Real per-recipe values for any pre-existing
        // rows are a content fix, not a schema migration's job.)
        $this->addSql('ALTER TABLE recipe ADD kcal_per_serving INT DEFAULT NULL');
        $this->addSql('ALTER TABLE recipe ADD protein_per_serving INT DEFAULT NULL');
        $this->addSql('UPDATE recipe SET kcal_per_serving = 0 WHERE kcal_per_serving IS NULL');
        $this->addSql('ALTER TABLE recipe ALTER COLUMN kcal_per_serving SET NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE recipe DROP kcal_per_serving');
        $this->addSql('ALTER TABLE recipe DROP protein_per_serving');
    }
}
