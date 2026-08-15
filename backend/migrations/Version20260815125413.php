<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260815125413 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE photo ADD aperture VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE photo ADD shutter_speed VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE photo ADD iso INT DEFAULT NULL');
        $this->addSql('ALTER TABLE photo ADD focal_length VARCHAR(20) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE photo DROP aperture');
        $this->addSql('ALTER TABLE photo DROP shutter_speed');
        $this->addSql('ALTER TABLE photo DROP iso');
        $this->addSql('ALTER TABLE photo DROP focal_length');
    }
}
