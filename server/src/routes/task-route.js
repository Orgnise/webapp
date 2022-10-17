var express = require("express");
var router = express.Router();
var socket = require("../../index");
const authMiddleware = require("../middleware/auth-middleware");

const FakeBoardData = require("../config/task_data");

module.exports = function() {
  // socket = socket;˝
  this.router = router;
  this.board = new FakeBoardData();
  this.tasks = this.board.tasks;

  // middleware that is specific to this router
  router.use(authMiddleware());

  // define the home page route
  router.get("/", (req, res) => {
    res.send({ response: this.tasks }).status(200);
  });

  /* GET home page. */
  router.get("/task", function(req, res, next) {
    res.render("index", {
      title: "Express",
    });
  });

  this.initSocket = function(socket) {
    socket.on("taskDragged", (data) => {
      console.log("🚀: taskDragged -> data", data);
      const { source, destination } = data;
      try {
        //👇🏻 Gets the item that was dragged
        const itemMoved = {
          ...this.tasks[source.droppableId].items[source.index],
        };
        // console.log("DraggedItem>>> ", itemMoved);

        //👇🏻 Removes the item from the its source
        this.tasks[source.droppableId].items.splice(source.index, 1);
        // this.updateTasks(this.tasks);

        //👇🏻 Add the item to its destination using its destination index
        this.tasks[destination.droppableId].items.splice(
          destination.index,
          0,
          itemMoved
        );

        //👇🏻 Sends the updated tasks object to the React app
        socket.emit("tasks", this.tasks);
        console.log("🚀: handleDragEnd -> this.tasks");
      } catch (error) {
        console.log("Source", this.tasks[destination.droppableId]);
        console.log(error);
        console.table(this.tasks["todo"]);
      }
    });
    socket.on("createTask", (data) => {
      // 👇🏻 Constructs an object according to the data structure
      const newTask = {
        id: this.board.FakeBoardData.fetchID(),
        title: data.task,
        description: data.task.description,
        comments: [],
        data: this.board.FakeBoardData.fetchDate(),
        status: data.status,
        priority: data.priority,
        isComplete: data.status === "Done" ? true : false,
        isArchived: false,
        isDeleted: false,
      };
      // 👇🏻 Adds the task to the `[data.status]` category
      if (this.tasks[data.status]) {
        // Check if the status has items
        if (this.tasks[data.status].items) {
          // Add the new task to the existing items
          this.tasks[data.status].items.push(newTask);
        } else {
          // If items is not defined then create items and add the new task
          this.tasks[data.status].items = [newTask];
        }
      } else {
        // If the status is not defined then create the status and add the new task
        this.tasks[data.status] = {
          id: `${data.status}-${this.board.FakeBoardData.fetchID()},`,
          title: data.status,
          items: [newTask],
        };
      }

      /* Fires the tasks event for update*/
      socket.emit("tasks", this.tasks);
      socket.emit("createTask", data);
    });
    socket.on("fetchComments", (data) => {
      const { category, id } = data;
      const taskItems = this.tasks[category].items;
      for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].id === id) {
          socket.emit("comments", taskItems[i].comments);
        }
      }
    });
    socket.on("addComment", (data) => {
      const { category, userId, comment, id, date } = data;
      console.log("Comment", data);
      //👇🏻 Gets the items in the task's category
      const taskItems = this.tasks[category].items;
      //👇🏻 Loops through the list of items to find a matching ID
      for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].id === id) {
          //👇🏻 Then adds the comment to the list of comments under the item (task)
          taskItems[i].comments.push({
            name: userId,
            text: comment,
            id: this.board.FakeBoardData.fetchID(),
            date: date,
          });
          //👇🏻 sends a new event to the React app
          socket.emit("comments", taskItems[i].comments);
        }
      }
    });
  };
};
