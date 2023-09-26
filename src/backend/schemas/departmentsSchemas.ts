import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().max(100).nonempty('Department name is required'),
});
