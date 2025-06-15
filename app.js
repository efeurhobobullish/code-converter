const express = require('express');
const path = require('path');
const fs = require('fs'); // Not used here, but kept in case you add file logging later.
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// API endpoint for code conversion
app.post('/api/convert', (req, res) => {
  const { code, from, to } = req.body;

  if (!code || !from || !to) {
    return res.status(400).json({ success: false, error: 'Missing required fields: code, from, to' });
  }

  try {
    let convertedCode;

    switch (`${from}->${to}`) {
      case 'node-telegram->telegraf':
        convertedCode = convertNodeTelegramToTelegraf(code);
        break;
      case 'telegraf->node-telegram':
        convertedCode = convertTelegrafToNodeTelegram(code);
        break;
      case 'javascript->python':
        convertedCode = convertJsToPython(code);
        break;
      default:
        throw new Error('Unsupported conversion type');
    }

    res.json({ success: true, convertedCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Conversion Functions
function convertNodeTelegramToTelegraf(code) {
  return code
    .replace(/TelegramBot\s*/g, 'Telegraf(')
    .replace(/\.on'text'/g, '.on("text")')
    .replace(/\.sendMessage\s*/g, '.reply(')
    .replace(/msg\.chat\.id/g, 'ctx.chat.id')
    .replace(/msg\.text/g, 'ctx.message.text');
}

function convertTelegrafToNodeTelegram(code) {
  return code
    .replace(/Telegraf\s*/g, 'TelegramBot(')
    .replace(/\.on"text"/g, ".on('text')")
    .replace(/\.reply\s*/g, '.sendMessage(')
    .replace(/ctx\.chat\.id/g, 'msg.chat.id')
    .replace(/ctx\.message\.text/g, 'msg.text');
}

function convertJsToPython(code) {
  return code
    .replace(/const |let |var /g, '')
    .replace(/function\s+(\w+)/g, 'def $1')
    .replace(/{/g, ':')
    .replace(/}/g, '')
    .replace(/console\.log/g, 'print(')
    .replace(/;/g, '')
    .replace(/===/g, '==')
    .replace(/`([^`]*)`/g, '"""$1"""');
}

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
