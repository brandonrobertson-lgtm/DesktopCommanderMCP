import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import rateLimit from 'express-rate-limit';

// Load environment variables
config();

// Import mock data
import { mockStore, generateId } from './data/mockStore';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
  }
});

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-family', (familyId: string) => {
    socket.join(`family-${familyId}`);
  });

  socket.on('chat-message', (data) => {
    io.to(`family-${data.familyId}`).emit('new-message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development
}));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // generous limit for development
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ BUDGET ROUTES ============
app.get('/api/budget', (req, res) => {
  res.json({ success: true, data: mockStore.budgets });
});

app.get('/api/budget/transactions', (req, res) => {
  res.json({ success: true, data: mockStore.transactions });
});

app.get('/api/budget/bills', (req, res) => {
  res.json({ success: true, data: mockStore.bills });
});

app.post('/api/budget', (req, res) => {
  const newBudget = { id: generateId(), ...req.body, spent: 0 };
  mockStore.budgets.push(newBudget);
  res.json({ success: true, data: newBudget });
});

app.post('/api/budget/transactions', (req, res) => {
  const newTransaction = { id: generateId(), ...req.body, date: new Date() };
  mockStore.transactions.push(newTransaction);
  res.json({ success: true, data: newTransaction });
});

app.post('/api/budget/bills', (req, res) => {
  const newBill = { id: generateId(), ...req.body, isPaid: false };
  mockStore.bills.push(newBill);
  res.json({ success: true, data: newBill });
});

app.patch('/api/budget/bills/:id/pay', (req, res) => {
  const bill = mockStore.bills.find(b => b.id === req.params.id);
  if (bill) {
    bill.isPaid = true;
    bill.paidDate = new Date();
  }
  res.json({ success: true, data: bill });
});

// ============ TODO ROUTES ============
app.get('/api/todos', (req, res) => {
  res.json({ success: true, data: mockStore.todos });
});

app.post('/api/todos', (req, res) => {
  const newTodo = { id: generateId(), ...req.body, completed: false };
  mockStore.todos.push(newTodo);
  res.json({ success: true, data: newTodo });
});

app.patch('/api/todos/:id', (req, res) => {
  const todo = mockStore.todos.find(t => t.id === req.params.id);
  if (todo) Object.assign(todo, req.body);
  res.json({ success: true, data: todo });
});

app.delete('/api/todos/:id', (req, res) => {
  const index = mockStore.todos.findIndex(t => t.id === req.params.id);
  if (index > -1) mockStore.todos.splice(index, 1);
  res.json({ success: true });
});

// ============ GROCERY ROUTES ============
app.get('/api/grocery', (req, res) => {
  res.json({ success: true, data: mockStore.groceries });
});

app.post('/api/grocery', (req, res) => {
  const newItem = { id: generateId(), ...req.body, checked: false };
  mockStore.groceries.push(newItem);
  res.json({ success: true, data: newItem });
});

app.patch('/api/grocery/:id', (req, res) => {
  const item = mockStore.groceries.find(g => g.id === req.params.id);
  if (item) Object.assign(item, req.body);
  res.json({ success: true, data: item });
});

app.delete('/api/grocery/:id', (req, res) => {
  const index = mockStore.groceries.findIndex(g => g.id === req.params.id);
  if (index > -1) mockStore.groceries.splice(index, 1);
  res.json({ success: true });
});

// ============ VEHICLE ROUTES ============
app.get('/api/vehicles', (req, res) => {
  res.json({ success: true, data: mockStore.vehicles });
});

app.post('/api/vehicles', (req, res) => {
  const newVehicle = { id: generateId(), ...req.body };
  mockStore.vehicles.push(newVehicle);
  res.json({ success: true, data: newVehicle });
});

app.patch('/api/vehicles/:id', (req, res) => {
  const vehicle = mockStore.vehicles.find(v => v.id === req.params.id);
  if (vehicle) Object.assign(vehicle, req.body);
  res.json({ success: true, data: vehicle });
});

// ============ MEDICATION ROUTES ============
app.get('/api/medications', (req, res) => {
  res.json({ success: true, data: mockStore.medications });
});

app.post('/api/medications', (req, res) => {
  const newMed = { id: generateId(), ...req.body, isActive: true };
  mockStore.medications.push(newMed);
  res.json({ success: true, data: newMed });
});

// ============ FRIDGE ROUTES ============
app.get('/api/fridge', (req, res) => {
  res.json({ success: true, data: mockStore.fridgeItems });
});

app.post('/api/fridge', (req, res) => {
  const newItem = { id: generateId(), ...req.body, isExpired: false };
  mockStore.fridgeItems.push(newItem);
  res.json({ success: true, data: newItem });
});

app.delete('/api/fridge/:id', (req, res) => {
  const index = mockStore.fridgeItems.findIndex(f => f.id === req.params.id);
  if (index > -1) mockStore.fridgeItems.splice(index, 1);
  res.json({ success: true });
});

// ============ MEAL ROUTES ============
app.get('/api/meals', (req, res) => {
  res.json({ success: true, data: mockStore.mealPlans });
});

app.get('/api/meals/recipes', (req, res) => {
  res.json({ success: true, data: mockStore.recipes });
});

app.post('/api/meals', (req, res) => {
  const newMeal = { id: generateId(), ...req.body };
  mockStore.mealPlans.push(newMeal);
  res.json({ success: true, data: newMeal });
});

// ============ NOTES ROUTES ============
app.get('/api/notes', (req, res) => {
  res.json({ success: true, data: mockStore.notes });
});

app.post('/api/notes', (req, res) => {
  const newNote = { id: generateId(), ...req.body, createdAt: new Date() };
  mockStore.notes.push(newNote);
  res.json({ success: true, data: newNote });
});

app.patch('/api/notes/:id', (req, res) => {
  const note = mockStore.notes.find(n => n.id === req.params.id);
  if (note) Object.assign(note, req.body);
  res.json({ success: true, data: note });
});

app.delete('/api/notes/:id', (req, res) => {
  const index = mockStore.notes.findIndex(n => n.id === req.params.id);
  if (index > -1) mockStore.notes.splice(index, 1);
  res.json({ success: true });
});

// ============ AUTH ROUTES (MOCK) ============
app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: mockStore.users[0],
      token: 'mock-jwt-token-' + Date.now()
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const newUser = { id: generateId(), ...req.body, familyId: '1', role: 'member' };
  mockStore.users.push(newUser);
  res.json({ success: true, data: { user: newUser, token: 'mock-jwt-token-' + Date.now() }});
});

app.get('/api/auth/me', (req, res) => {
  res.json({ success: true, data: mockStore.users[0] });
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`💰 Budget API: http://localhost:${PORT}/api/budget`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { app, io };
