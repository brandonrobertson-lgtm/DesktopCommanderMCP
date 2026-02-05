import { Router } from 'express';
import { MealController } from '../controllers/mealController';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new MealController();

router.use(authenticate);

// Meal plans
router.get('/plans', controller.getMealPlans);
router.get('/plans/:date', controller.getMealPlansByDate);
router.post('/plans', controller.createMealPlan);
router.patch('/plans/:id', controller.updateMealPlan);
router.delete('/plans/:id', controller.deleteMealPlan);

// Recipes
router.get('/recipes', controller.getRecipes);
router.get('/recipes/:id', controller.getRecipe);
router.post('/recipes', controller.createRecipe);
router.patch('/recipes/:id', controller.updateRecipe);
router.delete('/recipes/:id', controller.deleteRecipe);
router.post('/recipes/:id/favorite', controller.toggleFavorite);

// Calorie tracking
router.get('/calories', controller.getCalorieLogs);
router.get('/calories/:date', controller.getCalorieLogsByDate);
router.post('/calories', controller.logCalories);
router.delete('/calories/:id', controller.deleteCalorieLog);
router.get('/calories/stats/:userId', controller.getCalorieStats);

// Food database
router.get('/foods/search', controller.searchFoods);
router.get('/foods/:barcode/barcode', controller.getFoodByBarcode);
router.post('/foods', controller.addFoodToDatabase);

export default router;
