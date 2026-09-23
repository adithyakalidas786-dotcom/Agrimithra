# 🌾 AgriMithra | Farmers • Food • Future
> **Hackathon Edition (v4.0)** — Smart Agricultural Decision & Direct Trade Platform

---

## 🎯 The Core Problem AgriMithra Solves

> **“Multiple Intermediaries Reduce Farmers' Earnings and Increase Consumer Prices.”**

In traditional agricultural supply chains, produce moves through **4 to 5 middlemen** before reaching the consumer:
$$\text{Farmer (₹18/kg)} \longrightarrow \text{Village Trader (₹24/kg)} \longrightarrow \text{Mandi Wholesaler (₹30/kg)} \longrightarrow \text{Retailer (₹42/kg)} \longrightarrow \text{Consumer (₹42/kg)}$$

Farmers receive only **35%–45%** of the consumer rupee, while middlemen extract over **55%** in commissions and markups.

**AgriMithra changes this:**
$$\text{Farmer (₹33/kg)} \longrightarrow \text{AgriMithra Shared Green Logistics (₹2/kg)} \longrightarrow \text{Direct Buyer (₹37/kg)}$$

The farmer earns **+75% to +100% more revenue**, while buyers and consumers save **10% to 15%**.

---

## 💡 The AgriMithra Philosophy

> **“AgriMithra does not simply connect farmers and buyers. It helps farmers decide WHEN to sell, WHERE to sell, AT WHAT PRICE to sell, and HOW to reduce delivery costs.”**

```
Farmer Enters Crop Details / Speaks in Tamil or English
                        ↓
         AgriMithra Smart Decision Engine
                        ↓
     "Why this price?" 7-Factor Transparency
                        ↓
    Profit Simulator: Intermediary vs Direct Comparison
                        ↓
         Smart Buyer Matcher (% Compatibility)
                        ↓
               Accept / Send Offer
                        ↓
           Shared Transport Optimizer
                        ↓
        Direct Order Delivered & UPI Settled
                        ↓
         Farmer Earnings & Savings Analytics
```

---

## 🚀 Key Features

### 1. 🧠 AgriMithra Smart Decision Center
- **Farmer Inputs**: Crop, Quantity (kg), Quality/Grade (A/B/C), Location, Expected Price, Harvest Date.
- **Rule-Based Calculation**: Combines APMC spot prices, quality multipliers, demand-supply velocity, and freight offsets.
- **Actionable Guidance**: **Sell Now**, **Consider Waiting (2-3 days)**, or **Find Better Buyer**.
- **Calculations**: Recommended selling price range, gross revenue, transport cost, and net profit.

### 2. 💰 Profit Loss Simulator ("How Much Are You Losing to Intermediaries?")
- Step-by-step 5-stage comparison against AgriMithra's 3-stage direct model.
- Visual breakdown of:
  - Traditional farmer revenue
  - Direct sale revenue
  - Total intermediary margin lost
  - Shared transport freight
  - Net amount received
  - **Potential Additional Income (+₹ and +% increase)**.

### 3. 🔍 "Why this price?" Explainability System
- Transparent 7-factor explainability modal breakdown:
  1. *Local Mandi Benchmark Rate*
  2. *Direct Intermediary Elimination Delta*
  3. *Crop Quality & Grade Adjustment (+15% for Grade A)*
  4. *7-Day Price Trend Momentum*
  5. *Buyer Active Demand Index*
  6. *Optimized Shared Logistics Offset*
  7. *Batch Volume Synergy*

### 4. 🤝 Smart Buyer Matching
- Dynamic matching algorithm scoring verified buyers:
  - **94% Match**, **89% Match**, **84% Match**.
- Scores computed from: Crop fit (40 pts), Price proximity (25 pts), Distance (20 pts), and Volume capacity (15 pts).
- Interactive actions: **View Buyer**, **Send Offer**, **Direct Order**.

### 5. 🚚 Shared Transport Optimizer
- Pools mini-truck freight across adjacent farms along the same transport corridors (e.g., Pollachi ➔ Coimbatore).
- Compares:
  - Solo Truck Hire: ₹1,200
  - Pooled Transport: ₹420
  - **Estimated Transport Savings: ₹780 (65% saved)**.
- Real-time booking with **"Join Shared Transport"**.

### 6. 🎙️ Natural Voice Selling (தமிழ் & English) with Confirmation Screen
- Supports speech in natural Tamil and English:
  - *"Enakku 200 kilo tomato irukku, kilo 32 rupees-ku sell panna poren"*
  - *"Tomato 200 kg 35 rupees"*
- Extracts: **Crop**, **Quantity**, and **Price**.
- **Mandatory Confirmation Screen**: Displays parsed values with edit controls. Never auto-publishes without farmer confirmation.

