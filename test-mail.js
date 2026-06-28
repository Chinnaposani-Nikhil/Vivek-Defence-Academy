import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Manual env loader since dotenv isn't installed
const loadEnv = () => {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.length > 0 && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
            value = value.replace(/\\n/gm, '\n');
          }
          value = value.replace(/(^['"]|['"]$)/g, '').trim();
          process.env[key] = value;
        }
      });
    }
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
};

loadEnv();

const email = process.env.SMTP_EMAIL;
const password = process.env.SMTP_PASSWORD;

if (!email || !password) {
  console.error('\x1b[31mError: SMTP_EMAIL or SMTP_PASSWORD is not set inside your .env file!\x1b[0m');
  process.exit(1);
}

console.log(`Connecting to Gmail SMTP using: ${email}...`);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: password,
  },
});

const mailOptions = {
  from: email,
  to: email, // Send to yourself
  subject: 'Vivek Defence Academy - SMTP Connection Test',
  html: `
    <h2 style="color: #2B3A2C;">Gmail SMTP Verification</h2>
    <p>Congratulations! Your <strong>.env</strong> file and Google <strong>App Password</strong> are working perfectly.</p>
    <p>Your local React + Vite website is now ready to receive emails when deployed or run in serverless dev mode.</p>
    <br>
    <p>Best Regards,</p>
    <p><strong>Vivek Defence Academy Assistant</strong></p>
  `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('\x1b[31mSMTP Connection Failed:\x1b[0m', error.message);
  } else {
    console.log('\x1b[32mSuccess! Test email sent successfully:\x1b[0m', info.response);
    console.log('\x1b[36mCheck your inbox at:', email, '\x1b[0m');
  }
});
