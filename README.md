# Enterprise IT Helpdesk Automation System

A production-style IT incident management system built with a clean, modular architecture. This system automatically classifies incoming IT issues, assigns priorities, persists data in SQLite, and simulates automated email notifications.

## 🚀 Features

- **Automated Classification**: Uses keyword-based logic to categorize issues (Access, Network, Hardware, etc.).
- **Smart Prioritization**: Automatically sets priority based on the issue category.
- **RESTful API**: Clean endpoints for ticket creation, retrieval, and management.
- **Swagger Documentation**: Interactive API documentation available at `/api-docs`.
- **SQLite Persistence**: Reliable local storage for all incident data.
- **Email Automation**: Simulated SMTP service for ticket acknowledgments.
- **Modern UI**: A sleek, responsive dashboard built with React, Tailwind CSS, and Motion.

## 🏗️ Architecture

The project follows a modular backend architecture:

`User → API (Express) → Classifier → Ticket Service → Database (SQLite) → Email Service`

- **API Layer**: Handles HTTP requests and input validation using Zod.
- **Service Layer**: Contains business logic for ticket lifecycle management.
- **Domain Logic**: The `Classifier` handles the intelligence of the system.
- **Data Layer**: Direct interaction with SQLite via `better-sqlite3`.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite (better-sqlite3)
- **Validation**: Zod
- **Documentation**: Swagger (OpenAPI 3.0)
- **Frontend**: React, Tailwind CSS, Lucide Icons, Motion
- **Email**: Nodemailer

## 📂 Project Structure

```text
IT-Helpdesk-Automation-System/
├── api/
│   └── routes.ts          # Express API routes & Swagger docs
├── backend/
│   ├── classifier.ts      # Issue classification logic
│   ├── database.ts        # SQLite initialization
│   ├── models.ts          # Type definitions & Zod schemas
│   └── ticket_service.ts  # Business logic for tickets
├── utils/
│   └── email_service.ts   # SMTP / Email automation
├── database/
│   └── tickets.db         # SQLite database file
├── src/
│   └── App.tsx            # React Dashboard UI
├── server.ts              # Main entry point (Express + Vite)
└── README.md
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Retrieve all tickets |
| POST | `/api/create_ticket` | Create and classify a new ticket |
| GET | `/api/ticket/{id}` | Get details for a specific ticket |
| PUT | `/api/close_ticket/{id}` | Mark a ticket as closed |
| GET | `/api-docs` | Interactive Swagger UI |

## 🚦 Setup & Installation

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Access the App**:
   - Dashboard: `http://localhost:3000`
   - API Docs: `http://localhost:3000/api-docs`

## 🔮 Future Improvements

- **AI Integration**: Replace keyword matching with a LLM-based classifier (e.g., Gemini API).
- **User Authentication**: Add role-based access control (RBAC) for technicians and employees.
- **Attachments**: Support file uploads for screenshots of IT issues.
- **Real-time Updates**: Implement WebSockets for live dashboard updates.
