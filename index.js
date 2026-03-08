const express = require("express");
const https = require("https");

const app = express();
app.use(express.json());

const CHANNEL_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN;

function reply(replyToken, text) {

  const data = JSON.stringify({
    replyToken: replyToken,
    messages: [{ type: "text", text: text }]
  });

  const options = {
    hostname: "api.line.me",
    path: "/v2/bot/message/reply",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
    }
  };

  const req = https.request(options);
  req.write(data);
  req.end();
}

app.get("/", (req,res)=>{
  res.send("BOT OK");
});

app.post("/webhook",(req,res)=>{

  const events=req.body.events;

  if(!events) return res.sendStatus(200);

  events.forEach(event=>{

    if(event.type==="message"){

      const text=event.message.text;

      if(text==="こんにちは"){
        reply(event.replyToken,"こんにちは WADATENです😊");
      }

    }

  });

  res.sendStatus(200);

});

app.listen(process.env.PORT || 3000);
