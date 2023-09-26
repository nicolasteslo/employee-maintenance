import { Employees, Prisma } from '@prisma/client';
import { EmployeesDepartmentsHistoryResponse } from './employeesDepartmentsHistory';

export interface EmployeeResponse extends Omit<Employees, 'createdAt' | 'updatedAt' | 'hireDate' > {
  hireDate: string | Date
  departmentHistory: EmployeesDepartmentsHistoryResponse[]
}

export type EmployeeCreateBody = Omit<Prisma.EmployeesCreateInput, 'hireDate' | 'createdAt' | 'updatedAt' > & {
  hireDate: string;
};

export interface EmployeeUpdateBody extends Partial<EmployeeResponse> {}
