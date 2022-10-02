const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
var RandomData = require("./src/data");

const app = express();
const port = process.env.PORT || 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const randomData = new RandomData();
let tasks = randomData.fetchPending();

const server = app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const socket = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socket.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("taskDragged", (data) => {
    const { source, destination } = data;
    try {
      //👇🏻 Gets the item that was dragged
      const itemMoved = {
        ...tasks[source.droppableId].items[source.index],
      };
      console.log("DraggedItem>>> ", itemMoved);

      //👇🏻 Removes the item from the its source
      tasks[source.droppableId].items.splice(source.index, 1);

      //👇🏻 Add the item to its destination using its destination index
      tasks[destination.droppableId].items.splice(
        destination.index,
        0,
        itemMoved
      );

      //👇🏻 Sends the updated tasks object to the React app
      socket.emit("tasks", tasks);
    } catch (error) {
      console.log("Source", source.droppableId);
      console.log(error);
      console.log(tasks);
    }
  });
  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("🔥: A user disconnected");
  });
});

app.get("/api", (req, res) => {
  // console.log("🚀: API request received", randomData.fetchTasks());
  res.json(tasks);
  // res.send({ response: randomData.fetchPending() }).status(200);
});
