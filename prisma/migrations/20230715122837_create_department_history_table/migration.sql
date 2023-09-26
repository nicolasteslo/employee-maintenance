-- CreateTable
CREATE TABLE `EmployeesDepartmentsHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `employeeId` INTEGER NOT NULL,
    `departmentName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EmployeesDepartmentsHistory` ADD CONSTRAINT `EmployeesDepartmentsHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmployeesDepartmentsHistory` ADD CONSTRAINT `EmployeesDepartmentsHistory_departmentName_fkey` FOREIGN KEY (`departmentName`) REFERENCES `Departments`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
