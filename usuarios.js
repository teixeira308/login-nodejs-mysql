

async function consultaUsuarios()
{
    console.log("entrou na consultaUsuarios")
    const db = require('./db');
    const users = await db.findAllUsers();
    console.log(users);
    return users;
}

module.exports = { consultaUsuarios }
