import request, { Request } from "supertest";
import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import app from "../app";
import db from "../db/connection";
import { Item, Comment } from "./types-test";
import "jest-sorted";

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("API: /api/items", () => {
  describe("GET /api/items", () => {
    test("200: responds with an items array of items objects (sorted by date in descending order)", () => {
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
                long: expect.any(String),
              })
            );
          });
        });
    });

    test("200: responds with an items array of items objects which sorted by any valid column", () => {
      return request(app)
        .get("/api/items?sort_by=price&order=asc")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).not.toHaveLength(0);
          expect(items).toBeSortedBy("price", { descending: false });
        });
    });

    test("200: responds with an items array of items objects which sorted by any valid column and default descending order when passed invalid order", () => {
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
                long: expect.any(String),
              })
            );
          });
        });
    });

    test("400: responds with bad request message when passed invalid sort_by", () => {
      return request(app)
        .get("/api/items?sort_by=oranges")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid sort by");
        });
    });

    test("200: responds with an items filtered by the category value specified in the query", () => {
      return request(app)
        .get("/api/items?category=Vehicles")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toBeInstanceOf(Array);
          expect(items).not.toHaveLength(0);
          items.forEach((item: Item) => {
            expect(item).toEqual(
              expect.objectContaining({
                category: "Vehicles",
              })
            );
          });
        });
    });

    test("200: responds with an empty array when passed category is not in database", () => {
      return request(app)
        .get("/api/items?category=categoryNotInDatabase")
        .expect(200)
        .then(({ body: { items } }) => {
          expect(items).toEqual([]);
        });
    });
  });
  describe.only("POST: /api/items", () => {
    test("201: responds with new item", () => {
      const newItem = {
        item_id: 8,
        name: "Gardening Mower",
        price: 1900,
        body: "This tool is specificity used for garden and has lasted me years.",
        item_image: "none",
        created_at: expect.any(String),
        rating: 0,
        is_available: true,
        lat: "51.51561",
        long: "-0.0769",
        user_id: 7,
        category_id: 7,
      };

      return request(app)
        .post(`/api/items`)
        .send(newItem)
        .expect(201)
        .then(({ body: { item } }) => {
          expect(item).toEqual(newItem);
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

  describe("GET: /api/items/:item_id/comment", () => {
    test("200: responds with a comment object", () => {
      const item_id = 3;

      return request(app)
        .get(`/api/items/${item_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(2);
          expect(comments).toBeInstanceOf(Array);
          comments.forEach((comment: Comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                user_id: expect.any(Number),
                body: expect.any(String),
                item_id: expect.any(Number),
                created_at: expect.any(String),
              })
            );
          });
        });
    });

    test("200: responds with a empty comment array when item exists but no comment posted", () => {
      const item_id = 1;

      return request(app)
        .get(`/api/items/${item_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toBeInstanceOf(Object);
          expect(comments).toEqual([]);
        });
    });
  });
  describe("GET - errors: /api/items/:item_id/comments", () => {
    test("400: responds with an error message when passed an invalid endpoint", () => {
      const item_id = "invalid_id";

      return request(app)
        .get(`/api/items/${item_id}/comments`)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is not valid");
        });
    });

    test("404:responds with an error message when passed an endpoint with correct data type but does not exist", () => {
      const item_id = 999;

      return request(app)
        .get(`/api/${item_id}/comments`)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("invalid endpoint");
        });
    });
  });

  describe("POST: /api/items/:item_id/comments", () => {
    test("201: responds with new comment", () => {
      const item_id = 1;
      const newComment = {
        body: "This is a cool game",
        user_id: 3,
      };

      return request(app)
        .post(`/api/items/${item_id}/comments`)
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(newComment);
        });
    });
  });
  describe("POST - errors: /api/items/:item_id/comments", () => {
    test("400: responds with error message when body does not contain mandatory keys ", () => {
      const item_id = 1;
      const newComment = {
        notUser_id: "invalid_author",
        notBody: "invalid_body",
      };
      return request(app)
        .post(`/api/items/${item_id}/comments`)
        .send(newComment)
        .expect(400)
        .then(({ body: { message } }) => {
          expect(message).toBe("input is missing");
        });
    });

    test("404: responds with error message when item_id in path does not exist", () => {
      const item_id = 999;
      const newComment = {
        body: "This is a cool game",
        user_id: 3,
      };
      return request(app)
        .post(`/api/items/${item_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("input does not exist");
        });
    });

    test("404: responds with error message when user_id does not exist", () => {
      const item_id = 2;
      const newComment = {
        body: "This is a cool game",
        user_id: 199099,
      };
      return request(app)
        .post(`/api/items/${item_id}/comments`)
        .send(newComment)
        .expect(404)
        .then(({ body: { message } }) => {
          expect(message).toBe("input does not exist");
        });
    });
  });
});
