const express = require("express");
const cors = require('cors');
const app = express();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();
const { userRecord, userData, userKey,} = require("./consultas/consultas.js");
const { checkCredentialsExists, tokenVerification,} = require("./middleware/middleware.js");


const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/", router);

app.get("/", (req, res) => {
  res.send("Hello World2");
});

app.post("/usuarios", checkCredentialsExists, async (req, res) => {
  const usuario = req.body;
  await userRecord(usuario);
  res.send("Registro Correcto");

});

app.get("/usuarios", tokenVerification, async (req, res) => {
  const token = req.header("Authorization").split("Bearer ")[1];
  const { email } = jwt.decode(token);
  const usuario = await userData(email);
  res.json(usuario);

});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  await userKey(email, password);
  const token = jwt.sign({ email }, process.env.SECRET);
  res.send(token);

});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
