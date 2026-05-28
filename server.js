const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, { cors: { origin: "*" } });

app.use(express.static("public"));

io.on("connection", (socket) => {
  // 部屋に参加
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    // 部屋に誰かが入ったら、その部屋の全員に通知（接続確認用）
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

  // ルーム解散
  socket.on("dissolve_room", (roomId) => {
    io.to(roomId).emit("room_dissolved");
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
