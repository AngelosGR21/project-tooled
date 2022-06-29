import request, { Request } from "supertest";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import app from "../app";
import db from "../db/connection";
import { Item } from "./types-test";
import 'jest-sorted';

afterAll(() => {
  db.end();
})

beforeEach(() => seed(testData));

describe("API: /api/items", () => {
  describe('GET /api/items', () => {
    test('200: responds with an items array of items objects (sorted by date in descending order)', () => {
      return request(app)
        .get("/api/items")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).not.toHaveLength(0);
          expect(items).toBeSortedBy("created_at", { descending: true });
          items.forEach((item: Item) => {
            expect(item).toEqual(
              expect.objectContaining({
                item_id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number),
                body: expect.any(String),
                user_id: expect.any(Number),
                category_id: expect.any(Number),
                item_image: expect.any(String),
                created_at: expect.any(String),
                is_available: expect.any(Boolean),
                rating: expect.any(Number),
                lat: expect.any(String),
                long: expect.any(String)
              })
            )
          })
        })
    });

    test('200: responds with an items array of items objects which sorted by any valid column', () => {
      return request(app)
        .get("/api/items?sort_by=price&order=asc")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).not.toHaveLength(0);
          expect(items).toBeSortedBy("price", { descending: false });
        })
    });

    test('200: responds with an items array of items objects which sorted by any valid column and default descending order when passed invalid order', () => {
      return request(app)
        .get("/api/items?sort_by=price&order=random")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).not.toHaveLength(0);
          expect(items).toBeSortedBy("created_at", { descending: true });
          items.forEach((item: Item) => {
            expect(item).toEqual(
              expect.objectContaining({
                item_id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(Number),
                body: expect.any(String),
                user_id: expect.any(Number),
                category_id: expect.any(Number),
                item_image: expect.any(String),
                created_at: expect.any(String),
                is_available: expect.any(Boolean),
                rating: expect.any(Number),
                lat: expect.any(String),
                long: expect.any(String)
              })
            )
          })
        })
    });

    test('400: responds with bad request message when passed invalid sort_by', () => {
      return request(app)
        .get("/api/items?sort_by=oranges")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid sort by");
        });
    });

  });
  describe("GET: /api/items/:item_id", () => {
    test("200: responds with a item object", () => {
      const item_id = 1;
      return request(app)
        .get(`/api/items/${item_id}`)
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Object);
          expect(items).toEqual(
            expect.objectContaining({
              item_id: 1,
              name: "Drill",
              price: 2000,
              body: "Powerful cordless combi drill with 2 mechanical gears and all-metal gear construction to ensure high transmission durability. Variable speed trigger covers a wide range of drilling, driving and hammer applications. Other features include 16 adjustable torque settings plus drill mode, a single sleeve keyless chuck to enable easy bit removal and a soft-grip ergonomic handle. Supplied in a moulded plastic case.",
              user_id: 1,
              category_id: 1,
              item_image:
                "https://media.istockphoto.com/photos/cordless-power-drill-picture-id184290460?k=20&m=184290460&s=612x612&w=0&h=2SPZtNwffX2rudiiftl0UZzdE5ksoqhGeR7yzIJFDaM=",
              created_at: new Date(1610964101251).toISOString(),
              is_available: true,
              lat: "51.51561",
              long: "-0.0769",
              rating: 0,
            })
          );
        });
    });
  });
  describe("GET - errors: /api/items/:item_id", () => {
    test("400: responds with an error message when passed an invalid endpoint", () => {
      const item_id = "invalid_type";
      return request(app)
        .get(`/api/items/${item_id}`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });
    test("404: responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const item_id = 999;
      return request(app)
        .get(`/api/items/${item_id}`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe(`item does not exist`);
        });
    });
  });
});
