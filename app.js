const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for code conversion
app.post('/api/convert', (req, res) => {
  const { code, from, to } = req.body;
  
  try {
    const convertedCode = convertCode(code, from, to);
    res.json({ success: true, convertedCode });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Comprehensive code conversion logic
function convertCode(code, from, to) {
  // Node Telegram API to Telegraf
  if (from === 'node-telegram' && to === 'telegraf') {
    return code
      .replace(/TelegramBot/g, 'Telegraf')
      .replace(/require\('node-telegram-bot-api'\)/g, "require('telegraf')")
      .replace(/new TelegramBot\(/g, 'new Telegraf(')
      .replace(/bot\.on\((['"])(text|message)\1/g, 'bot.on($1$2$1')
      .replace(/bot\.sendMessage/g, 'ctx.reply')
      .replace(/msg\.chat\.id/g, 'ctx.chat.id')
      .replace(/msg\.from\.id/g, 'ctx.from.id')
      .replace(/msg\.text/g, 'ctx.message.text')
      .replace(/(\w+)\.then\(\(\) => \{/g, '$1.then(() => {')
      .replace(/bot\./g, 'ctx.');
  }

  // Telegraf to Node Telegram API
  if (from === 'telegraf' && to === 'node-telegram') {
    return code
      .replace(/Telegraf/g, 'TelegramBot')
      .replace(/require\('telegraf'\)/g, "require('node-telegram-bot-api')")
      .replace(/new Telegraf\(/g, 'new TelegramBot(')
      .replace(/ctx\.reply/g, 'bot.sendMessage')
      .replace(/ctx\.chat\.id/g, 'msg.chat.id')
      .replace(/ctx\.from\.id/g, 'msg.from.id')
      .replace(/ctx\.message\.text/g, 'msg.text')
      .replace(/bot\.on\('message'/g, "bot.on('message'")
      .replace(/ctx\./g, 'bot.');
  }

  // JavaScript to Python
  if (from === 'javascript' && to === 'python') {
    return code
      .replace(/function /g, 'def ')
      .replace(/let |const |var /g, '')
      .replace(/console\.log/g, 'print')
      .replace(/`(.+?)`/g, 'f"$1"')
      .replace(/\$\{([^}]+)\}/g, '{$1}')
      .replace(/{/g, ':')
      .replace(/}/g, '')
      .replace(/;/g, '')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/null/g, 'None')
      .replace(/true/g, 'True')
      .replace(/false/g, 'False')
      .replace(/=>/g, ':')
      .replace(/\(\) =>/g, 'lambda:')
      .replace(/\((\w+)\) =>/g, 'lambda \1:');
  }

  // Python to JavaScript
  if (from === 'python' && to === 'javascript') {
    return code
      .replace(/def /g, 'function ')
      .replace(/print\(/g, 'console.log(')
      .replace(/f"(.+?)"/g, '`$1`')
      .replace(/{([^}]+)}/g, '${$1}')
      .replace(/#.*/g, '')
      .replace(/:$/gm, '{')
      .replace(/^(\s*)(\w+)\s*=\s*/gm, '$1let $2 = ')
      .replace(/None/g, 'null')
      .replace(/True/g, 'true')
      .replace(/False/g, 'false')
      .replace(/==/g, '===')
      .replace(/!=/g, '!==')
      .replace(/lambda:/g, '() =>')
      .replace(/lambda (\w+):/g, '($1) =>');
  }

  throw new Error(`Conversion from ${from} to ${to} not yet implemented`);
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
