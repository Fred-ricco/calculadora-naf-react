const prisma = require('./config/prisma');

async function testar() {
  const usuarios = await prisma.usuario.findMany();

  console.log('Usuários cadastrados:');
  console.log(usuarios);
}

testar();