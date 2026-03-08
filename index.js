const express = require("express");
const app = express();
app.use(express.json());

app.post("/webhook", (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.sendStatus(200);
  }

  console.log("LINEイベント受信:", events);

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("LINE BOT RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
