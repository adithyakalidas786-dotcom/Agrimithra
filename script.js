
const API_BASE_URL = window.location.origin.includes('localhost')
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api';

let products = [
    { id:"L101", name:"Tomato", cat:"vegetable", icon:"🍅", price:31, qty:"100 kg", loc:"Pollachi", grade:"A" },
    { id:"L102", name:"Onion", cat:"vegetable", icon:"🧅", price:27, qty:"200 kg", loc:"Udumalpet", grade:"A" },
    { id:"L103", name:"Banana", cat:"fruit", icon:"🍌", price:38, qty:"150 kg", loc:"Coimbatore", grade:"A" },
    { id:"L104", name:"Rice", cat:"grain", icon:"🌾", price:52, qty:"500 kg", loc:"Tiruppur", grade:"A" },
    { id:"L105", name:"Chilli", cat:"spice", icon:"🌶️", price:115, qty:"80 kg", loc:"Erode", grade:"A" },
    { id:"L106", name:"Mango", cat:"fruit", icon:"🥭", price:64, qty:"120 kg", loc:"Pollachi", grade:"A" },
    { id:"L107", name:"Carrot", cat:"vegetable", icon:"🥕", price:44, qty:"90 kg", loc:"Mettupalayam", grade:"A" },
    { id:"L108", name:"Turmeric", cat:"spice", icon:"🟡", price:145, qty:"60 kg", loc:"Erode", grade:"A" }
];

const defaultAppUser = { name: 'Guest Farmer', avatar: '🌱', location: 'Pollachi, Tamil Nadu', role: 'farmer' };
let appUser = JSON.parse(localStorage.getItem('agriAppUser') || 'null') || { ...defaultAppUser };
let myListings = JSON.parse(localStorage.getItem("agriListings") || "[]");
let customerOrders = JSON.parse(localStorage.getItem("customerOrders") || "[]");

function getCurrentUserName() {
    return appUser && appUser.name ? appUser.name : defaultAppUser.name;
}

function getCurrentUserLocation() {
    return appUser && appUser.location ? appUser.location : defaultAppUser.location;
}

function applyUserProfile() {
    const profileBtn = document.querySelector('.profile');
    if (profileBtn) {
        const avatar = profileBtn.querySelector('.avatar');
        const nameLabel = profileBtn.querySelector('span:last-child');
        if (avatar) avatar.textContent = appUser.avatar || defaultAppUser.avatar;
        if (nameLabel) nameLabel.textContent = getCurrentUserName();
    }

    const customerNameFields = document.querySelectorAll('#customerName, #modalCustomerName');
    customerNameFields.forEach(field => {
        if (field) field.value = getCurrentUserName();
    });
}

function setCurrentUser(nextUser = {}) {
    appUser = { ...defaultAppUser, ...nextUser };
    localStorage.setItem('agriAppUser', JSON.stringify(appUser));
    applyUserProfile();
}

function applyLanguageUI() {
    const languageBtn = document.querySelector('.language-btn');
    if (languageBtn) {
        const currentLang = localStorage.getItem('agriLanguage') || 'en';
        languageBtn.textContent = currentLang === 'ta' ? 'English' : 'தமிழ்';
    }
}

let buyersList = [
    { name:"FreshMart Supermarkets", buyerType:"Retailer", avatar:"🏪", location:"Coimbatore (RS Puram)", distanceKm:24, matchScore:94, crop:"Tomato", targetPrice:34, paymentTerm:"Instant UPI on Delivery" },
    { name:"GreenBasket Farmers Producer Co.", buyerType:"FPO", avatar:"🌿", location:"Pollachi North", distanceKm:8, matchScore:89, crop:"Onion", targetPrice:29, paymentTerm:"Same-day Bank Transfer" },
    { name:"Hotel Annapoorna Grand", buyerType:"Hotel / Restaurant", avatar:"🏨", location:"Gandhipuram, Coimbatore", distanceKm:28, matchScore:92, crop:"Banana", targetPrice:40, paymentTerm:"Escrow / Instant UPI" },
    { name:"Kovai Direct Agro Hub", buyerType:"Wholesaler", avatar:"🏬", location:"Singanallur, Coimbatore", distanceKm:22, matchScore:84, crop:"Turmeric", targetPrice:152, paymentTerm:"Instant IMPS" }
];

let transportRoutes = [
    { id:"trans_100", routeFrom:"Pollachi", routeTo:"Coimbatore Market", driverName:"Arun Logistics", driverPhone:"+91 94432 10987", vehicleType:"Tata Ace Mini Truck", capacityKg:800, bookedKg:450, individualCost:1200, sharedCost:420, savingsAmount:780, departureTime:"07:30 AM Tomorrow", pooledFarmersCount:3 },
    { id:"trans_101", routeFrom:"Udumalpet", routeTo:"Tiruppur Wholesale Hub", driverName:"Selvam Transport", driverPhone:"+91 98421 55678", vehicleType:"Mahindra Bolero Maxi Truck", capacityKg:1200, bookedKg:750, individualCost:1500, sharedCost:550, savingsAmount:950, departureTime:"06:00 AM Tomorrow", pooledFarmersCount:4 },
    { id:"trans_102", routeFrom:"Erode", routeTo:"Coimbatore RS Puram", driverName:"Kongu Green Freight", driverPhone:"+91 97890 33445", vehicleType:"Eicher Pro Light Cargo", capacityKg:2000, bookedKg:1300, individualCost:2200, sharedCost:750, savingsAmount:1450, departureTime:"08:00 AM Tomorrow", pooledFarmersCount:5 }
];

let buyerOffers = [
    { id:"off_1", buyerName:"FreshMart Supermarkets", buyerAvatar:"🏪", crop:"Tomato", quantity:100, grade:"A", offeredPrice:34, matchScore:94, deliveryLocation:"Coimbatore (RS Puram)", status:"Pending" },
    { id:"off_2", buyerName:"GreenBasket Farmers Producer Co.", buyerAvatar:"🌿", crop:"Onion", quantity:200, grade:"A", offeredPrice:28, matchScore:89, deliveryLocation:"Pollachi North", status:"Pending" },
    { id:"off_3", buyerName:"Hotel Annapoorna Grand", buyerAvatar:"🏨", crop:"Banana", quantity:150, grade:"A", offeredPrice:39, matchScore:92, deliveryLocation:"Gandhipuram, Coimbatore", status:"Pending" }
];

