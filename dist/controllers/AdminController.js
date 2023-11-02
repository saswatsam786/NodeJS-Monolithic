"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetVandorByID = exports.GetVandors = exports.CreateVandor = exports.FindVandor = void 0;
var models_1 = require("../models");
var utility_1 = require("../utility");
var FindVandor = function (id, email) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!email) return [3 /*break*/, 2];
                return [4 /*yield*/, models_1.Vandor.findOne({ email: email })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2: return [4 /*yield*/, models_1.Vandor.findById(id)];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.FindVandor = FindVandor;
var CreateVandor = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, ownerName, foodTypes, pincode, address, phone, email, password, existingVandor, salt, userPassword, createVandor;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, name = _a.name, ownerName = _a.ownerName, foodTypes = _a.foodTypes, pincode = _a.pincode, address = _a.address, phone = _a.phone, email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, exports.FindVandor)("", email)];
            case 1:
                existingVandor = _b.sent();
                if (existingVandor)
                    return [2 /*return*/, res.json({ message: "Vandor already exist with this email ID" })];
                return [4 /*yield*/, (0, utility_1.GenerateSalt)()];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, (0, utility_1.GeneratePassword)(password, salt)];
            case 3:
                userPassword = _b.sent();
                return [4 /*yield*/, models_1.Vandor.create({
                        name: name,
                        address: address,
                        pincode: pincode,
                        foodTypes: foodTypes,
                        email: email,
                        password: userPassword,
                        salt: salt,
                        ownerName: ownerName,
                        phone: phone,
                        rating: 0,
                        serviceAvailable: false,
                        coverImages: [],
                        foods: [],
                    })];
            case 4:
                createVandor = _b.sent();
                return [2 /*return*/, res.json(createVandor)];
        }
    });
}); };
exports.CreateVandor = CreateVandor;
var GetVandors = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vandors;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.Vandor.find()];
            case 1:
                vandors = _a.sent();
                if (vandors !== null)
                    return [2 /*return*/, res.json(vandors)];
                return [2 /*return*/, res.json({ message: "Vandors data not available" })];
        }
    });
}); };
exports.GetVandors = GetVandors;
var GetVandorByID = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var vandorId, vandor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                vandorId = req.params.id;
                return [4 /*yield*/, (0, exports.FindVandor)(vandorId)];
            case 1:
                vandor = _a.sent();
                if (vandor !== null)
                    return [2 /*return*/, res.json(vandor)];
                return [2 /*return*/, res.json({ message: "Vandor data not available" })];
        }
    });
}); };
exports.GetVandorByID = GetVandorByID;
//# sourceMappingURL=AdminController.js.map