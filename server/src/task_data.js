class FakeBoardData {
  //👇🏻 Generates a random string
  fetchID = () => "KAN-" + this.fetchNumber(10000);
  // Math.random()
  // .toString(36)
  // .substring(2, 10);
  //👇🏻 Generates a random number
  fetchNumber = (maxNumber) => Math.floor(Math.random() * maxNumber ?? 100);
  //👇🏻 Generates a random boolean
  fetchBoolean = () => Math.random() >= 0.5;
  //👇🏻 Generates a random date
  fetchDate = () =>
    new Date(+new Date() - Math.floor(Math.random() * 10000000000));

  //👇🏻 Generates a random date
  fetchDateInBetween = () =>
    new Date(
      +new Date() +
        Math.floor(Math.random() * 10000000000) -
        Math.floor(Math.random() * 10000000000)
    );
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
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old",
      "Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source",
      "Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC",
      "This book is a treatise on the theory of ethics, very popular during the Renaissance",
      "The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32",
      "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested",
      "Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham",
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable",
      "If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text",
      "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet",
      "It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable",
      "The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc",
      "Contrary to popular belief, Lorem Ipsum is not simply random text",
      "It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old",
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
    date: this.fetchDateInBetween(),
  });
  //👇🏻 Generates a random list of comments
  fetchComments = () =>
    Array.from({ length: this.fetchNumber(10) }, () => this.fetchComment());

  /// Generate a random task objet
  fetchTask = () => ({
    id: this.fetchID(),
    title: this.fetchText(),
    comments: this.fetchComments(),
    date: this.fetchDateInBetween(),
    isComplete: this.fetchBoolean(),
    isArchived: this.fetchBoolean(),
    isDeleted: this.fetchBoolean(),
  });

  //👇🏻 Generates a random list of tasks
  fetchTasks = () =>
    Array.from({ length: this.fetchNumber(20) }, () => this.fetchTask());

  // 👇🏻 Generates a random list of tasks
  fetchBoard = () => ({
    Todo: {
      id: this.fetchID(),
      title: "Todo",
      items: this.fetchTasks(),
    },
    "In Progress": {
      id: this.fetchID(),
      title: "In Progress",
      items: this.fetchTasks(),
    },
    "In Review": {
      id: this.fetchID(),
      title: "In Review",
      items: this.fetchTasks(),
    },
    Done: {
      id: this.fetchID(),
      title: "Done",
      items: this.fetchTasks(),
    },
  });

  tasks = this.fetchBoard();

  // Update tasks
  updateTasks = (tasks) => {
    this.tasks = tasks;
    console.table(this.tasks);
  };
}

module.exports = function() {
  this.FakeBoardData = new FakeBoardData();
  this.tasks = this.FakeBoardData.tasks;
};
