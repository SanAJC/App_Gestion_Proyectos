import request from "supertest";
import app from "../server";

describe("POST /api/tasks", () => {
    it("Tarea creada correctamente", async () => {
        const response = await request(app).post("/api/tasks/nkEVy5mpN1MUG61PQjpL").send({
            title: "Tarea 1",
            description: "Descripcion de la tarea 1",
            status: "pendiente",
            assignedTo: "test1@example.com",
            createdAt: new Date(),
            dueDate: new Date()
        });
        expect(response.statusCode).toBe(201);
    })
});

// describe("GET /api/tasks", () => {
//     it("Tareas obtenidas correctamente", async () => {
//         const response = await request(app).get("/api/tasks").send({
//             projectId: "nkEVy5mpN1MUG61PQjpL"
//         });
//         expect(response.statusCode).toBe(200);
//     })
// });
