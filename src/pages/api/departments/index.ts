import type { NextApiRequest, NextApiResponse } from 'next';
import { DepartmentResponse } from '@/backend/types/departments';
import { ErrorResponse } from '@/backend/types/error';
import { getAllDepartments, getDepartmentByName, createDepartment } from '@/backend/repositories/departmentsRepository';
import { createDepartmentSchema } from '@/backend/schemas/departmentsSchemas';
import { z } from 'zod';

async function handleCreateDepartment(
  req: NextApiRequest,
  res: NextApiResponse<DepartmentResponse | ErrorResponse>,
) {
  const departmentBody = createDepartmentSchema.parse(req.body);

  const departmentExists = await getDepartmentByName(departmentBody.name);

  if (departmentExists) return res.status(404).json({ message: 'Department already exists.' });

  const createdDepartment = await createDepartment(departmentBody);

  return res.status(201).json(createdDepartment);
}

async function handleGetAllDepartments(
  req: NextApiRequest,
  res: NextApiResponse<DepartmentResponse[]>,
) {
  const departments = await getAllDepartments();

  return res.status(200).json(departments);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DepartmentResponse[] | ErrorResponse | DepartmentResponse>,
) {
  try {
    if (req.method === 'GET') {
      await handleGetAllDepartments(req, res);
    } else if (req.method === 'POST') {
      await handleCreateDepartment(req, res);
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
