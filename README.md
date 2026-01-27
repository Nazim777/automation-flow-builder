# Automation Flow Builder

A full-stack application for creating and managing email automation workflows with a visual flow editor.

## Tech Stack

### Frontend

- **Framework**: Next.js 16 with TypeScript and socket.io-client
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Email**: Nodemailer
- **Realtime automation udpate**: socket.io
- **Environment**: dotenv

## Project Structure

```
automation-flow-builder/
├── client/
│   ├── public/
│   │   └── favicon.ico
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   │
│   │   ├── components/                     # Global reusable UI
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loader.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── features/
│   │   │   └── automation/
│   │   │       ├── api/
│   │   │       │   └── api.ts
│   │   │       │
│   │   │       ├── components/
│   │   │       │   ├── AutomationFlowBuilder.tsx
│   │   │       │   ├── AutomationList.tsx
│   │   │       │   ├── FlowEditor.tsx
│   │   │       │   ├── TestDialog.tsx
│   │   │       │   ├── NodeConfigPanel.tsx
│   │   │       │   ├── index.ts
│   │   │       │
│   │   │       │   └── nodes/
│   │   │       │       ├── StartNode.tsx
│   │   │       │       ├── EndNode.tsx
│   │   │       │       ├── ActionNode.tsx
│   │   │       │       ├── ConditionNode.tsx
│   │   │       │       ├── DelayNode.tsx
│   │   │       │       └── index.ts
│   │   │       │
│   │   │       ├── hooks/
│   │   │       │   ├── useAutomation.ts
│   │   │       │   └── useFlowEditor.ts
│   │   │       │
│   │   │       ├── types/
│   │   │       │   └── index.ts
│   │   │       │
│   │   │       ├── utils/
│   │   │       │   └── validation.ts
│   │   │       │
│   │   │       └── index.ts
│   │   │
│   │   ├── constants/
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   │   └── global.ts
│   │   │
│   │   ├── lib/
│   │   │   └── axios.ts
│   │   │
│   │   └── styles/
│   │       └── reactflow.css
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── next.config.js
│   └── .env.local
│
└── server/
    ├── src/
    │   ├── app/
    │   │   ├── app.ts
    │   │   ├── routes.ts
    │   │   ├── middleware.ts
    │   │   └── error.ts
    │   │
    │   ├── config/
    │   │   ├── config.ts
    │   │   ├── database.ts
    │   │   └── index.ts
    │   │
    │   ├── controllers/
    │   │   ├── automation.controller.ts
    │   │   ├── testRun.controller.ts
    │   │   └── index.ts
    │   │
    │   ├── models/
    │   │   ├── automation.model.ts
    │   │   ├── testRun.model.ts
    │   │   └── index.ts
    │   │
    │   ├── routes/
    │   │   ├── automation.route.ts
    │   │   ├── testRun.route.ts
    │   │   └── index.ts
    │   │
    │   ├── services/
    │   │   ├── automation.service.ts
    │   │   ├── testRun.service.ts
    │   │   └── index.ts
    │   │
    │   ├── utils/
    │   │   ├── cron/
    │   │   │   ├── cron.util.ts
    │   │   │   └── index.ts
    │   │   │
    │   │   ├── validation/
    │   │   │   └── validator.util.ts
    │   │   │
    │   │   ├── automationExecutor.ts
    │   │   ├── email.util.ts
    │   │   └── index.ts
    │   │
    │   ├── types/
    │   │   └── index.ts
    │   │
    │   └── server.ts
    │
    ├── package.json
    ├── tsconfig.json
    └── .env



```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Gmail account (for email sending)

### Backend Setup

1. Navigate to backend directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/automation-flow
PORT=5000
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
```

4. Build and run:

```bash
npm run build
npm start

# OR for development
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file:

```env
NEXT_PUBLIC_SOCKET_URL = http://localhost:5000
NEXT_PUBLIC_API_URL = http://localhost:5000/api/v1
```

