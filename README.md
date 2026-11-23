# BloodConnect AI 🩸🤖

> *"Current systems tell us where blood is available today. BloodConnect AI predicts where blood will be needed tomorrow."*

BloodConnect AI is an AI-powered Blood Donation and Blood Bank Coordination Platform that seamlessly connects blood donors, blood banks, hospitals, and administrators through a unified healthcare ecosystem.

---

## 🌟 Key Features

### 1. 🛡️ Strict 90-Day Donor Eligibility Engine
- Automatically computes: `Last Donation Date + 90 Days`.
- Displays dynamic badges: **ELIGIBLE** (Green) or **NOT ELIGIBLE** (Red).
- **Protective Notification Shield**: Ineligible and recently donated individuals are automatically shielded from emergency broadcast fatigue.

### 2. ⚡ Dynamic Search Radius & Two-Step Emergency Protocol
- **Step 1: Automated Inventory Reserve**: Queries regional licensed blood banks first to lock units instantly without telephonic delays.
- **Step 2: Intelligent Civic Donor Mobilization**: If blood banks are out of stock, triggers an intelligent expansion radius (**5 KM → 15 KM → 30 KM → 50 KM → District Wide → Neighbouring Districts**).
- Multi-criteria AI candidate ranking:
  - ABO/Rh Blood Group Compatibility
  - 100% Medical Eligibility Verification
  - Real-Time Haversine Distance
  - Historical Donation Reliability

### 3. 📈 AI Blood Shortage Prediction Engine
- Ingests historical transfusion patterns, surgical schedules, emergency trauma frequencies, and seasonal trends (e.g. dengue platelet demand spikes).
- Computes 7–14 day forecast deficit for all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`) with confidence metrics and proactive recommendations.

### 4. 🏥 Role-Based Dashboards & Permissions
- **Blood Donor Console**: Profile details, 90-day cooldown countdown, active emergency requests matching donor type, accept/reject commitment, nearby walk-in blood banks, and personalized nutritional guidance.
- **Hospital Emergency Desk**: Create urgent blood requests with triage priorities (Critical, High, Medium, Low), live donor discovery, and dispatch tracking.
- **Blood Bank Inventory Management**: Real-time stock levels, lot expiration monitoring, unit addition/removal, and interactive bar charts.
- **Admin & Public Health Directorate**: High-level KPI metrics, monthly donation vs. demand trends, blood group distribution, regional shortage hotspots, and full relational database explorer.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn-inspired modern healthcare UI, Dark Mode support
- **Data Visualizations**: Recharts
- **Icons**: Lucide React
- **Geospatial Utilities**: Haversine distance algorithm & dynamic radius tiering

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18+ or v20+)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Manoj4143/Blood_connect.git
cd Blood_connect/client

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to explore the platform.

---

## 📄 License
This project is licensed under the MIT License.
