const express = require("express");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_SID,
  process.env.TWILIO_TOKEN
);

let codes = {};

app.post("/send-code", async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(1000 + Math.random() * 9000);

  codes[phone] = code;

  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phone}`,
      body: `Seu código FinancePro é: ${code}`
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.post("/verify-code", (req, res) => {
  const { phone, code } = req.body;

  if (codes[phone] == code) {
    return res.json({ success: true });
  }

  res.json({ success: false });
});

app.listen(3000, () => console.log("Servidor rodando 🚀"));
