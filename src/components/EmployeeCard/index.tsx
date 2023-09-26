import React from 'react';
import { EmployeeResponse } from '@/backend/types/employees';
import { baseUrl } from '@/services/config';
import Image from 'next/image';
import Link from 'next/link';
import { formatDateAndDuration } from '@/utils/date';
import AvatarImage from '../../../public/assets/avatar.png';

interface EmployeeCardProps {
  employee: EmployeeResponse
}

function EmployeeCard({ employee }: EmployeeCardProps) {
  const { formattedDate, durationString } = formatDateAndDuration(employee.hireDate as string);

  return (
    <div data-testid="employee-card" className="flex flex-col lg:flex-row justify-between items-center border border-gray-400 border-solid my-8 p-4">
      <div className="flex gap-4">
        <Image width={140} height={140} src={AvatarImage} alt="employee avatar" />

        <div className="flex flex-col justify-center">

          <div className="flex-col lg:flex-row flex lg:gap-2 lg:items-center">
            <span className="my-0 lg:my-4 font-bold">
              {employee.firstName}
              {' '}
              {employee.lastName}
            </span>
            <span className="inline">
              (
              {employee.departmentName}
              )
            </span>
          </div>

          <span className="font-medium">Hire Date</span>

          <span className="text-xs lg:text-base">
            {formattedDate}
            {' '}
            (
            {durationString}
            )
          </span>
        </div>
      </div>

      <Link
        className="mt-6 lg:mt-0 py-2 text-white px-8 bg-green-500 rounded-lg"
        href={`${baseUrl}/employees/${employee.id}`}
      >
        View Details
      </Link>
    </div>
  );
}

export default EmployeeCard;
