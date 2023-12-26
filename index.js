const customReferences = require('./references/customReferences');
require('./database/config');
require('./controllers/Auth/CustomerAuthController');
require('./controllers/Auth/adminAuthController');
require('./controllers/CategoriesController');
require('./controllers/Auth/subAdminController');
require('./controllers/Auth/RestaurantAuthController');
require('./controllers/ProductController');
require('./controllers/DonorController');
require('./controllers/NotificationsController');
require('./controllers/CartController');
require('./controllers/ShareFoodController');
require('./controllers/FoodDealController');

customReferences.app.listen(8888);
