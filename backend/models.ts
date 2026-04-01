import { z } from 'zod';

export const TicketSchema = z.object({
  ticket_id: z.string().optional(),
  issue_description: z.string().min(5, "Description must be at least 5 characters"),
  category: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  status: z.enum(['Open', 'Closed']).default('Open'),
  created_at: z.string().optional(),
});

export type Ticket = z.infer<typeof TicketSchema>;

export interface CreateTicketInput {
  issue_description: string;
}

export enum Category {
  ACCESS = "Access Issue",
  NETWORK = "Network Issue",
  COMMUNICATION = "Communication Issue",
  HARDWARE = "Hardware Issue",
  GENERAL = "General Issue"
}

export enum Priority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}
