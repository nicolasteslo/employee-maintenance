-- DropForeignKey
ALTER TABLE `EmployeesDepartmentsHistory` DROP FOREIGN KEY `EmployeesDepartmentsHistory_employeeId_fkey`;

-- AddForeignKey
ALTER TABLE `EmployeesDepartmentsHistory` ADD CONSTRAINT `EmployeesDepartmentsHistory_employeeId_fkey` FOREIGN KEY (`employeeId`) REFERENCES `Employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