async function checkBackendConnection(){
    try{
        const res = await fetch(`${API_BASE_URL}/health`);
        if(res.ok){
            const data = await res.json();
            document.getElementById("backendStatusPill").style.background = "#eaf6ec";
            document.getElementById("backendStatusText").innerText = data.databaseMode.includes('MongoDB') ? "MongoDB Live" : "API Connected";
        }
    }catch(err){
        document.getElementById("backendStatusPill").style.background = "#fff6e5";
        document.getElementById("backendStatusText").innerText = "Offline Mode";
    }
}

function showPage(id,button){
    document.querySelectorAll(".page").forEach(page=>{ page.classList.add("hidden"); });
    const target = document.getElementById(id);
    if(target) target.classList.remove("hidden");
    document.querySelectorAll(".nav-btn").forEach(btn=>{ btn.classList.remove("active"); });
    if(button) button.classList.add("active");

    if(id==="market") renderProducts();
    if(id==="crops") renderMyCrops();
    if(id==="offers") renderOffersPage();
    if(id==="buyerMatch") renderSmartBuyerMatches();
    if(id==="logistics") renderTransportRoutes();
    if(id==="aiorders") renderAIOrders();
    if(id==="customerOrders") renderCustomerOrders();
    if(id==="decisionCenter") runDecisionCenterEngine();
    if(id==="profitSimulator") runProfitSimulatorEngine();

    window.scrollTo({ top:0, behavior:"smooth" });
}

async function runDecisionCenterEngine(){
    const crop = document.getElementById("dcCrop").value;
    const quantity = Number(document.getElementById("dcQty").value) || 200;
    const quality = document.getElementById("dcGrade").value;
    const location = document.getElementById("dcLocation").value;
    const expectedPrice = document.getElementById("dcExpectedPrice").value;

    try{
        const res = await fetch(`${API_BASE_URL}/decision/price`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ crop, quantity, quality, location, expectedPrice })
        });
        if(res.ok){
            const json = await res.json();
            displayDecisionCenterResults(json.data);
            return;
        }
    }catch(e){}

    const benchmarkRates = {
        Tomato:{ mandi:18, min:31, max:35, trend:"Upward", trendPct:8.2, demand:"High (8.8/10)" },
        Onion:{ mandi:16, min:27, max:30, trend:"Stable", trendPct:4.5, demand:"High (8.2/10)" },
        Banana:{ mandi:22, min:37, max:41, trend:"Upward", trendPct:11.4, demand:"High (9.1/10)" },
        Rice:{ mandi:34, min:52, max:56, trend:"Stable", trendPct:1.8, demand:"Moderate (6.8/10)" },
        Chilli:{ mandi:75, min:115, max:128, trend:"Upward", trendPct:9.6, demand:"High (9.4/10)" },
        Mango:{ mandi:38, min:64, max:72, trend:"Upward", trendPct:6.2, demand:"Moderate (7.9/10)" },
        Carrot:{ mandi:26, min:44, max:48, trend:"Stable", trendPct:3.1, demand:"Moderate (7.4/10)" },
        Turmeric:{ mandi:95, min:145, max:160, trend:"Upward", trendPct:12.8, demand:"High (9.6/10)" }
    };

    const b = benchmarkRates[crop] || benchmarkRates.Tomato;
    const gradeMultiplier = quality==='A' ? 1.15 : quality==='B' ? 1.0 : 0.88;
    const minP = Math.round(b.min * gradeMultiplier);
    const maxP = Math.round(b.max * gradeMultiplier);
    const avgP = Math.round((minP + maxP) / 2);
    const rev = avgP * quantity;
    const transport = Math.round(150 + 26 * 10);
    const net = rev - transport;

    displayDecisionCenterResults({
        crop, quantity, recommendedPriceMin: minP, recommendedPriceMax: maxP, recommendedAveragePrice: avgP,
        estimatedRevenue: rev, estimatedTransportCost: transport, estimatedNetProfit: net,
        demandLevel: b.demand, benchmarkMandiPrice: b.mandi, recommendation: "Sell Now",
        reasons:[
            `High active direct buyer demand in ${location} and nearby urban hubs.`,
            `Direct pricing earns +₹${avgP - b.mandi}/kg more than local middleman rates.`,
            `Grade ${quality} quality receives +${quality==='A'?'15%':'0%'} price premium.`
        ]
    });
}

function displayDecisionCenterResults(data){
    document.getElementById("dcPriceRangeDisplay").innerHTML = `₹${data.recommendedPriceMin} – ₹${data.recommendedPriceMax} <small style="font-size:14px;color:#248348">/ kg</small>`;
    document.getElementById("dcMandiPriceDisplay").innerText = `₹${data.benchmarkMandiPrice}/kg`;
    document.getElementById("dcDirectAdvantageDisplay").innerText = `+₹${data.recommendedAveragePrice - data.benchmarkMandiPrice}/kg (+${Math.round(((data.recommendedAveragePrice - data.benchmarkMandiPrice)/data.benchmarkMandiPrice)*100)}%)`;

    document.getElementById("dcRevenue").innerText = `₹${data.estimatedRevenue.toLocaleString()}`;
    document.getElementById("dcTransport").innerText = `₹${data.estimatedTransportCost.toLocaleString()}`;
    document.getElementById("dcNetProfit").innerText = `₹${data.estimatedNetProfit.toLocaleString()}`;
    document.getElementById("dcDemandIndex").innerText = typeof data.demandLevel === 'string' ? data.demandLevel : "High (8.8/10)";

    let badgeClass = data.recommendation==="Sell Now" ? "badge-sell-now" : data.recommendation==="Consider Waiting" ? "badge-wait" : "badge-buyer";
    document.getElementById("dcRecommendationBadge").innerHTML = `<span class="${badgeClass}">⚡ ${data.recommendation}</span>`;

    const reasonsList = document.getElementById("dcReasonsList");
    if(reasonsList && data.reasons){
        reasonsList.innerHTML = data.reasons.map(r => `<li>${r}</li>`).join("");
    }
}

function proceedToPublishFromDecision(){
    const crop = document.getElementById("dcCrop").value;
    const qty = document.getElementById("dcQty").value;
    const grade = document.getElementById("dcGrade").value;
    const loc = document.getElementById("dcLocation").value;

    document.getElementById("cropName").value = crop;
    document.getElementById("cropQty").value = qty;
    document.getElementById("cropGrade").value = grade;
    document.getElementById("cropLocation").value = loc;

    openListing();
}

