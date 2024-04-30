import nodemailer from "nodemailer";

try {
// Create a nodemailer transporter using SMTP transport
const emailTransporter = nodemailer.createTransport({
    //service: 'Sendgrid',
    host: '',
    port: '',
    auth: {
      user: 'your_email@sengrid.com',
      pass: 'your_email_password',
    },
  });

  const emailConfig = {
    from: 'Conacts app admin <admin@example.com>',
    to: 'test@example.com',
    subject: 'Password reset testing',
    html: 'h1>Test email</h1>',
    text: 'Test email (text version)',
  };

  await emailTransporter.sendMail(emailConfig);
} catch(err) {}