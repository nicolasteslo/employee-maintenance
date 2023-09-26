import type { GetServerSideProps } from 'next';
import { type EmployeeResponse } from '@/backend/types/employees';
import React, { useState } from 'react';
import { getEmployee, updateEmployee } from '@/services/employeeService';
import { ParsedUrlQuery } from 'querystring';
import { formatDateAndDuration } from '@/utils/date';
import Image from 'next/image';
import EmployeeDepartmentsHistoryTable from '@/components/EmployeeDepartmentHistoryTable';
import { DepartmentResponse } from '@/backend/types/departments';
import { getAllDepartments } from '@/services/departmentsService';
import { type EmployeesDepartmentsHistoryResponse } from '@/backend/types/employeesDepartmentsHistory';
import AvatarImage from '../../../public/assets/avatar.png';

interface Params extends ParsedUrlQuery {
  employeeId: string;
}

export const getServerSideProps: GetServerSideProps<{
  employee: EmployeeResponse | null,
  departments: DepartmentResponse[] | null
}> = async (context) => {
  const { employeeId } = context.params as Params;
  try {
    const employee = await getEmployee(Number(employeeId));
    const departments = await getAllDepartments();
    return { props: { employee, departments } };
  } catch (err) {
    return { props: { employee: null, departments: null } };
  }
};

interface EmployeePageProps {
  employee: EmployeeResponse | null
  departments: DepartmentResponse[] | null
}

export interface EmployeeData {
  isActive: boolean | undefined
  departmentHistory: EmployeesDepartmentsHistoryResponse[] | undefined
  selectedDepartment: string | undefined
  defaultDepartment: string | undefined
}

export default function EmployeePage({ employee, departments }: EmployeePageProps) {
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    isActive: employee?.isActive,
    departmentHistory: employee?.departmentHistory,
    selectedDepartment: employee?.departmentName,
    defaultDepartment: employee?.departmentName,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!employee || !departments) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <span>Error retrieving employee data. Please, try again in a few minutes.</span>
      </main>
    );
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDepartment = e.target.value;

    setEmployeeData((prev) => ({
      ...prev,
      selectedDepartment,
    }));
  };

  const handleDepartmentUpdate = async () => {
    setIsLoading(true);

    try {
      await updateEmployee(employee.id, {
        departmentName: employeeData.selectedDepartment,
      });

      const updatedEmployee = await getEmployee(employee.id);

      setEmployeeData((prev) => ({
        ...prev,
        departmentHistory: updatedEmployee.departmentHistory,
        defaultDepartment: updatedEmployee.departmentName,
      }));
      setIsLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Error trying to update employee department.');
      setIsLoading(false);
    }
  };

  const handleEmployeeStatusUpdate = async (status: boolean) => {
    setIsLoading(true);

    try {
      await updateEmployee(employee.id, {
        isActive: status,
      });

      setEmployeeData((prev) => ({
        ...prev,
        isActive: status,
      }));

      setIsLoading(false);
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert('Error trying to update employee.');
      setIsLoading(false);
    }
  };

  const { formattedDate, durationString } = formatDateAndDuration(employee.hireDate as string);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between py-24 px-4 lg:p-24"
    >
      <div className="flex flex-col lg:flex-row gap-6 w-full justify-center">

        <div className="w-auto mx-auto lg:mx-0 flex items-center justify-center relative flex-col">
          <Image width={200} height={200} src={AvatarImage} alt="employee avatar image" />

          {!employeeData.isActive
                        && <span className="absolute left-50 bottom-2 w-11/12 mx-auto text-center text-white bg-red-600">Inactive</span>}

        </div>

        <div className="flex flex-col justify-between w-full lg:w-1/4">
          <h1 data-testid="employee-name" className="font-bold">
            {employee.firstName}
            {' '}
            {employee.lastName}
          </h1>
          <span>
            Employee ID:
            {' '}
            {employee.id}
          </span>
          <span>
            Department:
            {' '}
            {employeeData.defaultDepartment}
          </span>
          <span>
            Telephone:
            {' '}
            {employee.phone}
          </span>
          <span>
            Address:
            {' '}
            {employee.address}
          </span>

          <div>
            <span className="font-medium">Update department</span>

            <div className="flex items-center justify-between mt-4">
              <select
                defaultValue={employeeData.defaultDepartment}
                onChange={(e) => handleDepartmentChange(e)}
                className="w-full border border-solid border-black py-2 px-4"
              >
                {departments.map((department: DepartmentResponse) => (
                  <option key={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => handleDepartmentUpdate()}
                disabled={
                    employeeData.selectedDepartment === employeeData.defaultDepartment
                    || isLoading
                }
                className="text-white rounded-xl bg-green-500 py-2 px-4 mx-4 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        <div className="lg:ml-8 flex flex-col">
          <h2>Hire Date</h2>
          <span>{formattedDate}</span>
          <span>{durationString}</span>

          {employeeData.isActive ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleEmployeeStatusUpdate(false)}
              className="text-white rounded-xl bg-red-500 py-2 px-4 mx-4 cursor-pointer my-4"
            >
              Deactivate
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={() => handleEmployeeStatusUpdate(true)}
              className="text-white rounded-xl bg-green-500 py-2 px-4 mx-4 cursor-pointer my-4"
            >
              Activate
            </button>
          )}

        </div>
      </div>

      <div className="my-0 lg:my-20 w-full">
        {
            employeeData
            && employeeData.departmentHistory
            && employeeData.departmentHistory.length > 0
            && (
            <>
              <h3 className="font-bold font text-2xl text-center my-8">Department History</h3>
              <EmployeeDepartmentsHistoryTable employee={employeeData} />
            </>
            )
        }
      </div>

    </main>
  );
}
