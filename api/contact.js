import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  console.log('📧 Contact form received:', { name, email });

  // Validation
  if (!name || !email || !message) {
    console.log('❌ Validation failed: Missing fields');
    return res.status(400).json({ 
      success: false, 
      error: 'Please fill in all fields' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('❌ Validation failed: Invalid email format');
    return res.status(400).json({ 
      success: false, 
      error: 'Please enter a valid email address' 
    });
  }

  try {
    console.log('📨 Sending email to:', process.env.RECIPIENT_EMAIL);
    
    // Email to your inbox
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">New Message from Your Portfolio</h2>
            <hr style="border: none; border-top: 1px solid #ddd;">
            
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            
            <h3 style="color: #555;">Message:</h3>
            <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #007bff;">
              ${message.replace(/\n/g, '<br>')}
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #777; font-size: 12px;">
              This message was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
      replyTo: email
    });

    // Confirmation email to visitor
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="background-color: white; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">Thank You, ${name}!</h2>
            <p>I received your message and will get back to you soon.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd;">
            <p style="color: #666;">
              Best regards,<br>
              <strong>Lokesh</strong>
            </p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully to:', process.env.RECIPIENT_EMAIL);
    res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    });

  } catch (error) {
    console.error('❌ Email sending error:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later. Error: ' + error.message 
    });
  }
}
