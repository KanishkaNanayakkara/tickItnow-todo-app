declare namespace Cypress {
  interface Chainable {
    createTask(title: string, description: string): Chainable<Element>;
    login(email: string, password: string): Chainable<Element>;
  }
}

Cypress.Commands.add('createTask', (title: string, description: string) => {
  cy.get('[data-testid="add-task-button"]').click();
  cy.get('[data-testid="task-title-input"]').type(title);
  cy.get('[data-testid="task-description-input"]').type(description);
  cy.get('[data-testid="submit-task-button"]').click();
});