async function runProfitSimulatorEngine(){
    const crop = document.getElementById("simCrop").value;
    const quantity = Number(document.getElementById("simQty").value) || 500;

    try{
        const res = await fetch(`${API_BASE_URL}/decision/profit`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ crop, quantity })
        });
        if(res.ok){
            const json = await res.json();
            displayProfitSimResults(json.data);
            return;
        }
    }catch(e){}

    const benchmarks = {
        Tomato:{ mandi:18, trader:24, wholesale:30, retail:42, direct:33 },
        Onion:{ mandi:16, trader:20, wholesale:26, retail:38, direct:28 },
        Banana:{ mandi:22, trader:28, wholesale:36, retail:50, direct:39 },
        Rice:{ mandi:34, trader:40, wholesale:48, retail:65, direct:53 },
        Chilli:{ mandi:75, trader:90, wholesale:110, retail:155, direct:120 },
        Mango:{ mandi:38, trader:48, wholesale:60, retail:85, direct:66 },
        Carrot:{ mandi:26, trader:32, wholesale:40, retail:58, direct:45 },
        Turmeric:{ mandi:95, trader:112, wholesale:135, retail:195, direct:150 }
    };

    const b = benchmarks[crop] || benchmarks.Tomato;
    const tradRev = b.mandi * quantity;
    const tradLoss = (b.retail - b.mandi) * quantity;
    const dirRev = b.direct * quantity;
    const transCost = Math.round(2 * quantity);
    const dirNet = dirRev - transCost;
    const extraGain = dirRev - tradRev;
    const extraPct = Math.round((extraGain / tradRev) * 100);

    displayProfitSimResults({
        traditionalFarmerPrice: b.mandi, consumerRetailPrice: b.retail,
        traditionalFarmerRevenue: tradRev, estimatedIntermediaryMargin: tradLoss,
        directFarmerPrice: b.direct, directSaleRevenue: dirRev,
        directTransportCost: transCost, netAmountReceivedByFarmer: dirNet,
        potentialAdditionalIncome: extraGain, percentageIncomeIncrease: extraPct, b
    });
}

function displayProfitSimResults(d){
    const b = d.b || { trader: d.traditionalFarmerPrice+6, wholesale: d.traditionalFarmerPrice+12 };
    document.getElementById("simTradFarmerPrice").innerText = `₹${d.traditionalFarmerPrice}/kg (${Math.round((d.traditionalFarmerPrice/d.consumerRetailPrice)*100)}% share)`;
    document.getElementById("simTradTraderPrice").innerText = `₹${b.trader || d.traditionalFarmerPrice+6}/kg (+₹6 cut)`;
    document.getElementById("simTradWholesalePrice").innerText = `₹${b.wholesale || d.traditionalFarmerPrice+12}/kg (+₹6 cut)`;
    document.getElementById("simTradRetailPrice").innerText = `₹${d.consumerRetailPrice}/kg (+₹12 markup)`;
    document.getElementById("simTradConsumerPrice").innerText = `₹${d.consumerRetailPrice}/kg`;
    document.getElementById("simTradRevenue").innerText = `₹${d.traditionalFarmerRevenue.toLocaleString()}`;
    document.getElementById("simTradMarginLost").innerText = `₹${d.estimatedIntermediaryMargin.toLocaleString()} lost`;

    document.getElementById("simDirectFarmerPrice").innerText = `₹${d.directFarmerPrice}/kg (87% share)`;
    document.getElementById("simDirectBuyerFinalPrice").innerText = `₹${d.directFarmerPrice + 4}/kg (Buyer saves 12%)`;
    document.getElementById("simDirectRevenue").innerText = `₹${d.directSaleRevenue.toLocaleString()}`;
    document.getElementById("simDirectTransportCost").innerText = `₹${d.directTransportCost.toLocaleString()}`;
    document.getElementById("simDirectNetReceived").innerText = `₹${d.netAmountReceivedByFarmer.toLocaleString()}`;

    document.getElementById("simExtraGainDisplay").innerText = `+₹${d.potentialAdditionalIncome.toLocaleString()} (+${d.percentageIncomeIncrease}%)`;
}

async function openWhyPriceModal(cropName = 'Tomato'){
    const crop = cropName || 'Tomato';
    document.getElementById("whyPriceTitle").innerText = `Why this price? — ${crop}`;
    document.getElementById("whyPriceModal").style.display = "flex";

    const factorsBox = document.getElementById("whyFactorsList");
    factorsBox.innerHTML = `<div class="loader"><div class="spinner"></div><p style="font-size:10px">Computing market factor weights...</p></div>`;

    try{
        const res = await fetch(`${API_BASE_URL}/decision/price`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ crop, quantity: 100, quality: 'A' })
        });
        if(res.ok){
            const json = await res.json();
            const data = json.data;
            document.getElementById("whyPriceRange").innerText = `₹${data.recommendedPriceMin} – ₹${data.recommendedPriceMax} / kg`;
            document.getElementById("whyPriceMandi").innerText = `₹${data.benchmarkMandiPrice} / kg`;

            factorsBox.innerHTML = data.factorsBreakdown.map((f, i) => `
                <div class="why-factor-row">
                    <div class="why-factor-icon">${i === 0 ? '🏛️' : i === 1 ? '💰' : i === 2 ? '⭐' : i === 3 ? '📈' : i === 4 ? '🤝' : i === 5 ? '🚚' : '📦'}</div>
                    <div style="flex:1">
                        <div style="display:flex;justify-content:space-between;align-items:center">
                            <b style="font-size:11px;color:var(--dark)">${f.factor}</b>
                            <span class="factor-tag">${f.impact}</span>
                        </div>
                        <p style="font-size:9px;color:var(--muted);margin-top:2px;line-height:1.4">${f.description}</p>
                    </div>
                </div>
            `).join("");
            return;
        }
    }catch(e){}

    factorsBox.innerHTML = `
        <div class="why-factor-row"><div class="why-factor-icon">🏛️</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:11px">Local APMC Mandi Rate</b><span class="factor-tag">₹18/kg base</span></div><p style="font-size:9px;color:var(--muted)">Baseline arrival price at regional regulated agricultural markets.</p></div></div>
        <div class="why-factor-row"><div class="why-factor-icon">💰</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:11px">Direct Intermediary Elimination</b><span class="factor-tag">+₹13/kg gain</span></div><p style="font-size:9px;color:var(--muted)">Eliminating village aggregator and wholesaler commissions redirects margin directly to you.</p></div></div>
        <div class="why-factor-row"><div class="why-factor-icon">⭐</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:11px">Quality Grade A Adjustment</b><span class="factor-tag">+15% Premium</span></div><p style="font-size:9px;color:var(--muted)">Freshly harvested firm batch receives top retail grade rating.</p></div></div>
        <div class="why-factor-row"><div class="why-factor-icon">📈</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:11px">Weekly Price Trend</b><span class="factor-tag">Upward (+8.2%)</span></div><p style="font-size:9px;color:var(--muted)">Strong consumer demand in Coimbatore and Pollachi urban centers.</p></div></div>
        <div class="why-factor-row"><div class="why-factor-icon">🚚</div><div style="flex:1"><div style="display:flex;justify-content:space-between"><b style="font-size:11px">Pooled Logistics Freight Offset</b><span class="factor-tag">-₹2.10/kg</span></div><p style="font-size:9px;color:var(--muted)">Shared Tata Ace mini-truck logistics keeps transportation costs minimal.</p></div></div>
    `;
}

