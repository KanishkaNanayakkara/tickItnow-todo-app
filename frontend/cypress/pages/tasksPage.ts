export class TasksPage {
  visit() {
    cy.visit("/");
  }

  getEmptyStateText() {
    return cy.contains("No tasks yet!");
  }

  getEmptyStateIcon() {
    return cy.get('[data-testid="empty-check-icon"]');
  }

  createTask(title: string, description: string) {
    cy.get('.lg\\:hidden > .rounded-lg > .space-y-4 > :nth-child(1) > [data-testid="task-title-input"]').scrollIntoView().type(title);
    cy.get('.lg\\:hidden > .rounded-lg > .space-y-4 > :nth-child(2) > [data-testid="task-description-input"]').scrollIntoView().type(description);
    cy.get('.lg\\:hidden > .rounded-lg > .space-y-4 > [data-testid="submit-task-button"]').scrollIntoView().click();
  }

  getToastMessage() {
    return cy.get('[data-content=""] > div');
  }

  getTaskCard(title: string) {
    return cy.contains(title).parents(".shadow-card");
  }

  completeTask(title: string) {
    this.getTaskCard(title).within(() => {
      cy.contains("button", "Complete").click();
    });
  }

  editTask(title: string, newTitle: string, newDesc: string) {
    this.getTaskCard(title).within(() => {
      cy.contains("button", "Edit").click();
    });
    cy.get('.lg\\:hidden > .rounded-lg > .space-y-4 > :nth-child(1) > [data-testid="task-title-input"]').scrollIntoView().clear().type(newTitle);
    cy.get('textarea[placeholder="Task description"]').clear().type(newDesc);
    cy.contains("button", "Save").click();
  }

  cancelEdit(title: string, tempTitle: string) {
    this.getTaskCard(title).within(() => {
      cy.contains("button", "Edit").click();
    });
    cy.get('.lg\\:hidden > .rounded-lg > .space-y-4 > :nth-child(1) > [data-testid="task-title-input"]').clear().type(tempTitle);
    cy.contains("button", "Cancel").click();
  }
}
