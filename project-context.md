# Project Context: Chase Premier Banking Simulation

## 1. Application Identity
*   **Name:** Chase Premier Banking
*   **Type:** High-Fidelity Financial Simulation / Dashboard
*   **Tone:** Professional, Secure, Trustworthy, Corporate, Premium.
*   **User Persona:** "Marcelo Grant" - A high-net-worth individual with multiple account types (Checking, Savings, Credit Cards, Loans).

## 2. Technical Stack
*   **Framework:** React 19
*   **Language:** TypeScript (Strict typing required, avoid `any`).
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **Icons:** Lucide React
*   **AI Integration:** Google GenAI SDK (`@google/genai`) - **v1.31.0+**
*   **Data Visualization:** Recharts (if charts are needed).

## 3. Design System & Aesthetics
*   **Primary Color (Chase Blue):** `#117aca` (Tailwind arbitrary value or close match `blue-600`/`blue-700`).
*   **Backgrounds:** Light gray (`#f3f4f6` / `bg-gray-100`) for the app background, White (`#ffffff` / `bg-white`) for cards.
*   **Typography:** 'Open Sans', sans-serif. Clean, readable, professional.
*   **Shadows:** Soft, diffused shadows (`shadow-md`, `shadow-xl`) to create depth for cards and modals.
*   **Animations:** Subtle CSS animations (`animate-fade-in`, `animate-fade-in-up`) for modals and list items. No erratic movements.
*   **Layout:**
    *   **Sidebar:** Collapsible hamburger menu on mobile, distinct header on desktop.
    *   **Modals:** Heavy use of centered, backdrop-blurred modals for distinct actions (Transfers, Deposit, Details) to maintain context without page reloads.

## 4. Coding Standards & Patterns
*   **Modals:** Use `Suspense` and `React.lazy` for heavy modals to ensure fast initial render.
*   **Currency:** Always format numbers as USD currency (`$1,234.56`).
*   **Dates:** Use strictly US Date formats (MM/DD/YYYY) or friendly relative dates ("Today", "2 days ago"). Timezone should be forced to 'America/New_York' for realism.
*   **Mock Data:** utilize `constants.ts` for initial state, but local state management (React `useState`) should handle the session's "live" feel (e.g., deducting balance when a transfer occurs).

## 5. Google GenAI (Gemini) Implementation Rules
*   **Package:** `@google/genai` (NOT `@google/generative-ai`).
*   **Initialization:** `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
*   **Model:** Default to `'gemini-2.5-flash'` for text/chat.
*   **Response Handling:** Access text via `response.text` property (getter), NOT `response.text()`.
*   **Persona:** The AI assistant is "Chase Genius™". It is polite, concise, financial-focused, and aware of the user's specific transaction history context passed in the prompt.