function closeWhyPriceModal(){
    document.getElementById("whyPriceModal").style.display = "none";
}

async function renderSmartBuyerMatches(){
    const box = document.getElementById("smartBuyerList");
    if(!box) return;

    const filterCrop = document.getElementById("buyerMatchCropFilter") ? document.getElementById("buyerMatchCropFilter").value : 'all';

    let list = buyersList;
    if(filterCrop !== 'all'){
        list = list.filter(b => b.crop.toLowerCase().includes(filterCrop.toLowerCase()));
    }

    box.innerHTML = list.map(buyer => `
        <div class="buyer-card">
            <div class="buyer-score-badge">
                ${buyer.matchScore}%
                <small style="display:block;font-size:8px;color:#24763e;font-weight:700">MATCH</small>
            </div>
            <div style="font-size:26px">${buyer.avatar}</div>
            <div style="flex:1">
                <div style="display:flex;align-items:center;gap:8px">
                    <b style="font-size:13px">${buyer.name}</b>
                    <span class="factor-tag">${buyer.buyerType}</span>
                </div>
                <small style="color:var(--muted);display:block;font-size:9px;margin-top:2px">
                    📍 ${buyer.location} (${buyer.distanceKm} km away) • Seeking: <b>${buyer.crop}</b> • Target: <b>₹${buyer.targetPrice}/kg</b>
                </small>
                <small style="color:#1d753c;display:block;font-size:9px;margin-top:2px">
                    💳 Payment: ${buyer.paymentTerm} • ⭐ 4.9 Rating Verified
                </small>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
                <button class="primary" style="padding:6px 12px;font-size:10px;" onclick="openSendOfferModal('${buyer.name}', '${buyer.crop}', ${buyer.targetPrice})">🤝 Send Offer</button>
                <button class="secondary" style="padding:5px 10px;font-size:9px;" onclick="directOrderWithBuyer('${buyer.name}', '${buyer.crop}', ${buyer.targetPrice})">Place Order</button>
            </div>
        </div>
    `).join("");
}

function openSendOfferModal(buyerName, crop, targetPrice){
    document.getElementById("sendOfferBuyerName").innerText = `Send Offer to ${buyerName}`;
    document.getElementById("modalOfferCrop").value = crop || 'Tomato';
    document.getElementById("modalOfferPrice").value = targetPrice || 34;
    document.getElementById("sendOfferModal").style.display = "flex";
}

function closeSendOfferModal(){
    document.getElementById("sendOfferModal").style.display = "none";
}

async function submitCustomOffer(){
    const crop = document.getElementById("modalOfferCrop").value;
    const qty = document.getElementById("modalOfferQty").value;
    const price = document.getElementById("modalOfferPrice").value;
    const buyerName = document.getElementById("sendOfferBuyerName").innerText.replace("Send Offer to ", "");

    try{
        await fetch(`${API_BASE_URL}/offers`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ buyerName, crop, quantity: Number(qty), offeredPrice: Number(price), matchScore: 92 })
        });
    }catch(e){}

    buyerOffers.unshift({
        id: "off_" + Date.now(), buyerName, buyerAvatar: "🏪", crop,
        quantity: Number(qty), grade: "A", offeredPrice: Number(price),
        matchScore: 92, deliveryLocation: "Coimbatore", status: "Pending"
    });

    closeSendOfferModal();
    showToast(`🤝 Direct offer sent to ${buyerName} for ${qty} kg ${crop} at ₹${price}/kg!`);
    renderOffersPage();
}

function directOrderWithBuyer(buyerName, crop, price){
    buyProduct(crop, price);
}

async function renderTransportRoutes(){
    const box = document.getElementById("transportRoutesContainer");
    if(!box) return;

    try{
        const res = await fetch(`${API_BASE_URL}/transport`);
        if(res.ok){
            const json = await res.json();
            if(json.data && json.data.length > 0) transportRoutes = json.data;
        }
    }catch(e){}

    box.innerHTML = transportRoutes.map(t => `
        <div class="pool-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                    <b style="font-size:13px;color:var(--dark)">📍 ${t.routeFrom} ➔ ${t.routeTo}</b>
                    <small style="display:block;color:var(--muted);font-size:9px;margin-top:2px">
                        🚛 ${t.driverName} • ${t.vehicleType} • Departs: <b>${t.departureTime}</b>
                    </small>
                </div>
                <div style="text-align:right">
                    <span class="badge-sell-now">⚡ ${t.pooledFarmersCount} Farmers Pooled</span>
                </div>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding:10px;background:#f6faf5;border-radius:10px;">
                <div>
                    <span style="font-size:10px;color:var(--muted)">Capacity Booked: <b>${t.bookedKg} / ${t.capacityKg} kg</b></span>
                    <div class="bar-track" style="width:160px;margin-top:4px;">
                        <div class="bar-fill" style="width:${Math.round((t.bookedKg/t.capacityKg)*100)}%"></div>
                    </div>
                </div>
                <div style="text-align:right">
                    <div style="font-size:16px;font-weight:800;color:#13783f">₹${t.sharedCost}</div>
                    <small style="font-size:8px;color:#85968b;text-decoration:line-through">₹${t.individualCost} solo rate</small>
                </div>
                <button class="primary" style="padding:6px 14px;font-size:10px;" onclick="joinSharedTransportAction('${t.id || t._id}', 'Tomato', 100)">
                    Join Shared Slot
                </button>
            </div>
        </div>
    `).join("");
}

