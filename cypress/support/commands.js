const qs = require('qs');
Cypress.Commands.add('getScpiInvestToken', () => {
        cy.request({
            method: 'POST',
            url: 'https://keycloak.check-consulting.net/realms/master/protocol/openid-connect/token',
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
            form:true,
            body: {
                grant_type: 'password',
                client_id: 'scpi-invest-plus',
                username: 'sz93',
                password: 'Test93'
            }
        }).then((response) => {
            const { access_token } = response.body;
            return cy.wrap(access_token);
        });
});