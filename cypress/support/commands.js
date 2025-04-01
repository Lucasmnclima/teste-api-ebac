Cypress.Commands.add('token', (email, senha) => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            "email": email,
            "password": senha 
        }
    }).then((response) => {
        expect(response.status).to.equal(200)
        return response.body.authorization
    })
})

Cypress.Commands.add('cadastrarUsuario', (token, nome, email, senha, administrador) => {
    cy.request({
      method: 'POST',
      url: '/usuarios',
      headers: { Authorization: token },
      body: {
        "nome": nome,
        "email": email,
        "password": senha,
        "administrador": administrador ? "true" : "false",
      },
      failOnStatusCode: false, // Permite capturar respostas com erro
    });
});