async function joinSharedTransportAction(transportId, crop='Tomato', qty=100){
    try{
        const res = await fetch(`${API_BASE_URL}/transport/join`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ transportId, crop, quantityKg: qty })
        });
        if(res.ok){
            const json = await res.json();
            showToast(json.message);
            renderTransportRoutes();
            return;
        }
    }catch(e){}

    showToast(`✅ Successfully joined shared mini-truck transport! Pick-up confirmed for ${qty} kg ${crop} tomorrow morning. Driver: Arun Logistics (+91 94432 10987)`);
}

let recognition = null;
let voiceLanguage = "en-IN";
let isListening = false;

function setVoiceLanguage(language, button){
    voiceLanguage = language;
    document.querySelectorAll(".languages button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    showToast(language === "ta-IN" ? "🇮🇳 தமிழ் குரல் பதிவு தேர்ந்தெடுக்கப்பட்டது" : "🇬🇧 English voice recognition selected");
}

function startListingVoice(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRecognition){
        showToast("⚠️ Voice recognition is not supported in this browser. Please use Google Chrome.");
        return;
    }

    if(isListening) return;

    recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.continuous = false;
    recognition.interimResults = false;

    const button = document.getElementById("voiceBtn");
    const status = document.getElementById("voiceStatus");

    isListening = true;
    if(button){ button.innerHTML = "🔴"; button.disabled = true; }
    if(status){
        status.style.display = "block";
        status.innerHTML = voiceLanguage === 'ta-IN'
            ? "🔴 <b>கேட்கிறது...</b><br>கூறுங்கள்: தக்காளி 200 கிலோ 32 ரூபாய்"
            : "🔴 <b>Listening...</b><br>Say: Tomato 200 kg 35 rupees";
    }

    try{
        recognition.start();
    }catch(error){
        resetVoice();
    }

    recognition.onresult = function(event){
        const text = event.results[0][0].transcript.trim();
        if(status) status.innerHTML = `🗣️ <b>You said:</b> "${text}"`;
        processVoiceListingWithConfirmation(text);
        if(button) button.innerHTML = "✅";
        setTimeout(() => { resetVoice(); }, 1200);
    };

    recognition.onerror = function(event){
        showToast("⚠️ Voice error: " + event.error);
        resetVoice();
    };

    recognition.onend = function(){
        resetVoice();
    };
}

function resetVoice(){
    isListening = false;
    const button = document.getElementById("voiceBtn");
    if(button){ button.disabled = false; button.innerHTML = "🎙️"; }
}

function processVoiceListingWithConfirmation(text){
    const speech = text.toLowerCase();

    const cropMap = {
        tomato:"Tomato", onion:"Onion", banana:"Banana", mango:"Mango", rice:"Rice", chilli:"Chilli",
        chili:"Chilli", carrot:"Carrot", potato:"Potato", brinjal:"Brinjal", cabbage:"Cabbage", beans:"Beans",
        turmeric:"Turmeric",
        "தக்காளி":"Tomato", "வெங்காயம்":"Onion", "வாழைப்பழம்":"Banana", "அரிசி":"Rice",
        "மிளகாய்":"Chilli", "கேரட்":"Carrot", "மஞ்சள்":"Turmeric", "மாம்பழம்":"Mango"
    };

    let crop = "Tomato";
    for(const key in cropMap){
        if(speech.includes(key)){ crop = cropMap[key]; break; }
    }

    const qtyMatch = speech.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilos|kilogram|கிலோ)/i);
    const numbers = speech.match(/\d+(?:\.\d+)?/g) || [];
    const quantity = qtyMatch ? qtyMatch[1] : (numbers.length > 0 ? numbers[0] : "100");

    let price = "32";
    const priceMatch = speech.match(/(?:₹|rs|rs\.|rupees|ரூபாய்|விலை|at|rate)\s*(\d+(?:\.\d+)?)/i);
    if(priceMatch){
        price = priceMatch[1];
    } else if(numbers.length >= 2){
        price = numbers[numbers.length - 1];
    }

    closeListing();

    document.getElementById("voiceTranscriptDisplay").innerText = `"${text}"`;
    document.getElementById("voiceConfirmCrop").value = crop;
    document.getElementById("voiceConfirmQty").value = quantity;
    document.getElementById("voiceConfirmPrice").value = price;
    document.getElementById("voiceConfirmLocation").value = "Pollachi, Tamil Nadu";
    document.getElementById("voiceConfirmModal").style.display = "flex";
}

function openListingVoice(){
    openListing();
    setTimeout(() => { startListingVoice(); }, 400);
}

function closeVoiceConfirmModal(){
    document.getElementById("voiceConfirmModal").style.display = "none";
}

async function executeVoicePublish(){
    const name = document.getElementById("voiceConfirmCrop").value.trim();
    const qty = document.getElementById("voiceConfirmQty").value;
    const price = document.getElementById("voiceConfirmPrice").value;
    const location = document.getElementById("voiceConfirmLocation").value;

    const item = {
        id:"L" + Date.now(),
        name,
        qty: `${qty} kg`,
        grade:"A",
        price:Number(price),
        loc:location,
        location,
        date:new Date().toLocaleDateString(),
        status:"Active"
    };

    try{
        await fetch(`${API_BASE_URL}/products`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ name, quantity: Number(qty), price: Number(price), grade: 'A', location, isVoiceCreated: true })
        });
    }catch(e){}

    myListings.unshift(item);
    localStorage.setItem("agriListings", JSON.stringify(myListings));

    closeVoiceConfirmModal();
    updateListingCount();
    renderMyCrops();
    showToast(`🌱 Voice Listing Confirmed & Published: ${name} (${qty} kg @ ₹${price}/kg)!`);
}

