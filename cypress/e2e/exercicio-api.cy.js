/// <reference types="cypress" />
import { faker } from '@faker-js/faker';
import contract from '../contracts/produtos.contract'
describe('Testes da Funcionalidade Usuários', () => {

  let token
  beforeEach(() => {
    cy.token('fulano@qa.com', 'teste').then(tkn => {
      token = tkn
    })
  })

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(response => {
      return contract.validateAsync(response.body)
    })
  });

  it('Deve listar usuários cadastrados - GET', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',
    }).should((response) => {
      expect(response.status).to.equal(200)
      expect(response.body).to.have.property('usuarios')
    })
  }); //teste

  it('Deve cadastrar um usuário com sucesso - POST', () => {
    let nome = faker.person.fullName(); // Gera um nome completo aleatório
    let email = faker.internet.email(); // Gera um e-mail aleatório
    let senha = faker.internet.password(); // Gera uma senha aleatória
    let administrador = true;
    cy.cadastrarUsuario(token, nome, email, senha, administrador)
      .should((response) => {
        expect(response.status).to.equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })
  });

  it('Deve validar um usuário com email inválido - POST', () => {
    let nome = faker.person.fullName();
    let email = faker.internet.email(); // Gera um e-mail aleatório
    let senha = faker.internet.password();
    let administrador = true;

    // Primeiro, cadastra o usuário para garantir que o e-mail já existe
    cy.cadastrarUsuario(token, nome, email, senha, administrador)
      .then((response) => {
        expect(response.status).to.equal(201); // Verifica se o cadastro foi bem-sucedido
      });

    // Em seguida, tenta cadastrar o mesmo e-mail para validar o erro
    cy.cadastrarUsuario(token, nome, email, senha, administrador)
      .should((response) => {
        expect(response.status).to.equal(400); // Espera erro de e-mail duplicado
        expect(response.body.message).to.equal('Este email já está sendo usado');
      });
  });

  it('Deve editar um usuário previamente cadastrado - PUT', () => {
    let nome = faker.person.fullName();
    let email = faker.internet.email(); // Gera um e-mail aleatório
    let senha = faker.internet.password();
    let administrador = true;
  
    // Cadastra o usuário e captura o ID
    cy.cadastrarUsuario(token, nome, email, senha, administrador)
      .then((response) => {
        expect(response.status).to.equal(201); // Verifica se o cadastro foi bem-sucedido
        let id = response.body._id; // Captura o ID do usuário cadastrado
  
        // Faz a requisição PUT para editar o usuário
        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`, // Usa o ID capturado
          headers: { Authorization: token },
          body: {
            "nome": nome + " Editado", // Edita o nome do usuário
            "email": email,
            "password": senha,
            "administrador": administrador ? "true" : "false",
          },
        }).should((response) => {
          expect(response.status).to.equal(200); // Verifica se a edição foi bem-sucedida
          expect(response.body.message).to.equal('Registro alterado com sucesso'); // Verifica a mensagem de sucesso
        });
      });
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let nome = 'Usuario EBAC ' + Math.floor(Math.random() * 100000000000); // Gerando um nome único
    let email = 'usuario' + Math.floor(Math.random() * 100000) + '@ebac.com.br'; // Gerando um e-mail único
    let senha = 'teste@123'; // Definindo uma senha
    let administrador = true; // Definindo o administrador como true
  
    // Cadastra o usuário e captura o ID
    cy.cadastrarUsuario(token, nome, email, senha, administrador)
      .then(response => {
        let id = response.body._id; // Captura o ID do usuário cadastrado
  
        // Faz a requisição DELETE para excluir o usuário
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`, // Usa o ID capturado
          headers: { Authorization: token },
        }).should((response) => {
          expect(response.status).to.equal(200); // Verifica se a exclusão foi bem-sucedida
          expect(response.body.message).to.equal('Registro excluído com sucesso'); // Verifica a mensagem de sucesso
        });
      });
  });
});
// describe('Teste de API - Usuários', () => {

//     let token
//     /* Token visível para todos os testes criados. Criei o comando token em support/commands.js
//         Posso utilizar token em qualquer teste que eu descreva */
//     beforeEach(() => {
//         cy.token('fulano@qa.com', 'teste').then(tkn => {
//             token = tkn
//         })
//     })

//     it('Deve validar contrato de usuários com sucesso', () => {
//         cy.request('usuarios').then(response => {
//             return contrato.validateAsync(response.body)
//             /* O validateAsync é uma função do Joi que valida o contrato */
//         })
//     })
