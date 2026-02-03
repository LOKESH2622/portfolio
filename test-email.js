import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

console.log('Testing email configuration...');
console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Password length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'NOT SET');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email verification failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
  } else {
    console.log('✅ Email service verified successfully!');
    
    // Try sending a test email
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'Test Email from Portfolio',
      html: '<h1>Test Email</h1><p>If you received this, email is working!</p>'
    }, (err, info) => {
      if (err) {
        console.error('❌ Email sending failed:');
        console.error('Error:', err.message);
      } else {
        console.log('✅ Email sent successfully!');
        console.log('Response:', info.response);
      }
      process.exit(0);
    });
  }
});
