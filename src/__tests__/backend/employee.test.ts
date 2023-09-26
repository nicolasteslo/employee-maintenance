import { NextApiRequest, NextApiResponse } from 'next';
import { getDepartmentByName } from '../../backend/repositories/departmentsRepository';
import { getEmployee, deleteEmployee } from '../../backend/repositories/employeesRepository';
import handler from '../../pages/api/employees/[employeeId]';

jest.mock('../../backend/repositories/employeesRepository', () => ({
  getEmployee: jest.fn().mockResolvedValue({
    id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'Test Department',
  }),
  updateEmployee: jest.fn().mockResolvedValue({
    id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'New Department',
  }),
  deleteEmployee: jest.fn().mockResolvedValue(null),
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

describe('handleGetEmployee', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a single employee and return 200 status', async () => {
    const mockRequest: NextApiRequest = {
      method: 'GET',
      query: { employeeId: '1' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'Test Department',
    });

    // Check if the getEmployee function was called with the correct employeeId
    expect(getEmployee).toHaveBeenCalledWith(1);
  });

  it('should return 400 status if the employeeId is not a number', async () => {
    const mockRequest: NextApiRequest = {
      method: 'GET',
      query: { employeeId: 'abc' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'employeeId has to be a number.' });
  });

  it('should return 404 status if the employee is not found', async () => {
    (getEmployee as jest.Mock).mockResolvedValueOnce(null);

    const mockRequest: NextApiRequest = {
      method: 'GET',
      query: { employeeId: '1' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(404);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Employee not found.' });
  });
});

describe('handleUpdateEmployee', () => {
  it('should update an employee and return 200 status', async () => {
    (getEmployee as jest.Mock).mockResolvedValue({
      id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'New Department',
    });

    const mockRequest: NextApiRequest = {
      method: 'PATCH',
      query: { employeeId: '1' },
      body: { departmentName: 'New Department' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({
      id: 1, firstName: 'Test', lastName: 'Employee', departmentName: 'New Department',
    });
  });

  it('should return 400 status if the employeeId is not a number', async () => {
    const mockRequest: NextApiRequest = {
      method: 'PATCH',
      query: { employeeId: 'abc' },
      body: { departmentName: 'New Department' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'employeeId has to be a number.' });
  });

  it('should return 400 status if the employee to update is not found', async () => {
    (getEmployee as jest.Mock).mockResolvedValueOnce(null);

    const mockRequest: NextApiRequest = {
      method: 'PATCH',
      query: { employeeId: '1' },
      body: { departmentName: 'New Department' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Employee to update not found.' });
  });

  it('should return 400 status if no fields are provided to update employee', async () => {
    const mockRequest: NextApiRequest = {
      method: 'PATCH',
      query: { employeeId: '1' },
      body: {},
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'No fields provided to update employee.' });
  });

  it('should return 400 status if the department provided does not exist', async () => {
    (getDepartmentByName as jest.Mock).mockResolvedValueOnce(false);

    const mockRequest: NextApiRequest = {
      method: 'PATCH',
      query: { employeeId: '1' },
      body: { departmentName: 'Nonexistent Department' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Department provided does not exist.' });
  });
});

describe('handleDeleteEmployee', () => {
  it('should delete an employee and return 200 status', async () => {
    const mockRequest: NextApiRequest = {
      method: 'DELETE',
      query: { employeeId: '1' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(200);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Employee deleted.' });

    // Check if the deleteEmployee function was called with the correct employeeId
    expect(deleteEmployee).toHaveBeenCalledWith(1);
  });

  it('should return 400 status if the employee to delete is not found', async () => {
    (getEmployee as jest.Mock).mockResolvedValueOnce(null);

    const mockRequest: NextApiRequest = {
      method: 'DELETE',
      query: { employeeId: '1' },
    } as any;

    await handler(mockRequest, mockResponse);

    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({ message: 'Employee to delete not found.' });
  });
});
