import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const accessToken = await new Promise<string>((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token");
      }
      resolve(token || '');
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      accessToken,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN
    }
  });

  return transporter;
};

export const sendEmail = async (to: string, subject: string, templateData: any) => {
  const transporter = await createTransporter();

  // Read the email template
  const templatePath = path.join(process.cwd(), 'src', 'templates', 'emailTemplate.hbs');
  const source = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(source);

  // Compile the template with the provided data
  const html = template({
    subject,
    companyName: 'Legacy Project', // Replace with your company name
    currentYear: new Date().getFullYear(),
    ...templateData,
  });

  const mailOptions = {
    from: `"${process.env.COMPANY_NAME}" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
    attachments: [{
      filename: 'logo.png',
      path: path.join(process.cwd(), 'public', 'images', 'logo.png'),
      cid: 'companyLogo'
    }]
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
