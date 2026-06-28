const fs = require('fs');
const envPath = '.env';
let envContent = fs.readFileSync(envPath, 'utf8');

const keyRegex = /(FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n)(.*?)(\\n-----END PRIVATE KEY-----")/;
const match = envContent.match(keyRegex);

if (match) {
  const prefix = match[1];
  const base64 = match[2].replace(/\s+/g, ''); // Remove any existing whitespace
  let formattedBase64 = '';
  for (let i = 0; i < base64.length; i += 64) {
    formattedBase64 += base64.substring(i, i + 64) + '\\n';
  }
  // Remove the trailing newline
  if (formattedBase64.endsWith('\\n')) {
    formattedBase64 = formattedBase64.slice(0, -2);
  }

  const newContent = envContent.replace(keyRegex, prefix + formattedBase64 + match[3]);
  fs.writeFileSync(envPath, newContent);
  console.log('Fixed private key format in .env');
} else {
  console.log('Could not find private key to fix');
}
