SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `imagebin` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
USE `imagebin` ;

-- -----------------------------------------------------
-- Table `imagebin`.`Painting`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `imagebin`.`Painting` (
  `Painting_ID` INT(32) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `sequenceKey` VARCHAR(45) CHARACTER SET 'ascii' COLLATE 'ascii_bin' NOT NULL ,
  `paintingName` VARCHAR(250) NULL ,
  `isARemixOfPainting_ID` INT(32) UNSIGNED NULL DEFAULT NULL ,
  `authorName` VARCHAR(100) NULL ,
  `isVisibleToPublic` BIT(2) NOT NULL ,
  `lastUpdated` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `renderedSHA256Hash` CHAR(128) CHARACTER SET 'ascii' COLLATE 'ascii_general_ci' NULL ,
  PRIMARY KEY (`Painting_ID`) ,
  UNIQUE INDEX `UQ_sequenceKey` (`sequenceKey` ASC) ,
  INDEX `fk_Painting_remix_ID` (`isARemixOfPainting_ID` ASC) ,
  CONSTRAINT `fk_Painting_remix_ID`
    FOREIGN KEY (`isARemixOfPainting_ID` )
    REFERENCES `imagebin`.`Painting` (`Painting_ID` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 100
PACK_KEYS = 1
ROW_FORMAT = DEFAULT;


-- -----------------------------------------------------
-- Table `imagebin`.`AccessLog`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `imagebin`.`AccessLog` (
  `AccessLog_ID` INT(32) UNSIGNED NOT NULL AUTO_INCREMENT ,
  `ipAddress` VARCHAR(45) NULL ,
  `Painting_ID` INT(32) UNSIGNED NULL DEFAULT NULL ,
  `Page` VARCHAR(250) NULL ,
  `_GET` BLOB NULL ,
  `_POST` BLOB NULL ,
  `_SERVER` BLOB NULL ,
  `accessTime` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`AccessLog_ID`) ,
  INDEX `fk_AccessLog_2_Painting` (`Painting_ID` ASC) ,
  CONSTRAINT `fk_AccessLog_2_Painting`
    FOREIGN KEY (`Painting_ID` )
    REFERENCES `imagebin`.`Painting` (`Painting_ID` )
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Placeholder table for view `imagebin`.`SimplePaintingView`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `imagebin`.`SimplePaintingView` (`id` INT);

-- -----------------------------------------------------
-- procedure InsertNewImage
-- -----------------------------------------------------

DELIMITER $$
USE `imagebin`$$
CREATE PROCEDURE `imagebin`.`InsertNewImage` (IN sha256Hash)
BEGIN



END$$

DELIMITER ;

-- -----------------------------------------------------
-- View `imagebin`.`SimplePaintingView`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `imagebin`.`SimplePaintingView`;
USE `imagebin`;
CREATE  OR REPLACE VIEW `imagebin`.`SimplePaintingView` AS
SELECT 
  sequenceKey `key`,
  IF(imageName IS NULL OR !imageName, 'Untitled', Painting.imageName) as `imageName`,
  IF(authorName IS NULL OR !authorName, 'Anonymous', Painting.imageName) as `authorName`
  IF(isARemixOfPainting_ID IS NOT NULL, (
    SELECT sequenceKey 
    FROM PaintingInner 
    WHERE PaintingInner.Painting_ID = Painting.isARemixOfPainting_ID
    ) as remixSequenceKey,
  lastUpated as `dateAdded`

FROM Painting;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
