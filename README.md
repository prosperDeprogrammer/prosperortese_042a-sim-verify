# SimVerify Pro: Infrastructure for SME Trust & Digital Commerce
**Africa Ignite Hackathon 2026 · Theme 5: SME Enablement & Digital Commerce Growth**

> *"In African digital commerce, a SIM swap isn't just a technical glitch—it's a gateway for life-altering financial fraud. We built SimVerify Pro to shut that gate for SMEs."*

---

## 💡 The Problem
Digital transformation is sweeping through Africa, but fraud is moving just as fast. Traditional OTPs (One-Time Passwords) via SMS are vulnerable to **SIM Swap hijacks**. When a fraudster hijacks a SIM, they hijack the bank account, the mobile money wallet, and the digital identity. 

Small and Medium Enterprises (SMEs) suffer the most, as they lack the enterprise-grade security tools to verify their customers.

## 🛡️ Our Solution
SimVerify Pro is a next-generation fraud prevention API designed specifically for African SMEs and e-commerce platforms. We leverage the **GSMA Open Gateway** and **Nokia Network-as-Code** APIs to query real-time telecom trust signals directly.

### 🧩 Core Features:

### 1. Nokia Network-as-Code (NaC) Integration
We leverage the **CAMARA API standard** to pull real-time data directly from carrier networks (MTN, Airtel, Glo, 9mobile):
- **SIM Swap Detection**: Instant alerts if a SIM card was recently replaced.
- **Number Verification**: Passwordless onboarding via background device verification.
- **Location Verification**: Real-time correlation of device location with commerce transactions.

### 2. SME Trust Dashboard
A central hub for business owners to:
- Monitor live verification logs.
- Manage API Keys.
- Integrate the **SME Trust Badge** into their storefronts.

### 3. Developer-First Experience
We provide a full **API Documentation** suite with copy-pasteable snippets for **cURL and Node.js**, ensuring SMEs can go live in minutes, not days.

---

## 🎡 Judge's Demo Guide (How to test)

Follow these steps in the **Trust Sandbox**:

1. **The 'Safe Path'**: Use `99999991001`.
   - Result: `LOW Risk`. The engine sees a stable SIM and verified number.
2. **The 'SIM Swap Trap'**: Use `99999991000`.
   - Result: `HIGH Risk`. The engine detects a recent SIM swap via Nokia NaC and flags the transaction.
3. **The 'Location Mismatch'**: Use `99999991003`.
   - Result: `SUSPICIOUS`. The user is outside the allowed commerce zone.
4. **Agentic Support**: Click the pulsing chat icon and ask: *"Why was that last check blocked?"* 

---

## 🛠️ Tech Stack
- **API Standard**: CAMARA (Nokia Network-as-Code Blueprint)
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Axios
- **Deployment**: Optimized for Vercel (Frontend) and Render (Backend)

---

## 🌍 Deployment & Infrastructure (How to host)

To replicate this production environment, follow these steps:

### 1. Backend (Render)
1. **Connect Repository**: Connect the `backend` folder to a new **Web Service** on Render.
2. **Environment Variables**: Add the following `Environment Variables` in the Render dashboard:
   - `NAC_API_KEY`: Your Nokia Network-as-Code API Key.
   - `NAC_SIM_SWAP_URL`: Set to the SIM Swap endpoint.
   - `NAC_LOCATION_VERIFY_URL`: Set to the Location Verification endpoint.
   - `NAC_MOCK_NUMBER_VERIFICATION`: `true` (for demo purposes).
3. **Build Command**: `npm install`
4. **Start Command**: `node server.js`

### 2. Frontend (Vercel)
1. **Connect Repository**: Connect the `frontend` folder to a new project on Vercel.
2. **Environment Variables**: Add the following key:
   - `REACT_APP_API_URL`: The URL of your live Render backend (e.g., `https://simverify-api.onrender.com`).
3. **Framework Preset**: Create React App (or Vite if applicable).

---

## 🚀 The Vision: Moving to Production
SimVerify Pro is designed to be "pluggable." In a production environment, we simply swap our `simulation` layer for live GSMA Open Gateway endpoints. The risk engine, the dashboard, and the developer experience remain exactly the same.

**Built with ❤️ for the Africa Ignite Hackathon.**
