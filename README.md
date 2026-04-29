# SimVerify: Agentic Anti-Fraud & Identity Protection
**Africa Ignite Hackathon 2024 · Theme 1: Financial Inclusion & Secure Payments**

> *"In Sub-Saharan Africa, a SIM swap isn't just a technical glitch—it's a gateway for life-altering financial fraud. We built SimVerify to shut that gate."*

---

## 💡 The Problem
Digital transformation is sweeping through Africa, but fraud is moving just as fast. Traditional OTPs (One-Time Passwords) via SMS are vulnerable to **SIM Swap hijacks**. When a fraudster hijacks a SIM, they hijack the bank account, the mobile money wallet, and the digital identity. 

Financial inclusion cannot happen without **trust**.

## 🛡️ Our Solution
SimVerify is a next-generation fraud prevention API designed for fintechs and e-commerce platforms. Instead of relying on vulnerable SMS codes, we query the **Telecom Network directly** to verify trust signals in real-time.

### 🧩 The Three Pillars of SimVerify:

### 1. Nokia Network-as-Code (NaC) Integration
We leverage the **CAMARA API standard** to pull real-time data directly from the carrier network:
- **SIM Swap Detection**: Instant alerts if a SIM card was recently replaced.
- **Number Verification**: Authenticate users without requiring user interaction.
- **Device Status**: Know if the device is actually active and reachable on the network.
- **Location Verification**: Verify if the person making the transaction is physically where they claim to be.

### 2. Agentic AI Bonus Layer (Innovation) 🧠
We don't just report data; our **AI Fraud Agent** analyzes it.
- **Automated Reasoning**: The agent explains *why* a decision was made (e.g., *"Agent detected a 4.2km offset between GPS and Cell Tower... suggesting remote spoofing"*).
- **Intelligent Orchestration**: Based on risk, the agent automatically recommends either an `ALLOW`, a `STEP-UP` (Biometric check), or a flat `BLOCK`.

### 3. Transparent & Developer-First
We built this for developers. Our dashboard includes a live playground, raw API response inspectors, and copy-pasteable snippets for **cURL, JavaScript, and Python**.

---

## 🎡 Judge's Demo Guide (How to test the 'Magic')

Follow these steps to see how SimVerify thinks:

1. **The 'Safe Path'**: Use `08011111111`.
   - Result: `LOW Risk`. The agent sees a verified number and matching location.
2. **The 'SIM Swap Trap'**: Use `08022222222`.
   - Result: `HIGH Risk`. The engine detects a recent SIM swap via Nokia NaC and blocks the action.
   - **Check the Logic Chain**: Look at how the agent "reasons" about the distance mismatch.
3. **The 'Missing Signal'**: Use `08000000000`.
   - Result: `Number Not Found`. Watch the AI catch a number that isn't even registered in the HLR database.
4. **Agentic Chat**: Open the chat widget and ask: *"Why was that last check blocked?"* It's session-aware!

---

## 🛠️ Tech Stack
- **AI Agent**: Custom Reasoning Engine with Session-Awareness
- **Telephony**: Simulated CAMARA Standard (Nokia NaC Blueprint)
- **Frontend**: React, TypeScript, Tailwind CSS (for that premium dark-mode aesthetic)
- **Backend**: Node.js, Express, Axios

---

## 🚀 The Vision: Moving to Production
SimVerify is designed to be "pluggable." In a production environment, we simply swap our `simulation` layer for the **Live Nokia NaC Sandbox** endpoints. The risk engine, the AI agent, and the UI remain exactly the same.

**Built with ❤️ for Africa Ignite.**
