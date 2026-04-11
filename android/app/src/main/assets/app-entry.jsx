/**
 * KrishiShield AI â€” Enhanced Production App
 * A professional AgriTech mobile app with stable fake AI guidance,
 * live weather data, pest detection, market prices, and full farm management.
 */

import React, { useState, useEffect, useRef, useCallback } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import { motion, AnimatePresence } from "https://esm.sh/framer-motion@11.18.2";
import {
  LayoutDashboard, CloudSun, Brain, Bell, MapPin, Sun, CloudRain,
  CloudLightning, Cloud, Wind, Droplets, Thermometer, AlertTriangle,
  Zap, ChevronRight, ChevronLeft, Search, Leaf, Tractor, ArrowRight,
  CheckCircle, Radio, Sprout, Layers, Navigation, FlaskConical,
  TrendingUp, TrendingDown, Camera, Mic, MicOff, Send, X, Plus,
  BarChart3, Wheat, Bug, DollarSign, Settings, LogOut, User,
  RefreshCw, Info, Star, ShieldCheck, Satellite, Activity,
  ChevronDown, ChevronUp, MessageSquare, Phone, Globe, Package,
  Calendar, Clock, Eye, Download, Share2, BookOpen, Loader2,
  WifiOff, CheckCircle2, XCircle, Gauge, Cpu
} from "https://esm.sh/lucide-react@0.468.0";

// â”€â”€â”€ THEME & DESIGN TOKENS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const THEME = {
  bg: "#0D0F0E",
  surface: "#141716",
  surfaceHigh: "#1E2220",
  surfaceHighest: "#262B28",
  primary: "#4ADE80",
  primaryDim: "#22C55E",
  primaryContainer: "#052E16",
  secondary: "#60A5FA",
  secondaryContainer: "#1E3A5F",
  tertiary: "#F59E0B",
  tertiaryContainer: "#451A03",
  error: "#F87171",
  errorContainer: "#450A0A",
  success: "#34D399",
  outline: "#374151",
  onSurface: "#E2E8E4",
  onSurfaceVariant: "#9CA3AF",
  accent: "#A78BFA",
};

// â”€â”€â”€ UTILITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const formatTime = (date) => date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const formatDate = (date) => date.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

// â”€â”€â”€ APP DATA â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const WEATHER_DATA = {
  current: { temp: null, wind: null, feelsLike: null, condition: "Fetching weather...", updatedAt: null, source: "Fetching", error: null },
  forecast: [
    { day: "Mon", high: 34, low: 22, rain: 2, icon: "sun", condition: "Clear" },
    { day: "Tue", high: 31, low: 20, rain: 12, icon: "cloud-sun", condition: "Partly Cloudy" },
    { day: "Wed", high: 28, low: 18, rain: 45, icon: "cloud-rain", condition: "Light Rain" },
    { day: "Thu", high: 24, low: 16, rain: 92, icon: "storm", condition: "Heavy Storm", alert: true },
    { day: "Fri", high: 26, low: 17, rain: 30, icon: "cloud-rain", condition: "Showers" },
    { day: "Sat", high: 30, low: 19, rain: 5, icon: "cloud-sun", condition: "Mostly Clear" },
    { day: "Sun", high: 33, low: 21, rain: 0, icon: "sun", condition: "Sunny" },
  ],
};

const weatherCodeToCondition = (code) => ({
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Slight rain",
  63: "Rain",
  65: "Heavy rain",
  80: "Rain showers",
  81: "Showers",
  82: "Heavy showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
})[code] || "Changing weather";

const weatherConditionToIcon = (condition = "") => {
  const normalized = condition.toLowerCase();
  if (normalized.includes("thunder")) return "storm";
  if (normalized.includes("rain") || normalized.includes("drizzle") || normalized.includes("shower")) return "cloud-rain";
  if (normalized.includes("cloud") || normalized.includes("overcast")) return "cloud-sun";
  return "sun";
};

const buildLiveWeather = (current) => {
  const temp = Math.round(current.temperature);
  const wind = Math.round(current.windspeed);
  const condition = weatherCodeToCondition(Number(current.weathercode));
  return {
    current: {
      temp,
      wind,
      feelsLike: temp,
      condition,
      updatedAt: new Date().toISOString(),
      source: "Open-Meteo",
      error: null,
    },
    forecast: WEATHER_DATA.forecast.map((day, index) => index === 0
      ? { ...day, high: temp, low: Math.max(0, temp - 7), rain: 0, icon: weatherConditionToIcon(condition), condition, wind }
      : day),
  };
};

const formatLocationName = (address = {}) => {
  const city = address.city || address.town || address.village || address.hamlet || address.county;
  const state = address.state || address.region;
  return [city, state].filter(Boolean).join(", ") || "Location detected";
};

const CROPS = [
  { id: "wheat", name: "Wheat", emoji: "ðŸŒ¾", stage: "Flowering", health: 78, sector: "A-1 to A-4" },
  { id: "cotton", name: "Cotton", emoji: "ðŸŒ¿", stage: "Boll Formation", health: 91, sector: "B-2" },
  { id: "paddy", name: "Paddy", emoji: "ðŸŒ±", stage: "Vegetative", health: 85, sector: "C-1" },
];

const MARKET_PRICES = [
  { crop: "Wheat", price: 2275, unit: "â‚¹/qtl", change: +45, trend: "up", msp: 2275 },
  { crop: "Cotton", price: 7020, unit: "â‚¹/qtl", change: -120, trend: "down", msp: 7020 },
  { crop: "Paddy", price: 2183, unit: "â‚¹/qtl", change: +28, trend: "up", msp: 2183 },
  { crop: "Maize", price: 1962, unit: "â‚¹/qtl", change: +15, trend: "up", msp: 1962 },
  { crop: "Soybean", price: 4600, unit: "â‚¹/qtl", change: -85, trend: "down", msp: 4600 },
];

const ALERTS = [
  { id: 1, type: "critical", title: "Check Weather Before Field Work", time: "2h ago", desc: "Review the live weather screen before spraying, irrigation, or harvesting decisions.", read: false },
  { id: 2, type: "warning", title: "Aphid Infestation Risk", time: "5h ago", desc: "Drone scan detected early signs of aphid colonies in Sector B-2. Recommend immediate inspection.", read: false },
  { id: 3, type: "info", title: "Optimal Spray Window", time: "8h ago", desc: "Low wind conditions (2.1 km/h) expected tomorrow 5â€“8 AM. Ideal for fungicide application.", read: true },
  { id: 4, type: "success", title: "Irrigation Complete", time: "1d ago", desc: "Automated drip system completed scheduled cycle in Sector C-1. Soil moisture at 76%.", read: true },
  { id: 5, type: "info", title: "MSP Update", time: "2d ago", desc: "Government announces revised MSP for Kharif 2025. Wheat: â‚¹2275/qtl (+â‚¹150 from last year).", read: true },
];

