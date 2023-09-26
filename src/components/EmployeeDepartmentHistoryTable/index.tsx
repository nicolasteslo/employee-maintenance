import React from 'react';
import { type EmployeeData } from '@/pages/employees/[employeeId]';
import { type EmployeesDepartmentsHistory } from '@prisma/client';
import { formatDateToMMDDYY } from '@/utils/date';

interface EmployeesDepartmentsHistoryTableProps {
  employee: EmployeeData
}

function EmployeeDepartmentsHistoryTable({ employee }: EmployeesDepartmentsHistoryTableProps) {
  return (
    <table className="w-full lg:w-1/2 mx-auto border border-black border-solid">
      <thead className="bg-gray-300">
        <tr className="border border-black border-solid">
          <th className="text-gray-500">Date</th>
          <th className="text-gray-500">Department</th>
        </tr>

      </thead>

      <tbody>
        {employee?.departmentHistory?.map((history: EmployeesDepartmentsHistory) => (
          <tr key={`${history.departmentName}${Math.random()}`}>
            <td className="text-center">{formatDateToMMDDYY(String(history.createdAt))}</td>
            <td className="text-center">{history.departmentName}</td>
          </tr>
        ))}
      </tbody>

    </table>
  );
}

export default EmployeeDepartmentsHistoryTable;
