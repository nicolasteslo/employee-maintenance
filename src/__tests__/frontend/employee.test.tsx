import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EmployeePage from '../../pages/employees/[employeeId]';

jest.mock('../../services/employeeService');
jest.mock('../../services/departmentsService');

const mockEmployee = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  isActive: true,
  departmentName: 'Engineering',
  hireDate: '2022-01-01',
  phone: '123456789',
  address: '123 Main St',
  departmentHistory: [
    {
      id: 4,
      employeeId: 1,
      departmentName: 'HR',
      createdAt: new Date('2023-07-15T13:28:26.121Z'),
    },
  ],
};

const mockDepartments = [
  { id: 1, name: 'Engineering' },
  { id: 2, name: 'Marketing' },
];

describe('EmployeePage', () => {
  it('renders "Error retrieving employee data. Please, try again in a few minutes." when there is no employee', async () => {
    render(<EmployeePage employee={null} departments={null} />);

    const noEmployeesText = screen.getByText('Error retrieving employee data. Please, try again in a few minutes.');
    expect(noEmployeesText).toBeInTheDocument();
  });

  it('renders employee data when there is employee prop', async () => {
    render(<EmployeePage employee={mockEmployee} departments={mockDepartments} />);

    const employeeNameText = screen.getByTestId('employee-name');

    expect(employeeNameText).toBeDefined();
  });
});
