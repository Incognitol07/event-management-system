-- CreateTable
CREATE TABLE `Location` (
    `LocationID` INTEGER NOT NULL AUTO_INCREMENT,
    `LocationName` VARCHAR(255) NOT NULL,
    `Capacity` INTEGER NOT NULL,

    PRIMARY KEY (`LocationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organizer` (
    `OrgID` INTEGER NOT NULL AUTO_INCREMENT,
    `OrgName` VARCHAR(255) NOT NULL,
    `OrgContact` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`OrgID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendee` (
    `AttendeeID` INTEGER NOT NULL AUTO_INCREMENT,
    `AttendeeName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `StudentID` VARCHAR(50) NULL,

    UNIQUE INDEX `Attendee_email_key`(`email`),
    PRIMARY KEY (`AttendeeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Resource` (
    `ResourceID` INTEGER NOT NULL AUTO_INCREMENT,
    `ResourceName` VARCHAR(255) NOT NULL,
    `QuantityAvailable` INTEGER NOT NULL,

    PRIMARY KEY (`ResourceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `EventID` INTEGER NOT NULL AUTO_INCREMENT,
    `EventName` VARCHAR(255) NOT NULL,
    `EventDate` DATE NOT NULL,
    `StartTime` TIME NOT NULL,
    `EndTime` TIME NOT NULL,
    `LocationID` INTEGER NOT NULL,
    `IsRecurring` BOOLEAN NOT NULL DEFAULT false,
    `RecurStartDate` DATE NULL,
    `RecurEndDate` DATE NULL,

    PRIMARY KEY (`EventID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Organizer` (
    `EventID` INTEGER NOT NULL,
    `OrgID` INTEGER NOT NULL,
    `Role` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`EventID`, `OrgID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Attendee` (
    `EventID` INTEGER NOT NULL,
    `AttendeeID` INTEGER NOT NULL,
    `RegistrationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`EventID`, `AttendeeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Resource` (
    `EventID` INTEGER NOT NULL,
    `ResourceID` INTEGER NOT NULL,
    `QuantityNeeded` INTEGER NOT NULL,

    PRIMARY KEY (`EventID`, `ResourceID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_LocationID_fkey` FOREIGN KEY (`LocationID`) REFERENCES `Location`(`LocationID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer` ADD CONSTRAINT `Event_Organizer_EventID_fkey` FOREIGN KEY (`EventID`) REFERENCES `Event`(`EventID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Organizer` ADD CONSTRAINT `Event_Organizer_OrgID_fkey` FOREIGN KEY (`OrgID`) REFERENCES `Organizer`(`OrgID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Attendee` ADD CONSTRAINT `Event_Attendee_EventID_fkey` FOREIGN KEY (`EventID`) REFERENCES `Event`(`EventID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Attendee` ADD CONSTRAINT `Event_Attendee_AttendeeID_fkey` FOREIGN KEY (`AttendeeID`) REFERENCES `Attendee`(`AttendeeID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Resource` ADD CONSTRAINT `Event_Resource_EventID_fkey` FOREIGN KEY (`EventID`) REFERENCES `Event`(`EventID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Resource` ADD CONSTRAINT `Event_Resource_ResourceID_fkey` FOREIGN KEY (`ResourceID`) REFERENCES `Resource`(`ResourceID`) ON DELETE CASCADE ON UPDATE CASCADE;
