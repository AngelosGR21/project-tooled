"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seed_1 = __importDefault(require("../db/seeds/seed"));
const test_data_1 = __importDefault(require("../db/data/test-data"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const connection_1 = __importDefault(require("../db/connection"));
beforeEach(() => (0, seed_1.default)(test_data_1.default));
afterAll(() => connection_1.default.end());
describe("API: /api/categories", () => {
    describe("GET: /api/categories", () => {
        test("200: responds with array of categories", () => {
            return (0, supertest_1.default)(app_1.default)
                .get("/api/categories")
                .expect(200)
                .then(({ body: { categories } }) => {
                expect(categories).toHaveLength(7);
                expect(categories).toBeInstanceOf(Array);
                categories.forEach((category) => {
                    expect(category).toEqual(expect.objectContaining({
                        category: expect.any(String),
                        category_id: expect.any(Number),
                    }));
                });
            });
        });
    });
    describe("GET - errors: /api/categories", () => {
        test("404: responds with error message", () => {
            return (0, supertest_1.default)(app_1.default)
                .get("/api/invalid_categories")
                .expect(404)
                .then(({ body: { message } }) => {
                expect(message).toBe("invalid endpoint");
            });
        });
    });
});
