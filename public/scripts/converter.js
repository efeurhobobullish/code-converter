document.addEventListener('DOMContentLoaded', () => {
  const inputCode = document.getElementById('input-code');
  const outputCode = document.getElementById('output-code');
  const fromLanguage = document.getElementById('from-language');
  const toLanguage = document.getElementById('to-language');
  const convertBtn = document.getElementById('convert-btn');
  const copyBtn = document.getElementById('copy-btn');
  const downloadBtn = document.getElementById('download-btn');
  const uploadBtn = document.getElementById('upload-btn');
  const fileInput = document.getElementById('file-input');
  const clearInput = document.getElementById('clear-input');

  // Convert code
  convertBtn.addEventListener('click', async () => {
    const code = inputCode.value.trim();
    if (!code) return alert('Please enter some code to convert');

    convertBtn.disabled = true;
    convertBtn.textContent = 'Converting...';

    try {
      const res = await fetch('/api/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          from: fromLanguage.value,
          to: toLanguage.value
        })
      });

      const data = await res.json();
      if (data.success) {
        outputCode.value = data.convertedCode;
      } else {
        alert('Conversion failed: ' + data.error);
      }
    } catch (err) {
      alert('Error converting code');
      console.error(err);
    } finally {
      convertBtn.disabled = false;
      convertBtn.textContent = 'Convert Code';
    }
  });

  // Copy to clipboard
  copyBtn.addEventListener('click', async () => {
    const converted = outputCode.value.trim();
    if (!converted) return alert('No converted code to copy');

    try {
      await navigator.clipboard.writeText(converted);
      copyBtn.innerHTML = `<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copied!`;
      setTimeout(() => copyBtn.innerHTML = 'Copy Code', 2000);
    } catch (err) {
      alert('Failed to copy');
      console.error(err);
    }
  });

  // Download converted code
  downloadBtn.addEventListener('click', () => {
    const converted = outputCode.value.trim();
    if (!converted) return alert('No converted code to download');

    const blob = new Blob([converted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted_code_${fromLanguage.value}_to_${toLanguage.value}.${getFileExtension(toLanguage.value)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Trigger file upload
  uploadBtn.addEventListener('click', () => fileInput.click());

  // Handle uploaded file
  fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => inputCode.value = e.target.result;
    reader.readAsText(file);
  });

  // Clear input/output
  clearInput.addEventListener('click', () => {
    inputCode.value = '';
    outputCode.value = '';
  });

  // Get file extension for download
  function getFileExtension(language) {
    switch (language) {
      case 'python': return 'py';
      case 'javascript': return 'js';
      case 'node-telegram': return 'js';
      case 'telegraf': return 'js';
      default: return 'txt';
    }
  }

  // Load example snippet
  window.loadExample = function(from, to) {
    fromLanguage.value = from;
    toLanguage.value = to;

    const examples = {
      'node-telegram->telegraf': `const TelegramBot = require('node-telegram-bot-api');

const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    bot.sendMessage(chatId, 'Welcome to my bot!');
  } else {
    bot.sendMessage(chatId, 'You said: ' + text);
  }
});`,
      'javascript->python': `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Greetings, \${name}\`;
}

const result = greet('World');
console.log(result);

const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x * x);
console.log(squared);`
    };

    const key = `${from}->${to}`;
    inputCode.value = examples[key] || '';
    convertBtn.click();
  };
});
