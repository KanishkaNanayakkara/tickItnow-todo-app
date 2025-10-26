import { TasksPage } from "../pages/tasksPage";

describe("Task Creation", () => {
  const tasksPage = new TasksPage();

  beforeEach(() => {
    cy.intercept("POST", "**/tasks", (req) => {
      const newTask = { id: Date.now(), completed: false, ...req.body };
      req.reply({ statusCode: 201, body: newTask });
    }).as("createTask");
    cy.visit("/");
    // cy.intercept('GET', '**/tasks', { fixture: 'tasks.json' }).as('getRecentTasks');
    // cy.wait('@getRecentTasks');
  });

  it("shows empty state when no tasks exist", () => {
    cy.intercept("GET", "**/tasks", { body: [] }).as("emptyTasks");
    tasksPage.visit();
    cy.wait("@emptyTasks");

    tasksPage.getEmptyStateText().should("be.visible");
    tasksPage.getEmptyStateIcon().should("be.visible");
  });

  it("creates a new task and sees it in recent list", () => {
    tasksPage.createTask("Buy milk", "2L whole milk");

    cy.wait("@createTask").its("request.body").should("deep.equal", {
      title: "Buy milk",
      description: "2L whole milk",
    });

    tasksPage.getToastMessage()
      .should("be.visible")
      .and("contain.text", "Task added successfully!");
    // cy.contains('Buy milk').should('be.visible');
    // cy.contains('2L whole milk').should('be.visible');
  });

  it("completes a task and removes it from list", () => {
    const task = { id: 1, title: "Walk dog", description: "30 mins", completed: false };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");
    cy.intercept("PUT", `**/tasks/${task.id}`, { body: { ...task, completed: true } }).as("completeTask");

    tasksPage.visit();
    cy.wait("@getTasks");

    tasksPage.completeTask("Walk dog");

    cy.wait("@completeTask");
    // cy.contains('Walk dog').should('not.exist');

    tasksPage.getToastMessage()
      .should("be.visible")
      .and("contain.text", "Task completed!");
  });

  it("edits a task inline", () => {
    const task = { id: 2, title: "Old title", description: "Old desc", completed: false };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");
    cy.intercept("PATCH", `**/tasks/${task.id}`, (req) => {
      req.reply({ statusCode: 200, body: { ...task, ...req.body } });
    }).as("updateTask");

    tasksPage.visit();
    cy.wait("@getTasks");

    tasksPage.editTask("Old title", "New title", "New desc");

    cy.wait("@updateTask").its("request.body").should("deep.equal", {
      title: "New title",
      description: "New desc",
    });

    tasksPage.getToastMessage()
      .should("be.visible")
      .and("contain.text", "Changes saved");

    // cy.contains('New title').should('be.visible');
    // cy.contains('New desc').should('be.visible');
  });

  it("cancels edit and reverts changes", () => {
    const task = { id: 3, title: "Cancel me", description: "Do not save", completed: false };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");

    tasksPage.visit();
    cy.wait("@getTasks");

    tasksPage.cancelEdit("Cancel me", "Should not save");

    cy.contains("Should not save").should("not.exist");
    cy.contains("Cancel me").should("be.visible");
  });
});
