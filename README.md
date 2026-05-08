# 🛡️ SimVerify Pro
### *The Anti-Fraud API for African Fintech — Powered by Nokia Network-as-Code*

**SimVerify Pro** is a B2B Anti-Fraud API built for the **Africa Ignite Hackathon 2026**. It gives African fintech apps one simple API call to detect SIM-swap fraud at login — using live telecom network intelligence via the **GSMA Open Gateway** and **Nokia Network-as-Code**.

🚀 **[LIVE DEMO: prosperortese-042a-sim-verify.vercel.app](https://prosperortese-042a-sim-verify.vercel.app/)**

---

## 💎 The Problem: SIM-Swap Fraud is Draining Fintech Accounts Across Africa
In Nigeria and across Africa, SIM-swap account takeovers are one of the biggest threats to fintech users. A hacker swaps a victim's SIM, intercepts their OTP, and drains their account — all in minutes. Small fintech apps can't afford enterprise fraud tools to stop this.

## 💡 The Solution: SimVerify Pro (Theme 5: SME Enablement & Digital Commerce Growth)
Aligned with **SME Enablement & Digital Commerce Growth**, SimVerify Pro is a plug-and-play API that gives any fintech app access to telco-level fraud signals with one API call at login.
- **SIM-Swap Detection** *(Primary)*: Instantly detect if a user's SIM was recently swapped — block the login before the account is taken over.
- **Number Ownership Verify**: Silently confirm the mobile number belongs to the device — no OTP required.
- **Device Location Check**: Verify the login is happening from an expected location — flag suspicious logins automatically.


## 🎡 Judge's 1-Minute Demo Guide
Once you are in the **API Sandbox**, use these "Trust Sandbox" numbers to see the engine in action:

1.  **The 'Safe Path'**: Use `99999991001`
    - *Result*: **LOW Risk**. Perfect for a smooth, frictionless checkout.
2.  **The 'SIM Swap Trap'**: Use `99999991000`
    - *Result*: **HIGH Risk**. The engine detects a recent SIM swap and flags the account takeover attempt.
3.  **The 'Location Mismatch'**: Use `99999991003`
    - *Result*: **SUSPICIOUS**. Flagged because the transaction location doesn't match the mobile device.



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

## ⚙️ Local Development Setup

Follow these steps to spin up the SimVerify Pro stack locally.

### Prerequisites
- **Node.js**: v18.x or higher
- **npm**: v9.x or higher

### 📦 Installation

```bash
# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 🔑 Configuration
1. Navigate to the `/backend` directory.
2. Create a `.env` file from the provided template: `cp .env.example .env`.
3. Add your **Nokia Network-as-Code** API keys and endpoints to the `.env` file.

### 🚀 Running the App

You will need two terminal instances:

**1. Start the Backend (API Engine)**
```bash
cd backend
npm run dev
```

**2. Start the Frontend (Security Dashboard)**
```bash
cd frontend
npm start
```

---

## 🚀 The Vision
SimVerify Pro is designed to be **"Network Agnostic."** By using the CAMARA standard, we can scale across every major carrier in Africa (MTN, Airtel, Safaricom) with a single codebase. We aren't just building a tool; we are building the **Trust Layer for African Digital Commerce.**

**Built with ❤️ for the Africa Ignite Hackathon.**
