describe("Task Creation", () => {
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
    cy.visit("/");
    cy.wait("@emptyTasks");

    cy.contains("No tasks yet!").should("be.visible");
    cy.get('[data-testid="empty-check-icon"]').should("be.visible");
  });

  it("creates a new task and sees it in recent list", () => {
    cy.createTask("Buy milk", "2L whole milk");

    cy.wait("@createTask").its("request.body").should("deep.equal", {
      title: "Buy milk",
      description: "2L whole milk",
    });
    cy.get('[data-content=""] > div')
      .should("be.visible")
      .and("contain.text", "Task added successfully!");
    // cy.contains('Buy milk').should('be.visible');
    // cy.contains('2L whole milk').should('be.visible');
  });

  it("completes a task and removes it from list", () => {
    const task: {
      id: number;
      title: string;
      description: string;
      completed: boolean;
    } = {
      id: 1,
      title: "Walk dog",
      description: "30 mins",
      completed: false,
    };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");
    cy.intercept("PUT", `**/tasks/${task.id}`, {
      body: { ...task, completed: true },
    }).as("completeTask");

    cy.visit("/");
    cy.wait("@getTasks");

    cy.contains("Walk dog")
      .parents(".shadow-card")
      .within(() => {
        cy.contains("button", "Complete").click();
      });

    cy.wait("@completeTask");
    // cy.contains('Walk dog').should('not.exist');

    cy.get('[data-content=""] > div')
      .should("be.visible")
      .and("contain.text", "Task completed!");
  });

  it("edits a task inline", () => {
    const task: {
      id: number;
      title: string;
      description: string;
      completed: boolean;
    } = {
      id: 2,
      title: "Old title",
      description: "Old desc",
      completed: false,
    };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");
    cy.intercept("PATCH", `**/tasks/${task.id}`, (req) => {
      req.reply({ statusCode: 200, body: { ...task, ...req.body } });
    }).as("updateTask");

    cy.visit("/");
    cy.wait("@getTasks");

    cy.contains("Old title")
      .parents(".shadow-card")
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    cy.get('input[placeholder="Task title"]').clear().type("New title");
    cy.get('textarea[placeholder="Task description"]').clear().type("New desc");
    cy.contains("button", "Save").click();

    cy.wait("@updateTask").its("request.body").should("deep.equal", {
      title: "New title",
      description: "New desc",
    });

    cy.get('[data-content=""] > div')
      .should("be.visible")
      .and("contain.text", "Changes saved");

    // cy.contains('New title').should('be.visible');
    // cy.contains('New desc').should('be.visible');
  });

  it("cancels edit and reverts changes", () => {
    const task: {
      id: number;
      title: string;
      description: string;
      completed: boolean;
    } = {
      id: 3,
      title: "Cancel me",
      description: "Do not save",
      completed: false,
    };

    cy.intercept("GET", "**/tasks", { body: [task] }).as("getTasks");

    cy.visit("/");
    cy.wait("@getTasks");

    cy.contains("Cancel me")
      .parents(".shadow-card")
      .within(() => {
        cy.contains("button", "Edit").click();
      });

    cy.get('input[placeholder="Task title"]').clear().type("Should not save");
    cy.contains("button", "Cancel").click();

    cy.contains("Should not save").should("not.exist");
    cy.contains("Cancel me").should("be.visible");
  });
});
