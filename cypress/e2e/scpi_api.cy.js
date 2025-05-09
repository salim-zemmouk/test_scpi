describe('template spec', () => {
  let token;
  let searchData;
  beforeEach(() => {
    cy.getScpiInvestToken().then((access_token) => {
        token = access_token;
    });
    cy.fixture('Search.json').then((search)=> {
        searchData = search;
    });
  });
  it('shoulde recuperate name and version', () => {
      cy.request({
        method: 'GET',
        url: 'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/application/details',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect (response.body).to.have.property('name',"scpi-invest-plus-api");
        expect (response.body).to.have.property('version',"1.0.0");
      });
  });

  it('should recuperate all scpi', () => {
      cy.request({
        method:'GET',
        url:'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi',
        headers:{
          Authorization:`Bearer ${token}`
        },
      }).then((response)=>{
        expect(response.status).to.eq(200);
        expect(response.body.length).to.eq(52);
        cy.log(response.body);
      })
  });
  it.only('should recuperate scpi details by ID', () => {
      cy.request({
        method: 'GET',
        url: 'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi/details/1',
        headers: {
          Authorization: `Bearer ${token}`
        },
       }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property("id",1);
        expect(response.body).to.have.property("name","Transitions Europe");
        expect(response.body).to.have.property("cashback",5);
        expect(response.body).to.have.property("manager","Arkea REIM");
        expect(response.body.locations.length).to.eq(5);
        expect(response.body.locations.map(l=>l.id.country)).to.include.members(["Pays-Bas", "Espagne", "Irlande", "Pologne", "Allemagne"]);
        expect(response.body.sectors.length).to.eq(5);
        expect(response.body.sectors.map(s =>s.id.name)).to.include.members(["Bureaux", "Hotels", "Logistique", "Sante",  "Commerce"]);
        expect(response.body.locations[1]).to.have.property("countryPercentage",24.00);
        expect(response.body.statYears.length).to.eq(3);
        const stat2024 = response.body.statYears.find(stat=>stat.yearStat.yearStat===2024);
        expect(stat2024, '2024 stats should exist').to.exist;
        expect(stat2024).to.deep.include({distributionRate:8.35, sharePrice:200.00, reconstitutionValue:205.37});

      })
  })
    it('should Retourne SCPI Research ', () => {
            cy.request(({
                method:"GET",
                url:'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi/search',
                headers:{
                    Authorization: `Bearer ${token}`,
                    "Content-Type":"application/json"
                },
                qs:searchData.ByExatDatta
            })).then((response)=>{
                expect(response.status).to.eq(200);
                expect(response.body.length).to.eq(1);
                expect(response.body[0].name).to.eq("Coeur de regions");
                expect(response.body[0].statYear).to.have.property("distributionRate",searchData.ByExactDatta.distributionRate);
            })
    });
    it('should Retourne SCPI By Minimum_subscription ', () => {
            cy.request(({
                method: "GET",
                url: 'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi/search',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                qs: searchData.ByMinSubscription
            })).then((response) => {
                expect(response.status).to.be.eq(200);
                expect(response.body.length).to.be.eq(2);
                cy.log(response.body);
            })
    });
    it('should Retourne SCPI By subscription_fees ', () => {
            cy.request(({
                method: "GET",
                url: 'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi/search',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                qs:searchData.BySubscriptionFees
            })).then((response) => {
                expect(response.status).to.be.eq(200);
                expect(response.body.length).to.be.eq(46);
            })
    });
    it('should Retourne SCPI By Fake_name ', () => {
            cy.request({
                method: "GET",
                url: 'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/scpi/search',
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                qs:searchData.ByFakeName,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.be.eq(404);
                expect(response.body).to.have.property("status","error");
                expect(response.body).to.have.property("message","Aucune SCPI ne correspond aux critères de recherche");
            })
    });
    it('should create new simulation', () => {
        cy.request({
            method:"POST",
            url:'https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/simulation',
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body: searchData.scpiSimulation,
        }).then((response)=>{
            expect(response.status).to.be.eq(201);
            expect(response.body).to.have.property("name", searchData.scpiSimulation.name)
            expect(response.body).to.have.property("totalInvestment", searchData.scpiSimulation.scpis[0].rising);
            expect(response.body.scpiSimulations[0]).to.have.property("scpiId", searchData.scpiSimulation.scpis[0].scpiId);

            // suppression de la simulation

            const simulationId = response.body.id;
            cy.log('ID de la simulation créée : ', simulationId);
                cy.request({
                    method: "DELETE",
                    url:`https://qua.scpi-invest-plus-api.check-consulting.net/api/v1/simulation/${simulationId}`,
                    headers:{
                        Authorization:`Bearer ${token}`,
                    },
                }).then((response)=>{
                    expect(response.status).to.be.eq(200);
                    cy.log(`La simulation enregistré sous l ID ${simulationId} à était supprimer avec success`);
                });
            });
        });
});