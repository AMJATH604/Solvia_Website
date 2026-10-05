// Illustrated CaseFlow screens, drawn in code so no real client data is ever
// shown. Names, case numbers and figures here are fictional samples.

import {
  Bell,
  Bot,
  Calculator,
  CalendarDays,
  Camera,
  FileText,
  Home,
  MapPin,
  Plus,
  Send,
  Settings,
  Wallet,
} from "lucide-react";

const C = {
  ground: "#0B1020",
  panel: "#141A30",
  edge: "#2A3358",
  text: "#EEF1FA",
  muted: "#9AA3C4",
  amber: "#F59E0B",
  green: "#10B981",
};

export function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto w-[300px] rounded-[46px] border border-white/10 bg-[#05070F] p-[10px] shadow-[0_50px_120px_-40px_rgba(11,16,32,0.75)] ${className}`}
      aria-hidden="true"
    >
      <div className="relative h-[610px] overflow-hidden rounded-[37px]" style={{ background: C.ground, color: C.text }}>
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-5 w-24 rounded-full bg-black" />
          <span className="flex gap-1">
            <span className="h-2.5 w-4 rounded-sm bg-white/80" />
          </span>
        </div>
        <div className="px-4 pt-3">{children}</div>
      </div>
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border p-3 ${className}`} style={{ background: C.panel, borderColor: C.edge }}>
      {children}
    </div>
  );
}

function TabBar() {
  return (
    <div className="absolute inset-x-3 bottom-3 flex items-center justify-around rounded-3xl border py-2.5" style={{ background: C.panel, borderColor: C.edge }}>
      <Home className="size-5 text-[var(--product)]" />
      <CalendarDays className="size-5" style={{ color: C.muted }} />
      <span className="flex size-10 items-center justify-center rounded-full bg-[var(--product)] text-white shadow-[0_0_24px_var(--product)]">
        <Plus className="size-5" />
      </span>
      <FileText className="size-5" style={{ color: C.muted }} />
      <Settings className="size-5" style={{ color: C.muted }} />
    </div>
  );
}

function DashboardScreen() {
  const hearings = [
    { no: "O.S. 214/2025", parties: "Selvam vs Ravi", court: "Court 3", time: "10:30", tag: "Evidence" },
    { no: "C.R.P. 88/2026", parties: "Priya vs Anand", court: "Court 7", time: "11:15", tag: "Arguments" },
    { no: "W.P. 1041/2026", parties: "Kumar vs State", court: "Court 12", time: "2:00", tag: "Admission" },
  ];
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: C.muted }}>
            Good morning
          </p>
          <p className="mt-0.5 text-[17px] font-semibold">Adv. R. Meenakshi</p>
        </div>
        <span className="relative flex size-9 items-center justify-center rounded-xl" style={{ background: C.panel }}>
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full" style={{ background: C.amber }} />
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Card>
          <p className="text-[9px] tracking-wider uppercase" style={{ color: C.muted }}>
            Active cases
          </p>
          <p className="mt-1 text-2xl font-semibold text-[var(--product)]">42</p>
          <p className="text-[10px]" style={{ color: C.green }}>
            ↑ 3 this week
          </p>
        </Card>
        <Card>
          <p className="text-[9px] tracking-wider uppercase" style={{ color: C.muted }}>
            Hearings today
          </p>
          <p className="mt-1 text-2xl font-semibold" style={{ color: C.amber }}>
            3
          </p>
          <p className="text-[10px]" style={{ color: C.muted }}>
            Courts 3, 7, 12
          </p>
        </Card>
      </div>
      <p className="mt-4 mb-2 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: C.muted }}>
        Today&apos;s listing
      </p>
      <div className="space-y-2">
        {hearings.map((h, i) => (
          <Card key={h.no} className={i === 0 ? "border-[var(--product)]!" : ""}>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold">{h.no}</p>
              <p className="text-[10px] text-[var(--product)]">
                {h.court} · {h.time}
              </p>
            </div>
            <p className="mt-0.5 text-[11px]" style={{ color: C.muted }}>
              {h.parties}
            </p>
            <span className="mt-1.5 inline-block rounded-md px-1.5 py-0.5 text-[9px] font-medium" style={{ background: "#1B2240", color: C.muted }}>
              {h.tag}
            </span>
          </Card>
        ))}
      </div>
      <TabBar />
    </>
  );
}

function DiaryScreen() {
  const counts: Record<number, number> = { 2: 2, 3: 4, 6: 1, 8: 3, 9: 5, 10: 2, 14: 3, 15: 1, 16: 6, 20: 2, 22: 3, 23: 1, 27: 4, 29: 2, 30: 3 };
  return (
    <>
      <p className="text-[17px] font-semibold">Court Diary</p>
      <div className="mt-1 flex items-center justify-between text-[11px]" style={{ color: C.muted }}>
        <span>October 2026</span>
        <span className="text-[var(--product)]">Today</span>
      </div>
      <Card className="mt-3">
        <div className="grid grid-cols-7 gap-1 text-center text-[9px]" style={{ color: C.muted }}>
          {"MTWTFSS".split("").map((d, i) => (
            <span key={i}>{d}</span>
          ))}
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <span
              key={d}
              className={`relative flex aspect-square items-center justify-center rounded-lg text-[10px] ${d === 16 ? "bg-[var(--product)] text-white" : ""}`}
              style={d === 16 ? undefined : { color: C.text }}
            >
              {d}
              {counts[d] && (
                <span
                  className="absolute -top-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full text-[7px] font-bold text-white"
                  style={{ background: counts[d] >= 4 ? "#E0625A" : "#334075" }}
                >
                  {counts[d]}
                </span>
              )}
            </span>
          ))}
        </div>
      </Card>
      <p className="mt-4 mb-2 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: C.muted }}>
        Friday 16 · 6 hearings
      </p>
      {["A.S. 57/2024 · Final hearing", "O.P. 312/2026 · Counter due"].map((t) => (
        <Card key={t} className="mb-2">
          <p className="text-[11px]">{t}</p>
        </Card>
      ))}
      <TabBar />
    </>
  );
}

function AiScreen() {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-[var(--product)]">
          <Bot className="size-5 text-white" />
        </span>
        <div>
          <p className="text-[15px] font-semibold">CaseFlow AI</p>
          <p className="text-[10px]" style={{ color: C.green }}>
            ● Grounded in Indian statute
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-3 text-[11.5px] leading-relaxed">
        <div className="ml-10 rounded-2xl rounded-tr-md bg-[var(--product)] p-3 text-white">
          What is the limitation period to recover money lent?
        </div>
        <div className="mr-6 rounded-2xl rounded-tl-md border p-3" style={{ background: C.panel, borderColor: C.edge }}>
          For money lent, <b>Article 19</b> of the Limitation Act, 1963 allows <b>three years</b> from the date the loan is made.
          <span className="mt-2 block text-[10px] text-[var(--product)]">Source · Limitation Act, Schedule, Art. 19</span>
        </div>
        <div className="ml-10 rounded-2xl rounded-tr-md bg-[var(--product)] p-2 text-white">
          <div className="flex items-center gap-2 rounded-xl bg-white/15 p-2">
            <Camera className="size-4" />
            <span className="text-[10.5px]">order_photo.jpg</span>
          </div>
          <p className="mt-1.5 px-1">Summarise this order</p>
        </div>
        <div className="mr-6 rounded-2xl rounded-tl-md border p-3" style={{ background: C.panel, borderColor: C.edge }}>
          Interim stay granted. Respondents to file counter within two weeks; matter listed after vacation.
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-2xl border px-3 py-2.5" style={{ background: C.panel, borderColor: C.edge }}>
        <span className="flex-1 text-[11px]" style={{ color: C.muted }}>
          Ask a legal question…
        </span>
        <span className="flex size-8 items-center justify-center rounded-xl bg-[var(--product)]">
          <Send className="size-4 text-white" />
        </span>
      </div>
    </>
  );
}

function FieldScreen() {
  return (
    <>
      <p className="text-[15px] font-semibold">Site visit 2 of 3</p>
      <p className="text-[10px]" style={{ color: C.muted }}>
        Commission · O.S. 214/2025
      </p>
      <div className="relative mt-3 h-36 overflow-hidden rounded-2xl border" style={{ borderColor: C.edge, background: "#101A33" }}>
        <svg viewBox="0 0 280 144" className="absolute inset-0 h-full w-full opacity-60">
          <path d="M0 100 C60 80 90 120 150 90 S240 60 280 80" stroke="#2A3358" strokeWidth="10" fill="none" />
          <path d="M120 0 L140 144" stroke="#2A3358" strokeWidth="6" />
          <rect x="170" y="20" width="70" height="44" rx="4" fill="none" stroke="var(--product)" strokeDasharray="4 3" />
        </svg>
        <span className="absolute top-[38%] left-[64%] flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--product)] shadow-[0_0_0_6px_rgba(37,99,235,0.25)]">
          <MapPin className="size-4 text-white" />
        </span>
        <span className="absolute bottom-2 left-2 rounded-md bg-black/50 px-1.5 py-0.5 font-mono text-[9px]">11.0168° N, 76.9558° E</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <Card>
          <p className="text-[9px] uppercase" style={{ color: C.muted }}>
            Checked in
          </p>
          <p className="text-[13px] font-semibold" style={{ color: C.green }}>
            10:42 AM
          </p>
        </Card>
        <Card>
          <p className="text-[9px] uppercase" style={{ color: C.muted }}>
            Duration
          </p>
          <p className="text-[13px] font-semibold">1h 18m</p>
        </Card>
      </div>
      <p className="mt-3 mb-2 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: C.muted }}>
        Evidence photos · 6
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {["#22305C", "#1E2A50", "#283869"].map((c, i) => (
          <div key={i} className="relative aspect-square rounded-xl" style={{ background: c }}>
            <Camera className="absolute top-1/2 left-1/2 size-4 -translate-x-1/2 -translate-y-1/2 opacity-40" />
          </div>
        ))}
      </div>
      <Card className="mt-2">
        <p className="font-mono text-[9.5px]" style={{ color: C.muted }}>
          SHA-256 · 9f2c71…b0e41a
        </p>
        <p className="mt-0.5 text-[10px]" style={{ color: C.green }}>
          ✓ Hash verified · GPS attached
        </p>
      </Card>
    </>
  );
}

function CalculatorScreen() {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl" style={{ background: C.panel }}>
          <Calculator className="size-5 text-[var(--product)]" />
        </span>
        <div>
          <p className="text-[15px] font-semibold">Delay Condonation</p>
          <p className="text-[10px]" style={{ color: C.muted }}>
            Section 5, Limitation Act
          </p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {[
          ["Appeal type", "Appeal from decree · 90 days"],
          ["Date of decree", "02 Jun 2026"],
          ["Copy applied / received", "05 Jun → 19 Jun 2026"],
          ["Date of filing", "01 Oct 2026"],
        ].map(([k, v]) => (
          <Card key={k}>
            <p className="text-[9px] uppercase" style={{ color: C.muted }}>
              {k}
            </p>
            <p className="mt-0.5 text-[12px] font-medium">{v}</p>
          </Card>
        ))}
      </div>
      <div className="mt-3 rounded-2xl bg-[var(--product)] p-4 text-white">
        <p className="text-[10px] tracking-wider uppercase opacity-80">Delay to be condoned</p>
        <p className="mt-1 text-[28px] leading-none font-semibold">17 days</p>
        <p className="mt-2 text-[10px] opacity-80">Copy period of 14 days excluded under Section 12</p>
      </div>
    </>
  );
}

function LedgerScreen() {
  const rows = [
    ["Fee installment", "+ ₹40,000", C.green],
    ["Court fee · ePay", "− ₹2,150", "#E0625A"],
    ["Fee installment", "+ ₹50,000", C.green],
  ];
  return (
    <>
      <p className="text-[15px] font-semibold">Financial Ledger</p>
      <p className="text-[10px]" style={{ color: C.muted }}>
        Client · S. Lakshmi
      </p>
      <Card className="mt-3">
        <div className="flex justify-between text-[10px]" style={{ color: C.muted }}>
          <span>Agreed fee</span>
          <span>₹1,50,000</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full" style={{ background: "#1B2240" }}>
          <div className="h-full w-[60%] rounded-full bg-[var(--product)]" />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <p className="text-[9px] uppercase" style={{ color: C.muted }}>
              Received
            </p>
            <p className="text-[15px] font-semibold" style={{ color: C.green }}>
              ₹90,000
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase" style={{ color: C.muted }}>
              Outstanding
            </p>
            <p className="text-[15px] font-semibold" style={{ color: C.amber }}>
              ₹60,000
            </p>
          </div>
        </div>
      </Card>
      <p className="mt-4 mb-2 text-[10px] font-semibold tracking-[0.12em] uppercase" style={{ color: C.muted }}>
        Payment timeline
      </p>
      {rows.map(([t, v, c], i) => (
        <Card key={i} className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2 text-[11px]">
            <Wallet className="size-3.5" style={{ color: C.muted }} />
            {t}
          </span>
          <span className="text-[11px] font-semibold" style={{ color: c }}>
            {v}
          </span>
        </Card>
      ))}
    </>
  );
}

/* ---------- Map visual names to real screenshots ---------- */
const REAL_SHOTS: Record<string, string> = {
  dashboard: "/screenshots/caseflow/dashboard.jpg",
  diary: "/screenshots/caseflow/calendar-tasks.jpg",
  ai: "/screenshots/caseflow/legal-pulse.jpg",
  field: "/screenshots/caseflow/more-hub.jpg",
  calculator: "/screenshots/caseflow/interest-calc.jpg",
  ledger: "/screenshots/caseflow/case-dossier.jpg",
  repository: "/screenshots/caseflow/legal-repository.jpg",
  home: "/screenshots/caseflow/home-actions.jpg",
  login: "/screenshots/caseflow/login.jpg",
  splash: "/screenshots/caseflow/splash.jpg",
};

const SCREENS: Record<string, () => React.ReactNode> = {
  dashboard: DashboardScreen,
  diary: DiaryScreen,
  ai: AiScreen,
  field: FieldScreen,
  calculator: CalculatorScreen,
  ledger: LedgerScreen,
};

export function ProductScreen({ visual = "dashboard", className = "" }: { visual?: string; className?: string }) {
  const realImage = REAL_SHOTS[visual];
  if (realImage) {
    return (
      <div
        className={`relative mx-auto w-[300px] rounded-[46px] border border-white/10 bg-[#05070F] p-[10px] shadow-[0_50px_120px_-40px_rgba(11,16,32,0.75)] ${className}`}
        aria-hidden="true"
      >
        <div className="relative h-[610px] overflow-hidden rounded-[37px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={realImage}
            alt=""
            className="h-full w-full object-cover object-top"
          />
        </div>
      </div>
    );
  }
  const Screen = SCREENS[visual] || DashboardScreen;
  return (
    <Phone className={className}>
      <Screen />
    </Phone>
  );
}
