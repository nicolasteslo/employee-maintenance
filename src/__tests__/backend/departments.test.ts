import { NextApiRequest, NextApiResponse } from 'next';
import { getDepartmentByName } from '../../backend/repositories/departmentsRepository';
import handler from '../../pages/api/departments';

// Mocking the functions in the handler file
jest.mock('../../backend/repositories/departmentsRepository', () => ({
  getAllDepartments: jest.fn().mockResolvedValue([]),
  getDepartmentByName: jest.fn().mockResolvedValue(null),
  createDepartment: jest.fn().mockResolvedValue({ id: 1, name: 'Test Department' }),
}));

// Mocking NextApiResponse methods for testing
const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

const mockResponse: NextApiResponse = {
  status: mockStatus,
} as any;

describe('departments handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleCreateDepartment', () => {
    it('should create a department and return 201 status', async () => {
      const mockRequest: NextApiRequest = {
        method: 'POST',
        body: { name: 'Test Department' },
      } as any;

      await handler(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({ id: 1, name: 'Test Department' });
    });

    it('should return 404 status if the department already exists', async () => {
      const mockRequest: NextApiRequest = {
        method: 'POST',
        body: { name: 'Existing Department' },
      } as any;

      (getDepartmentByName as jest.Mock).mockResolvedValueOnce({ id: 2, name: 'Existing Department' });

      await handler(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Department already exists.' });
    });
  });

  describe('handleGetAllDepartments', () => {
    it('should return all departments and return 200 status', async () => {
      const mockRequest: NextApiRequest = {
        method: 'GET',
      } as any;

      await handler(mockRequest, mockResponse);

      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith([]);
    });
  });
});
