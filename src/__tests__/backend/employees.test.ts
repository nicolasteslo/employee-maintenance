import { NextApiRequest, NextApiResponse } from 'next';
import handler from '../../pages/api/employees';
import { createEmployee } from '../../backend/repositories/employeesRepository';
import { getDepartmentByName } from '../../backend/repositories/departmentsRepository';

jest.mock('../../backend/repositories/employeesRepository', () => ({
  createEmployee: jest.fn().mockResolvedValue({
    id: 1, firstName: 'test', lastName: 'employee', departmentName: 'HR',
  }),
  getAllEmployees: jest.fn().mockResolvedValue([
    {
      id: 1, firstName: 'test', lastName: 'employee', departmentName: 'HR',
    },
  ]),
  getEmployee: jest.fn().mockResolvedValue({
    id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'HR',
  }),
  updateEmployee: jest.fn().mockResolvedValue({
    id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'Updated Department',
  }),
  deleteEmployee: jest.fn().mockResolvedValue({ id: 1, firstName: 'Test', lastName: 'Employee' }),
}));

jest.mock('../../backend/repositories/departmentsRepository', () => ({
  getDepartmentByName: jest.fn().mockResolvedValue(true),
}));

jest.mock('../../backend/repositories/employeesDepartmentsHistoryRepository', () => ({
  createEmployeeDepartmentHistory: jest.fn(),
}));

const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });

const mockResponse: NextApiResponse = {
  status: mockStatus,
} as any;

describe('handleCreateEmployee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new employee and return 201 status', async () => {
    const employeeData = {
      firstName: 'test',
      lastName: 'employee',
      hireDate: '2023-07-14T03:49:28.333Z',
      departmentName: 'HR',
      address: 'Rua test',
      phone: '5499222',
    };

    const mockRequest: NextApiRequest = {
      method: 'POST',
      body: employeeData,
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(201);
    expect(mockJson).toHaveBeenCalledWith({
      id: 1, firstName: 'test', lastName: 'employee', departmentName: 'HR',
    });

    // Check if the createEmployee function was called with the correct data
    expect(createEmployee).toHaveBeenCalledWith(employeeData);
  });

  it('should return 400 status if the department provided does not exist', async () => {
    (getDepartmentByName as jest.Mock).mockResolvedValueOnce(false);

    const employeeData = {
      firstName: 'test',
      lastName: 'employee',
      hireDate: '2023-07-14T03:49:28.333Z',
      departmentName: 'Nonexistent Department',
      address: 'Rua test',
      phone: '5499222',
    };

    const mockRequest: NextApiRequest = {
      method: 'POST',
      body: employeeData,
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Department provided does not exist.' });
  });
});

describe('handleGetAllEmployees', () => {
  it('should return all employees and return 200 status', async () => {
    const mockRequest: NextApiRequest = {
      method: 'GET',
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith([{
      id: 1, firstName: 'test', lastName: 'employee', departmentName: 'HR',
    }]);
  });
});
