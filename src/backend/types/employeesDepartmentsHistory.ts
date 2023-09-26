import { EmployeesDepartmentsHistory } from '@prisma/client';

export interface EmployeesDepartmentsHistoryResponse extends EmployeesDepartmentsHistory {}

export interface EmployeesDepartmentsHistoryCreateBody extends Omit<EmployeesDepartmentsHistory, 'id' | 'createdAt' > {}
