import nodemailer from 'nodemailer';
import { getDb } from './firebase-admin.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, mobile, email, course, message } = req.body;

    // Save to Firebase Firestore
    try {
      const db = getDb();
      await db.collection('enquiries').add({
        name,
        mobile,
        email: email || '',
        course,
        message: message || '',
        createdAt: new Date().toISOString(),
        status: 'new'
      });
      console.log('Enquiry saved to Firestore successfully.');
    } catch (dbError) {
      console.error('Error saving to Firestore:', dbError);
    }

    // Send Email using Nodemailer
    if (process.env.SMTP_EMAIL && process.env.SMTP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Configured for Gmail SMTP
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      // 1. Email to Academy Admin (Sends directly to your own email address)
      await transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: process.env.SMTP_EMAIL,
        subject: `New Admission Enquiry - ${course}`,
        html: `
          <h2>New Enquiry Details:</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Mobile:</strong> ${mobile}</p>
          <p><strong>Email:</strong> ${email || 'N/A'}</p>
          <p><strong>Course:</strong> ${course}</p>
          <p><strong>Message:</strong> ${message || 'No message provided'}</p>
        `
      });

      // 2. Auto-confirmation email to the student (if they provided an email address)
      if (email) {
        await transporter.sendMail({
          from: process.env.SMTP_EMAIL,
          to: email,
          subject: 'Thank you for contacting Vivek Defence Academy',
          html: `
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to Vivek Defence Academy.</p>
            <p>We have received your enquiry regarding the <strong>${course}</strong> course.</p>
            <p>Our admission counselor will contact you shortly at ${mobile}.</p>
            <br>
            <p>Best Regards,</p>
            <p><strong>Vivek Defence Academy Team</strong></p>
          `
        });
      }

      return res.status(200).json({ success: true, message: 'Enquiry submitted and emails sent successfully' });
    } else {
      console.warn("SMTP credentials not provided. Email not sent.");
      return res.status(200).json({ success: true, message: 'Enquiry received but SMTP credentials missing' });
    }

  } catch (error) {
    console.error("Submission Error:", error);
    return res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
}
