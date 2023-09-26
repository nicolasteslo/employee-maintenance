/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { render, screen } from '@testing-library/react';
import EmployeesPage from '../../pages/index';
import '@testing-library/jest-dom/extend-expect';

// Mock the employeeService.getAllEmployees function
jest.mock('../../services/employeeService', () => ({
  getAllEmployees: jest.fn(() => Promise.resolve([])),
}));

describe('EmployeesPage', () => {
  it('renders "No employees found." when there are no employees', async () => {
    render(<EmployeesPage employees={[]} />);

    const noEmployeesText = screen.getByText('No employees found.');
    expect(noEmployeesText).toBeInTheDocument();
  });

  it('renders employee cards when there are employees', async () => {
    const mockEmployees = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        departmentName: 'Engineering',
        hireDate: '2023-07-14T03:49:28.333Z',
        isActive: true,
        phone: '5499222',
        address: 'test street',
        departmentHistory: [
          {
            id: 4,
            employeeId: 1,
            departmentName: 'HR',
            createdAt: new Date('2023-07-15T13:28:26.121Z'),
          },
        ],
      },
    ];

    render(<EmployeesPage employees={mockEmployees} />);

    // Check if the employee cards are rendered
    const employeeCards = screen.getAllByTestId('employee-card');
    expect(employeeCards).toHaveLength(mockEmployees.length);
  });
});
