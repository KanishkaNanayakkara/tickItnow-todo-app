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
    cy.get('[data-testid="task-title-input"]').type(title);
    cy.get('[data-testid="task-description-input"]').type(description);
    cy.contains("button", "Add Task").click();
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
    cy.get('input[placeholder="Task title"]').clear().type(newTitle);
    cy.get('textarea[placeholder="Task description"]').clear().type(newDesc);
    cy.contains("button", "Save").click();
  }

  cancelEdit(title: string, tempTitle: string) {
    this.getTaskCard(title).within(() => {
      cy.contains("button", "Edit").click();
    });
    cy.get('input[placeholder="Task title"]').clear().type(tempTitle);
    cy.contains("button", "Cancel").click();
  }
}
