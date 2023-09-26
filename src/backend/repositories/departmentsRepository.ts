import { PrismaClient } from '@prisma/client';
import { departmentsDTO } from '@/backend/dtos/departmentsDtos';
import { DepartmentResponse, DepartmentCreateBody } from '@/backend/types/departments';

const prisma = new PrismaClient();

export async function getAllDepartments(): Promise<DepartmentResponse[]> {
  const departments = await prisma.departments.findMany({
    select: departmentsDTO,
  });

  return departments;
}

export async function createDepartment(
  departmentBody: DepartmentCreateBody,
): Promise< DepartmentResponse > {
  const createdDepartment = await prisma.departments.create({
    data: departmentBody,
  });

  return createdDepartment;
}

export async function getDepartmentByName(
  departmentName: string,
): Promise< DepartmentResponse | null > {
  const department = await prisma.departments.findUnique({
    where: {
      name: departmentName,
    },
  });

  return department;
}
