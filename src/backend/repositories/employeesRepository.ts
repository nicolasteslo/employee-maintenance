import { PrismaClient } from '@prisma/client';
import { employeeDTO } from '@/backend/dtos/employeesDtos';
import { EmployeeResponse, EmployeeUpdateBody, EmployeeCreateBody } from '@/backend/types/employees';
import { createEmployeeDepartmentHistory } from '@/backend/repositories/employeesDepartmentsHistoryRepository';

const prisma = new PrismaClient();

export async function getAllEmployees(): Promise<EmployeeResponse[]> {
  const employees = await prisma.employees.findMany({
    select: employeeDTO,
  });

  return employees;
}

export async function getEmployee(
  employeeId: number,
): Promise< EmployeeResponse | null > {
  const employee = await prisma.employees.findUnique({
    where: {
      id: Number(employeeId),
    },
    select: employeeDTO,
  });

  return employee;
}

export async function createEmployee(
  employeeBody: EmployeeCreateBody,
): Promise< EmployeeResponse | null > {
  const createdEmployee = await prisma.employees.create({
    data: employeeBody,
    select: employeeDTO,
  });

  await createEmployeeDepartmentHistory({
    employeeId: createdEmployee.id,
    departmentName: createdEmployee.departmentName,
  });

  const newEmployee = await getEmployee(createdEmployee.id);

  return newEmployee;
}

export async function updateEmployee(
  employeeId: number,
  employeeBody: Omit<EmployeeUpdateBody, 'departmentHistory'>,
): Promise< EmployeeResponse > {
  const updatedEmployee = await prisma.employees.update({
    where: {
      id: employeeId,
    },
    data: employeeBody,
    select: employeeDTO,
  });

  return updatedEmployee;
}

export async function deleteEmployee(
  employeeId: number,
): Promise< EmployeeResponse > {
  const deletedEmployee = await prisma.employees.delete({
    where: {
      id: employeeId,
    },
    select: employeeDTO,
  });

  return deletedEmployee;
}