function updateQuickSellCard(){
    const crop = document.getElementById("quickCropSelect").value;
    const data = {
        Tomato:{ mandi:18, directMin:31, directMax:35, demand:"High (8.8/10)", supply:"Moderate (5.1/10)", trend:"↑ Upward (+8.2%)", rec:"Sell Now", badge:"badge-sell-now", reason:"Urban retail demand is surging by 14% with low local mandi arrivals. Sell now through AgriMithra to secure peak margins." },
        Onion:{ mandi:16, directMin:27, directMax:30, demand:"High (8.2/10)", supply:"Moderate (6.0/10)", trend:"→ Stable (+4.5%)", rec:"Sell Now", badge:"badge-sell-now", reason:"Steady direct wholesale quotes from FPOs in Coimbatore with direct farm pickup available." },
        Banana:{ mandi:22, directMin:37, directMax:41, demand:"High (9.1/10)", supply:"Low (4.2/10)", trend:"↑ Upward (+11.4%)", rec:"Sell Now", badge:"badge-sell-now", reason:"High festival and hotel demand in Coimbatore cluster; Grade A clusters receiving premium rates." },
        Rice:{ mandi:34, directMin:52, directMax:56, demand:"Moderate (6.8/10)", supply:"High (7.8/10)", trend:"→ Stable (+1.8%)", rec:"Consider Waiting", badge:"badge-wait", reason:"Regional mill arrivals are peaking. Storage for 2–3 weeks is projected to gain an extra +₹4/kg." },
        Chilli:{ mandi:75, directMin:115, directMax:128, demand:"High (9.4/10)", supply:"Low (3.8/10)", trend:"↑ Upward (+9.6%)", rec:"Sell Now", badge:"badge-sell-now", reason:"Export and spice extraction units in Erode seeking premium sun-dried batches." },
        Turmeric:{ mandi:95, directMin:145, directMax:160, demand:"High (9.6/10)", supply:"Low (3.2/10)", trend:"↑ Upward (+12.8%)", rec:"Sell Now", badge:"badge-sell-now", reason:"High curcumin grade demand in Erode export cluster with immediate cash settlement." }
    };

    const d = data[crop] || data.Tomato;
    document.getElementById("quickMandiPrice").innerText = `₹${d.mandi}/kg`;
    document.getElementById("quickDirectPrice").innerText = `₹${d.directMin} – ₹${d.directMax}/kg`;
    document.getElementById("quickDemandLevel").innerText = d.demand;
    document.getElementById("quickSupplyLevel").innerText = d.supply;
    document.getElementById("quickTrend").innerText = d.trend;
    document.getElementById("quickBadgeContainer").innerHTML = `<span class="${d.badge}">⚡ ${d.rec}</span>`;
    document.getElementById("quickReasonText").innerText = d.reason;

    document.getElementById("heroCropSub").innerText = `${crop} • Grade A • 100 kg`;
    document.getElementById("heroPriceDisplay").innerHTML = `₹${d.directMin} <small>/kg (Direct)</small>`;
}

async function fetchProductsFromAPI(){
    try{
        const res = await fetch(`${API_BASE_URL}/products`);
        if(res.ok){
            const json = await res.json();
            if(json.data && json.data.length > 0) products = json.data;
        }
    }catch(e){}
}

function renderProducts(list=products){
    const box = document.getElementById("products");
    if(!box) return;

    if(list.length === 0){
        box.innerHTML = `<div class="tip">No produce found.</div>`;
        return;
    }

    box.innerHTML = list.map(product => `
        <div class="product">
            <div class="product-image">
                <span class="product-tag">VERIFIED FARMER</span>
                ${product.icon || '🌾'}
            </div>
            <div class="product-body">
                <h3>${product.name}</h3>
                <div class="product-location">📍 ${product.location || product.loc || 'Tamil Nadu'}</div>
                <div class="product-qty">${product.quantity ? product.quantity + ' kg' : (product.qty || '100 kg')} • Grade ${product.grade || 'A'}</div>
                <div class="product-bottom">
                    <div class="price">₹${product.price}<small>/kg</small></div>
                    <button class="buy-btn" onclick="buyProduct('${product.name}', ${product.price})">Buy Now</button>
                </div>
                <div style="margin-top:6px">
                    <button class="offer-btn" style="width:100%" onclick="makeOffer('${product.name}', ${product.price})">Make Offer</button>
                </div>
            </div>
        </div>
    `).join("");
}

function filterProducts(category, button){
    document.querySelectorAll(".tab").forEach(btn => btn.classList.remove("active"));
    if(button) button.classList.add("active");
    if(category === "all") renderProducts(products);
    else renderProducts(products.filter(item => (item.category === category || item.cat === category)));
}

function globalSearch(){
    const input = document.getElementById("search");
    if(!input) return;
    const query = input.value.toLowerCase().trim();
    if(!query) return;

    showPage("market");
    renderProducts(products.filter(product =>
        (product.name && product.name.toLowerCase().includes(query)) ||
        (product.loc && product.loc.toLowerCase().includes(query)) ||
        (product.location && product.location.toLowerCase().includes(query))
    ));
}

function openListing(){
    document.getElementById("listingModal").style.display = "flex";
}

function closeListing(){
    document.getElementById("listingModal").style.display = "none";
}

async function publishListing(){
    const name = document.getElementById("cropName").value.trim();
    const qty = document.getElementById("cropQty").value;
    const grade = document.getElementById("cropGrade").value;
    const price = document.getElementById("cropPrice").value;
    const location = document.getElementById("cropLocation").value.trim();

    if(!name || !qty || !price){
        showToast("⚠️ Crop, quantity and price are required.");
        return;
    }

    const item = {
        id:"L" + Date.now(),
        name,
        qty,
        grade,
        price:Number(price),
        location,
        loc:location,
        date:new Date().toLocaleDateString(),
        status:"Active"
    };

    try{
        await fetch(`${API_BASE_URL}/products`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ name, quantity: Number(qty), grade, price: Number(price), location })
        });
    }catch(e){}

    myListings.push(item);
    localStorage.setItem("agriListings", JSON.stringify(myListings));

    updateListingCount();
    closeListing();
    renderMyCrops();
    showToast("🌱 Produce successfully published to marketplace!");
}

