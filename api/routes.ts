import { Router, Request, Response } from 'express';
import { TicketService } from '../backend/ticket_service';
import { EmailService } from '../utils/email_service';
import { TicketSchema } from '../backend/models';

const router = Router();

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Retrieve all tickets
 *     responses:
 *       200:
 *         description: A list of tickets
 */
router.get('/tickets', (req: Request, res: Response) => {
  try {
    const tickets = TicketService.getAllTickets();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

/**
 * @swagger
 * /api/create_ticket:
 *   post:
 *     summary: Create a new IT ticket
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               issue_description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */
router.post('/create_ticket', async (req: Request, res: Response) => {
  try {
    const validation = TicketSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    const ticket = TicketService.createTicket(req.body);
    await EmailService.sendTicketConfirmation(ticket);
    
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

/**
 * @swagger
 * /api/ticket/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 *       404:
 *         description: Ticket not found
 */
router.get('/ticket/:id', (req: Request, res: Response) => {
  const ticket = TicketService.getTicketById(req.params.id);
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

/**
 * @swagger
 * /api/close_ticket/{id}:
 *   put:
 *     summary: Close an existing ticket
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket closed successfully
 *       404:
 *         description: Ticket not found
 */
router.put('/close_ticket/:id', (req: Request, res: Response) => {
  const success = TicketService.closeTicket(req.params.id);
  if (success) {
    res.json({ message: 'Ticket closed successfully' });
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

export default router;
