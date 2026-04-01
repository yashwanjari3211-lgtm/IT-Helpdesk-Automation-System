import nodemailer from 'nodemailer';
import { Ticket } from '../backend/models';

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'demo@example.com',
      pass: process.env.SMTP_PASS || 'password',
    },
  });

  /**
   * Sends a confirmation email for a newly created ticket.
   * In a real enterprise app, this would use a real SMTP server.
   */
  static async sendTicketConfirmation(ticket: Ticket) {
    console.log(`[EmailService] Sending confirmation for ticket ${ticket.ticket_id}`);
    
    // For demo purposes, we just log the email content if no real SMTP is configured
    const mailOptions = {
      from: '"IT Helpdesk" <helpdesk@enterprise.com>',
      to: 'user@example.com',
      subject: `Ticket Created: ${ticket.ticket_id}`,
      text: `
        Hello,

        Your IT support ticket has been created successfully.

        Ticket ID: ${ticket.ticket_id}
        Category: ${ticket.category}
        Priority: ${ticket.priority}
        Status: ${ticket.status}

        Our team will review your request shortly.

        Regards,
        IT Helpdesk Team
      `,
    };

    try {
      // In this environment, we might not have real SMTP access, so we'll just log
      // await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully (simulated)');
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
}
