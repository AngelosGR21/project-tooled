import db from "../db/connection";
import testData from "../db/data/test-data/index";
import seed from "../db/seeds/seed";
import request from "supertest";
import app from "../app";



beforeEach(() => seed(testData));
afterAll(() => db.end());


describe("API: /api/users", () => {
    describe("POST: /api/users/login", () => {
        test("200: responds with a success message", () => {
            const credentials = { username: "oxlong123", password: "password" }
            return request(app)
                .post("/api/users/login")
                .send(credentials)
                .expect(200)
                .then(({ headers, body }) => {
                    const { message } = body;
                    expect(typeof headers["x-application-token"]).toBe("string");
                    expect(message).toBe("Login successful!")
                })
        })
        test("400: responds with an error message when the password was wrong", () => {
            const credentials = { username: "oxlong123", password: "passwordd" }
            return request(app)
                .post("/api/users/login")
                .send(credentials)
                .expect(400)
                .then(({ headers, body }) => {
                    const { message } = body;
                    expect(headers["x-application-token"]).toBe(undefined);
                    expect(message).toBe("Username or password is incorrect")
                })
        })
        test("400: responds with an error message when the username was wrong", () => {
            const credentials = { username: "oxlong12345671", password: "password" }
            return request(app)
                .post("/api/users/login")
                .send(credentials)
                .expect(400)
                .then(({ headers, body }) => {
                    const { message } = body;
                    expect(headers["x-application-token"]).toBe(undefined);
                    expect(message).toBe("Username or password is incorrect")
                })
        })
    })
    describe("POST /api/users", () => {
        test("201: creates a new user and authenticates him", () => {
            const userDetails = {
                "username": "testingUsername",
                "name": "User Name",
                "postcode": "LS170AW",
                "password": "password"
            }
            return request(app)
                .post("/api/users")
                .send(userDetails)
                .expect(201)
                .then(({ headers, body }) => {
                    const { message } = body;
                    expect(typeof headers["x-application-token"]).toBe("string")
                    expect(message).toBe("User created!")
                })
        })
        test("409: responds with an error message when the username already exists", () => {
            const userDetails = {
                "username": "oxlong123",
                "name": "User Name",
                "postcode": "LS170AW",
                "password": "password"
            }
            return request(app)
                .post("/api/users")
                .send(userDetails)
                .expect(409)
                .then(({ body }) => {
                    const { message } = body;
                    expect(message).toBe("username already exists")
                })

        })
        test("404: responds with an error message when the postcode is invalid", () => {
            const userDetails = {
                "username": "testing details",
                "name": "User Name",
                "postcode": "LS170AWWWW",
                "password": "password"
            }
            return request(app)
                .post("/api/users")
                .send(userDetails)
                .expect(404)
                .then(({ body }) => {
                    const { message } = body;
                    expect(message).toBe("Invalid postcode")
                })

        })
    })
})