const { urlencoded } = require("express");
const express = require("express");
const app = express();
const port = 8000;
var cors = require("cors");
var http = require("http");
var server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

app.use([
  urlencoded({ extended: true, limit: "50mb" }),
  express.json({ limit: "50mb" }),
]);
let data = [];

app.get("/cnic", (req, res) => {
  res.send(data);
});

io.on("connection", (socket) => {
  socket.emit("connection", null);
});

app.post("/uploading", (req, res) => {
  const { qr } = req.body;
  io.emit(`${qr}-upload`, true);
  res.send("start");
});

app.post("/cnic", (req, res) => {
  const { qr, photo } = req.body;
  const dataObject = {
    qr,
    photo,
  };

  io.emit(qr, photo);

  res.send(`${dataObject}`);
});

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
