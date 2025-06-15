const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// API endpoint for code conversion
app.post('/api/convert', (req, res) => {
  const { code, from, to } = req.body;
  
  try {
    let convertedCode = '';
    
    // Conversion logic
    if (from === 'node-telegram' && to === 'telegraf') {
      convertedCode = convertNodeTelegramToTelegraf(code);
    } else if (from === 'telegraf' && to === 'node-telegram') {
      convertedCode = convertTelegrafToNodeTelegram(code);
    } else if (from === 'javascript' && to === 'python') {
      convertedCode = convertJsToPython(code);
    } else {
      throw new Error('Unsupported conversion');
    }
    
    res.json({ success: true, convertedCode });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Conversion functions
function convertNodeTelegramToTelegraf(code) {
  // Basic conversion examples - you'd expand this
  return code
    .replace(/TelegramBot\(/g, 'Telegraf(')
    .replace(/\.on\('text'/g, '.on("text")')
    .replace(/\.sendMessage\(/g, '.reply(')
    .replace(/msg\.chat\.id/g, 'ctx.chat.id')
    .replace(/msg\.text/g, 'ctx.message.text');
}

function convertTelegrafToNodeTelegram(code) {
  return code
    .replace(/Telegraf\(/g, 'TelegramBot(')
    .replace(/\.on\("text"/g, ".on('text'")
    .replace(/\.reply\(/g, '.sendMessage(')
    .replace(/ctx\.chat\.id/g, 'msg.chat.id')
    .replace(/ctx\.message\.text/g, 'msg.text');
}

function convertJsToPython(code) {
  // Basic JS to Python conversion
  return code
    .replace(/const /g, '')
    .replace(/let /g, '')
    .replace(/var /g, '')
    .replace(/function /g, 'def ')
    .replace(/{/g, ':')
    .replace(/}/g, '')
    .replace(/console\.log\(/g, 'print(')
    .replace(/;/g, '')
    .replace(/===/g, '==')
    .replace(/`([^`]*)`/g, '"""$1"""');
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
