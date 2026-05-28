const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    io.to(roomId).emit("member_joined", { count: io.sockets.adapter.rooms.get(roomId)?.size });
  });

  socket.on("sync", (data) => {
    socket.emit("sync_res", { c: data.c, s: Date.now() });
  });

  socket.on("start_signal", (data) => {
    io.to(data.roomId).emit("start_broadcast", data);
  });

  socket.on("stop_signal", (data) => {
    io.to(data.roomId).emit("stop_broadcast", data);
  });

  // リセット（次へ）信号
  socket.on("reset_signal", (roomId) => {
    io.to(roomId).emit("reset_broadcast");
  });

  socket.on("dissolve_room", (roomId) => {
    io.to(roomId).emit("room_dissolved");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
