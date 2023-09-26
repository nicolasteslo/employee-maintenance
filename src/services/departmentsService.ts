import { DepartmentResponse } from '@/backend/types/departments';
import { baseUrl } from './config';

export async function getAllDepartments(): Promise<DepartmentResponse[]> {
  const url = `${baseUrl}/api/departments`;
  const response = await fetch(url);
  const departments = await response.json();

  return departments;
}
