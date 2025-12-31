
# Chase Premier Banking Simulation

## Overview
A high-fidelity banking simulation featuring secure authentication, real-time interactive dashboards, transaction history visualization, and AI-powered financial insights using Gemini.

## Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **AI:** Google GenAI SDK (`@google/genai`)
- **Icons:** Lucide React

## Project Structure
### Core
- **`App.tsx`**: The main application component. It handles the global state (authentication, user profile) and orchestrates the routing between the Login screen (`AuthModal`) and the `Dashboard`.
- **`main.tsx` / `index.tsx`**: The entry point that mounts the React application.

### Components (`components/`)
- **`Dashboard.tsx`**: The central hub. Displays accounts, transactions, and the AI chat interface ("Chase Genius™").
- **`AuthModal.tsx`**: Handles user login and registration flows.
- **`TransferModal.tsx`**: Manages money transfers (Internal, Domestic, International, Bill Pay).
- **`CardList.tsx`**: Renders the visual credit/debit cards with quick actions (Lock, Pay).
- **`LiveActivityFeed.tsx`**: Shows real-time notifications for transactions.
- **`SettingsModal.tsx`**: Manages user profile, security settings, and notifications.

### Services (`services/`)
- **`geminiService.ts`**: Contains the logic to initialize the Google GenAI client, configure the model (`gemini-2.5-flash`), and handle the `googleSearch` tool for grounded financial advice.

### Data
- **`types.ts`**: TypeScript interfaces for `User`, `Transaction`, `Account`, etc.
- **`constants.ts`**: Contains the `MOCK_TRANSACTIONS`, `MOCK_CARDS`, and initial balances used to simulate a live account.

## Features
1.  **AI Financial Assistant**: Ask questions like "How much did I spend on travel?" and get answers grounded in your transaction history and Google Search.
2.  **Interactive Transfers**: Simulate sending money with realistic validation and confirmation steps.
3.  **Real-time Updates**: Balance and transaction lists update instantly when actions are performed (optimistic UI).
4.  **Responsive Design**: Fully adaptive layout for desktop and mobile devices.
