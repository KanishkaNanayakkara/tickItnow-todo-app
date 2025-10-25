describe('Task Creation', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should create a new task successfully', () => {
    cy.intercept('POST', '**/tasks', {
      statusCode: 201,
      body: { id: 9999, title: 'New Test Task', description: 'Test Description', completed: false },
    }).as('addTask');

    const title = 'New Test Task';
    const description = 'Test Description';

    cy.get('#title').should('be.visible').type(title);
    cy.get('#description').should('be.visible').type(description);

    cy.contains('button', 'Add Task').scrollIntoView().click();

    cy.wait('@addTask');

    cy.contains('Task added successfully!').should('be.visible');

    cy.get('#title').should('have.value', '');
    cy.get('#description').should('have.value', '');
    
  });
});