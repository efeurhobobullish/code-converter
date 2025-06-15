document.addEventListener('DOMContentLoaded', function() {
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

  // Convert button click handler
  convertBtn.addEventListener('click', async function() {
    if (!inputCode.value.trim()) {
      alert('Please enter some code to convert');
      return;
    }

    try {
      convertBtn.disabled = true;
      convertBtn.textContent = 'Converting...';
      
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: inputCode.value,
          from: fromLanguage.value,
          to: toLanguage.value
        })
      });

      const data = await response.json();
      
      if (data.success) {
        outputCode.value = data.convertedCode;
      } else {
        alert('Conversion failed: ' + data.error);
      }
    } catch (error) {
      alert('An error occurred during conversion');
      console.error(error);
    } finally {
      convertBtn.disabled = false;
      convertBtn.textContent = 'Convert Code';
    }
  });

  // Copy button click handler
  copyBtn.addEventListener('click', function() {
    if (!outputCode.value.trim()) {
      alert('No converted code to copy');
      return;
    }

    outputCode.select();
    document.execCommand('copy');
    
    // Visual feedback
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = '<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copied!';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 2000);
  });

  // Download button click handler
  downloadBtn.addEventListener('click', function() {
    if (!outputCode.value.trim()) {
      alert('No converted code to download');
      return;
    }

    const blob = new Blob([outputCode.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    // Set filename based on conversion
    const from = fromLanguage.value;
    const to = toLanguage.value;
    a.download = `converted_code_${from}_to_${to}.${getFileExtension(to)}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // Upload button click handler
  uploadBtn.addEventListener('click', function() {
    fileInput.click();
  });

  // File input change handler
  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      inputCode.value = e.target.result;
    };
    reader.readAsText(file);
  });

  // Clear input button
  clearInput.addEventListener('click', function() {
    inputCode.value = '';
    outputCode.value = '';
  });

  // Helper function to get file extension based on language
  function getFileExtension(language) {
    switch(language) {
      case 'python': return 'py';
      case 'javascript': return 'js';
      case 'node-telegram': return 'js';
      case 'telegraf': return 'js';
      default: return 'txt';
    }
  }
});

// Function to load example conversions
function loadExample(from, to) {
  const inputCode = document.getElementById('input-code');
  const fromLanguage = document.getElementById('from-language');
  const toLanguage = document.getElementById('to-language');
  
  fromLanguage.value = from;
  toLanguage.value = to;
  
  // Set example code based on conversion type
  if (from === 'node-telegram' && to === 'telegraf') {
    inputCode.value = `const TelegramBot = require('node-telegram-bot-api');\n\n// Replace with your token\nconst token = 'YOUR_TELEGRAM_BOT_TOKEN';\n\n// Create a bot\nconst bot = new TelegramBot(token, {polling: true});\n\n// Listen for messages\nbot.on('text', (msg) => {\n  const chatId = msg.chat.id;\n  const text = msg.text;\n  \n  if (text === '/start') {\n    bot.sendMessage(chatId, 'Welcome to my bot!');\n  } else {\n    bot.sendMessage(chatId, 'You said: ' + text);\n  }\n});`;
  } else if (from === 'javascript' && to === 'python') {
    inputCode.value = `// JavaScript code to convert to Python\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n  return \`Greetings, \${name}\`;\n}\n\nconst result = greet('World');\nconsole.log(result);\n\n// Array operations\nconst numbers = [1, 2, 3, 4, 5];\nconst squared = numbers.map(x => x * x);\nconsole.log(squared);`;
  }
  
  // Trigger conversion
  document.getElementById('convert-btn').click();
}
