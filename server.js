const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("sync", (t) => socket.emit("sync_res", { c: t, s: Date.now() }));
  socket.on("start_signal", (data) => io.emit("start_broadcast", data));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Server running on port ${PORT}`));
