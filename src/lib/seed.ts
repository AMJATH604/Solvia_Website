// Starter content written to the store on first run. Everything here is editable
// from the admin panel; items marked `published: false` stay hidden until reviewed.

type Seed = Record<string, unknown>;

export const seedSingletons: Record<string, Seed> = {
  settings: {
    companyName: "Solvia Technologies Pvt Ltd",
    brandName: "Solvia",
    tagline: "Technology that gets it solved.",
    accentColor: "#0EA66E",
    logoImage: "",
    email: "hello@solvia.tech",
    phone: "",
    whatsapp: "",
    hours: "Mon – Fri, 9:30 am – 6:30 pm IST",
    address: "",
    mapLink: "",
    linkedin: "",
    x: "",
    github: "",
    instagram: "",
    youtube: "",
    facebook: "",
    seoTitle: "Solvia Technologies — Technology that gets it solved.",
    seoDescription:
      "Solvia Technologies builds custom software, AI automation, cloud platforms and digital products that solve real business problems — from diagnosis to production.",
    ogImage: "",
    announcementEnabled: false,
    announcementText: "We're hiring engineers and designers",
    announcementLink: "/careers",
    footerBlurb:
      "A problem-solving technology company. We diagnose what's slowing you down and build the software that fixes it.",
    footerNote: "Made with care in India.",
  },

  home: {
    heroEyebrow: "Problem-solving technology partner",
    heroTitle: "Technology that gets it",
    heroHighlight: "solved.",
    heroSubtitle:
      "Solvia turns hard business problems into software that works — custom platforms, AI automation and cloud systems, from first diagnosis to production.",
    heroPrimaryLabel: "Start a project",
    heroPrimaryLink: "/contact",
    heroSecondaryLabel: "See how we work",
    heroSecondaryLink: "/work",
    heroTickets: [
      { problem: "Invoices matched by hand, three days every month", solution: "Automated reconciliation in minutes", tag: "Finance" },
      { problem: "Customer data scattered across five tools", solution: "One live dashboard for every team", tag: "Data" },
      { problem: "App slows to a crawl at peak traffic", solution: "Auto-scaling cloud architecture", tag: "Cloud" },
      { problem: "Support team buried in repetitive tickets", solution: "AI assistant resolves the routine ones", tag: "AI" },
    ],
    marqueeTitle: "Engineering with the stack modern teams trust",
    marqueeItems: [
      "React",
      "Next.js",
      "Node.js",
      "TypeScript",
      "Python",
      "Flutter",
      "Kotlin",
      "Swift",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Google Cloud",
      "Azure",
      "Docker",
      "Kubernetes",
      "LLMs & RAG",
    ],
    servicesEyebrow: "What we do",
    servicesTitle: "Everything it takes to get it solved",
    servicesIntro:
      "One accountable team across strategy, design, engineering and support — so nothing falls between the cracks.",
    whyEyebrow: "Why Solvia",
    whyTitle: "Problem-first. Not tech-first.",
    whyIntro:
      "We start with what's actually broken and pick the simplest technology that fixes it for good.",
    whyItems: [
      { icon: "search", title: "We diagnose before we build", text: "Every engagement starts by mapping the real problem, its cost and what 'solved' looks like." },
      { icon: "users", title: "Small senior teams", text: "The people you meet are the people who build. No hand-offs, no juniors learning on your budget." },
      { icon: "eye", title: "Radical transparency", text: "Weekly demos of working software, a shared board and a straight answer when something changes." },
      { icon: "lock", title: "You own everything", text: "Code, designs, data and infrastructure are yours from day one. No lock-in, ever." },
    ],
    statsEnabled: true,
    stats: [
      { value: "24h", label: "Reply to every enquiry" },
      { value: "2 wks", label: "Kickoff to first working demo" },
      { value: "100%", label: "Code & IP ownership to you" },
      { value: "1", label: "Team from discovery to support" },
    ],
    processEyebrow: "How we work",
    processTitle: "From problem to solved in four moves",
    processIntro: "A clear path with working software at every step — and no surprises at the end.",
    processSteps: [
      { title: "Diagnose", text: "Workshops, data and stakeholder interviews to find the root cause and define success.", duration: "Week 1" },
      { title: "Design", text: "Architecture, UX flows and a clickable prototype you can put in front of real users.", duration: "Weeks 2–3" },
      { title: "Build", text: "Short sprints, weekly demos and automated testing — shipping to production early and often.", duration: "Weeks 3–12" },
      { title: "Solve & scale", text: "Launch, measure against the goals we set, then support, optimise and grow the system.", duration: "Ongoing" },
    ],
    workTitle: "Problems we've put to rest",
    workIntro: "A look at how we take a problem apart and ship the fix.",
    industriesTitle: "Solutions for every industry",
    industriesIntro: "Different sectors, same approach: understand the problem, then build what fixes it.",
    testimonialsTitle: "What clients say",
    insightsTitle: "Insights from the team",
    faqTitle: "Questions, answered",
    ctaTitle: "Have a problem worth solving?",
    ctaText:
      "Tell us what's slowing you down. We'll come back within one business day with how we'd approach it — no obligation.",
    ctaPrimaryLabel: "Get in touch",
    ctaPrimaryLink: "/contact",
  },

  about: {
    eyebrow: "Company",
    title: "We exist to get things solved.",
    intro:
      "Solvia Technologies Pvt Ltd is a technology company built around one idea: software should solve a real problem, measurably. We partner with businesses to find what's slowing them down and build the systems that fix it.",
    mission:
      "To turn complex business problems into simple, reliable technology that people actually enjoy using.",
    vision:
      "To be the first call for any organisation with a hard problem — the partner known for getting it solved.",
    storyTitle: "Our story",
    story:
      "Solvia started with a simple frustration: too many technology projects deliver features, not outcomes.\n\nSo we built a company the other way round. Every engagement begins with the problem — what it costs, who it affects and what *solved* looks like. Only then do we choose the technology.\n\nToday we design and engineer custom software, AI automation, cloud platforms and digital products for teams who care about results. The checkmark in our logo is a promise: when we take on a problem, we see it through.",
    valuesTitle: "What we value",
    values: [
      { icon: "target", title: "Outcomes over output", text: "We measure success by the problem solved, not the lines of code written." },
      { icon: "lightbulb", title: "Clarity over complexity", text: "The simplest solution that works is usually the best one." },
      { icon: "handshake", title: "Ownership", text: "We treat your problem as our own and stay until it's solved." },
      { icon: "sparkles", title: "Craft", text: "Well-made software is faster, safer and cheaper to run. We sweat the details." },
    ],
    teamTitle: "The people behind Solvia",
    teamIntro: "A small, senior team of engineers, designers and problem-solvers.",
  },

  pages: {
    servicesEyebrow: "Services",
    servicesTitle: "Capabilities to solve problems end to end",
    servicesIntro:
      "Pick one service or bring us the whole problem. Either way you get a single team that owns the outcome.",
    solutionsEyebrow: "Solutions",
    solutionsTitle: "Built for the problems your industry actually has",
    solutionsIntro:
      "We bring patterns that work across sectors and tailor them to the way your business runs.",
    workEyebrow: "Work",
    workTitle: "Problems in. Solutions out.",
    workIntro: "Selected projects, told the way we work: the problem, our approach and the outcome.",
    insightsEyebrow: "Insights",
    insightsTitle: "Notes on building things that work",
    insightsIntro: "Practical thinking on software, AI and solving problems — from the Solvia team.",
    careersEyebrow: "Careers",
    careersTitle: "Solve problems that matter",
    careersIntro:
      "Join a small, senior team where your work ships, your opinion counts and every project ends with a checkmark.",
    perks: [
      { icon: "rocket", title: "Real ownership", text: "Own problems end to end, not tickets." },
      { icon: "education", title: "Learning budget", text: "Courses, books and conferences on us." },
      { icon: "globe", title: "Hybrid & flexible", text: "Work where you do your best thinking." },
      { icon: "health", title: "Health cover", text: "Medical insurance for you and family." },
    ],
    careersEmpty:
      "No open roles right now — but we're always glad to meet great people. Send your profile to our email and tell us what you'd love to solve.",
    contactEyebrow: "Contact",
    contactTitle: "Let's get it solved.",
    contactIntro:
      "Tell us about the problem. A senior member of the team will reply within one business day.",
    contactServices: [
      "Custom software",
      "Web & mobile app",
      "AI & automation",
      "Cloud & DevOps",
      "Data & analytics",
      "Product design",
      "Not sure yet",
    ],
    contactBudgets: ["Under ₹5 lakh", "₹5 – 15 lakh", "₹15 – 50 lakh", "₹50 lakh +", "Let's discuss"],
    contactSuccess:
      "Thanks — your message is with us. We'll get back to you within one business day.",
  },
};

