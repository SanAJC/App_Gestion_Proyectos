import request from "supertest";
import app from "../server";

describe("POST /api/projects", () => {
    it("Proyecto creado correctamente", async () => {
        const response = await request(app).post("/api/projects").send({
            title: "Proyecto 1",
            description: "Descripcion del proyecto 1",
            ownerId: "test1@example.com",
            miembros: ["test2@example.com"],
            githubRepo: {
                name: "repo1",
                url: "https://github.com/test1/repo1"
            },
            status: "activo"
            
        });
        expect(response.statusCode).toBe(201);
    })
});

describe("GET /api/projects", () => {
    it("Proyectos obtenidos correctamente", async () => {
        const response = await request(app).get("/api/projects");
        expect(response.statusCode).toBe(200);
    })
});
