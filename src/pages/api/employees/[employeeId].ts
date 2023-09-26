import type { NextApiRequest, NextApiResponse } from 'next';
import { type EmployeeResponse } from '@/backend/types/employees';
import { getEmployee, updateEmployee, deleteEmployee } from '@/backend/repositories/employeesRepository';
import { ErrorResponse } from '@/backend/types/error';
import { getDepartmentByName } from '@/backend/repositories/departmentsRepository';
import { createEmployeeDepartmentHistory } from '@/backend/repositories/employeesDepartmentsHistoryRepository';

async function handleGetEmployee(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse | ErrorResponse>,
) {
  const employeeId = Number(req.query.employeeId);

  if (Number.isNaN(employeeId)) return res.status(400).json({ message: 'employeeId has to be a number.' });

  const employee = await getEmployee(Number(employeeId));

  if (!employee) return res.status(404).json({ message: 'Employee not found.' });

  return res.status(200).json(employee);
}

async function handleUpdateEmployee(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse | ErrorResponse | null>,
) {
  const employeeId = Number(req.query.employeeId);

  if (Number.isNaN(employeeId)) return res.status(400).json({ message: 'employeeId has to be a number.' });

  const employee = await getEmployee(Number(employeeId));

  if (!employee) return res.status(400).json({ message: 'Employee to update not found.' });

  const employeeBody = req.body;

  if (!employeeBody || Object.keys(employeeBody).length === 0) return res.status(400).json({ message: 'No fields provided to update employee.' });

  const isUpdatingDepartment = 'departmentName' in employeeBody;

  if (isUpdatingDepartment) {
    const departmentExists = await getDepartmentByName(employeeBody.departmentName);

    if (!departmentExists) return res.status(400).json({ message: 'Department provided does not exist.' });
  }

  const updatedEmployee = await updateEmployee(employeeId, employeeBody);

  if (isUpdatingDepartment && employee.departmentName !== employeeBody.departmentName) {
    await createEmployeeDepartmentHistory({
      employeeId: employee.id,
      departmentName: employeeBody.departmentName,
    });

    const updatedEmployeeWithDepartmentHistory = await getEmployee(employeeId);

    return res.status(200).json(updatedEmployeeWithDepartmentHistory);
  }

  return res.status(200).json(updatedEmployee);
}

async function handleDeleteEmployee(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse | ErrorResponse>,
) {
  const employeeId = Number(req.query.employeeId);

  if (Number.isNaN(employeeId)) return res.status(400).json({ message: 'employeeId has to be a number.' });

  const employee = await getEmployee(Number(employeeId));

  if (!employee) return res.status(400).json({ message: 'Employee to delete not found.' });

  await deleteEmployee(employeeId);

  return res.status(200).json({ message: 'Employee deleted.' });
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<EmployeeResponse | ErrorResponse | null>,
) {
  try {
    if (req.method === 'GET') {
      await handleGetEmployee(req, res);
    } else if (req.method === 'PATCH') {
      await handleUpdateEmployee(req, res);
    } else if (req.method === 'DELETE') {
      await handleDeleteEmployee(req, res);
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
