const createTable ='CREATE TABLE `salvage`.`salvage_status` ( `salvage_status_id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(100) NOT NULL , `code` VARCHAR(100) NOT NULL , `created_by` INT NOT NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , `updated_by` INT NULL , `updated_at` TIMESTAMP on update CURRENT_TIMESTAMP NULL , PRIMARY KEY (`salvage_status_id`)) ENGINE = InnoDB;'