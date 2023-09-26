import { PrismaClient } from '@prisma/client';
import { EmployeesDepartmentsHistoryResponse, EmployeesDepartmentsHistoryCreateBody } from '@/backend/types/employeesDepartmentsHistory';

const prisma = new PrismaClient();

export async function createEmployeeDepartmentHistory(
  departmentHistoryBody: EmployeesDepartmentsHistoryCreateBody,
): Promise< EmployeesDepartmentsHistoryResponse > {
  const createdEmployeeDepartmentHistory = await prisma.employeesDepartmentsHistory.create({
    data: departmentHistoryBody,
  });

  return createdEmployeeDepartmentHistory;
}