4. Run development server:

```bash
npm run dev
```

5. Open browser at `http://localhost:3000`

## Features

### Core Features

- ✅ Visual flow editor with drag-and-drop nodes
- ✅ Action nodes (send email)
- ✅ Delay nodes (relative & specific time)
- ✅ Condition nodes with branching (TRUE/FALSE paths)
- ✅ Full CRUD operations for automations
- ✅ Test run functionality with background execution
- ✅ Real-time execution logs
- ✅ Real-time execution udpate from server to client via socket.io

### Node Types

1. **START** - Entry point (fixed)
2. **END** - Exit point (fixed)
3. **ACTION** - Send email with custom message
4. **DELAY** - Wait for duration or until specific time
5. **CONDITION** - Branch based on email rules (AND/OR logic)

### API Endpoints

- `POST /api/v1/automations` - Create
- `GET /api/v1/automations` - List all
- `GET /api/v1/automations/:id` - Get one
- `PUT /api/v1/automations/:id` - Update
- `DELETE /api/v1/automations/:id` - Delete
- `POST /api/v1/test-runs/:id/test` - Test run
- `GET /api/v1/test-runs/:id` - Get test history

## Gmail Configuration

1. Enable 2-factor authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security
   - Select "App Passwords"
   - Generate password for "Mail"
3. Use generated password in `.env` file

## Development

### Type Safety

All code uses TypeScript with strict mode enabled for maximum type safety.

### Code Organization

- **Components**: Reusable UI components
- **Hooks**: Custom React hooks for state management
- **Services**: API communication layer
- **Utils**: Helper functions and validators
- **Types**: Shared TypeScript interfaces

### Best Practices

- Proper error handling throughout
- Loading states for async operations
- Input validation on frontend and backend
- Clean separation of concerns
- Responsive design

# 📧 Backend Email Automation: Render & Mailtrap Setup

This project uses **Nodemailer** for automated email notifications. This documentation explains the specific configuration required to send emails successfully while hosted on **Render's Free Tier**.

## 🛑 The Render "SMTP Wall"

As of **September 2026**, Render has implemented a strict security policy for all **Free Web Services**. To prevent platform abuse and spam, Render **blocks all outbound traffic** on standard SMTP ports.

### Blocked Ports:

- **Port 25**: Legacy SMTP (Unsecure)
- **Port 465**: Implicit SSL/TLS
- **Port 587**: Modern STARTTLS (Gmail/Outlook default)

**The Problem:** If you attempt to connect to Gmail or professional SMTP relays via these ports from a Render free instance, the connection will **timeout (`ETIMEDOUT`)** because the traffic never leaves Render's network.

---

## 🛠️ The Solution: Mailtrap Email Sandbox

To bypass these restrictions without upgrading to a paid Render plan, this project uses **Mailtrap**.

### Why Mailtrap works here:

1. **Port 2525 (The Bypass):** Mailtrap allows connections via Port `2525`. Unlike standard email ports, Render does **not** block this port on the free tier.
2. **No Domain Verification:** Unlike Resend or SendGrid, Mailtrap Sandbox does not require a verified domain. You can send "test" emails from any address (e.g., `test@example.com`) to any recipient.
3. **Safety:** Emails are captured in the Mailtrap virtual dashboard and are **not** sent to real inboxes, making it 100% safe for development.

---

## ⚙️ Configuration

### 1. Environment Variables

Add these to your **Render Dashboard** under `Environment`:

| Key             | Value                         |
| :-------------- | :---------------------------- |
| `MAILTRAP_USER` | _Your Mailtrap SMTP Username_ |
| `MAILTRAP_PASS` | _Your Mailtrap SMTP Password_ |

### 2. Transport Implementation (`email.util.ts`)

The transporter is explicitly configured to use the non-blocked port:

```typescript
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525, // CRITICAL: This port is open on Render Free Tier
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

```
## License
MIT
