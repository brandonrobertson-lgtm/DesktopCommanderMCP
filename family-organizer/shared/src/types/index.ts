// Core User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  familyId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  PARENT = 'parent',
  CHILD = 'child',
  GUEST = 'guest'
}

export interface Family {
  id: string;
  name: string;
  members: User[];
  settings: FamilySettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilySettings {
  currency: string;
  timezone: string;
  defaultLocation?: string;
  wallDisplayEnabled: boolean;
  wallDisplayModules: string[];
}

// Budget & Finance Types
export interface Budget {
  id: string;
  familyId: string;
  name: string;
  amount: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
  category: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  familyId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense';
  source: 'manual' | 'wealthsimple' | 'ynab';
  budgetId?: string;
  createdBy: string;
  createdAt: Date;
}

export interface Bill {
  id: string;
  familyId: string;
  name: string;
  amount: number;
  dueDate: Date;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  isPaid: boolean;
  autoPayEnabled: boolean;
  payee: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: string;
  familyId: string;
  vendor: string;
  amount: number;
  date: Date;
  category: string;
  imageUrl: string;
  ocrData?: any;
  items?: ReceiptItem[];
  createdBy: string;
  createdAt: Date;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

// Email Types
export interface EmailAccount {
  id: string;
  userId: string;
  provider: 'gmail' | 'microsoft' | 'icloud';
  email: string;
  displayName: string;
  isDefault: boolean;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface Email {
  id: string;
  accountId: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  isRead: boolean;
  isStarred: boolean;
  folder: string;
  date: Date;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
}

// Lists Types
export interface TodoList {
  id: string;
  familyId: string;
  name: string;
  color?: string;
  items: TodoItem[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface GroceryList {
  id: string;
  familyId: string;
  name: string;
  items: GroceryItem[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroceryItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  checked: boolean;
  notes?: string;
  createdAt: Date;
}

// Automotive Types
export interface Vehicle {
  id: string;
  familyId: string;
  name: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate?: string;
  color?: string;
  currentMileage: number;
  fuelType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleMaintenance {
  id: string;
  vehicleId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'general' | 'other';
  description: string;
  date: Date;
  mileage: number;
  cost?: number;
  vendor?: string;
  nextDueDate?: Date;
  nextDueMileage?: number;
  fluidsUsed?: FluidSpec[];
  notes?: string;
  receiptId?: string;
  createdBy: string;
  createdAt: Date;
}

export interface FluidSpec {
  type: 'engine_oil' | 'transmission_fluid' | 'coolant' | 'brake_fluid' | 'power_steering' | 'other';
  brand: string;
  viscosity?: string;
  quantity: number;
  unit: string;
}

export interface MaintenanceSchedule {
  id: string;
  vehicleId: string;
  type: string;
  intervalMiles: number;
  intervalMonths: number;
  lastPerformedDate?: Date;
  lastPerformedMileage?: number;
  isActive: boolean;
}

// Home & Appliances Types
export interface Home {
  id: string;
  familyId: string;
  name: string;
  address: string;
  type: 'primary' | 'vacation' | 'rental' | 'other';
  purchaseDate?: Date;
  squareFootage?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appliance {
  id: string;
  homeId: string;
  name: string;
  category: 'kitchen' | 'laundry' | 'hvac' | 'water' | 'electrical' | 'other';
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  warrantyExpiration?: Date;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApplianceMaintenance {
  id: string;
  applianceId: string;
  type: string;
  description: string;
  date: Date;
  cost?: number;
  vendor?: string;
  nextDueDate?: Date;
  notes?: string;
  receiptId?: string;
  createdBy: string;
  createdAt: Date;
}

// Contacts & Phonebook Types
export interface Contact {
  id: string;
  familyId: string;
  name: string;
  category: 'insurance' | 'bank' | 'medical' | 'utility' | 'emergency' | 'other';
  company?: string;
  phoneNumbers: PhoneNumber[];
  emails: string[];
  address?: string;
  website?: string;
  notes?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PhoneNumber {
  type: 'mobile' | 'work' | 'home' | 'fax' | 'other';
  number: string;
  isPrimary: boolean;
}

// Password Manager Types
export interface PasswordEntry {
  id: string;
  familyId: string;
  title: string;
  username: string;
  encryptedPassword: string;
  website?: string;
  category: string;
  notes?: string;
  isFavorite: boolean;
  sharedWith: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsed?: Date;
}

export interface PasswordFolder {
  id: string;
  familyId: string;
  name: string;
  color?: string;
  parentId?: string;
  createdBy: string;
  createdAt: Date;
}

// Document Storage Types
export interface Document {
  id: string;
  familyId: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'spreadsheet' | 'other';
  category: 'legal' | 'financial' | 'medical' | 'personal' | 'other';
  fileUrl: string;
  fileSize: number;
  isEncrypted: boolean;
  tags: string[];
  sharedWith: string[];
  folderId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentFolder {
  id: string;
  familyId: string;
  name: string;
  color?: string;
  parentId?: string;
  createdBy: string;
  createdAt: Date;
}

// Chat Types
export interface ChatMessage {
  id: string;
  familyId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'location';
  attachments?: ChatAttachment[];
  replyTo?: string;
  isEdited: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatAttachment {
  id: string;
  type: 'image' | 'file' | 'location';
  url: string;
  filename?: string;
  mimeType?: string;
  size?: number;
}

// Medications Types
export interface Medication {
  id: string;
  familyId: string;
  name: string;
  dosage: string;
  frequency: string;
  userId: string;
  startDate: Date;
  endDate?: Date;
  prescribedBy?: string;
  pharmacy?: string;
  refillDate?: Date;
  instructions?: string;
  sideEffects?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  takenAt: Date;
  takenBy: string;
  notes?: string;
  createdAt: Date;
}

// Fridge & Inventory Types
export interface FridgeItem {
  id: string;
  familyId: string;
  name: string;
  quantity: number;
  unit: string;
  category: 'dairy' | 'meat' | 'produce' | 'beverages' | 'condiments' | 'leftovers' | 'other';
  location: 'fridge' | 'freezer' | 'pantry';
  purchaseDate?: Date;
  expirationDate?: Date;
  isExpired: boolean;
  barcode?: string;
  imageUrl?: string;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Meal Planning Types
export interface MealPlan {
  id: string;
  familyId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  recipeName: string;
  servings: number;
  totalCalories: number;
  notes?: string;
  isPrepared: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface Recipe {
  id: string;
  familyId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  ingredients: Ingredient[];
  instructions: string[];
  category: string;
  cuisine?: string;
  totalCalories: number;
  nutritionInfo?: NutritionInfo;
  tags: string[];
  isFavorite: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface CalorieLog {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  servingSize: number;
  calories: number;
  nutritionInfo?: NutritionInfo;
  createdAt: Date;
}

export interface FoodDatabase {
  id: string;
  name: string;
  brand?: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  nutritionInfo: NutritionInfo;
  barcode?: string;
  category: string;
}

// Notes Types
export interface Note {
  id: string;
  familyId: string;
  title: string;
  content: string;
  format: 'text' | 'markdown' | 'rich';
  tags: string[];
  isPinned: boolean;
  sharedWith: string[];
  folderId?: string;
  attachments?: NoteAttachment[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteAttachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface NoteFolder {
  id: string;
  familyId: string;
  name: string;
  color?: string;
  parentId?: string;
  createdBy: string;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  data?: any;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
