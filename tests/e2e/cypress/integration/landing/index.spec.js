/// <reference types="Cypress" />

describe('Public page sanity checks', () => {
  it('Successfully loads', () => {
    cy.visit('/')
    cy.visit('/pricing')
    cy.visit('/contact')
  })
})
