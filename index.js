const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

function replyMessage(replyToken, text) {
  const data = JSON.stringify({
    replyToken: replyToken,
    messages: [
      {
        type: "text",
        text: text
      }
    ]
  });

  const options = {
    hostname: "api.line.me",
    path: "/v2/bot/message/reply",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      "Content-Length": Buffer.byteLength(data)
    }
  };

  const req = https.request(options, (res) => {
    let body = "";
    res.on("data", (chunk) => {
      body += chunk;
    });
    res.on("end", () => {
      console.log("LINE reply response:", res.statusCode, body);
    });
  });

  req.on("error", (error) => {
    console.error("Reply error:", error);
  });

  req.write(data);
  req.end();
}

app.post("/webhook", (req, res) => {
  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.sendStatus(200);
  }

  events.forEach((event) => {
    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text;

      let replyText = "こんにちは。生年月日を8桁で送ってください。例：19641225";

      if (userText === "こんにちは" || userText === "こんばんは") {
        replyText = "こんにちは😊 生年月日を8桁で送ってください。例：19641225";
      }

      replyMessage(event.replyToken, replyText);
    }
  });

  res.sendStatus(200);
});

app.get("/", (req, res) => {
  res.send("LINE BOT RUNNING");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
