import 'cypress-mochawesome-reporter/register';
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
                username: Cypress.env('CYPRESS_USERNAME'),
                password: Cypress.env('CYPRESS_PASSWORD')
            }
        }).then((response) => {
            const { access_token } = response.body;
            return cy.wrap(access_token);
        });
});
Cypress.Commands.add('login',()=>{
        cy.visit('/');
        cy.get('.btn-primary').click()
        cy.origin('https://keycloak.check-consulting.net', () => {
            cy.get('#username').type(Cypress.env('CYPRESS_USERNAME'));
            cy.get('#password').type(Cypress.env('CYPRESS_PASSWORD'));
            cy.get('#kc-login').click()
        });
        cy.url().should('include','/dashboard');
});