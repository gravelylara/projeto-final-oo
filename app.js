// Bibliotecas necessárias para o funcionamento da aplicação
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const AdminBro = require('admin-bro');
const AdminBroExpressjs = require('admin-bro-expressjs');

// Configurando o AdminBro com o mongoose (Ferramenta para integrar o Nodejs com o MongoDB)
AdminBro.registerAdapter(require('admin-bro-mongoose'));

// Configurações do Express 
const app = express();
app.use(bodyParser.json());

// Modelos do utilizados pelo mongoose (Modelo é o formato utilizado para gravar os documentos no MongoDB.
// O MongoDB é um banco de dados orientado a documentos)
// Schemas são utilizados para definir a estrutura de um documento no banco de dados.

const setorSchema = new mongoose.Schema({
  nome: String,
  // responsible: Employee
})

const Setor = mongoose.model('Setor', setorSchema); // Associando a estrutura do documento com sua collection no banco de dados 


const funcionarioSchema = new mongoose.Schema({
  nome: String,
  cpf: String,
  cargo: String,
  setor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setor',
    required: true
  }
})

const Funcionarios = mongoose.model('Funcionários', funcionarioSchema)


const maquinaSchema = new mongoose.Schema({
  nome: String,
  numeroDeInventario: int
})



// Criação dos sub-menus do AdminBro
const employesSubMenu = {
  name: 'Sub-menu de funcionários e máquinas'
};

// Configurações do AdminBro (Rotas, modelos, classes, etc)
const adminBro = new AdminBro({
  rootPath: '/', // Rota em que a aplicação irá rodar
  resources: [ // Modelos ("classes" no MongoDB) que o AdminBro irá usar
    {
      resource: Setor, options: {parent: employesSubMenu}
    },
    {
      resource: Funcionarios, options: {parent: employesSubMenu}
    }  
  ],
  branding: {
    companyName: 'Admin fábrica de bebidas',
    softwareBrothers: true
  }
});

// Criando uma rota no AdminBro que use o Express para rodar as chamadas e o próprio servidor
const router = AdminBroExpressjs.buildRouter(adminBro);
app.use(adminBro.options.rootPath, router);

// Criando o método assíncrono para rodar a aplicação Nodejs (na porta 3000) 
// e o banco de dados MongoDB (na url especificada)
const run = async () => {
  mongoose.connect('mongodb://localhost/adminFabricaBebidas')
  app.listen(3000, () => {
    console.log(`Sistema administrativo de fábricas no ar!`)
  })
};

run(); // Rodando a aplicação


