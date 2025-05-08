describe('Perform UI testing of the application features',()=> {
    // let comparatorData;
    beforeEach(function ()  {
        cy.log('Authentification');
        cy.login();
        cy.fixture('Data_feature_IHM_Comparator.json').then((comparator)=> {
            this.comparatorData=comparator;
        });
    });
    it('should test the comparator', function () {
        const comparatorData = this.comparatorData;
        cy.log('Vérifier que je suis sur le comparateur');
        cy.contains('a.nav-link', 'Comparateur').click();
        cy.url().should('include','/comparateur');
        cy.log('Sélection du montant à investir');
        cy.get('#investmentAmount').type(comparatorData.totalInvestment);
        //première SCPI
        cy.log('Sélection de la première SCPI');
        cy.get('div[role="button"][aria-label="dropdown trigger"]').first().click();
        cy.get('li[role="option"]').should('have.length', comparatorData.dbLength);
        cy.get('li[role="option"]')
            .contains(comparatorData.scpi1.scpiName).click();
        cy.get('.revenus-value').first().should('contain', comparatorData.scpi1.RevenusMensuels);
        cy.get('.rendement-box').first().should('contain', comparatorData.scpi1.distribution_Rate);

        //Deuxième SCPI
        cy.log('Sélection de la deuxième SCPI');
        cy.get('div[role="button"][aria-label="dropdown trigger"]').eq(1).click();
        cy.get('li[role="option"]').should('have.length', comparatorData.dbLength-1);
        cy.get('li[role="option"]')
            .contains(comparatorData.scpi2.scpiName).click();
        cy.get('.revenus-value').eq(1).should('contain', comparatorData.scpi2.RevenusMensuels);
        cy.get('.rendement-box').eq(1).should('contain', comparatorData.scpi2.distribution_Rate);

        // Troisième SCPI
        cy.log('Sélection de la Troisième SCPI');
        cy.get('div[role="button"][aria-label="dropdown trigger"]').eq(2).click();
        cy.get('li[role="option"]').should('have.length', comparatorData.dbLength-2);
        cy.get('li[role="option"]')
            .contains(comparatorData.scpi3.scpiName).click();
        cy.get('.revenus-value').eq(2).should('contain', comparatorData.scpi3.RevenusMensuels);
        cy.get('.rendement-box').eq(2).should('contain', comparatorData.scpi3.distribution_Rate);
        cy.contains('tr', 'Frais de souscription')
            .within(() => {
                cy.get('td').eq(1).should('contain', comparatorData.scpi1.Frais_de_souscription)
                cy.get('td').eq(2).should('contain', comparatorData.scpi2.Frais_de_souscription)
                cy.get('td').eq(3).should('contain', comparatorData.scpi3.Frais_de_souscription)
            });
    })
    it('Should test simulation');
    it('should test crédit');
    it('Should test versements programmés')

});