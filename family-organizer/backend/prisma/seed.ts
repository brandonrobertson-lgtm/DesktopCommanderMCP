import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@familyorganizer.com' },
    update: {},
    create: {
      email: 'demo@familyorganizer.com',
      passwordHash: hashedPassword,
      name: 'Demo User',
      role: 'admin',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create budgets
  await prisma.budget.createMany({
    data: [
      {
        userId: user.id,
        name: 'Monthly Groceries',
        amount: 800,
        spent: 542.50,
        category: 'Food',
        period: 'monthly',
      },
      {
        userId: user.id,
        name: 'Gas & Transportation',
        amount: 300,
        spent: 180.25,
        category: 'Transportation',
        period: 'monthly',
      },
      {
        userId: user.id,
        name: 'Entertainment',
        amount: 200,
        spent: 85.00,
        category: 'Entertainment',
        period: 'monthly',
      },
    ],
  });

  console.log('✅ Created budgets');

  // Create transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        amount: 3500,
        description: 'Monthly Salary',
        category: 'Income',
        type: 'income',
        date: new Date('2025-12-01'),
      },
      {
        userId: user.id,
        amount: -125.50,
        description: 'Costco Grocery Shopping',
        category: 'Food',
        type: 'expense',
        date: new Date('2025-12-14'),
      },
      {
        userId: user.id,
        amount: -45.20,
        description: 'Gas Station',
        category: 'Transportation',
        type: 'expense',
        date: new Date('2025-12-13'),
      },
    ],
  });

  console.log('✅ Created transactions');

  // Create bills
  await prisma.bill.createMany({
    data: [
      {
        userId: user.id,
        name: 'Electric Bill',
        amount: 145.00,
        payee: 'City Power Company',
        dueDate: new Date('2025-12-20'),
        isPaid: false,
        category: 'Utilities',
        recurring: true,
        frequency: 'monthly',
      },
      {
        userId: user.id,
        name: 'Car Insurance',
        amount: 165.00,
        payee: 'State Farm',
        dueDate: new Date('2025-12-28'),
        isPaid: false,
        category: 'Insurance',
        recurring: true,
        frequency: 'monthly',
      },
    ],
  });

  console.log('✅ Created bills');

  // Create vehicle
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: user.id,
      name: 'Family Car',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: '1HGBH41JXMN109186',
      licensePlate: 'ABC1234',
      mileage: 45000,
    },
  });

  console.log('✅ Created vehicle');

  // Create home
  const home = await prisma.home.create({
    data: {
      userId: user.id,
      name: 'Main Residence',
      address: '123 Main St, Anytown, USA',
      type: 'house',
    },
  });

  console.log('✅ Created home');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