function renderMyCrops(){
    const box = document.getElementById("myCrops");
    if(!box) return;

    if(myListings.length === 0){
        box.innerHTML = `
            <div class="tip">
                🌱 No custom listings yet.<br><br>
                Add a crop using <b>New Listing</b> or <b>Sell by Voice</b>.
            </div>
        `;
        return;
    }

    box.innerHTML = myListings.map((item, index) => `
        <div class="offer">
            <div class="offer-avatar">🌱</div>
            <div class="offer-info">
                <b>${item.name}</b>
                <small>${item.qty} kg • Grade ${item.grade} • ${item.location || item.loc}</small>
                <small>Listed ${item.date}</small>
            </div>
            <div class="offer-price">₹${item.price}/kg</div>
            <button class="accept" onclick="deleteListing(${index})">Delete</button>
        </div>
    `).join("");
}

function deleteListing(index){
    myListings.splice(index, 1);
    localStorage.setItem("agriListings", JSON.stringify(myListings));
    updateListingCount();
    renderMyCrops();
    showToast("Listing deleted.");
}

function updateListingCount(){
    const el = document.getElementById("listingCount");
    if(el) el.innerText = 8 + myListings.length;
}

function renderOffersPage(){
    const box = document.getElementById("allOffersContainer");
    const dashBox = document.getElementById("dashOffersContainer");

    const content = buyerOffers.map((o, idx) => `
        <div class="offer">
            <div class="offer-avatar">${o.buyerAvatar || '🏪'}</div>
            <div class="offer-info">
                <div style="display:flex;align-items:center;gap:6px">
                    <b>${o.buyerName}</b>
                    <span class="factor-tag">${o.matchScore || 90}% Match</span>
                </div>
                <small>${o.crop} • ${o.quantity} kg • Grade ${o.grade || 'A'} • 📍 ${o.deliveryLocation || 'Coimbatore'}</small>
            </div>
            <div class="offer-price">₹${o.offeredPrice}/kg</div>
            <button class="accept" onclick="acceptOffer('${o.buyerName}', '${o.crop}', ${o.quantity}, ${o.offeredPrice})">Accept</button>
        </div>
    `).join("");

    if(box) box.innerHTML = content;
    if(dashBox) dashBox.innerHTML = content;
}

function acceptOffer(name, crop='Produce', qty=100, price=32){
    showToast(`✅ Offer accepted from ${name}! Creating confirmed direct order...`);
    const newOrder = {
        id: "AG" + Date.now().toString().slice(-7),
        customer: name,
        crop,
        quantity: qty,
        price,
        total: qty * price,
        farmer: getCurrentUserName(),
        location: getCurrentUserLocation(),
        status: "CONFIRMED & PAID",
        date: new Date().toLocaleString()
    };
    customerOrders.unshift(newOrder);
    localStorage.setItem("customerOrders", JSON.stringify(customerOrders));
    renderCustomerOrders();
    renderAIOrders();
}

function makeOffer(crop, currentPrice){
    const offer = prompt(`Enter your direct offer for ${crop}.\nCurrent recommended direct price: ₹${currentPrice}/kg`, currentPrice);
    if(!offer) return;
    showToast(`🤝 ₹${offer}/kg offer sent for ${crop}`);
}

function openCustomerOrder(){
    document.getElementById("customerModal").style.display = "flex";
}

function closeCustomerOrder(){
    document.getElementById("customerModal").style.display = "none";
}

function submitCustomerOrder(){
    const name = document.getElementById("modalCustomerName").value;
    const request = document.getElementById("modalCustomerRequest").value;
    const location = document.getElementById("modalCustomerLocation").value;

    if(!request.trim()){
        showToast("Please enter what you want to order.");
        return;
    }

    document.getElementById("customerName").value = name;
    document.getElementById("customerRequest").value = request;
    document.getElementById("customerLocation").value = location;

    closeCustomerOrder();
    showPage("customer");
    placeCustomerOrder();
}

function buyProduct(crop, currentPrice){
    document.getElementById("customerRequest").value = `I need 200 kg ${crop} at ₹${currentPrice} per kg`;
    document.getElementById("customerName").value = getCurrentUserName();
    document.getElementById("customerLocation").value = getCurrentUserLocation();
    showPage("customer");
    showToast(`🛒 ${crop} added to your direct order`);
}

function placeCustomerOrder(){
    const request = document.getElementById("customerRequest").value.trim();
    const customer = document.getElementById("customerName").value.trim() || "Customer";
    const location = document.getElementById("customerLocation").value.trim() || "Coimbatore";

    if(!request){
        showToast("Please enter what you need.");
        return;
    }

    const result = document.getElementById("aiOrderResult");
    result.innerHTML = `
        <div class="loader">
            <div class="spinner"></div>
            <b>AgriMithra AI is matching farmer & optimizing logistics...</b>
            <p style="font-size:9px;color:#748078;margin-top:7px">
                Parsing requirement → Checking direct pricing → Assigning verified farmer → Booking shared mini-truck
            </p>
        </div>
    `;

    setTimeout(() => {
        const parsed = parseCustomerRequest(request);
        const farmer = findBestFarmer(parsed.crop);
        const price = farmer ? farmer.price : (parsed.price || 34);
        const quantity = parsed.quantity || 100;
        const total = quantity * price;

        const order = {
            id: "AG" + Date.now().toString().slice(-7),
            customer,
            request,
            crop: parsed.crop || "Tomato",
            quantity,
            price,
            total,
            location,
            farmer: farmer ? farmer.name : "Verified Farmer Network",
            status: "AI FULFILLED",
            date: new Date().toLocaleString()
        };

        customerOrders.unshift(order);
        localStorage.setItem("customerOrders", JSON.stringify(customerOrders));

        try{
            fetch(`${API_BASE_URL}/orders`, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                    customer,
                    crop: order.crop,
                    quantity,
                    price,
                    total,
                    location,
                    farmer: order.farmer,
                    request
                })
            });
        }catch(e){}

        result.innerHTML = `
            <div class="ai-understanding">
                <h4>✅ Order Placed & Direct Farmer Matched</h4>
                <div class="ai-row"><span>Order ID</span><b>#${order.id}</b></div>
                <div class="ai-row"><span>Crop</span><b>🌱 ${order.crop}</b></div>
                <div class="ai-row"><span>Quantity</span><b>⚖️ ${order.quantity} kg</b></div>
                <div class="ai-row"><span>Direct Price</span><b>💰 ₹${order.price}/kg</b></div>
                <div class="ai-row"><span>Farmer</span><b>👨‍🌾 ${order.farmer}</b></div>
                <div class="ai-row"><span>Delivery</span><b>📍 ${order.location}</b></div>
                <div class="ai-row"><span>Status</span><b>✅ ${order.status}</b></div>
                <div class="total">Total: ₹${order.total.toLocaleString()}</div>
                <button class="primary full" onclick="shareSpecificOrder('${order.id}')">
                    📤 Share Order via WhatsApp
                </button>
            </div>
        `;

        renderAIOrders();
        renderCustomerOrders();
        showToast("✅ Direct farmer matched and shared transport arranged!");
    }, 1400);
}

