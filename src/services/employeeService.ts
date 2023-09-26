import { EmployeeResponse, EmployeeUpdateBody } from '@/backend/types/employees';
import { baseUrl } from './config';

export async function getAllEmployees(): Promise<EmployeeResponse[]> {
  const url = `${baseUrl}/api/employees`;
  const response = await fetch(url);
  const employees = await response.json();

  return employees;
}

export async function getEmployee(id: number): Promise<EmployeeResponse> {
  const url = `${baseUrl}/api/employees/${id}`;
  const response = await fetch(url);
  const employee = await response.json();

  return employee;
}

export async function updateEmployee(
  employeeId: number,
  employeeBody: EmployeeUpdateBody,
): Promise<EmployeeResponse> {
  const url = `${baseUrl}/api/employees/${employeeId}`;

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(employeeBody),
  };

  const response = await fetch(url, options);

  const updatedEmployee = await response.json();

  return updatedEmployee;
}
