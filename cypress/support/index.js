
// afterEach(function () {
//   if (this.currentTest.state === 'failed') {
//     Cypress.stop()
//     return
//   }
// })

beforeEach(() => {
  if (env !== 'expected-condition') {
    cy.log('Stop tests - environment is not setup correctly')
    Cypress.stop()
    return
  }
})