// â”€â”€â”€ FAKE AI SYSTEM â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
async function getAIResponse(input) {
  await sleep(800);
  const text = String(input || "").toLowerCase();

  if (text.includes("json") && text.includes("healthscore")) {
    return JSON.stringify({
      healthScore: 82,
      issues: [{
        name: "Early nutrient stress",
        severity: "moderate",
        description: "A small patch may need closer scouting before treatment.",
        treatment: "Inspect affected rows and apply balanced fertilizer only if yellowing spreads."
      }],
      ndviValue: 0.68,
      soilMoisture: 61,
      nitrogenLevel: 48,
      recommendation: "Crop health is stable. Scout again in 24-48 hours and avoid unnecessary input cost."
    });
  }

  if (text.includes("json")) {
    return JSON.stringify({
      title: text.includes("rain") ? "Delay irrigation before rain" : "Scout crop before treatment",
      crop: text.includes("cotton") ? "Cotton" : text.includes("wheat") ? "Wheat" : "All crops",
      urgency: text.includes("rain") || text.includes("aphid") ? "warning" : "medium",
      summary: text.includes("aphid")
        ? "Aphid pressure needs leaf inspection before spraying."
        : "Use weather and crop stage before spending on inputs.",
      detail: text.includes("rain")
        ? "If rain is expected, delay irrigation and avoid spraying until leaves are dry."
        : "Inspect the affected patch first. Treat only where symptoms are visible.",
      actions: ["Inspect field", "Act only on affected patch"]
    });
  }

  if (text.includes("aphid") || text.includes("pest")) {
    return "ðŸ› Aphids: check the underside of leaves early morning. If colonies are active, start with neem-based spray and reassess after 24 hours. Avoid blanket spraying unless the infestation spreads.";
  }
  if (text.includes("wheat") || text.includes("harvest")) {
    return "ðŸŒ¾ Wheat: if the crop is mature and rain is possible, prioritize harvesting the driest blocks first. Keep harvested grain covered and avoid nitrogen application before wet weather.";
  }
  if (text.includes("rain") || text.includes("irrigation") || text.includes("water")) {
    return "ðŸŒ§ï¸ Rain/irrigation: delay irrigation if rain is likely or soil already feels moist. Spray only after leaves are dry and wind is calm.";
  }
  if (text.includes("price") || text.includes("market") || text.includes("mandi")) {
    return "â‚¹ Market: compare todayâ€™s mandi price with MSP and your storage cost. If price is weak and storage is safe, holding for a few days can be better.";
  }
  return "âœ… First scout the field, confirm the crop stage, and treat only the affected patch. Keep input costs low, avoid spraying during wind or rain risk, and check again after 24 hours.";
}

async function callAI(messages) {
  const input = Array.isArray(messages)
    ? messages.map(m => m?.content || "").join("\n")
    : String(messages || "");
  return getAIResponse(input);
}

// â”€â”€â”€ MAIN APP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function App() {
  const [screen, setScreen] = useState("onboarding");
  const [farmData, setFarmData] = useState(null);
  const [location, setLocation] = useState({
    lat: null,
    lon: null,
    name: "Fetching location...",
  });
  const [weatherData, setWeatherData] = useState(WEATHER_DATA);
  const [unreadAlerts, setUnreadAlerts] = useState(ALERTS.filter(a => !a.read).length);
  const [notifications, setNotifications] = useState([]);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const updateLocation = (nextLocation) => {
      if (!cancelled) setLocation(nextLocation);
    };

    const reverseGeocode = async (lat, lon) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error(`Reverse geocode failed: ${response.status}`);
        const data = await response.json();
        return formatLocationName(data.address);
      } catch (error) {
        return "Location detected";
      }
    };

    if (!navigator.geolocation) {
      updateLocation({ lat: null, lon: null, name: "Not supported" });
      return () => { cancelled = true; };
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const lat = coords.latitude;
        const lon = coords.longitude;
        const name = await reverseGeocode(lat, lon);
        updateLocation({ lat, lon, name });
      },
      (error) => {
        updateLocation({
          lat: null,
          lon: null,
          name: error.code === error.PERMISSION_DENIED ? "Permission denied" : "Location detected",
        });
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
    );

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (location.lat == null || location.lon == null) return;
    let cancelled = false;

    setWeatherData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        condition: prev.current.temp == null ? "Fetching weather..." : prev.current.condition,
        source: "Fetching",
        error: null,
      },
    }));

    const fetchWeather = async () => {
      try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`);
        if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
        const data = await response.json();
        if (!data.current_weather) throw new Error("Weather response missing current_weather");
        if (!cancelled) setWeatherData(buildLiveWeather(data.current_weather));
      } catch (error) {
        if (!cancelled) {
          setWeatherData(prev => ({
            ...prev,
            current: {
              ...prev.current,
              condition: prev.current.temp == null ? "Weather unavailable" : prev.current.condition,
              source: prev.current.temp == null ? "Unavailable" : prev.current.source,
              error: "Weather unavailable",
            },
          }));
        }
      }
    };

    fetchWeather();
    return () => { cancelled = true; };
  }, [location.lat, location.lon]);

  useEffect(() => {
    const locationFinishedWithoutCoords = location.lat == null
      && location.lon == null
      && location.name !== "Fetching location...";

    if (!locationFinishedWithoutCoords) return;

    setWeatherData(prev => ({
      ...prev,
      current: {
        ...prev.current,
        condition: "Location needed for weather",
        source: "Unavailable",
        error: "Location needed for weather",
      },
    }));
  }, [location.lat, location.lon, location.name]);

  const addNotification = useCallback((msg, type = "info") => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 4000);
  }, []);

  const screens = {
    home: <HomeScreen onNavigate={setScreen} farmData={farmData} location={location} weather={weatherData} alerts={ALERTS} now={now} />,
    forecast: <ForecastScreen onNavigate={setScreen} location={location} weather={weatherData} />,
    advisory: <AdvisoryScreen onNavigate={setScreen} crops={CROPS} addNotification={addNotification} />,
    alerts: <AlertsScreen onNavigate={setScreen} alerts={ALERTS} setUnreadAlerts={setUnreadAlerts} />,
    market: <MarketScreen onNavigate={setScreen} prices={MARKET_PRICES} />,
    crophealth: <CropHealthScreen onNavigate={setScreen} crops={CROPS} farmData={farmData} addNotification={addNotification} />,
    assistant: <AIAssistantScreen onNavigate={setScreen} farmData={farmData} location={location} weather={weatherData} />,
    profile: <ProfileScreen onNavigate={setScreen} farmData={farmData} location={location} />,
    onboarding: <OnboardingScreen location={location} onComplete={(data) => { setFarmData({ ...data, location: data.location || location.name }); setScreen("home"); }} />,
  };

  if (screen === "onboarding") {
    return (
      <AppShell>
        <AnimatePresence mode="wait">
          <PageTransition key="onboarding">{screens.onboarding}</PageTransition>
        </AnimatePresence>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Toast Notifications */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.id}
              initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 60 }}
              className={`px-4 py-3 rounded-xl text-sm font-medium shadow-xl border backdrop-blur-xl max-w-[280px]
                ${n.type === "success" ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-300" :
                  n.type === "error" ? "bg-red-950/90 border-red-500/30 text-red-300" :
                  "bg-gray-900/90 border-gray-700/50 text-gray-200"}`}
            >{n.msg}</motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top Bar */}
      <header style={{ background: "rgba(13,15,14,0.85)" }}
        className="fixed top-0 w-full z-50 flex justify-between items-center px-5 py-4 backdrop-blur-2xl border-b border-white/5">
        <button onClick={() => setScreen("home")} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #052E16, #166534)" }}>
            <Leaf size={16} className="text-green-400" />
          </div>
          <span className="font-black tracking-tighter text-white text-base" style={{ fontFamily: "'Syne', sans-serif" }}>
            KrishiShield<span style={{ color: THEME.primary }}>AI</span>
          </span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen("assistant")}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.accent}30` }}>
            <MessageSquare size={16} style={{ color: THEME.accent }} />
          </button>
          <button onClick={() => setScreen("alerts")} className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}` }}>
            <Bell size={16} className="text-gray-300" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                style={{ background: THEME.error, color: "#fff" }}>{unreadAlerts}</span>
            )}
          </button>
          <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl overflow-hidden border-2 border-green-500/30">
            <div className="w-full h-full flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg, #052E16, #166534)", color: THEME.primary }}>
              {farmData?.name?.[0] || "F"}
            </div>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[72px] pb-28 min-h-screen">
        <AnimatePresence mode="wait">
          <PageTransition key={screen}>{screens[screen] || screens.home}</PageTransition>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 pt-2"
        style={{ background: "linear-gradient(to top, rgba(13,15,14,0.98) 70%, transparent)" }}>
        <div className="max-w-md mx-auto flex justify-around items-center px-3 py-3 rounded-2xl border"
          style={{ background: "rgba(20,23,22,0.95)", backdropFilter: "blur(20px)", borderColor: THEME.outline + "50" }}>
          {[
            { id: "home", icon: <LayoutDashboard size={20} />, label: "Home" },
            { id: "forecast", icon: <CloudSun size={20} />, label: "Weather" },
            { id: "crophealth", icon: <Leaf size={20} />, label: "Crops" },
            { id: "market", icon: <TrendingUp size={20} />, label: "Market" },
            { id: "advisory", icon: <Brain size={20} />, label: "AI Advice" },
          ].map(({ id, icon, label }) => (
            <NavBtn key={id} active={screen === id} onClick={() => setScreen(id)} icon={icon} label={label} />
          ))}
        </div>
      </nav>
    </AppShell>
  );
}

function AppShell({ children }) {
  return (
    <div className="min-h-screen select-none" style={{ background: THEME.bg, color: THEME.onSurface, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        .no-scroll { overflow: hidden; }
        .glass { background: rgba(30,34,32,0.6); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.06); }
        .glass-sm { background: rgba(38,43,40,0.8); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.05); }
        .glow-green { box-shadow: 0 0 20px rgba(74,222,128,0.2); }
        .glow-red { box-shadow: 0 0 20px rgba(248,113,113,0.2); }
        .glow-amber { box-shadow: 0 0 20px rgba(245,158,11,0.2); }
        .text-gradient { background: linear-gradient(135deg, #4ADE80, #60A5FA); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .syne { font-family: 'Syne', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        input, textarea { outline: none; }
        input::placeholder, textarea::placeholder { color: #4B5563; }
      `}</style>
      {children}
    </div>
  );
}

