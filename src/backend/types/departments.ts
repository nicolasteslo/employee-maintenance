import { Departments } from '@prisma/client';

export interface DepartmentResponse extends Omit<Departments, 'createdAt' | 'updatedAt' > {}

export interface DepartmentCreateBody extends Omit<Departments, 'createdAt' | 'updatedAt' | 'employees' | 'id' > {}