function parseCustomerRequest(text){
    const speech = text.toLowerCase();
    const cropMap = {
        tomato:"Tomato", onion:"Onion", banana:"Banana", mango:"Mango", rice:"Rice", chilli:"Chilli", carrot:"Carrot",
        "தக்காளி":"Tomato", "வெங்காயம்":"Onion", "வாழைப்பழம்":"Banana"
    };

    let crop = "Tomato";
    for(const k in cropMap){ if(speech.includes(k)){ crop = cropMap[k]; break; } }

    const qtyMatch = speech.match(/(\d+(?:\.\d+)?)\s*(kg|kgs|kilo|kilogram|கிலோ)/i);
    const quantity = qtyMatch ? Number(qtyMatch[1]) : 100;

    const priceMatch = speech.match(/(?:₹|rs|rupees|at|around|price)\s*(\d+(?:\.\d+)?)/i);
    const price = priceMatch ? Number(priceMatch[1]) : null;

    return { crop, quantity, price };
}

function findBestFarmer(crop){
    const target = crop.toLowerCase();
    const own = myListings.find(item => item.name.toLowerCase().includes(target));
    if(own) return { name: "You / AgriMithra Farmer (Direct)", price: Number(own.price) };
    const p = products.find(item => item.name.toLowerCase() === target);
    if(p) return { name: `Verified Farmer • ${p.loc || p.location || 'Pollachi'}`, price: Number(p.price) };
    return null;
}

function renderCustomerOrders(){
    const box = document.getElementById("customerOrderHistory");
    if(!box) return;

    if(customerOrders.length === 0){
        box.innerHTML = `<div class="tip">No customer orders placed yet.</div>`;
        return;
    }

    box.innerHTML = customerOrders.map(order => `
        <div class="order-card">
            <div class="order-top">
                <div class="order-id">#${order.id} • ${order.crop}</div>
                <div class="order-status">${order.status}</div>
            </div>
            <div class="order-desc">
                👤 ${order.customer} • ${order.quantity} kg • ₹${order.price}/kg<br>
                👨‍🌾 Matched Farmer: ${order.farmer}<br>
                📍 ${order.location}
            </div>
            <div class="progress">
                <div class="progress-step done">✓</div>
                <div class="progress-line done"></div>
                <div class="progress-step done">✓</div>
                <div class="progress-line done"></div>
                <div class="progress-step">3</div>
            </div>
            <div class="progress-labels">
                <span>Direct Order Placed</span>
                <span>Farmer Matched</span>
                <span>Delivered & Paid</span>
            </div>
            <button class="offer-btn" style="margin-top:10px" onclick="shareSpecificOrder('${order.id}')">
                📤 Share Order
            </button>
        </div>
    `).join("");
}

function renderAIOrders(){
    const box = document.getElementById("aiOrdersList");
    if(!box) return;

    if(customerOrders.length === 0){
        box.innerHTML = `<div class="tip">No AI fulfilled orders yet.</div>`;
        return;
    }

    box.innerHTML = customerOrders.map(order => `
        <div class="order-card">
            <div class="order-top">
                <div class="order-id">#${order.id} • ${order.crop}</div>
                <div class="order-status">AI FULFILLED</div>
            </div>
            <div class="order-desc">
                Customer: ${order.customer} • ${order.quantity} kg • ₹${order.price}/kg<br>
                Farmer: ${order.farmer}
            </div>
            <div style="margin-top:6px;color:#278143;font-size:9px;font-weight:700">
                ✓ Fair Price Verified • ✓ Zero Middleman Cut • ✓ Shared Freight
            </div>
        </div>
    `).join("");
}

function shareCustomerOrder(){
    const request = document.getElementById("customerRequest").value.trim();
    const name = document.getElementById("customerName").value;
    const location = document.getElementById("customerLocation").value;

    if(!request){
        showToast("Enter an order before sharing.");
        return;
    }

    const message = `🌾 AgriMithra Direct Order\n👤 Customer: ${name}\n🛒 Requirement: ${request}\n📍 Delivery: ${location}\n🤖 Fulfill directly with fair farmer pricing.`;
    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
}

function shareSpecificOrder(id){
    const order = customerOrders.find(item => item.id === id);
    if(!order) return;
    const message = `🌾 AgriMithra Direct Order #${order.id}\n👤 Customer: ${order.customer}\n🌱 Crop: ${order.crop} (${order.quantity} kg @ ₹${order.price}/kg)\n💵 Total: ₹${order.total}\n👨‍🌾 Farmer: ${order.farmer}\n📍 Delivery: ${order.location}`;
    window.open("https://wa.me/?text=" + encodeURIComponent(message), "_blank");
}

function openProfile(){
    const userName = getCurrentUserName();
    const userLocation = getCurrentUserLocation();
    showToast(`👨‍🌾 Active farmer profile: ${userName} (${userLocation})`);
}

function toggleLanguage(){
    const currentLang = localStorage.getItem('agriLanguage') || 'en';
    const nextLang = currentLang === 'ta' ? 'en' : 'ta';
    localStorage.setItem('agriLanguage', nextLang);
    applyLanguageUI();
    showToast(nextLang === 'ta' ? '🇮🇳 தமிழ் மொழி பயன்முறை இயக்கப்பட்டது (Tamil Mode Active)' : '🇬🇧 English mode activated');
}

function showToast(message){
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.style.display = "block";
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 3500);
}

document.addEventListener('DOMContentLoaded', function () {
    applyUserProfile();
    applyLanguageUI();
});

document.querySelectorAll(".modal-bg").forEach(modal => {
    modal.addEventListener("click", function(event){
        if(event.target === modal) modal.style.display = "none";
    });
});

checkBackendConnection();
fetchProductsFromAPI();
renderProducts();
renderMyCrops();
renderOffersPage();
renderSmartBuyerMatches();
renderTransportRoutes();
renderAIOrders();
renderCustomerOrders();
updateListingCount();
updateQuickSellCard();
