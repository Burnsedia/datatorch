/// <reference types="Cypress" />

describe('The authorization flow', () => {
  beforeEach(() => {
    cy.exec('cd ../.. && yarn db:reset --force')
  })
  it('Goes through the regsiter, logout, and login flows', () => {
    cy.visit('/register')
    cy.wait(500)
    cy.get('#field-1').type('janedoe')
    cy.get('#field-2').type('jane.doe@example.com')
    cy.get('#field-3').type('examplePassword')
    cy.get('button[type=submit]').click()
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.eq('/home')
    // })
    // const oldRefresh = cy.getCookie('refresh-token')
    // oldRefresh.should('exist')
    // const oldAccess = cy.getCookie('access-token')
    // oldAccess.should('exist').should('exist')
    // cy.get('.chakra-avatar__svg').click()
    // cy.contains('Sign out').click()
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.eq('/login')
    // })
    // cy.getCookie('refresh-token').should('not.exist')
    // cy.getCookie('access-token').should('not.exist')
    // cy.get('#field-19').type('janedoe')
    // cy.get('#field-20').type('examplePassword')
    // cy.get('button[type=submit]').click()
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.eq('/home')
    // })
    // cy.contains('janedoe').should('exist')
    // const newRefresh = cy.getCookie('refresh-token')
    // newRefresh.should('exist')
    // const newAccess = cy.getCookie('access-token')
    // newAccess.should('exist')
    // newRefresh.should('not.eq', oldRefresh)
    // newAccess.should('not.eq', oldAccess)
    // newRefresh.should('eq', newRefresh)
    // newAccess.should('eq', newAccess)
  })
})
