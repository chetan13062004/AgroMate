// Utility for sending emails using Nodemailer
// Note: Make sure to set the following environment variables in your .env file:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE(optional), ADMIN_EMAIL, FRONTEND_BASE_URL (optional)

import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load .env early so SMTP_* vars are available even if this file is imported before server initialization
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });
import { IUser } from '../models/userModel';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Quick sanity-check of essential SMTP env vars
afterEnvCheck();

function afterEnvCheck() {
  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  required.forEach(v => {
    if (!process.env[v]) {
      console.warn(`⚠️  ENV WARNING: ${v} is not set – email sending will fail`);
    }
  });
  console.log(`SMTP config → host=${process.env.SMTP_HOST} port=${process.env.SMTP_PORT} secure=${process.env.SMTP_SECURE}`);
}

// Verify connection configuration at server start-up
(async () => {
  try {
    await transporter.verify();
    console.log('🚀 Email transporter configured successfully');
  } catch (err) {
    console.error('❌ Unable to configure email transporter', err);
    console.error('   Tip: check SMTP_* variables in .env');
  }
})();

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const fromEmail = process.env.SMTP_FROM || `Farm App <${process.env.SMTP_USER}>`;

  const info = await transporter.sendMail({
    from: fromEmail,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  // Log a helpful message so developers can see that the email actually went out
  console.log(`📧 Email sent: to=${options.to} subject=\"${options.subject}\" messageId=${info.messageId}`);
};

// Helper specifically for notifying farmer when approved
export const notifyFarmerOfApproval = async (farmer: IUser): Promise<void> => {
  if (!farmer.email) {
    console.warn('Farmer email not found – skipping approval notification');
    return;
  }
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  const dashboardLink = `${baseUrl}/profile`;
  const html = `
    <p>Hello ${farmer.name},</p>
    <p>Congratulations! Your account has been <b>approved</b> by the Farm App admin team. You can now log in and start using all features available to farmers.</p>
    <p><a href="${dashboardLink}" style="display:inline-block;padding:10px 15px;background:#22c55e;color:#fff;text-decoration:none;border-radius:4px;">Go to your Dashboard</a></p>
    <p>Thank you for joining us.<br/>Farm App Team</p>
  `;
  await sendEmail({
    to: farmer.email,
    subject: 'Your Farm App account has been approved!',
    html,
  });
};

// Helper specifically for notifying farmer when rejected
export const notifyFarmerOfRejection = async (farmer: IUser, reason?: string): Promise<void> => {
  if (!farmer.email) {
    console.warn('Farmer email not found – skipping rejection notification');
    return;
  }
  const html = `
    <p>Hello ${farmer.name},</p>
    <p>We regret to inform you that your Farm App account application has been <b>rejected</b>.</p>
    ${reason ? `<p>Reason: ${reason}</p>` : ''}
    <p>If you believe this is a mistake, please contact our support team for further assistance.</p>
    <p>Best regards,<br/>Farm App Team</p>
  `;
  await sendEmail({
    to: farmer.email,
    subject: 'Your Farm App Account Application Status',
    html,
  });
};

// Helper specifically for notifying admin when a new farmer registers
export const notifyAdminOfNewFarmer = async (farmer: IUser): Promise<void> => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('ADMIN_EMAIL env variable not set – skipping admin notification email');
    return;
  }

  // Construct approval link – assumes an admin dashboard route exists on the frontend
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:3000';
  const approvalLink = `${baseUrl}/admin/farmers`; // adjust path if necessary

  const html = `
    <p>Hello Admin,</p>
    <p>A new farmer has registered and is awaiting your approval:</p>
    <ul>
      <li><strong>Name:</strong> ${farmer.name}</li>
      <li><strong>Email:</strong> ${farmer.email}</li>
      <li><strong>Location:</strong> ${farmer.location || 'N/A'}</li>
    </ul>
    <p>Please review and approve the account at your earliest convenience.</p>
    <p><a href="${approvalLink}" style="display:inline-block;padding:10px 15px;background:#22c55e;color:#fff;text-decoration:none;border-radius:4px;">Open Approval Dashboard</a></p>
    <p>Thank you,<br/>Farm App Team</p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: 'New Farmer Approval Request',
    html,
  });
};