### 7. ⚡ "Should I Sell Now?" Quick Dashboard Card
- Instant farm intelligence card on the Farmer Dashboard.
- Evaluates real-time demand, supply pressure, and 7-day trend to recommend **Sell Now** or **Consider Waiting**.

### 8. 📊 Farmer Earnings Analytics
- Tracks 8 core metrics: Total Sales, Completed Orders, Pending Orders, Total Revenue, Transport Savings, Estimated Additional Income, Crop Margins, and Actionable AI Insights.

---

## 🛠️ Full Backend Architecture

Built with **Node.js + Express.js + MongoDB (Mongoose)**.

### Database Models (`backend/models/`)
- `User`: Roles (`farmer`, `buyer`, `admin`), phone, location, password hash (bcrypt).
- `Farmer`: Farm size, crops grown, sales count, lifetime revenue, transport savings.
- `Buyer`: Business type (Retailer, FPO, Hotel/Restaurant, Wholesaler), demand crops, credit rating.
- `Product`: Crop listings, grade, quantity, price, location, voice-created flag.
- `Order`: Lifecycle tracking, intermediary savings, transport cost, delivery status steps.
- `Offer`: Direct B2B negotiations between buyers and farmers with match scores.
- `Transport`: Routes, truck capacity, booked load, individual vs shared pricing, pooled farmers count.
- `MarketData`: Regional mandi benchmark prices, retail prices, supply/demand indices, trends.

### REST API Endpoints

#### Authentication
- `POST /api/auth/register` — Register farmer/buyer
- `POST /api/auth/login` — JWT Authentication
- `GET /api/auth/profile` — Get profile

#### Products
- `GET /api/products` — List all products with category and search filter
- `POST /api/products` — Create produce listing (supports voice tags)
- `PUT /api/products/:id` — Update listing
- `DELETE /api/products/:id` — Remove listing

#### Decision Engine
- `POST /api/decision/price` — Smart Decision Center calculations & "Why this price?" factors
- `POST /api/decision/profit` — Intermediary loss vs direct profit simulation
- `POST /api/decision/transport` — Solo vs pooled logistics optimization
- `POST /api/decision/buyer-match` — Ranked buyer compatibility scoring

#### Orders & Offers
- `GET /api/orders` — List orders
- `POST /api/orders` — Create / AI fulfill order
- `PUT /api/orders/:id/status` — Update order status
- `GET /api/offers` — List buyer offers
- `POST /api/offers` — Send direct offer
- `PUT /api/offers/:id` — Accept / counter offer

#### Transport & Market Data
- `GET /api/transport` — Active pooled routes
- `POST /api/transport/join` — Join shared mini-truck
- `GET /api/market` — Benchmark rates
- `GET /api/market/analytics` — Farmer earnings metrics

---

## 💻 Installation & Running Instructions

### Prerequisites
- **Node.js**: v18 or higher (tested on Node v24)
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI *(Optional: the server includes high-performance in-memory state fallback so it runs out-of-the-box even without a local MongoDB service)*

### 1. Install Dependencies
```bash
# Navigate to backend directory
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/agrimithra
JWT_SECRET=agrimithra_super_secret_jwt_key_2024_farmers_future
NODE_ENV=development
```

### 3. (Optional) Seed the Database
If you have a live MongoDB running:
```bash
npm run seed
```

### 4. Start the Application
From the root or backend directory:
```bash
# From backend/
npm start

# Or from root/
node backend/server.js
```

### 5. Access the Platform
- **Frontend Dashboard**: Open your browser at `http://localhost:5000` or double-click `agrimithra001.html`
- **Backend API**: `http://localhost:5000/api`
- **System Health Check**: `http://localhost:5000/api/health`

---

## 🏆 Hackathon Demonstration Flow

1. Open **Smart Decision Center** from sidebar ➔ Select Tomato, 200 kg, Grade A, Pollachi ➔ Click **Calculate Smart Decision**.
2. Click **Why this price?** to see the 7-factor explainability breakdown.
3. Open **Profit Simulator** ➔ Slide harvest quantity to 500 kg to see the ₹12,000 intermediary margin recovered by the farmer.
4. Open **Smart Buyer Match** ➔ Inspect verified buyers with 94% match scores ➔ Click **Send Offer**.
5. Open **Shared Logistics** ➔ View ₹780 (65%) transport savings ➔ Click **Join Shared Slot**.
6. Click **Sell by Voice** ➔ Speak or test in Tamil/English ➔ Inspect the **Confirmation Screen** before publishing.
7. Open **Analytics** to view verified +₹5,680 additional income and ₹3,420 freight savings.
