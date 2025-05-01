import app from "./server";
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`[server]: Servidor corriendo en http://localhost:${port}`);
});