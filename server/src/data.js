module.exports = class RandomData {
  //👇🏻 Generates a random string
  fetchID = () =>
    Math.random()
      .toString(36)
      .substring(2, 10);
  //👇🏻 Generates a random number
  fetchNumber = (maxNumber) => Math.floor(Math.random() * maxNumber ?? 100);
  //👇🏻 Generates a random boolean
  fetchBoolean = () => Math.random() >= 0.5;
  //👇🏻 Generates a random date
  fetchDate = () => new Date().toUTCString();
  //👇🏻 Generates a random meaningful comment string
  fetchText = () => {
    const comments = [
      "Create a new project",
      "Create a new milestone",
      "Create a new label",
      "Create a new task",
      "Add a new feature",
      "Commit changes to the repo",
      "Push changes to the remote repo",
      "Create a new branch",
      "Merge pull request",
      "Merge changes to the master branch",
      "Create a new release",
      "Create a new pull request",
      "Delete a branch",
      "Create a new issue",
      "Add a comment",
      "Close an issue",
      "Reopen an issue",
      "Create a new wiki page",
      "Review GitHub notifications",
      "Review GitHub discussions",
      "Review GitHub projects",
    ];
    const comment = comments[Math.floor(Math.random() * comments.length)];
    return comment;
  };
  //👇🏻 Generates a random names with different alphabets in english
  fetchName = () => {
    const names = [
      "John",
      "Jane",
      "Doe",
      "Smith",
      "Micheal",
      "Jackson",
      "William",
      "Ava",
      "Olivia",
      "Emma",
      "Sophia",
      "Isabella",
      "Charlotte",
      "Amelia",
      "Mia",
      "Harper",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };
  ///👇🏻 Generates a random comment object
  fetchComment = () => ({
    userId: this.fetchID(),
    name: this.fetchName(),
    text: this.fetchText(),
    date: this.fetchDate(),
  });
  //👇🏻 Generates a random list of comments
  fetchComments = () =>
    Array.from({ length: this.fetchNumber(10) }, () => this.fetchComment());

  /// Generate a random task objet
  fetchTask = () => ({
    id: this.fetchID(),
    title: this.fetchText(),
    comments: this.fetchComments(),
    date: this.fetchDate(),
    isComplete: this.fetchBoolean(),
    isArchived: this.fetchBoolean(),
    isDeleted: this.fetchBoolean(),
  });

  //👇🏻 Generates a random list of tasks
  fetchTasks = () =>
    Array.from({ length: this.fetchNumber(10) }, () => this.fetchTask());

  // 👇🏻 Generates a random list of tasks
  fetchPending = () => ({
    pending: {
      id: this.fetchID(),
      title: "pending",
      items: this.fetchTasks(),
    },
    ongoing: {
      id: this.fetchID(),
      title: "ongoing",
      items: this.fetchTasks(),
    },
    completed: {
      id: this.fetchID(),
      title: "completed",
      items: this.fetchTasks(),
    },
  });

  //👇🏻 Generates a random list of projects
  fetchProjects = () =>
    Array.from({ length: this.fetchNumber(10) }, () => ({
      id: this.fetchID(),
      title: this.fetchText(),
      tasks: this.fetchTasks(),
      date: this.fetchDate(),
      isComplete: this.fetchBoolean(),
      isArchived: this.fetchBoolean(),
      isDeleted: this.fetchBoolean(),
    }));
};
