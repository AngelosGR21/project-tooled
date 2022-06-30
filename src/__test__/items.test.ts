import seed from "../db/seeds/seed";
import testData from "../db/data/test-data";
import request from "supertest";
import app from "../app";
import db from "../db/connection";
import { Comment } from "./types-test";

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("API: /api/items", () => {
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
});
