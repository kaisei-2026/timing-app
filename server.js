const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(express.static("public"));

io.on("connection", (socket) => {
  // 部屋に参加する
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // その部屋だけに時刻同期を返す
  socket.on("sync", (data) => {
    socket.emit("sync_res", { c: data.c, s: Date.now() });
  });

  // その部屋だけにスタート信号を送る
  socket.on("start_signal", (data) => {
    io.to(data.roomId).emit("start_broadcast", data);
  });

  // その部屋だけにストップ信号を送る
  socket.on("stop_signal", (data) => {
    io.to(data.roomId).emit("stop_broadcast", data);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
