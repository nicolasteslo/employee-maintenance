import type { NextApiRequest, NextApiResponse } from 'next';
import { type EmployeeResponse } from '@/backend/types/employees';
import { createEmployeeSchema } from '@/backend/schemas/employeesSchemas';
import { createEmployee, getAllEmployees } from '@/backend/repositories/employeesRepository';
import { ErrorResponse } from '@/backend/types/error';

import { getDepartmentByName } from '@/backend/repositories/departmentsRepository';
import { z } from 'zod';

async function handleCreateEmployee(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse | ErrorResponse>,
) {
  const employeeBody = createEmployeeSchema.parse(req.body);

  const departmentExists = await getDepartmentByName(employeeBody.departmentName);

  if (!departmentExists) return res.status(400).json({ message: 'Department provided does not exist.' });

  const createdEmployee = await createEmployee(employeeBody);

  if (!createdEmployee) return res.status(500).json({ message: 'Internal Server Error. Error creating user.' });

  return res.status(201).json(createdEmployee);
}

async function handleGetAllEmployees(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse[]>,
) {
  const employees = await getAllEmployees();

  return res.status(200).json(employees);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse[] | ErrorResponse | EmployeeResponse>,
) {
  try {
    if (req.method === 'GET') {
      await handleGetAllEmployees(req, res);
    } else if (req.method === 'POST') {
      await handleCreateEmployee(req, res);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid fields', issues: error.issues });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
