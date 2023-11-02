"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShoppingRoute = void 0;
var express_1 = __importDefault(require("express"));
var controllers_1 = require("../controllers");
var router = express_1.default.Router();
exports.ShoppingRoute = router;
// ---------------- Food Available ----------------
router.get("/:pincode", controllers_1.GetFoodAvailability);
// ---------------- Top Restaurants ----------------
router.get("/top-restaurants/:pincode", controllers_1.GetTopRestaurants);
// ----------------- Food Available in 30 mins --------------------------------
router.get("/foods-in-30-min/:pincode", controllers_1.GetFoodsIn30mins);
// ---------------- Search Foods --------------------------------
router.get("/search/:pincode", controllers_1.SearchFoods);
// ---------------- Find Restaurant By Id -------------------------
router.get("/restaurant/:id", controllers_1.RestaurantById);
//# sourceMappingURL=ShoppingRoute.js.map