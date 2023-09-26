import { z } from 'zod';

export const createEmployeeSchema = z.object({
  firstName: z.string().max(100).nonempty('First name is required'),
  lastName: z.string().max(100).nonempty('Last name is required'),
  hireDate: z.string().datetime().nonempty('Hire date is required'),
  departmentName: z.string().max(100).nonempty('Department Name is required'),
  phone: z.string().max(100).nonempty('Phone number is required'),
  address: z.string().max(200).nonempty('Address is required'),
});
