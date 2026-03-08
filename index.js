const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

function replyMessage(replyToken, text) {
  if (!CHANNEL_ACCESS_TOKEN) {
    console.error("CHANNEL_ACCESS_TOKEN is missing");
    return;
  }

  const data = JSON.stringify({
    replyToken,
    messages: [{ type: "text", text }]
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
    res.on("data", (chunk) => body += chunk);
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

app.get("/", (req, res) => {
  res.send("LINE BOT RUNNING");
});

app.get("/webhook", (req, res) => {
  res.status(200).send("WEBHOOK OK");
});

app.post("/webhook", (req, res) => {
  console.log("Webhook received");

  const events = req.body.events;

  if (!events || events.length === 0) {
    return res.sendStatus(200);
  }

  for (const event of events) {
    console.log("Event:", JSON.stringify(event));

    if (event.type === "message" && event.message.type === "text") {
      const userText = event.message.text;
      let replyText = "こんにちは😊 生年月日を8桁で送ってください。例：19641225";

      if (/^\d{8}$/.test(userText)) {
        replyText = "生年月日ありがとう。次で数秘占いを返せるようにするね。";
      }

      replyMessage(event.replyToken, replyText);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
