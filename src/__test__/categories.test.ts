import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import request from "supertest";
import app from "../app";
import db from "../db/connection";
import { Category } from "./types-test";

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("API: /api/categories", () => {
  describe("GET: /api/categories", () => {
    test("200: responds with array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toHaveLength(7);
          expect(categories).toBeInstanceOf(Array);
          categories.forEach((category: Category) => {
            expect(category).toEqual(
              expect.objectContaining({
                category: expect.any(String),
                category_id: expect.any(Number),
              })
            );
          });
        });
    });
  });
});
