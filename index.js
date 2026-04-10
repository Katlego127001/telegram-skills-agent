require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

console.log("🤖 Ollama Agent is running...");

// Skill templates (replacing broken CLI skills)
const skills = {
  "frontend-design": `
You are a senior frontend engineer.
Create clean, modern UI designs using Tailwind CSS.
Focus on UX, spacing, and responsiveness.
`,

  "general": `
You are a helpful AI assistant.
Give clear, structured answers.
`,

  "planner": `
You are an expert system architect.
Break problems into clear steps and architecture plans.
`
};

// Skill switching
let userSkill = {};

// Start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
`👋 Welcome!

Send me a prompt and I’ll respond using local AI.

Commands:
/skill frontend-design
/skill planner
/skill general`
  );
});

// Set skill
bot.onText(/\/skill (.+)/, (msg, match) => {
  const skill = match[1];
  userSkill[msg.chat.id] = skill;

  bot.sendMessage(msg.chat.id, `✅ Skill set to: ${skill}`);
});

// CORE AI FUNCTION (OLLAMA)
async function runSkill(prompt, skill = "frontend-design") {
  const systemPrompt = `
You are a helpful AI assistant.
`;

  const fullPrompt = `
${systemPrompt}

USER REQUEST:
${prompt}
`;

  for (let i = 0; i < 5; i++) {
    try {
      const response = await axios.post("http://localhost:11434/api/generate", {
        model: "llama3",
        prompt: fullPrompt,
        stream: false
      });

      return response.data.response;

    } catch (err) {
      console.log("Retrying Ollama...", i + 1);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  throw new Error("Ollama not responding");
}
// Handle messages
bot.on("message", async (msg) => {
  if (!msg.text) return;
  if (msg.text.startsWith("/start")) return;
  if (msg.text.startsWith("/skill")) return;

  const chatId = msg.chat.id;
  const prompt = msg.text;

  const skill = userSkill[chatId] || "frontend-design";

  bot.sendMessage(chatId, "⏳ Thinking...");

  try {
    const response = await runSkill(prompt, skill);

    const chunkSize = 4000;
    for (let i = 0; i < response.length; i += chunkSize) {
      await bot.sendMessage(chatId, response.slice(i, i + chunkSize));
    }

  } catch (err) {
    bot.sendMessage(chatId, `❌ Error:\n${err.message}`);
  }
});