function PageTransition({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

function NavBtn({ active, onClick, icon, label }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all"
      style={{ color: active ? THEME.primary : THEME.onSurfaceVariant, transform: active ? "scale(1.08)" : "scale(1)" }}>
      <div className="relative">
        {icon}
        {active && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full" style={{ background: THEME.primary }} />}
      </div>
      <span className="text-[9px] font-semibold uppercase tracking-widest">{label}</span>
    </button>
  );
}

// â”€â”€â”€ HOME SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HomeScreen({ onNavigate, farmData, location, weather, alerts, now }) {
  const [riskLevel] = useState(72);
  const criticalAlerts = alerts.filter(a => a.type === "critical" && !a.read);
  const locationLoading = location.name === "Fetching location...";
  const weatherLoading = weather.current.source === "Fetching";

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      {/* Greeting */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>
          {formatDate(now)} Â· {formatTime(now)}
        </p>
        <h1 className="text-3xl font-black leading-tight syne text-white">
          Sat Sri Akal,<br />{farmData?.farmerName || "Farmer Ji"} ðŸ™
        </h1>
        <div className="flex items-center gap-1.5 mt-1.5">
          <MapPin size={12} style={{ color: THEME.primary }} />
          <span className="text-xs font-medium" style={{ color: THEME.onSurfaceVariant }}>
            {location.name || farmData?.location || "Fetching location..."}
          </span>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <motion.button onClick={() => onNavigate("alerts")} whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-2xl text-left glow-red"
          style={{ background: "linear-gradient(135deg, rgba(69,10,10,0.8), rgba(127,29,29,0.4))", border: `1px solid ${THEME.error}40` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: THEME.error + "20" }}>
              <AlertTriangle size={18} style={{ color: THEME.error }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: THEME.error }}>
                ðŸš¨ Critical Alert
              </p>
              <p className="text-sm font-semibold text-white truncate">{criticalAlerts[0].title}</p>
            </div>
            <ChevronRight size={16} style={{ color: THEME.error }} />
          </div>
        </motion.button>
      )}

      {/* Weather Card */}
      <div className="glass rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.6), rgba(14,23,18,0.8))" }}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>Current Weather</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-black syne text-white">{weather.current.temp == null ? "--" : weather.current.temp}Â°</span>
              <span className="text-lg font-medium mb-1" style={{ color: THEME.onSurfaceVariant }}>Wind {weather.current.wind == null ? "--" : weather.current.wind}km/h</span>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: THEME.primary }}>
              {locationLoading || weatherLoading ? "Fetching weather..." : (weather.current.condition || "Weather unavailable")}
            </p>
          </div>
          <Sun size={52} className="opacity-80" style={{ color: THEME.tertiary }} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Temp", value: weather.current.temp == null ? "--" : `${weather.current.temp}Â°C`, icon: <Thermometer size={14} /> },
            { label: "Wind", value: weather.current.wind == null ? "--" : `${weather.current.wind}km/h`, icon: <Wind size={14} /> },
            { label: "Condition", value: weatherLoading ? "Loading" : weather.current.condition, icon: <CloudSun size={14} /> },
            { label: "Source", value: weather.current.source || "Live", icon: <Radio size={14} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="flex justify-center mb-1" style={{ color: THEME.primary }}>{icon}</div>
              <div className="text-sm font-bold text-white">{value}</div>
              <div className="text-[9px] font-medium uppercase tracking-wide mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Gauge */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>AI Risk Score</p>
            <h3 className="text-lg font-bold syne text-white">Crop Threat Analysis</h3>
          </div>
          <button onClick={() => onNavigate("advisory")} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: THEME.primaryContainer, color: THEME.primary }}>
            View Plan <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: "Fungal Blight", value: 78, color: THEME.error },
            { label: "Pest Infestation", value: 52, color: THEME.tertiary },
            { label: "Nutrient Deficiency", value: 34, color: THEME.secondary },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: THEME.onSurfaceVariant }}>{label}</span>
                <span className="font-bold" style={{ color }}>{value}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: THEME.surfaceHighest }}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full" style={{ background: color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: THEME.onSurfaceVariant }}>Quick Actions</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "AI Scan", icon: <Camera size={20} />, color: THEME.accent, screen: "crophealth" },
            { label: "Advisory", icon: <Brain size={20} />, color: THEME.primary, screen: "advisory" },
            { label: "Market", icon: <TrendingUp size={20} />, color: THEME.tertiary, screen: "market" },
            { label: "Assistant", icon: <MessageSquare size={20} />, color: THEME.secondary, screen: "assistant" },
          ].map(({ label, icon, color, screen: s }) => (
            <button key={label} onClick={() => onNavigate(s)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl transition-all hover:scale-105"
              style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}50` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + "15" }}>
                <span style={{ color }}>{icon}</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: THEME.onSurfaceVariant }}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crop Health Overview */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: THEME.onSurfaceVariant }}>My Crops</h3>
          <button onClick={() => onNavigate("crophealth")} className="text-xs font-semibold" style={{ color: THEME.primary }}>See All â†’</button>
        </div>
        <div className="space-y-3">
          {CROPS.map(crop => (
            <button key={crop.id} onClick={() => onNavigate("crophealth")}
              className="w-full glass-sm rounded-xl p-4 flex items-center gap-4 text-left">
              <span className="text-2xl">{crop.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{crop.name}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ background: crop.health > 80 ? THEME.primaryContainer : THEME.tertiaryContainer,
                      color: crop.health > 80 ? THEME.primary : THEME.tertiary }}>
                    {crop.health}%
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{crop.stage} Â· {farmData?.area || "Area not set"} Â· {crop.sector}</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: THEME.surfaceHighest }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${crop.health}%`, background: crop.health > 80 ? THEME.primary : THEME.tertiary }} />
                </div>
              </div>
              <ChevronRight size={16} style={{ color: THEME.onSurfaceVariant }} />
            </button>
          ))}
        </div>
      </div>

      {/* Market Snapshot */}
      <div className="glass-sm rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold syne text-white">Market Prices Today</h3>
          <button onClick={() => onNavigate("market")} className="text-xs font-semibold" style={{ color: THEME.secondary }}>Full Market â†’</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {MARKET_PRICES.slice(0, 3).map(item => (
            <div key={item.crop} className="rounded-xl p-3 text-center" style={{ background: THEME.surfaceHighest }}>
              <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: THEME.onSurfaceVariant }}>{item.crop}</p>
              <p className="text-sm font-black syne" style={{ color: item.trend === "up" ? THEME.primary : THEME.error }}>
                â‚¹{item.price}
              </p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: item.trend === "up" ? THEME.primary : THEME.error }}>
                {item.trend === "up" ? "â†‘" : "â†“"}{Math.abs(item.change)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ FORECAST SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ForecastScreen({ onNavigate, location, weather }) {
  const [selectedDay, setSelectedDay] = useState(0);
  const selectedForecast = weather.forecast[selectedDay] || weather.forecast[0];
  const WeatherIcon = ({ type, size = 20 }) => {
    const props = { size, style: { color: type === "storm" ? THEME.error : type === "cloud-rain" ? THEME.secondary : THEME.tertiary } };
    if (type === "sun") return <Sun {...props} />;
    if (type === "cloud-sun") return <CloudSun {...props} />;
    if (type === "cloud-rain") return <CloudRain {...props} />;
    if (type === "storm") return <CloudLightning {...props} />;
    return <Cloud {...props} />;
  };

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>Weather Intelligence</p>
        <h1 className="text-3xl font-black syne text-white">7-Day Forecast</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin size={12} style={{ color: THEME.primary }} />
          <span className="text-xs" style={{ color: THEME.onSurfaceVariant }}>
            {location.name || "Fetching location..."} Â· {weather.current.updatedAt ? "Updated just now" : weather.current.source}
          </span>
        </div>
      </div>

      {/* Storm Warning */}
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-4 glow-red"
        style={{ background: "linear-gradient(135deg, rgba(69,10,10,0.7), rgba(127,29,29,0.3))", border: `1px solid ${THEME.error}30` }}>
        <div className="flex items-center gap-3">
          <CloudLightning size={28} style={{ color: THEME.error }} />
          <div>
            <p className="font-bold text-white">Live Weather Active</p>
            <p className="text-xs mt-0.5" style={{ color: THEME.error }}>
              {weather.current.temp == null
                ? "Fetching weather from Open-Meteo..."
                : `${weather.current.condition} Â· ${weather.current.temp}Â°C Â· wind ${weather.current.wind}km/h`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 7-Day Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {weather.forecast.map((day, i) => (
          <button key={day.day} onClick={() => setSelectedDay(i)}
            className="flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl transition-all min-w-[80px]"
            style={{
              background: selectedDay === i ? (day.alert ? "rgba(69,10,10,0.8)" : THEME.primaryContainer) : THEME.surfaceHigh,
              border: `1px solid ${selectedDay === i ? (day.alert ? THEME.error : THEME.primary) : THEME.outline}40`,
              transform: selectedDay === i ? "scale(1.05)" : "scale(1)",
            }}>
            <span className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: day.alert ? THEME.error : THEME.onSurfaceVariant }}>{day.day}</span>
            <WeatherIcon type={day.icon} />
            <div className="text-center">
              <div className="text-sm font-black" style={{ color: day.alert ? THEME.error : "white" }}>{day.high}Â°</div>
              <div className="text-[10px]" style={{ color: THEME.onSurfaceVariant }}>{day.low}Â°</div>
            </div>
            <div className="text-[10px] font-bold" style={{ color: day.rain > 60 ? THEME.error : THEME.secondary }}>{day.rain}%</div>
          </button>
        ))}
      </div>

      {/* Selected Day Detail */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold syne text-white">{selectedForecast.day} Â· Detailed View</h3>
          <WeatherIcon type={selectedForecast.icon} size={28} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Condition", value: selectedForecast.condition, icon: <Cloud size={14} /> },
            { label: "Temperature", value: weather.current.temp == null ? "--" : `${weather.current.temp}Â°C`, icon: <Thermometer size={14} /> },
            { label: "Source", value: weather.current.source || "Open-Meteo", icon: <Radio size={14} /> },
            { label: "Wind", value: weather.current.wind == null ? "--" : `${weather.current.wind} km/h`, icon: <Wind size={14} /> },
          ].map(({ label, value, icon }) => (
            <div key={label} className="rounded-xl p-3" style={{ background: THEME.surfaceHighest }}>
              <div className="flex items-center gap-1.5 mb-1.5" style={{ color: THEME.onSurfaceVariant }}>
                {icon}<span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
              </div>
              <p className="font-bold text-white text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Precipitation Chart */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-bold syne text-white mb-4">Rainfall Forecast (mm)</h3>
        <div className="flex items-end gap-2 h-24">
          {weather.forecast.map((day) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] font-bold" style={{ color: day.alert ? THEME.error : THEME.secondary }}>
                {Math.round(day.rain * 0.4 * 10) / 10}
              </span>
              <div className="w-full rounded-t-lg transition-all" style={{
                height: `${Math.max(4, day.rain * 0.7)}px`,
                background: day.alert ? `linear-gradient(to top, ${THEME.error}, ${THEME.error}88)` :
                  `linear-gradient(to top, ${THEME.secondary}, ${THEME.secondary}44)`,
                boxShadow: day.alert ? `0 0 12px ${THEME.error}60` : "none",
              }} />
              <span className="text-[9px]" style={{ color: THEME.onSurfaceVariant }}>{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Interpretation */}
      <div className="glass rounded-2xl p-5" style={{ border: `1px solid ${THEME.primary}20` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryContainer }}>
            <Brain size={18} style={{ color: THEME.primary }} />
          </div>
          <h3 className="font-bold syne text-white">AI Weather Interpretation</h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>
          {weather.current.wind != null && weather.current.wind > 18
            ? "âš ï¸ Wind is high right now. Delay spraying until calmer conditions."
            : weather.current.temp == null
              ? "Fetching weather guidance for your farm..."
              : "âœ… Live weather is loaded for your location. Use the current temperature and wind before spraying or irrigating."}
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ AI ADVISORY SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AdvisoryScreen({ onNavigate, crops, addNotification }) {
  const [loading, setLoading] = useState(false);
  const [advisories, setAdvisories] = useState([
    {
      id: 1, crop: "Wheat", title: "Harvest Window Closing Fast",
      urgency: "critical", time: "14m ago", expanded: false,
      summary: "Wheat maturity at 94.2%. Storm approaching Thursday â€” harvest by Wednesday evening.",
      detail: "Satellite imagery confirms crop maturity at 94.2% (optimal: 92â€“96%). A high-intensity storm cell is approaching Thursday 2â€“8 AM with projected 45â€“65mm precipitation. Post-storm wet conditions will trigger Fusarium Head Blight within 48hrs, reducing grain quality by 15â€“20%. Immediate action: begin harvesting Monday evening, prioritize blocks A-1 and A-2 first.",
      actions: ["Schedule Harvester", "Mark Complete"],
    },
    {
      id: 2, crop: "Cotton", title: "Aphid Alert â€” Sector B-2",
      urgency: "warning", time: "2h ago", expanded: false,
      summary: "Early aphid colonies detected via drone scan. Spray Imidacloprid 17.8% SL within 48 hours.",
      detail: "Drone multispectral scan at 09:30 AM detected irregular NIR reflectance in 3 patches of Sector B-2, consistent with sap-sucking pest activity. Population density estimated at 180â€“220 aphids per plant (threshold: 200). Recommend: Imidacloprid 17.8% SL @ 150ml/acre + Triazophos 40% EC @ 400ml/acre in 200L water. Apply early morning before 9 AM.",
      actions: ["View Spray Plan", "Log Treatment"],
    },
    {
      id: 3, crop: "Paddy", title: "Ideal Fertilizer Window Tomorrow",
      urgency: "info", time: "4h ago", expanded: false,
      summary: "Wind < 5km/h tomorrow 5â€“9 AM. Apply Urea 46% @ 25kg/acre for tillering stage boost.",
      detail: "IMD forecast confirms wind speed stabilization (2â€“4 km/h) between 05:00â€“09:00 tomorrow. Soil pH: 6.8 (optimal for N uptake). Crop is at maximum tillering stage â€” nitrogen demand is highest. Recommendation: Urea 46% @ 25kg/acre + Zinc Sulphate @ 5kg/acre for micronutrient correction. Light dew forecast improves absorption by 12%.",
      actions: ["Add to Schedule", "Buy Inputs"],
    },
  ]);
  const [generating, setGenerating] = useState(false);

  const toggleExpand = (id) => {
    setAdvisories(prev => prev.map(a => a.id === id ? { ...a, expanded: !a.expanded } : a));
  };

  const generateNewAdvisory = async () => {
    setGenerating(true);
    const response = await callAI([{
      role: "user",
      content: `Generate a new farming advisory for an Indian farmer with:
- Wheat (flowering stage, Sector A)
- Cotton (boll formation, Sector B) 
- Current weather: use the live weather card before making field decisions
- Recent: aphids in cotton detected, soil moisture normal
Give ONE specific new advisory I haven't covered yet. Format as JSON: {title, crop, urgency, summary, detail, actions[2]}`
    }], "You are an expert agronomist for India. Respond ONLY with valid JSON, no markdown.");
    setGenerating(false);
    try {
      const clean = response.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAdvisories(prev => [{
        id: Date.now(), ...parsed, time: "just now", expanded: false
      }, ...prev]);
      addNotification("âœ… New AI advisory generated!", "success");
    } catch {
      addNotification("âš ï¸ Could not parse advisory. Try again.", "error");
    }
  };

  const urgencyStyle = {
    critical: { bg: "rgba(69,10,10,0.6)", border: THEME.error + "40", badge: THEME.error, badgeBg: THEME.errorContainer },
    warning: { bg: "rgba(69,35,0,0.5)", border: THEME.tertiary + "30", badge: THEME.tertiary, badgeBg: THEME.tertiaryContainer },
    info: { bg: "rgba(5,46,22,0.4)", border: THEME.primary + "25", badge: THEME.primary, badgeBg: THEME.primaryContainer },
  };

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>Predictive Intelligence</p>
          <h1 className="text-3xl font-black syne text-white">AI Advisory</h1>
        </div>
        <button onClick={generateNewAdvisory} disabled={generating}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ background: THEME.primaryContainer, color: THEME.primary, border: `1px solid ${THEME.primary}30` }}>
          {generating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
          {generating ? "Generatingâ€¦" : "Generate"}
        </button>
      </div>

      <div className="space-y-4">
        {advisories.map((adv, i) => {
          const style = urgencyStyle[adv.urgency] || urgencyStyle.info;
          return (
            <motion.div key={adv.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: style.bg, border: `1px solid ${style.border}`, backdropFilter: "blur(16px)" }}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{ background: style.badgeBg, color: style.badge }}>
                      {adv.urgency === "critical" ? "ðŸš¨" : adv.urgency === "warning" ? "âš ï¸" : "âœ…"} {adv.urgency}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full"
                      style={{ background: THEME.surfaceHighest, color: THEME.onSurfaceVariant }}>{adv.crop}</span>
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: THEME.onSurfaceVariant }}>{adv.time}</span>
                </div>
                <h3 className="font-bold syne text-white text-base mb-2">{adv.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>{adv.summary}</p>

                <button onClick={() => toggleExpand(adv.id)}
                  className="flex items-center gap-1.5 mt-3 text-xs font-bold"
                  style={{ color: style.badge }}>
                  {adv.expanded ? "Show Less" : "Show Analysis"}
                  {adv.expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                <AnimatePresence>
                  {adv.expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t" style={{ borderColor: THEME.outline + "30" }}>
                        <p className="text-sm leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>{adv.detail}</p>
                        <div className="flex gap-2 mt-4">
                          {adv.actions?.map(action => (
                            <button key={action} onClick={() => addNotification(`âœ… ${action} noted!`, "success")}
                              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                              style={{ background: style.badgeBg, color: style.badge, border: `1px solid ${style.border}` }}>
                              {action}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <button onClick={() => onNavigate("assistant")}
        className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm"
        style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.accent}30`, color: THEME.accent }}>
        <MessageSquare size={16} /> Ask AI Assistant for Custom Advice
      </button>
    </div>
  );
}

// â”€â”€â”€ ALERTS SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AlertsScreen({ onNavigate, alerts, setUnreadAlerts }) {
  const [localAlerts, setLocalAlerts] = useState(alerts);

  const markAllRead = () => {
    setLocalAlerts(prev => prev.map(a => ({ ...a, read: true })));
    setUnreadAlerts(0);
  };

  const typeConfig = {
    critical: { color: THEME.error, bg: "rgba(69,10,10,0.5)", icon: <AlertTriangle size={18} /> },
    warning: { color: THEME.tertiary, bg: "rgba(69,35,0,0.4)", icon: <Zap size={18} /> },
    info: { color: THEME.secondary, bg: "rgba(30,58,95,0.4)", icon: <Info size={18} /> },
    success: { color: THEME.primary, bg: "rgba(5,46,22,0.4)", icon: <CheckCircle size={18} /> },
  };

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>System Intelligence</p>
          <h1 className="text-3xl font-black syne text-white">Alerts</h1>
        </div>
        <button onClick={markAllRead} className="text-xs font-semibold" style={{ color: THEME.primary }}>Mark all read</button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Critical", count: localAlerts.filter(a => a.type === "critical").length, color: THEME.error },
          { label: "Warning", count: localAlerts.filter(a => a.type === "warning").length, color: THEME.tertiary },
          { label: "Info", count: localAlerts.filter(a => a.type === "info").length, color: THEME.secondary },
          { label: "Unread", count: localAlerts.filter(a => !a.read).length, color: THEME.accent },
        ].map(({ label, count, color }) => (
          <div key={label} className="glass-sm rounded-xl p-3 text-center">
            <div className="text-xl font-black syne" style={{ color }}>{count}</div>
            <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {localAlerts.map((alert, i) => {
          const cfg = typeConfig[alert.type] || typeConfig.info;
          return (
            <motion.div key={alert.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setLocalAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, read: true } : a))}
              className="rounded-2xl p-4 cursor-pointer transition-all"
              style={{ background: cfg.bg, border: `1px solid ${cfg.color}25`, opacity: alert.read ? 0.7 : 1 }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.color + "15", color: cfg.color }}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-bold text-white text-sm">{alert.title}</h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!alert.read && <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />}
                      <span className="text-[10px]" style={{ color: THEME.onSurfaceVariant }}>{alert.time}</span>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>{alert.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€â”€ MARKET SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MarketScreen({ onNavigate, prices }) {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [aiInsight, setAiInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  const getInsight = async (crop) => {
    setSelectedCrop(crop);
    setLoadingInsight(true);
    setAiInsight("");
    const resp = await callAI([{
      role: "user",
      content: `Current ${crop.crop} price: ${crop.price} â‚¹/qtl (MSP: ${crop.msp}, change: ${crop.change > 0 ? "+" : ""}${crop.change}). 
Give a 2-sentence market outlook and selling recommendation for an Indian farmer.`
    }]);
    setAiInsight(resp);
    setLoadingInsight(false);
  };

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>Live Market Intelligence</p>
        <h1 className="text-3xl font-black syne text-white">Mandi Prices</h1>
        <p className="text-xs mt-1" style={{ color: THEME.onSurfaceVariant }}>Tap any crop for AI price analysis Â· Updated 15 min ago</p>
      </div>

      {/* MSP Banner */}
      <div className="glass rounded-xl p-4" style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.5), rgba(5,46,22,0.2))", border: `1px solid ${THEME.primary}25` }}>
        <div className="flex items-center gap-3">
          <ShieldCheck size={20} style={{ color: THEME.primary }} />
          <div>
            <p className="text-xs font-bold text-white">Government MSP Protection Active</p>
            <p className="text-[10px] mt-0.5" style={{ color: THEME.onSurfaceVariant }}>All prices at or above Minimum Support Price for Kharif 2025</p>
          </div>
        </div>
      </div>

      {/* Price Cards */}
      <div className="space-y-3">
        {prices.map((item, i) => (
          <motion.button key={item.crop} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }} onClick={() => getInsight(item)} whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl p-4 text-left"
            style={{
              background: selectedCrop?.crop === item.crop ? THEME.surfaceHighest : THEME.surfaceHigh,
              border: `1px solid ${selectedCrop?.crop === item.crop ? THEME.primary + "40" : THEME.outline + "40"}`,
            }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: THEME.surfaceHighest }}>
                {item.crop === "Wheat" ? "ðŸŒ¾" : item.crop === "Cotton" ? "ðŸŒ¿" : item.crop === "Paddy" ? "ðŸŒ±" : item.crop === "Maize" ? "ðŸŒ½" : "ðŸ«˜"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white">{item.crop}</h3>
                    <p className="text-[10px] mt-0.5" style={{ color: THEME.onSurfaceVariant }}>MSP: â‚¹{item.msp}/qtl</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black syne" style={{ color: item.trend === "up" ? THEME.primary : THEME.error }}>
                      â‚¹{item.price.toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs font-bold flex items-center justify-end gap-1"
                      style={{ color: item.trend === "up" ? THEME.primary : THEME.error }}>
                      {item.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.trend === "up" ? "+" : ""}{item.change} {item.unit.split("/")[0]}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: THEME.surfaceHighest }}>
                    <div className="h-full rounded-full" style={{
                      width: `${Math.min(100, (item.price / (item.msp * 1.2)) * 100)}%`,
                      background: item.trend === "up" ? THEME.primary : THEME.error,
                    }} />
                  </div>
                  <span className="text-[9px]" style={{ color: THEME.onSurfaceVariant }}>vs MSP</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* AI Insight Panel */}
      <AnimatePresence>
        {selectedCrop && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="glass rounded-2xl p-5" style={{ border: `1px solid ${THEME.secondary}20` }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: THEME.secondaryContainer }}>
                <Brain size={16} style={{ color: THEME.secondary }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">AI Market Analysis</p>
                <p className="text-[10px]" style={{ color: THEME.onSurfaceVariant }}>{selectedCrop.crop} Â· {selectedCrop.price} â‚¹/qtl</p>
              </div>
            </div>
            {loadingInsight ? (
              <div className="flex items-center gap-2" style={{ color: THEME.onSurfaceVariant }}>
                <Loader2 size={14} className="animate-spin" /><span className="text-sm">Analyzing market dataâ€¦</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>{aiInsight}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearby Mandis */}
      <div>
        <h3 className="text-sm font-bold text-white mb-3 syne">Nearest Mandis</h3>
        <div className="space-y-2">
          {[
            { name: "Nearest Anaj Mandi", dist: "3.2 km", open: true, rating: 4.2 },
            { name: "District Agriculture Market", dist: "18 km", open: true, rating: 4.5 },
            { name: "Regional Grain Market", dist: "45 km", open: false, rating: 4.1 },
          ].map(mandi => (
            <div key={mandi.name} className="glass-sm rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: THEME.surfaceHighest }}>
                <Package size={16} style={{ color: THEME.tertiary }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{mandi.name}</p>
                <p className="text-[10px]" style={{ color: THEME.onSurfaceVariant }}>{mandi.dist} Â· â­ {mandi.rating}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                style={{ background: mandi.open ? THEME.primaryContainer : THEME.surfaceHighest, color: mandi.open ? THEME.primary : THEME.onSurfaceVariant }}>
                {mandi.open ? "Open" : "Closed"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ CROP HEALTH SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CropHealthScreen({ onNavigate, crops, farmData, addNotification }) {
  const [selectedCrop, setSelectedCrop] = useState(crops[0]);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const runAIScan = async () => {
    setScanning(true);
    setScanResult(null);
    await sleep(2000);
    const resp = await callAI([{
      role: "user",
      content: `Simulate an AI crop health scan result for ${selectedCrop.name} at ${selectedCrop.stage} stage 
in India. Return JSON: {healthScore, issues[{name,severity,description,treatment}], ndviValue, 
soilMoisture, nitrogenLevel, recommendation}. Use realistic values.`
    }], "Return ONLY valid JSON, no markdown or extra text.");
    setScanning(false);
    try {
      const clean = resp.replace(/```json|```/g, "").trim();
      setScanResult(JSON.parse(clean));
      addNotification(`âœ… ${selectedCrop.name} scan complete`, "success");
    } catch {
      setScanResult({
        healthScore: selectedCrop.health, issues: [{ name: "Nitrogen Deficiency", severity: "moderate", description: "Yellowing of lower leaves observed in 15% of field area", treatment: "Apply Urea 46% @ 25kg/acre" }],
        ndviValue: 0.62, soilMoisture: 58, nitrogenLevel: 42, recommendation: "Overall crop health is satisfactory. Monitor for continued yellowing and apply nitrogen fertilizer in next 48 hours."
      });
      addNotification(`âœ… ${selectedCrop.name} scan complete`, "success");
    }
  };

  return (
    <div className="px-4 py-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: THEME.onSurfaceVariant }}>Precision Agriculture</p>
        <h1 className="text-3xl font-black syne text-white">Crop Health</h1>
      </div>

      {/* Crop Selector */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {crops.map(crop => (
          <button key={crop.id} onClick={() => { setSelectedCrop(crop); setScanResult(null); }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all"
            style={{
              background: selectedCrop.id === crop.id ? THEME.primaryContainer : THEME.surfaceHigh,
              border: `1px solid ${selectedCrop.id === crop.id ? THEME.primary + "50" : THEME.outline + "40"}`,
              color: selectedCrop.id === crop.id ? THEME.primary : THEME.onSurfaceVariant,
            }}>
            <span className="text-base">{crop.emoji}</span>
            <span className="text-sm font-bold">{crop.name}</span>
          </button>
        ))}
      </div>

      {/* Crop Overview */}
      <div className="glass rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.5), rgba(14,23,18,0.7))" }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-black syne text-white">{selectedCrop.emoji} {selectedCrop.name}</h2>
            <p className="text-sm mt-1" style={{ color: THEME.onSurfaceVariant }}>{selectedCrop.stage} Â· {farmData?.area || "Area not set"} Â· {selectedCrop.sector}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black syne" style={{ color: selectedCrop.health > 80 ? THEME.primary : THEME.tertiary }}>
              {selectedCrop.health}%
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: THEME.onSurfaceVariant }}>Health Score</p>
          </div>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-3" style={{ background: THEME.surfaceHighest }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${selectedCrop.health}%` }} transition={{ duration: 1 }}
            className="h-full rounded-full" style={{
              background: `linear-gradient(90deg, ${selectedCrop.health > 80 ? THEME.primary : THEME.tertiary}, ${selectedCrop.health > 80 ? THEME.primaryDim : "#D97706"})`,
              boxShadow: `0 0 12px ${selectedCrop.health > 80 ? THEME.primary : THEME.tertiary}60`,
            }} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "NDVI", value: "0.62", color: THEME.primary },
            { label: "Soil VWC", value: "58%", color: THEME.secondary },
            { label: "Nitrogen", value: "Moderate", color: THEME.tertiary },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
              <div className="text-sm font-black" style={{ color }}>{value}</div>
              <div className="text-[9px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Scan Button */}
      <button onClick={runAIScan} disabled={scanning}
        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
        style={{ background: scanning ? THEME.surfaceHigh : "linear-gradient(135deg, #052E16, #166534)", color: scanning ? THEME.onSurfaceVariant : THEME.primary, border: `1px solid ${THEME.primary}40` }}>
        {scanning ? <><Loader2 size={18} className="animate-spin" />Running AI Scanâ€¦</> : <><Cpu size={18} />Run AI Crop Health Scan</>}
      </button>

      {/* Scan Results */}
      <AnimatePresence>
        {scanResult && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="glass rounded-2xl p-5" style={{ border: `1px solid ${THEME.primary}25` }}>
              <h3 className="font-bold syne text-white mb-4">ðŸ¤– AI Scan Results</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Health Score", value: `${scanResult.healthScore}%`, color: THEME.primary },
                  { label: "NDVI Index", value: scanResult.ndviValue?.toFixed(2), color: THEME.secondary },
                  { label: "Soil Moisture", value: `${scanResult.soilMoisture}%`, color: THEME.tertiary },
                  { label: "Nitrogen", value: `${scanResult.nitrogenLevel}%`, color: THEME.accent },
                ].map(({ label, value, color }) => (
                  <div key={label} className="rounded-xl p-3" style={{ background: THEME.surfaceHighest }}>
                    <div className="text-lg font-black syne" style={{ color }}>{value}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{label}</div>
                  </div>
                ))}
              </div>
              {scanResult.recommendation && (
                <div className="rounded-xl p-4" style={{ background: THEME.primaryContainer }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: THEME.primary }}>AI Recommendation</p>
                  <p className="text-sm" style={{ color: THEME.onSurfaceVariant }}>{scanResult.recommendation}</p>
                </div>
              )}
            </div>

            {scanResult.issues?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold syne text-white">Issues Detected</h3>
                {scanResult.issues.map((issue, i) => (
                  <div key={i} className="glass-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-white text-sm">{issue.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize"
                        style={{
                          background: issue.severity === "severe" ? THEME.errorContainer : issue.severity === "moderate" ? THEME.tertiaryContainer : THEME.primaryContainer,
                          color: issue.severity === "severe" ? THEME.error : issue.severity === "moderate" ? THEME.tertiary : THEME.primary,
                        }}>{issue.severity}</span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: THEME.onSurfaceVariant }}>{issue.description}</p>
                    <p className="text-xs font-semibold" style={{ color: THEME.primary }}>âœ… {issue.treatment}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// â”€â”€â”€ AI ASSISTANT SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AIAssistantScreen({ onNavigate, farmData, location, weather }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Sat Sri Akal! ðŸ™ I'm your KrishiShield AI assistant. Ask me anything about your crops, weather, pests, soil, irrigation, or market prices. I'm here to help you get the best harvest!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const history = [...messages, userMsg].slice(-10).map(m => ({ role: m.role, content: m.content }));
    const reply = await callAI(history, `You are KrishiShield AI, a friendly agricultural expert for Indian farmers. 
The farmer's details: ${farmData ? `Name: ${farmData.farmerName}, Location: ${location.name || farmData.location}, Crops: ${farmData.crops?.join(", ")}` : `Location: ${location.name}`}.
Current conditions: ${weather.current.temp}Â°C, ${weather.current.condition}, wind ${weather.current.wind} km/h.
Be conversational, concise, and practical. Use simple Hindi words occasionally (like "bhai", "acha", "haan"). 
Add emojis for readability. Max 150 words.`);

    setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    setLoading(false);
  };

  const quickQuestions = [
    "When should I harvest wheat?",
    "How to treat aphids in cotton?",
    "Best time to irrigate paddy?",
    "Today's wheat price near me?",
    "Fungicide for blight disease?",
  ];

  return (
    <div className="flex flex-col max-w-2xl mx-auto" style={{ height: "calc(100vh - 140px)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #052E16, #166534)" }}>
            <Brain size={20} style={{ color: THEME.primary }} />
          </div>
          <div>
            <h1 className="font-black syne text-white text-lg">AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: THEME.primary }} />
              <span className="text-[11px]" style={{ color: THEME.primary }}>Offline AI advice Â· Always available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
        {/* Quick Questions (only at start) */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map(q => (
              <button key={q} onClick={() => sendMessage(q)}
                className="text-xs px-3 py-2 rounded-xl font-medium transition-all"
                style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}50`, color: THEME.onSurfaceVariant }}>
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center mr-2 mt-0.5"
                style={{ background: THEME.primaryContainer }}>
                <Leaf size={14} style={{ color: THEME.primary }} />
              </div>
            )}
            <div className="max-w-[80%] rounded-2xl px-4 py-3"
              style={{
                background: msg.role === "user" ? "linear-gradient(135deg, #052E16, #166534)" : THEME.surfaceHigh,
                border: msg.role === "user" ? `1px solid ${THEME.primary}30` : `1px solid ${THEME.outline}40`,
              }}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap"
                style={{ color: msg.role === "user" ? THEME.primary : THEME.onSurface }}>
                {msg.content}
              </p>
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryContainer }}>
              <Leaf size={14} style={{ color: THEME.primary }} />
            </div>
            <div className="px-4 py-3 rounded-2xl" style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}40` }}>
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full" style={{ background: THEME.primary }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0" style={{ borderTop: `1px solid ${THEME.outline}40` }}>
        <div className="flex items-end gap-2">
          <div className="flex-1 flex items-end gap-2 rounded-2xl px-4 py-3"
            style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}50` }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask about crops, weather, pests, marketâ€¦"
              rows={1} className="flex-1 bg-transparent text-sm resize-none"
              style={{ color: THEME.onSurface, maxHeight: "80px" }} />
            <button onClick={() => setIsListening(!isListening)} className="p-1.5 rounded-lg transition-all"
              style={{ color: isListening ? THEME.error : THEME.onSurfaceVariant }}>
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
          <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: input.trim() && !loading ? "linear-gradient(135deg, #052E16, #166534)" : THEME.surfaceHigh,
              color: input.trim() && !loading ? THEME.primary : THEME.onSurfaceVariant }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ PROFILE SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProfileScreen({ onNavigate, farmData, location }) {
  const stats = [
    { label: "Total Area", value: farmData?.area || "Not set", icon: <Layers size={16} /> },
    { label: "Active Crops", value: String(farmData?.crops?.length || 0), icon: <Leaf size={16} /> },
    { label: "AI Scans", value: "47", icon: <Cpu size={16} /> },
    { label: "Alerts Saved", value: "12", icon: <ShieldCheck size={16} /> },
  ];

  return (
    <div className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
      {/* Profile Header */}
      <div className="glass rounded-2xl p-6 text-center"
        style={{ background: "linear-gradient(135deg, rgba(5,46,22,0.5), rgba(14,23,18,0.7))" }}>
        <div className="w-20 h-20 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black syne"
          style={{ background: "linear-gradient(135deg, #052E16, #166534)", color: THEME.primary, border: `2px solid ${THEME.primary}40` }}>
          {farmData?.farmerName?.[0] || "F"}
        </div>
        <h2 className="text-xl font-black syne text-white">{farmData?.farmerName || "Farmer Ji"}</h2>
        <p className="text-sm mt-1" style={{ color: THEME.onSurfaceVariant }}>{location.name || farmData?.location || "Fetching location..."}</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: THEME.primaryContainer, color: THEME.primary }}>
            âœ… Verified Farmer
          </span>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: THEME.secondaryContainer, color: THEME.secondary }}>
            Pro Plan
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="glass-sm rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.primaryContainer, color: THEME.primary }}>
              {icon}
            </div>
            <div>
              <div className="text-lg font-black syne text-white">{value}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: THEME.onSurfaceVariant }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Settings Menu */}
      <div className="space-y-2">
        {[
          { icon: <User size={18} />, label: "Edit Farm Profile", color: THEME.primary },
          { icon: <Bell size={18} />, label: "Notification Preferences", color: THEME.secondary },
          { icon: <Globe size={18} />, label: "Language: English / à¨ªà©°à¨œà¨¾à¨¬à©€ / à¤¹à¤¿à¤‚à¤¦à¥€", color: THEME.tertiary },
          { icon: <Satellite size={18} />, label: "Connect IoT Sensors", color: THEME.accent },
          { icon: <BookOpen size={18} />, label: "Farming Knowledge Base", color: THEME.onSurfaceVariant },
          { icon: <Phone size={18} />, label: "Kisan Helpline: 1800-180-1551", color: THEME.primary },
          { icon: <Share2 size={18} />, label: "Share App with Other Farmers", color: THEME.secondary },
        ].map(({ icon, label, color }) => (
          <button key={label} className="w-full glass-sm rounded-xl p-4 flex items-center gap-3 text-left transition-all hover:scale-[1.01]">
            <span style={{ color }}>{icon}</span>
            <span className="flex-1 text-sm font-medium text-white">{label}</span>
            <ChevronRight size={16} style={{ color: THEME.onSurfaceVariant }} />
          </button>
        ))}
      </div>

      {/* Onboarding reset */}
      <button onClick={() => onNavigate("onboarding")}
        className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2"
        style={{ background: THEME.errorContainer, color: THEME.error, border: `1px solid ${THEME.error}25` }}>
        <RefreshCw size={16} /> Reset Farm Setup
      </button>

      <div className="text-center pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: THEME.onSurfaceVariant }}>
          KrishiShield AI v2.0 Â· Built with â¤ï¸ for Indian Farmers
        </p>
        <p className="text-[10px] mt-1" style={{ color: THEME.outline }}>
          AI advice runs offline Â· Location by browser GPS Â· Prices by Agmarknet
        </p>
      </div>
    </div>
  );
}

// â”€â”€â”€ ONBOARDING SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function OnboardingScreen({ location, onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ farmerName: "", location: location?.name || "Fetching location...", crops: [], area: "", stage: "Growing" });

  useEffect(() => {
    if (!location?.name || location.name === "Fetching location...") return;
    setData(d => d.location === "Fetching location..." ? { ...d, location: location.name } : d);
  }, [location?.name]);

  const steps = [
    {
      title: "Welcome to\nKrishiShield AI ðŸŒ¾",
      subtitle: "Smart farming powered by artificial intelligence",
      content: (
        <div className="space-y-5">
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-3xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #052E16, #166534)", boxShadow: "0 0 40px rgba(74,222,128,0.3)" }}>
              <Leaf size={48} style={{ color: THEME.primary }} />
            </div>
            <div className="space-y-3">
              {["ðŸ¤– AI-powered crop health scanning", "ðŸŒ¦ï¸ Hyper-local weather forecasting", "ðŸ“ˆ Live mandi price updates", "ðŸš¨ Smart pest & disease alerts"].map(f => (
                <div key={f} className="flex items-center gap-3 glass-sm rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-white">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Tell us about\nyourself ðŸ‘¤",
      subtitle: "Personalize your farming assistant",
      content: (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: THEME.onSurfaceVariant }}>Your Name</label>
            <input value={data.farmerName} onChange={e => setData(d => ({ ...d, farmerName: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium"
              style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}60` }}
              placeholder="e.g. Gurpreet Singh" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: THEME.onSurfaceVariant }}>Location</label>
            <div className="relative">
              <input value={data.location} onChange={e => setData(d => ({ ...d, location: e.target.value }))}
                className="w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium pr-12"
                style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}60` }}
                placeholder="Village / District, State" />
              <MapPin size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: THEME.primary }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest mb-2 block" style={{ color: THEME.onSurfaceVariant }}>Total Farm Area</label>
            <input value={data.area} onChange={e => setData(d => ({ ...d, area: e.target.value }))}
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm font-medium"
              style={{ background: THEME.surfaceHigh, border: `1px solid ${THEME.outline}60` }}
              placeholder="Enter your total farm area" />
          </div>
        </div>
      )
    },
    {
      title: "What crops do\nyou grow? ðŸŒ±",
      subtitle: "Select all that apply",
      content: (
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "wheat", name: "Wheat", emoji: "ðŸŒ¾", season: "Rabi" },
            { id: "cotton", name: "Cotton", emoji: "ðŸŒ¿", season: "Kharif" },
            { id: "paddy", name: "Paddy / Rice", emoji: "ðŸŒ±", season: "Kharif" },
            { id: "maize", name: "Maize", emoji: "ðŸŒ½", season: "Kharif" },
            { id: "soybean", name: "Soybean", emoji: "ðŸ«˜", season: "Kharif" },
            { id: "sugarcane", name: "Sugarcane", emoji: "ðŸŽ‹", season: "Annual" },
          ].map(crop => {
            const selected = data.crops.includes(crop.id);
            return (
              <button key={crop.id} onClick={() => setData(d => ({ ...d, crops: selected ? d.crops.filter(c => c !== crop.id) : [...d.crops, crop.id] }))}
                className="p-4 rounded-2xl text-left transition-all"
                style={{ background: selected ? THEME.primaryContainer : THEME.surfaceHigh, border: `1px solid ${selected ? THEME.primary + "50" : THEME.outline + "40"}` }}>
                <div className="text-2xl mb-2">{crop.emoji}</div>
                <div className="font-bold text-white text-sm">{crop.name}</div>
                <div className="text-[10px] mt-0.5" style={{ color: THEME.onSurfaceVariant }}>{crop.season}</div>
                {selected && <CheckCircle2 size={16} className="mt-2" style={{ color: THEME.primary }} />}
              </button>
            );
          })}
        </div>
      )
    },
    {
      title: "You're all set! ðŸŽ‰",
      subtitle: "Your AI farm assistant is ready",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #052E16, #166534)", boxShadow: "0 0 40px rgba(74,222,128,0.4)" }}>
            <CheckCircle2 size={48} style={{ color: THEME.primary }} />
          </div>
          <div>
            <h3 className="text-xl font-black syne text-white mb-2">Welcome, {data.farmerName || "Farmer Ji"}!</h3>
            <p className="text-sm leading-relaxed" style={{ color: THEME.onSurfaceVariant }}>
              Your farm in {data.location} is now set up. I'll monitor your {data.crops.length} crops 24/7 and alert you to any risks.
            </p>
          </div>
          <div className="space-y-2">
            {["Real-time AI crop monitoring active", "Weather alerts configured for your area", "Market price notifications enabled"].map(item => (
              <div key={item} className="flex items-center gap-3 glass-sm rounded-xl px-4 py-3">
                <CheckCircle size={16} style={{ color: THEME.primary }} />
                <span className="text-sm text-white">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const isLast = step === steps.length - 1;
  const canProceed = step === 0 || step === 2 || (step === 1 && data.farmerName) || isLast;

  return (
    <div className="min-h-screen px-4 py-8 flex flex-col max-w-md mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: i <= step ? THEME.primary : THEME.surfaceHighest }} />
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }} className="space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: THEME.primary }}>
                Step {step + 1} of {steps.length}
              </p>
              <h1 className="text-3xl font-black syne text-white whitespace-pre-line leading-tight mb-2">
                {currentStep.title}
              </h1>
              <p className="text-sm" style={{ color: THEME.onSurfaceVariant }}>{currentStep.subtitle}</p>
            </div>
            {currentStep.content}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)}
            className="px-6 py-4 rounded-2xl font-bold text-sm"
            style={{ background: THEME.surfaceHigh, color: THEME.onSurfaceVariant }}>
            Back
          </button>
        )}
        <button onClick={() => isLast ? onComplete(data) : setStep(s => s + 1)}
          disabled={!canProceed}
          className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
          style={{
            background: canProceed ? "linear-gradient(135deg, #052E16, #166534)" : THEME.surfaceHigh,
            color: canProceed ? THEME.primary : THEME.onSurfaceVariant,
            border: canProceed ? `1px solid ${THEME.primary}40` : `1px solid ${THEME.outline}40`,
            boxShadow: canProceed ? "0 0 30px rgba(74,222,128,0.2)" : "none",
          }}>
          {isLast ? "Start Farming ðŸŒ¾" : "Continue"} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

