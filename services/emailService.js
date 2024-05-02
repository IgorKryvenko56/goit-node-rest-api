import nodemailer from 'nodemailer';

import { convert } from 'html-to-text';
import path from 'path';

// Create a nodemailer transporter using Mailtrap SMTP settings
const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,// Use any of the available ports (25, 465, 587, or 2525)
    auth: {
      user: '5ee56f13ed8fc8', // Your Mailtrap username
      pass: '3582b7f7203e8d', // Your Mailtrap password
    },
    secure: false, // Use SSL/TLS (true for 465, false for other ports)
    tls: {
      // Define additional TLS options if needed
      ciphers: 'SSLv3',
    },
  });
  
  
  // Function to send verification email
export const sendVerificationEmail = async (toEmail, verificationToken) => {
 const verificationLink = `http://localhost:3000/api/users/auth/verify/${verificationToken}`;

  const emailConfig = {
    from: 'Magic Elves <from@example.com',
    to: toEmail,
    subject: 'You are awesome',
    html: `<html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    </head>
    <body style="font-family: sans-serif;">
      <div style="display: block; margin: auto; max-width: 600px;" class="main">
        <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
        <p>If you are viewing this email in your inbox – the integration works.</p>
        <img alt="Inspect with Tabs" src="https://assets-examples.mailtrap.io/integration-examples/welcome.png" style="width: 100%;">
        <p>Now send your email using our SMTP server and integration of your choice!</p>
        <p>Please verify your email by clicking <a href="${verificationLink}">here</a>.</p>
        <p>Good luck! Hope it works.</p>
      </div>
      <style>
        .main { background-color: white; }
        a:hover { border-left-width: 1em; min-height: 2em; }
      </style>
    </body>
  </html>
`,
text: `Hello, please click on the following link to verify your
          email: http://localhost:3000/api/users/auth/verify/${verificationToken}`,
    
  };
   // Send email
  try {
  const info = await transporter.sendMail(emailConfig);
  console.log('Email sent:', info.response);
   } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpError('Failed to send verification email', 500);
    }
  };

  