import request from "supertest";
import app from "../server";

describe("POST /api/auth/register", () => {
    it("Registro Correcto", async () => {
        const response = await request(app).post("/api/auth/register").send({
            email: "test1@example.com",
            password: "password",
            username: "test",
            rol: "user"        
        });
        expect(response.statusCode).toBe(201);
    })
    
});

describe("POST /api/auth/login", () => {
    it("Login Correcto", async () => {
        const response = await request(app).post("/api/auth/login").send({
            email: "test1@example.com",
            password: "password"
        });
        expect(response.statusCode).toBe(200);
    })
});