type SeedItem = Seed & { published?: boolean };

export const seedCollections: Record<string, SeedItem[]> = {
  services: [
    {
      title: "Custom Software Development",
      slug: "custom-software",
      icon: "code",
      featured: true,
      summary:
        "Bespoke platforms, internal tools and integrations engineered around the way your business actually works.",
      body:
        "Off-the-shelf software makes you adapt to it. We build software that adapts to you.\n\nFrom internal tools that remove hours of manual work to customer-facing platforms that scale to millions of requests, we design, build and run systems that are fast, secure and maintainable.\n\n## How we build\n\n- Architecture designed for your scale and budget\n- Clean, tested, documented code\n- CI/CD from day one, so shipping is routine\n- Handover and training so your team can own it",
      capabilities: ["Web platforms", "Internal tools", "APIs & integrations", "ERP & CRM extensions", "Legacy modernisation"],
      technologies: ["TypeScript", "Node.js", "Python", "Java", "PostgreSQL"],
      deliverables: [
        { title: "Architecture blueprint", text: "A clear technical plan before we write code." },
        { title: "Production software", text: "Tested, deployed and monitored." },
        { title: "Documentation & handover", text: "Everything your team needs to own it." },
      ],
    },
    {
      title: "AI & Automation",
      slug: "ai-automation",
      icon: "brain",
      featured: true,
      summary:
        "Put AI to work on real problems — assistants, document processing and workflow automation that pay for themselves.",
      body:
        "AI is only useful when it solves a specific problem. We identify the repetitive, error-prone work in your business and automate it safely.\n\n## Where AI helps most\n\n- **Customer support** — assistants that resolve routine questions and hand off the rest\n- **Documents** — extract, classify and validate data from invoices, forms and contracts\n- **Knowledge** — search and answer questions across your internal documents\n- **Operations** — automate multi-step workflows across your tools\n\nEvery system we ship includes guardrails, evaluation and human review where it matters.",
      capabilities: ["LLM assistants", "Retrieval (RAG)", "Document AI", "Workflow automation", "Predictive models"],
      technologies: ["Python", "LLM APIs", "Vector databases", "n8n", "LangGraph"],
      deliverables: [
        { title: "Opportunity map", text: "Where automation pays off, ranked by impact." },
        { title: "Production AI system", text: "With evaluation, guardrails and monitoring." },
        { title: "ROI tracking", text: "Clear numbers on time and cost saved." },
      ],
    },
    {
      title: "Web & Mobile Apps",
      slug: "web-mobile-apps",
      icon: "smartphone",
      summary: "Fast, beautiful apps for iOS, Android and the web that customers love to use.",
      body:
        "We design and build apps that feel effortless — from consumer products to field-team tools.\n\n- Native and cross-platform (Flutter, React Native)\n- Progressive web apps\n- Offline-first and real-time experiences\n- App store launch and ongoing releases",
      capabilities: ["iOS & Android", "Cross-platform", "Progressive web apps", "Real-time features"],
      technologies: ["Flutter", "React Native", "Swift", "Kotlin", "Next.js"],
      deliverables: [],
    },
    {
      title: "Cloud & DevOps",
      slug: "cloud-devops",
      icon: "cloud",
      summary: "Reliable, secure, cost-efficient infrastructure — migrations, automation and 24/7 readiness.",
      body:
        "Infrastructure should be invisible. We make it that way.\n\n- Cloud migration and modernisation\n- Infrastructure as code\n- CI/CD pipelines\n- Monitoring, alerting and incident readiness\n- Cloud cost optimisation",
      capabilities: ["Cloud migration", "Infrastructure as code", "CI/CD", "Observability", "Cost optimisation"],
      technologies: ["AWS", "Google Cloud", "Azure", "Docker", "Kubernetes", "Terraform"],
      deliverables: [],
    },
    {
      title: "Data & Analytics",
      slug: "data-analytics",
      icon: "chart",
      summary: "Turn scattered data into one source of truth, with dashboards that drive decisions.",
      body:
        "Most businesses have the data they need — it's just in the wrong places. We bring it together.\n\n- Data pipelines and warehousing\n- Business dashboards and reporting\n- Data quality and governance\n- Forecasting and analytics",
      capabilities: ["Data pipelines", "Warehousing", "Dashboards", "Forecasting"],
      technologies: ["BigQuery", "Snowflake", "dbt", "Power BI", "Metabase"],
      deliverables: [],
    },
    {
      title: "Product Design",
      slug: "product-design",
      icon: "palette",
      summary: "Research-led UX and UI design that makes complex things feel simple.",
      body:
        "Great design is how a solution actually gets used.\n\n- User research and journey mapping\n- UX flows and information architecture\n- UI design and design systems\n- Prototyping and usability testing",
      capabilities: ["User research", "UX design", "UI design", "Design systems", "Prototyping"],
      technologies: ["Figma", "Design tokens", "Accessibility (WCAG)"],
      deliverables: [],
    },
  ],

  industries: [
    { title: "Retail & E-commerce", icon: "cart", summary: "Unified commerce, inventory and customer experiences that convert.", problems: ["Stock out of sync across channels", "Slow, clunky checkout", "No single view of the customer"] },
    { title: "Healthcare", icon: "health", summary: "Secure, compliant systems that give clinicians time back.", problems: ["Paper-heavy patient intake", "Disconnected clinic systems", "Appointment no-shows"] },
    { title: "Finance & Fintech", icon: "finance", summary: "Automation and platforms built for accuracy, speed and compliance.", problems: ["Manual reconciliation", "Slow onboarding & KYC", "Reporting that takes days"] },
    { title: "Logistics & Supply Chain", icon: "truck", summary: "Real-time visibility from warehouse to doorstep.", problems: ["No live shipment tracking", "Route planning by spreadsheet", "Paper proof of delivery"] },
    { title: "Education", icon: "education", summary: "Learning platforms and admin tools students and staff enjoy.", problems: ["Fragmented learning tools", "Manual admissions & fees", "Little insight into outcomes"] },
    { title: "Manufacturing", icon: "factory", summary: "Connected operations, quality tracking and predictive maintenance.", problems: ["Unplanned downtime", "Quality issues found too late", "Production data on paper"] },
  ],

  work: [
    {
      title: "From three days to twenty minutes: automated invoice reconciliation",
      slug: "automated-invoice-reconciliation",
      client: "Distribution company",
      industry: "Finance",
      year: "2026",
      featured: true,
      cover: "",
      summary: "A finance team spent three days a month matching invoices by hand. We made it a twenty-minute review.",
      problem:
        "Thousands of supplier invoices arrived every month as PDFs and emails. The finance team matched each one against purchase orders and bank statements by hand — slow, error-prone and impossible to scale.",
      approach:
        "We mapped the full reconciliation workflow with the team, then built a pipeline that extracts invoice data with document AI, matches it against the ERP and bank feeds, and flags only the exceptions for a human to review.",
      outcome:
        "Month-end reconciliation now takes a short review instead of three days, errors are caught before payment, and the finance team spends its time on analysis instead of data entry.",
      metrics: [
        { value: "−90%", label: "Manual effort" },
        { value: "20 min", label: "Monthly review" },
        { value: "0", label: "Missed duplicates" },
      ],
      stack: ["Python", "Document AI", "PostgreSQL", "AWS"],
    },
    {
      title: "One live view of every customer",
      slug: "unified-customer-dashboard",
      client: "Retail brand",
      industry: "Retail",
      year: "2026",
      featured: true,
      cover: "",
      summary: "Customer data lived in five different tools. We unified it into one real-time dashboard.",
      problem:
        "Sales, support and marketing each had their own tools and their own version of the customer. Nobody could answer simple questions like 'what did this customer buy and what did they complain about?'",
      approach:
        "We built data pipelines from each system into a single warehouse, resolved duplicate customer records, and designed a dashboard each team could use without training.",
      outcome:
        "Every team now works from the same customer view, reporting that took a week is live, and marketing campaigns target customers based on real behaviour.",
      metrics: [
        { value: "5 → 1", label: "Sources of truth" },
        { value: "Live", label: "Reporting" },
        { value: "3", label: "Teams aligned" },
      ],
      stack: ["dbt", "BigQuery", "Next.js", "Metabase"],
    },
    {
      title: "An AI assistant that handles the routine questions",
      slug: "ai-support-assistant",
      client: "Services company",
      industry: "AI",
      year: "2026",
      featured: true,
      cover: "",
      summary: "Support was drowning in repetitive tickets. An AI assistant now resolves the routine ones safely.",
      problem:
        "Most incoming tickets asked the same handful of questions, so customers waited hours for simple answers and the support team had no time for complex issues.",
      approach:
        "We built an assistant grounded in the company's own help articles and policies, with clear hand-off to a human for anything sensitive, and an evaluation suite to keep answers accurate.",
      outcome:
        "Customers get instant answers to routine questions around the clock, and the support team focuses on the conversations that need a person.",
      metrics: [
        { value: "24/7", label: "Instant answers" },
        { value: "< 5s", label: "Response time" },
        { value: "100%", label: "Escalation coverage" },
      ],
      stack: ["LLM APIs", "RAG", "Node.js", "Vector DB"],
    },
  ],

  insights: [
    {
      title: "Diagnose before you build: how we scope a problem",
      slug: "diagnose-before-you-build",
      date: "2026-09-01",
      author: "Solvia Team",
      category: "Process",
      cover: "",
      excerpt: "Most failed software projects solved the wrong problem well. Here's the one-week diagnosis we run before writing any code.",
      body:
        "Most failed software projects didn't fail because of bad code. They failed because they solved the wrong problem — beautifully.\n\nThat's why every Solvia engagement starts with a diagnosis.\n\n## 1. Name the problem in one sentence\n\nIf we can't describe the problem in a sentence a new employee would understand, we're not ready to build. \"Our onboarding is slow\" isn't enough. \"New customers wait four days for account approval because three teams review the same documents\" is.\n\n## 2. Put a number on it\n\nHours lost, revenue delayed, customers churned. A number tells us how much the solution is worth — and when we can call it solved.\n\n## 3. Watch the work\n\nWe sit with the people who live with the problem. The real workflow is almost never the one in the process document.\n\n## 4. Define \"solved\"\n\nBefore we choose any technology, we agree on what success looks like and how we'll measure it.\n\n> The best code is the code you don't have to write. Sometimes the diagnosis shows a process change fixes 80% of the problem.\n\nOnly then do we design the solution.",
    },
    {
      title: "Build, buy or automate? A practical framework",
      slug: "build-buy-or-automate",
      date: "2026-08-12",
      author: "Solvia Team",
      category: "Strategy",
      cover: "",
      excerpt: "Custom software isn't always the answer. A simple framework for choosing between building, buying and automating.",
      body:
        "Every week someone asks us to build something that already exists. And every week someone tries to force an off-the-shelf tool onto a problem it wasn't made for.\n\nHere's the framework we use.\n\n## Buy when…\n\n- The problem is common to every business (payroll, email, accounting)\n- It isn't how you compete\n- A good tool exists and fits 80% of your needs\n\n## Automate when…\n\n- You already have the tools, but people copy data between them\n- The work is repetitive, rules-based or document-heavy\n\n## Build when…\n\n- The process is how you win against competitors\n- Off-the-shelf tools force painful workarounds\n- You need to own the data, the roadmap and the experience\n\nMost real solutions are a mix of all three. The skill is knowing which part is which.",
    },
  ],

  careers: [
    {
      title: "Full-Stack Engineer",
      slug: "full-stack-engineer",
      department: "Engineering",
      location: "India · Hybrid",
      type: "Full-time",
      experience: "3+ years",
      applyEmail: "",
      summary: "Build products end to end with TypeScript, React and Node.js — and own the problems they solve.",
      body:
        "## What you'll do\n\n- Design and build web platforms, APIs and internal tools for our clients\n- Take features from idea to production and own them afterwards\n- Work directly with clients to understand the problem\n\n## What we're looking for\n\n- Strong TypeScript, React and Node.js\n- Experience with SQL databases and cloud deployment\n- Clear communication and a bias for shipping\n\n## Nice to have\n\n- Experience with AI/LLM applications\n- Mobile experience (Flutter or React Native)",
    },
    {
      title: "Product Designer",
      slug: "product-designer",
      department: "Design",
      location: "India · Hybrid",
      type: "Full-time",
      experience: "2+ years",
      applyEmail: "",
      summary: "Turn complex workflows into simple, beautiful products — from research to polished UI.",
      body:
        "## What you'll do\n\n- Run user research and turn insights into flows and prototypes\n- Design polished interfaces and maintain our design systems\n- Work side by side with engineers through launch\n\n## What we're looking for\n\n- A portfolio showing problem-solving, not just visuals\n- Strong Figma and prototyping skills\n- Understanding of accessibility and design systems",
    },
  ],

  team: [
    { name: "Your Name", role: "Founder & CEO", photo: "", bio: "Add your team from the admin panel.", linkedin: "", published: false },
  ],

  testimonials: [
    {
      quote: "Add a real client quote here from the admin panel. This section stays hidden until a testimonial is published.",
      name: "Client name",
      role: "Role",
      company: "Company",
      photo: "",
      published: false,
    },
  ],

  faqs: [
    { question: "What kind of problems do you take on?", answer: "Anything where technology can make a measurable difference — slow manual processes, disconnected systems, products that need building or scaling, and places where AI can safely take over repetitive work. If you're not sure, tell us the problem and we'll tell you honestly whether we're the right fit." },
    { question: "How do engagements usually start?", answer: "With a short diagnosis. We learn how the problem shows up in your business, put a number on it and agree what 'solved' looks like. You get a clear plan, timeline and estimate before any build begins." },
    { question: "How long does a typical project take?", answer: "You'll see a working demo within about two weeks of kickoff. Most first releases go live in 6–12 weeks, depending on scope. We ship in small increments so value arrives early." },
    { question: "Who owns the code and IP?", answer: "You do. All code, designs, data and infrastructure belong to you from day one, and we hand over full documentation." },
    { question: "Do you support the software after launch?", answer: "Yes. We offer ongoing support, monitoring and improvement plans, or we can train your team to take it over — whichever suits you." },
  ],
};
