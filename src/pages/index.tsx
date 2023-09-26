import { Inter } from 'next/font/google';
import React from 'react';
import type { GetServerSideProps } from 'next';
import { EmployeeResponse } from '@/backend/types/employees';
import { getAllEmployees } from '@/services/employeeService';
import EmployeeCard from '@/components/EmployeeCard';

const inter = Inter({ subsets: ['latin'] });

export const getServerSideProps: GetServerSideProps<{
  employees: EmployeeResponse[]
}> = async () => {
  try {
    const employees = await getAllEmployees();
    return { props: { employees } };
  } catch (err) {
    return { props: { employees: [] } };
  }
};

interface EmployeesPageProps {
  employees: EmployeeResponse[]
}

export default function EmployeesPage({ employees }: EmployeesPageProps) {
  return (
    <main
      className={`w-full flex min-h-screen flex-col items-center justify-between lg:p-24 ${inter.className}`}
    >
      <h1 className="mt-8 text-xl font-bold">Employees</h1>
      {
        employees.length > 0 ? (
          <div className="px-4 lg:px-0 my-8 max-w-screen-md w-full">
            {employees.map((employee: EmployeeResponse) => (
              <EmployeeCard employee={employee} key={employee.id} />
            ))}
          </div>
        ) : (
          <span>No employees found.</span>
        )
      }
    </main>
  );
}
