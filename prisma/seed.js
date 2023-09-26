const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();

const fakeDepartments = [
  'Accounting', 'Human Resources', 'Financial', 'Customer Service', 'Marketing',
];

async function seed() {
  try {
    // create fake departments
    for (let i = 0; i < 5; i++) {
      await prisma.departments.create({
        data: {
          name: fakeDepartments[i],
        },
      });
    }

    // create fake employees
    for (let i = 0; i < 10; i++) {
      await prisma.employees.create({
        data: {
          firstName: `User${i}`,
          lastName: 'Test',
          hireDate: "2021-07-14T03:49:28.333Z",
          departmentName: 'Accounting',
          address: `Baker Street 22${i}b`,
          phone: '55 5450293232',
        },
      });

      await prisma.employeesDepartmentsHistory.create({
        data: {
          employeeId: i+1,
          departmentName: 'Accounting'
        },
      });
    }
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Departments and employees created.')
    await prisma.$disconnect();
  }
}

seed();
