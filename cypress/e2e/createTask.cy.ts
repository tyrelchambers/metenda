describe("tasks", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  beforeEach(() => {
    cy.login({ email: "user1@example.com" });
  });

  it("should allow you to create a task and view it", () => {
    const taskDetails = {
      name: "task 1",
      notes: "task 1 notes",
    };
    cy.visit("/agenda");
    cy.findByRole("link", { name: /new task/i }).click();

    cy.findByLabelText(/title/i).type(taskDetails.name);
    cy.findByLabelText(/notes/i).type(taskDetails.notes);

    cy.findByRole("button", { name: /create task/i }).click();

    cy.findByRole("link", { name: /task 1/i }).click();

    cy.contains(taskDetails.name).should("exist");
  });

  it("should allow you to delete a task", () => {
    const taskDetails = {
      name: "task 1",
      notes: "task 1 notes",
    };
    cy.visit("/agenda");
    cy.findByRole("link", { name: /new task/i }).click();

    cy.findByLabelText(/title/i).type(taskDetails.name);
    cy.findByLabelText(/notes/i).type(taskDetails.notes);

    cy.findByRole("button", { name: /create task/i }).click();

    cy.findByTestId("delete-task").click();

    cy.findByRole("link", { name: /task 1/i }).should("not.exist");
  });

  it("should show a create button if no tasks exist", () => {
    cy.visit("/agenda");
    cy.findByRole("link", { name: /create task/i }).click();
    cy.findByText(/create a new task/i).should("exist");
  });

  it("should redirect to agenda if discarded", () => {
    cy.visit("/agenda");
    cy.findByRole("link", { name: /new task/i }).click();
    cy.findByRole("button", { name: /discard/i }).click();
    cy.url().should("include", "/agenda");
  });

  it("should show a list of tasks in task list", () => {
    const taskDetails = {
      name: "task 1",
      notes: "task 1 notes",
    };
    cy.visit("/agenda");
    cy.findByRole("link", { name: /new task/i }).click();

    cy.findByLabelText(/title/i).type(taskDetails.name);
    cy.findByLabelText(/notes/i).type(taskDetails.notes);

    cy.findByRole("button", { name: /create task/i }).click();

    cy.findByRole("link", { name: /tasks/i }).click();

    cy.findByRole("link", { name: /task 1/i }).should("exist");
  });
});
