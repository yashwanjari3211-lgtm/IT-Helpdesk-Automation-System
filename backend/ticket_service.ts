import db from './database';
import { Ticket, CreateTicketInput } from './models';
import { IssueClassifier } from './classifier';
import { v4 as uuidv4 } from 'uuid';

export class TicketService {
  static createTicket(input: CreateTicketInput): Ticket {
    const { category, priority } = IssueClassifier.classify(input.issue_description);
    const ticket: Ticket = {
      ticket_id: `INC-${uuidv4().slice(0, 8).toUpperCase()}`,
      issue_description: input.issue_description,
      category,
      priority,
      status: 'Open',
      created_at: new Date().toISOString()
    };

    const stmt = db.prepare(`
      INSERT INTO tickets (ticket_id, issue_description, category, priority, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      ticket.ticket_id,
      ticket.issue_description,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.created_at
    );

    return ticket;
  }

  static getAllTickets(): Ticket[] {
    const stmt = db.prepare('SELECT * FROM tickets ORDER BY created_at DESC');
    return stmt.all() as Ticket[];
  }

  static getTicketById(id: string): Ticket | null {
    const stmt = db.prepare('SELECT * FROM tickets WHERE ticket_id = ?');
    const ticket = stmt.get(id);
    return (ticket as Ticket) || null;
  }

  static closeTicket(id: string): boolean {
    const stmt = db.prepare('UPDATE tickets SET status = ? WHERE ticket_id = ?');
    const result = stmt.run('Closed', id);
    return result.changes > 0;
  }
}
