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

// Modelos utilizados pelo mongoose (Modelo é o formato utilizado para gravar a estrutura dos documentos no MongoDB).
// Schemas são utilizados para definir a estrutura dos modelos.

const setorSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  responsavel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionarios'
  }, 
  funcionarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Funcionarios',
    }
  ],
  maquinario: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Maquina'
    }
  ]
});

const Setor = mongoose.model('Setor', setorSchema); // Associando a estrutura do documento com sua collection no banco de dados 
// -----------------------------------------------------------------------------------------------------------------
const cargoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  salario: {
    type: Number,
    required: true
  }
})

const Cargo = mongoose.model('Cargo', cargoSchema)
// -----------------------------------------------------------------------------------------------------------------
const funcionarioSchema = new mongoose.Schema({
  nome: {
    type: String, 
    required: true
  },
  CPF: {
    type: String,
    required: true
  },
  cargo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cargo',
    required: true
  }
});

const Funcionarios = mongoose.model('Funcionarios', funcionarioSchema);
//----------------------------------------------------------------------------------------------------------------
const maquinaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  numeroDeInventario: {
    type: Number,
    required: true
  },
  dataDaProximaManutencao: {
    type: Date,
    required: true
  },
  responsavelPelaManutencao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionarios'
  }
});


const Maquinas = mongoose.model('Maquina', maquinaSchema);
//---------------------------------------------------------------------------------------------------------------
const estoqueSchema = new mongoose.Schema({
  nomeDoItem: {
    type: String,
    required: true
  }
});

const Estoque = mongoose.model('Estoque', estoqueSchema);
//---------------------------------------------------------------------------------------------------------------
const linhaProducaoSchema = new mongoose.Schema({
  nomeDoProdutoGerado: {
    type: String,
    required: true
  },
  materiaPrimaUtilizada: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Estoque',
      required: true
    }
  ],
  setor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Setor',
    required: true
  }
});

const LinhaProducao = mongoose.model('Linha_de_producao', linhaProducaoSchema);
//---------------------------------------------------------------------------------------------------------------
const produtoFinalSchema = new mongoose.Schema({
  marca:{
    type: String,
    required: true
  },
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Linha_de_producao',
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  dataDeFabricacao: {
    type: Date,
    required: true
  },
  dataDeValidade: {
  type: Date,
  required: true
}
});

const ProdutoFinal = mongoose.model('Produto_final', produtoFinalSchema);
//---------------------------------------------------------------------------------------------------------------
const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  endereco: {
    type: String,
    required: true
  },
  cpfOuCnpj: {
    type: Number,
    required: true
  }
});

const Cliente = new mongoose.model('Cliente', clienteSchema);
//---------------------------------------------------------------------------------------------------------------
const vendaSchema = new mongoose.Schema({
  codigoDaVenda: {
    type: String,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  itens: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Produto_final',
      required: true
    }
  ],
  valorTotal: {
    type: Number,
    required: true
  },
  responsavelPelaVenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionarios',
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  }
});

const Venda = mongoose.model('Venda', vendaSchema);
//---------------------------------------------------------------------------------------------------------------
const entregaSchema = new mongoose.Schema({
  dataDeRecebimento: {
    type: Date,
    required: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  localDeRecebimento: {
    type: String, 
    required: true
  },
  dadosDaVenda: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venda',
    required: true
  }
});

const Entrega = new mongoose.model('Entrega', entregaSchema);

// Criação dos sub-menus do AdminBro
const employesAndMachinesSubMenu = {
  name: 'Sub-menu de funcionários e máquinas'
};

const productionLineSubMenu = {
  name: 'Sub-menu da linha de produção'
};

const salesAndDeliveriesSubMenu = {
  name: 'Sub-menu de vendas e entregas'
}

// Configurações do AdminBro 
const adminBro = new AdminBro({
  rootPath: '/', // Rota em que a aplicação irá rodar
  resources: [ // Modelos que o AdminBro irá usar associado com os seus sub-menus
    {
      resource: Setor, options: {parent: employesAndMachinesSubMenu}
    },
    {
      resource: Cargo, options: {parent: employesAndMachinesSubMenu}
    },
    {
      resource: Funcionarios, options: {parent: employesAndMachinesSubMenu}
    },
    {
      resource: Maquinas, options: {parent: employesAndMachinesSubMenu}
    },
    {
      resource: Estoque, options: {parent: productionLineSubMenu}
    },
    {
      resource: LinhaProducao, options: {parent: productionLineSubMenu}
    },
    {
      resource: ProdutoFinal, options: {parent: productionLineSubMenu}
    },
    {
      resource: Cliente, options: {parent: salesAndDeliveriesSubMenu}
    },
    {
      resource: Venda, options: {parent: salesAndDeliveriesSubMenu}
    },
    {
      resource: Entrega, options: {parent: salesAndDeliveriesSubMenu}
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


