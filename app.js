const express = require("express");
const pool = require("./db");
const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

async function initDB() {
 await pool.query(`
 CREATE TABLE IF NOT EXISTS tareas (
 id SERIAL PRIMARY KEY
 texto VARCHAR(255) NOT NULL
 )
 `);
}

app.get("/", async (req, res) => {
 try {
   const result = await pool.query("SELECT * FROM tareas ORDER BY id DESC");
   res.render("index", { tareas: result.rows });
 } catch (error) {
   res.status(500).send("Error al leer las tareas: " + error.message);
 }
});

app.post("/nueva", async (req, res) => {
 const { texto } = req.body;
 try {
   if (texto && texto.trim() !== "") {
     await pool.query("INSERT INTO tareas (texto) VALUES ($1)", [texto]);
   }
   res.redirect("/");
 } catch (error) {
   res.status(500).send("Error al guardar la tarea: " + error.message);
 }
});

const port = process.env.PORT || 3000;
initDB()
 .then(() => {
 app.listen(port, () => {
   console.log(`Servidor iniciado en puerto ${port}`);
 });
 })
 .catch((error) => {
   console.error("Error al inicializar la base de datos:", error);
 });
