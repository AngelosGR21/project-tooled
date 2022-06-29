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

});