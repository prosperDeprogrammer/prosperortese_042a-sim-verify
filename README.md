# 🛡️ SimVerify Pro
### *Enterprise-Grade Security for African SMEs*

**SimVerify Pro** is a unified Fraud Intelligence platform built for the **Africa Ignite Hackathon 2026**. It empowers small and medium enterprises (SMEs) to secure their digital commerce using live telecom network intelligence via the **GSMA Open Gateway** and **Nokia Network-as-Code**.

🚀 **[LIVE DEMO: prosperortese-042a-sim-verify.vercel.app](https://prosperortese-042a-sim-verify.vercel.app/)**

---

## 💎 The Problem: The "Trust Gap" for SMEs
Digital commerce in Africa is hindered by fraud—specifically **SIM-swap account takeovers** and **OTP interception**. Small businesses lack the budget for expensive enterprise security, leaving them and their customers vulnerable.

## 💡 The Solution: SimVerify Pro (Theme 5)
Aligned with **SME Enablement & Digital Commerce Growth**, we provide a simple, plug-and-play API that gives SMEs access to telco-level security signals.
- **Passwordless Onboarding**: Verify users silently via their mobile network.
- **SIM-Swap Detection**: Block transactions if a user's SIM was recently swapped.
- **Location Validation**: Ensure a merchant's checkout is happening where the customer actually is.

---

## 🎡 Judge's 1-Minute Demo Guide
Once you are in the **API Sandbox**, use these "Trust Sandbox" numbers to see the engine in action:

1.  **The 'Safe Path'**: Use `99999991001`
    - *Result*: **LOW Risk**. Perfect for a smooth, frictionless checkout.
2.  **The 'SIM Swap Trap'**: Use `99999991000`
    - *Result*: **HIGH Risk**. The engine detects a recent SIM swap and flags the account takeover attempt.
3.  **The 'Location Mismatch'**: Use `99999991003`
    - *Result*: **SUSPICIOUS**. Flagged because the transaction location doesn't match the mobile device.

---

## 🛠️ High-Fidelity Tech Stack
- **API Engine**: CAMARA (Nokia Network-as-Code Blueprint)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js (Express), Axios, Memory-Caching
- **AI Insights**: Dynamic Fraud Analysis Engine

## 🌍 Infrastructure & Deployment
- **Frontend**: Hosted on **Vercel** for ultra-fast global delivery.
- **Backend**: Hosted on **Render** (High-availability Node.js instance).
- **Security**: Environment-level API key management and CORS protection.

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### 2. Installation
```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Configuration
1. Navigate to the `backend` directory.
2. Create a `.env` file: `cp .env.example .env`.
3. Add your **Nokia Network-as-Code** API credentials to the `.env` file.

### 4. Running the App

**Start Backend (Terminal 1)**
```bash
cd backend
npm run dev
```

**Start Frontend (Terminal 2)**
```bash
cd frontend
npm start
```

---

## 🚀 The Vision
SimVerify Pro is designed to be **"Network Agnostic."** By using the CAMARA standard, we can scale across every major carrier in Africa (MTN, Airtel, Safaricom) with a single codebase. We aren't just building a tool; we are building the **Trust Layer for African Digital Commerce.**

**Built with ❤️ for the Africa Ignite Hackathon.**
