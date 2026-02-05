// In-memory data store for demo purposes
// Replace with real database later

interface MockData {
  budgets: any[];
  transactions: any[];
  bills: any[];
  todos: any[];
  groceries: any[];
  vehicles: any[];
  medications: any[];
  fridgeItems: any[];
  mealPlans: any[];
  recipes: any[];
  notes: any[];
  users: any[];
}

export const mockStore: MockData = {
  users: [
    {
      id: '1',
      email: 'demo@family.com',
      firstName: 'Demo',
      lastName: 'User',
      familyId: '1',
      role: 'admin'
    }
  ],
  budgets: [
    {
      id: '1',
      familyId: '1',
      name: 'Monthly Groceries',
      amount: 800,
      spent: 542.50,
      period: 'monthly',
      category: 'Food',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31')
    },
    {
      id: '2',
      familyId: '1',
      name: 'Gas & Transportation',
      amount: 300,
      spent: 180.25,
      period: 'monthly',
      category: 'Transportation',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31')
    },
    {
      id: '3',
      familyId: '1',
      name: 'Entertainment',
      amount: 200,
      spent: 85.00,
      period: 'monthly',
      category: 'Entertainment',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31')
    }
  ],
  transactions: [
    {
      id: '1',
      familyId: '1',
      amount: -125.50,
      description: 'Costco grocery shopping',
      category: 'Food',
      date: new Date('2025-12-14'),
      type: 'expense'
    },
    {
      id: '2',
      familyId: '1',
      amount: -45.20,
      description: 'Gas station',
      category: 'Transportation',
      date: new Date('2025-12-13'),
      type: 'expense'
    },
    {
      id: '3',
      familyId: '1',
      amount: 3500.00,
      description: 'Monthly salary',
      category: 'Income',
      date: new Date('2025-12-01'),
      type: 'income'
    }
  ],
  bills: [
    {
      id: '1',
      familyId: '1',
      name: 'Electric Bill',
      amount: 145.00,
      dueDate: new Date('2025-12-20'),
      frequency: 'monthly',
      category: 'Utilities',
      isPaid: false,
      payee: 'City Power Company'
    },
    {
      id: '2',
      familyId: '1',
      name: 'Internet',
      amount: 79.99,
      dueDate: new Date('2025-12-25'),
      frequency: 'monthly',
      category: 'Utilities',
      isPaid: true,
      payee: 'Comcast'
    },
    {
      id: '3',
      familyId: '1',
      name: 'Car Insurance',
      amount: 165.00,
      dueDate: new Date('2025-12-28'),
      frequency: 'monthly',
      category: 'Insurance',
      isPaid: false,
      payee: 'State Farm'
    }
  ],
  todos: [
    {
      id: '1',
      listId: '1',
      title: 'Schedule dentist appointment',
      completed: false,
      priority: 'high',
      dueDate: new Date('2025-12-18')
    },
    {
      id: '2',
      listId: '1',
      title: 'Pick up dry cleaning',
      completed: false,
      priority: 'medium',
      dueDate: new Date('2025-12-16')
    },
    {
      id: '3',
      listId: '1',
      title: 'Call insurance about claim',
      completed: true,
      priority: 'high',
      dueDate: new Date('2025-12-14')
    }
  ],
  groceries: [
    {
      id: '1',
      listId: '1',
      name: 'Milk',
      quantity: 2,
      unit: 'gallons',
      category: 'Dairy',
      checked: false
    },
    {
      id: '2',
      listId: '1',
      name: 'Bread',
      quantity: 1,
      unit: 'loaf',
      category: 'Bakery',
      checked: false
    },
    {
      id: '3',
      listId: '1',
      name: 'Chicken breast',
      quantity: 2,
      unit: 'lbs',
      category: 'Meat',
      checked: true
    },
    {
      id: '4',
      listId: '1',
      name: 'Apples',
      quantity: 6,
      unit: 'count',
      category: 'Produce',
      checked: false
    }
  ],
  vehicles: [
    {
      id: '1',
      familyId: '1',
      name: 'Family SUV',
      make: 'Honda',
      model: 'CR-V',
      year: 2022,
      currentMileage: 24500,
      licensePlate: 'ABC-1234',
      nextOilChange: 27500
    },
    {
      id: '2',
      familyId: '1',
      name: 'Sedan',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      currentMileage: 45200,
      licensePlate: 'XYZ-5678',
      nextOilChange: 48000
    }
  ],
  medications: [
    {
      id: '1',
      familyId: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      userId: '1',
      startDate: new Date('2025-01-01'),
      prescribedBy: 'Dr. Smith',
      isActive: true
    },
    {
      id: '2',
      familyId: '1',
      name: 'Vitamin D',
      dosage: '2000 IU',
      frequency: 'Once daily',
      userId: '1',
      startDate: new Date('2025-01-01'),
      isActive: true
    }
  ],
  fridgeItems: [
    {
      id: '1',
      familyId: '1',
      name: 'Milk',
      quantity: 1,
      unit: 'gallon',
      category: 'dairy',
      location: 'fridge',
      expirationDate: new Date('2025-12-20'),
      isExpired: false
    },
    {
      id: '2',
      familyId: '1',
      name: 'Eggs',
      quantity: 12,
      unit: 'count',
      category: 'dairy',
      location: 'fridge',
      expirationDate: new Date('2025-12-25'),
      isExpired: false
    },
    {
      id: '3',
      familyId: '1',
      name: 'Leftover Pizza',
      quantity: 4,
      unit: 'slices',
      category: 'leftovers',
      location: 'fridge',
      expirationDate: new Date('2025-12-16'),
      isExpired: false
    }
  ],
  mealPlans: [
    {
      id: '1',
      familyId: '1',
      date: new Date('2025-12-15'),
      mealType: 'dinner',
      recipeName: 'Spaghetti Bolognese',
      servings: 4,
      totalCalories: 2400
    },
    {
      id: '2',
      familyId: '1',
      date: new Date('2025-12-16'),
      mealType: 'dinner',
      recipeName: 'Grilled Chicken Salad',
      servings: 4,
      totalCalories: 1600
    }
  ],
  recipes: [
    {
      id: '1',
      familyId: '1',
      name: 'Spaghetti Bolognese',
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      totalCalories: 2400,
      isFavorite: true,
      category: 'Italian'
    },
    {
      id: '2',
      familyId: '1',
      name: 'Grilled Chicken Salad',
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      totalCalories: 1600,
      isFavorite: true,
      category: 'Healthy'
    }
  ],
  notes: [
    {
      id: '1',
      familyId: '1',
      title: 'Vacation Planning',
      content: 'Ideas for summer vacation:\n- Beach resort\n- Mountain cabin\n- Road trip',
      format: 'text',
      tags: ['vacation', 'travel'],
      isPinned: true,
      createdAt: new Date('2025-12-10')
    }
  ]
};

// Helper to generate IDs
let idCounter = 100;
export const generateId = () => String(idCounter++);
