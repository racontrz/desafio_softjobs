const pool = require("../bd/conexiones.js");
const bcrypt = require("bcryptjs");

const userRecord = async (usuario) => {
  let { email, password, rol, lenguage } = usuario;
  const key = bcrypt.hashSync(password);
  password = key;
  const values = [email, key, rol, lenguage];
  const consultas = "INSERT INTO usuarios VALUES (DEFAULT, $1, $2, $3, $4)";
  await pool.query(consultas, values);
};

const userData = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount } = await pool.query(consulta, values);
  if (!rowCount) { throw { code: 404, message: "Usuario Incorrecto" };
  }
  delete usuario.password;
  return usuario; 
};

const userKey = async (email, password) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows: [usuario], rowCount} = await pool.query(consulta, values);
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);
  if (!passwordEsCorrecta || !rowCount)
    throw { code: 401, message: "Datos incorrectos" };
};

module.exports = {
  userRecord,
  userData,
  userKey,
};
