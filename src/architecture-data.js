/**
 * ARCHITECTURE DATA & TOPOLOGY DEFINITIONS
 * Detailed systems architecture specifications, SVG topology diagrams,
 * performance benchmarks, and engineering trade-offs for featured projects.
 */

export const ARCHITECTURE_DATA = {
  insightpulse: {
    id: 'insightpulse',
    title: 'InsightPulse — Review Intelligence Platform',
    category: 'AI / NLP & Distributed Batch Analytics',
    tagline: 'High-throughput customer review ingestion, DistilBERT sentiment classification, and Gemini Map-Reduce batch synthesis.',
    metrics: [
      { label: 'Ingestion Throughput', value: '1,800 reviews/min' },
      { label: 'Classification Latency', value: 'p99 < 42 ms' },
      { label: 'Complaint Detection', value: '94.2% F1-Score' },
      { label: 'Memory Footprint', value: '< 480 MB RAM' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="g-box" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#181822" />
            <stop offset="100%" stop-color="#0f0f15" />
          </linearGradient>
          <linearGradient id="g-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#00f0ff" />
            <stop offset="100%" stop-color="#3b82f6" />
          </linearGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>

        <!-- Connections / Bus Lines -->
        <path d="M 125 105 L 185 105" stroke="#00f0ff" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow)" />
        <path d="M 315 105 L 375 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow)" />
        <path d="M 505 80 L 565 65" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow)" />
        <path d="M 505 130 L 565 145" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow)" />

        <!-- Node 1: Ingestion Sources -->
        <g transform="translate(10, 45)">
          <rect width="115" height="120" rx="10" fill="url(#g-box)" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="57" y="32" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">INGESTION</text>
          <text x="57" y="58" fill="#e4e4e7" font-size="11" text-anchor="middle">Multi-Tenant</text>
          <text x="57" y="74" fill="#a1a1aa" font-size="10" text-anchor="middle">App Store API</text>
          <text x="57" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">CSV / Webhook</text>
          <rect x="22" y="102" width="70" height="16" rx="4" fill="rgba(0,240,255,0.1)"/>
          <text x="57" y="114" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">1,800/min</text>
        </g>

        <!-- Node 2: Message Buffer & Queue -->
        <g transform="translate(185, 45)">
          <rect width="130" height="120" rx="10" fill="url(#g-box)" stroke="rgba(0,240,255,0.3)" stroke-width="1.5"/>
          <text x="65" y="32" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">REDIS STREAMS</text>
          <text x="65" y="58" fill="#e4e4e7" font-size="11" text-anchor="middle">Event Buffer</text>
          <text x="65" y="74" fill="#a1a1aa" font-size="10" text-anchor="middle">Consumer Groups</text>
          <text x="65" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Backpressure Ctr</text>
          <rect x="25" y="102" width="80" height="16" rx="4" fill="rgba(56,189,248,0.1)"/>
          <text x="65" y="114" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">In-Memory</text>
        </g>

        <!-- Node 3: AI Inference Engine -->
        <g transform="translate(375, 35)">
          <rect width="130" height="140" rx="10" fill="url(#g-box)" stroke="#00f0ff" stroke-width="1.5"/>
          <text x="65" y="28" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">AI PIPELINE</text>
          <text x="65" y="52" fill="#ffffff" font-size="11" font-weight="600" text-anchor="middle">DistilBERT Classifier</text>
          <text x="65" y="68" fill="#a1a1aa" font-size="10" text-anchor="middle">p99 &lt; 42ms Latency</text>
          <line x1="15" y1="80" x2="115" y2="80" stroke="rgba(255,255,255,0.08)" />
          <text x="65" y="98" fill="#ffffff" font-size="11" font-weight="600" text-anchor="middle">Gemini Flash Batch</text>
          <text x="65" y="114" fill="#a1a1aa" font-size="10" text-anchor="middle">Map-Reduce Summaries</text>
          <rect x="25" y="122" width="80" height="16" rx="4" fill="rgba(0,240,255,0.15)"/>
          <text x="65" y="134" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">FastAPI Core</text>
        </g>

        <!-- Node 4A: Relational / Analytics DB -->
        <g transform="translate(565, 20)">
          <rect width="180" height="75" rx="8" fill="url(#g-box)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
          <text x="90" y="24" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">POSTGRES / DUCKDB</text>
          <text x="90" y="44" fill="#ffffff" font-size="11" text-anchor="middle">Aggregated Review Telemetry</text>
          <text x="90" y="60" fill="#38bdf8" font-size="10" text-anchor="middle">TF-IDF Vector Grams &amp; Indices</text>
        </g>

        <!-- Node 4B: Frontend Presentation -->
        <g transform="translate(565, 115)">
          <rect width="180" height="75" rx="8" fill="url(#g-box)" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
          <text x="90" y="24" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">STREAMLIT DASHBOARD</text>
          <text x="90" y="44" fill="#ffffff" font-size="11" text-anchor="middle">Real-time Sentiment Visuals</text>
          <text x="90" y="60" fill="#00f0ff" font-size="10" text-anchor="middle">Theme Clustering &amp; Action Hub</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'FastAPI Microservice', role: 'Containerized asynchronous REST endpoints managing client ingestion requests and sentiment workers.' },
      { name: 'Redis Streams Queue', role: 'Buffers review batches to decouple HTTP ingest from GPU/CPU inference workloads.' },
      { name: 'Dual-Stage NLP Engine', role: 'DistilBERT provides sub-50ms local sentiment tagging; Gemini 1.5 Flash generates thematic root-cause summaries.' },
      { name: 'Analytics Data Store', role: 'DuckDB embedded engine performs columnar aggregations over millions of review ratings in sub-10ms.' }
    ],
    tradeoffs: [
      {
        decision: 'Redis Streams vs Apache Kafka',
        rationale: 'Kafka introduces JVM overhead and Zookeeper/KRaft operational complexity. Redis Streams provided the exact consumer group semantics and backpressure needed within a < 30MB Docker footprint.'
      },
      {
        decision: 'Two-Tiered Hybrid Inference (DistilBERT + Gemini)',
        rationale: 'Calling an LLM API for every individual review is economically prohibitive at 100K+ volumes. DistilBERT filters and flags high-priority complaints locally; only complex clusters are routed to Gemini.'
      }
    ]
  },

  telos: {
    id: 'telos',
    title: 'Telos — Journaling & Habit Reflection System',
    category: 'Productivity Platform & Native Android Integration',
    tagline: 'Encrypted cross-platform habit journal with native Android Glance home-screen widgets and offline-first vector synchronization.',
    metrics: [
      { label: 'Widget Sync Latency', value: '< 12 ms' },
      { label: 'Offline Idempotency', value: '99.98%' },
      { label: 'Encryption', value: 'AES-256-GCM' },
      { label: 'Lighthouse Score', value: '98 / 100' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-telos" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>
        <path d="M 140 105 L 210 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-telos)" />
        <path d="M 350 105 L 420 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-telos)" />
        <path d="M 560 105 L 630 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-telos)" />

        <g transform="translate(15, 45)">
          <rect width="125" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.3)" stroke-width="1.5"/>
          <text x="62" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">ANDROID CLIENT</text>
          <text x="62" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Kotlin Jetpack Compose</text>
          <text x="62" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Glance Widgets</text>
          <text x="62" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Encrypted Room DB</text>
          <text x="62" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Offline-First</text>
        </g>

        <g transform="translate(210, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="70" y="30" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">SYNC ENGINE</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">WorkManager</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Exponential Jitter</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">CRDT Vector Clocks</text>
          <text x="70" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Conflict Resolution</text>
        </g>

        <g transform="translate(420, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.4)" stroke-width="1.5"/>
          <text x="70" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">NEXT.JS 14 GATEWAY</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Server Actions</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Edge Middleware</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Tailwind &amp; Framer</text>
          <text x="70" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Web &amp; API Hub</text>
        </g>

        <g transform="translate(630, 45)">
          <rect width="115" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="57" y="30" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">SUPABASE</text>
          <text x="57" y="55" fill="#ffffff" font-size="11" text-anchor="middle">PostgreSQL RLS</text>
          <text x="57" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Encrypted Blobs</text>
          <text x="57" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Auth JWT</text>
          <text x="57" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Zero Knowledge</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'Android Glance Widgets', role: 'Interactive home-screen widgets rendering habit streaks without opening the main application.' },
      { name: 'WorkManager Sync Worker', role: 'Background service handling retries with exponential backoff and network status constraints.' },
      { name: 'Next.js 14 Web Portal', role: 'High-performance web dashboard featuring optimistic updates and SSR for deep reflection entries.' },
      { name: 'Supabase PostgreSQL', role: 'Multi-tenant database governed by Row Level Security (RLS) policies and AES-GCM encrypted payloads.' }
    ],
    tradeoffs: [
      {
        decision: 'Glance Compose vs Traditional RemoteViews',
        rationale: 'Glance provides declarative Kotlin UI state synchronization and removes thousands of lines of fragile XML widget wiring, while maintaining sub-15ms frame redraws.'
      },
      {
        decision: 'Client-Side Encryption vs Server-Side Hashing',
        rationale: 'Personal journal reflections require zero-knowledge privacy. Entries are encrypted on device using user-derived keys before network transit.'
      }
    ]
  },

  advocato: {
    id: 'advocato',
    title: 'Advocato — AI Legal Marketplace & Intake',
    category: 'LegalTech / Multi-Agent Consultation Platform',
    tagline: 'Autonomous AI intake assistant that triages legal cases, matches qualified attorneys, and provisions secure client workspaces.',
    metrics: [
      { label: 'Triage Response', value: '< 1.1 sec' },
      { label: 'Matching Accuracy', value: '91.4%' },
      { label: 'Vector Index', value: 'Qdrant Dense' },
      { label: 'Architecture', value: 'Multi-Agent DAG' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-adv" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>
        <path d="M 130 105 L 195 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-adv)" />
        <path d="M 335 105 L 400 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-adv)" />
        <path d="M 540 105 L 605 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-adv)" />

        <g transform="translate(10, 45)">
          <rect width="120" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="60" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">CLIENT INTAKE</text>
          <text x="60" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Conversational UI</text>
          <text x="60" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Audio &amp; Text Form</text>
          <text x="60" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Next.js Client</text>
          <text x="60" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Real-time</text>
        </g>

        <g transform="translate(195, 35)">
          <rect width="140" height="140" rx="10" fill="#181822" stroke="#00f0ff" stroke-width="1.5"/>
          <text x="70" y="28" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">AGENT SWARM</text>
          <text x="70" y="52" fill="#ffffff" font-size="10" font-weight="600" text-anchor="middle">1. Triage Agent</text>
          <text x="70" y="70" fill="#ffffff" font-size="10" font-weight="600" text-anchor="middle">2. Jurisdiction Matcher</text>
          <text x="70" y="88" fill="#ffffff" font-size="10" font-weight="600" text-anchor="middle">3. Risk Scoring Node</text>
          <line x1="15" y1="98" x2="125" y2="98" stroke="rgba(255,255,255,0.1)" />
          <text x="70" y="115" fill="#a1a1aa" font-size="9" text-anchor="middle">LangChain Orchestrator</text>
          <text x="70" y="130" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">DAG Pipeline</text>
        </g>

        <g transform="translate(400, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.4)" stroke-width="1.5"/>
          <text x="70" y="30" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">VECTOR DB</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Qdrant Hybrid</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Dense Embeddings</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Sparse BM25 Index</text>
          <text x="70" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Legal Taxonomies</text>
        </g>

        <g transform="translate(605, 45)">
          <rect width="145" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="72" y="30" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">WORKSPACE</text>
          <text x="72" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Attorney Portal</text>
          <text x="72" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Encrypted Chat</text>
          <text x="72" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Stripe Escrow</text>
          <text x="72" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Case Resolution</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'Multi-Agent Triage DAG', role: 'Directed acyclic graph coordinating legal classification, urgency assessment, and conflict checks.' },
      { name: 'Qdrant Hybrid Vector Store', role: 'Combines dense neural embeddings with keyword BM25 filtering for precision legal matching.' },
      { name: 'Supabase Row Security', role: 'Guarantees attorney-client privilege isolation between opposing counsel and unverified parties.' }
    ],
    tradeoffs: [
      {
        decision: 'Hybrid Dense + Sparse Search vs Pure Cosine Similarity',
        rationale: 'Legal statutes hinge on exact legal terminology (e.g. "tort", "injunction") that pure semantic embeddings can conflate. Hybrid indexing eliminated false-positive matchings.'
      }
    ]
  },

  vaidyabhavan: {
    id: 'vaidyabhavan',
    title: 'Arogya Theeram — Healthcare ERP System',
    category: 'Healthcare Infrastructure & Double-Entry Accounting',
    tagline: 'Comprehensive hospital management system featuring live doctor queue dispatch, inpatient ward admissions, and GST ledger audits.',
    metrics: [
      { label: 'Patient Admissions', value: '10,000+' },
      { label: 'Queue Dispatch', value: '< 8 ms' },
      { label: 'Ledger Variance', value: '0.00% Error' },
      { label: 'Invoice Generation', value: '110 ms' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-med" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>
        <path d="M 140 105 L 210 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-med)" />
        <path d="M 350 80 L 420 65" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-med)" />
        <path d="M 350 130 L 420 145" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-med)" />
        <path d="M 560 65 L 630 85" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-med)" />
        <path d="M 560 145 L 630 125" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-med)" />

        <g transform="translate(15, 45)">
          <rect width="125" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="62" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">RECEPTION</text>
          <text x="62" y="55" fill="#ffffff" font-size="11" text-anchor="middle">OP Registration</text>
          <text x="62" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">IP Ward Allocation</text>
          <text x="62" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Token Generation</text>
          <text x="62" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">FastAPI Core</text>
        </g>

        <g transform="translate(210, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="#00f0ff" stroke-width="1.5"/>
          <text x="70" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">QUEUE ENGINE</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Live Doctor Dispatch</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Consultation Room</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Prescription Writer</text>
          <text x="70" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">State Machine</text>
        </g>

        <g transform="translate(420, 20)">
          <rect width="140" height="80" rx="8" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
          <text x="70" y="25" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">PHARMACY DISPENSE</text>
          <text x="70" y="46" fill="#ffffff" font-size="10" text-anchor="middle">Batch Expiry Tracking</text>
          <text x="70" y="62" fill="#a1a1aa" font-size="9" text-anchor="middle">Stock Lock Verification</text>
        </g>

        <g transform="translate(420, 115)">
          <rect width="140" height="80" rx="8" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.2"/>
          <text x="70" y="25" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">GST ACCOUNTING</text>
          <text x="70" y="46" fill="#ffffff" font-size="10" text-anchor="middle">Double-Entry Ledger</text>
          <text x="70" y="62" fill="#a1a1aa" font-size="9" text-anchor="middle">Daily Cashbook Balance</text>
        </g>

        <g transform="translate(630, 45)">
          <rect width="115" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.4)" stroke-width="1.5"/>
          <text x="57" y="30" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">DATABASE</text>
          <text x="57" y="55" fill="#ffffff" font-size="11" text-anchor="middle">ACID Relational</text>
          <text x="57" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Serializable Rows</text>
          <text x="57" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Audit Triggers</text>
          <text x="57" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Zero Drift</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'Doctor Queue State Machine', role: 'Real-time patient queue routing with instantaneous room reassignment and token callouts.' },
      { name: 'Pharmacy Stock Decrement Engine', role: 'Atomic batch deductions ensuring expired formulations cannot be billed or double-allocated.' },
      { name: 'GST Compliant Ledger', role: 'Strict double-entry journal balance verifying cashbook receipts against doctor fee splits.' }
    ],
    tradeoffs: [
      {
        decision: 'ACID Serializable Isolation vs Read Committed',
        rationale: 'During peak morning hours, multiple pharmacists dispense from the same medicine stock simultaneously. Serializable isolation prevented negative inventory anomalies.'
      }
    ]
  },

  'personal-ai': {
    id: 'personal-ai',
    title: 'Personal AI Knowledge Assistant',
    category: 'Local Semantic RAG / Privacy-First AI',
    tagline: '100% offline document intelligence platform with FAISS dense vector search and local transformer inference.',
    metrics: [
      { label: 'Query Latency', value: '< 15 ms' },
      { label: 'Data Privacy', value: '100% Offline' },
      { label: 'Vector Count', value: '50,000+ Chunks' },
      { label: 'GPU Memory', value: 'Zero Required' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-rag" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>
        <path d="M 135 105 L 205 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-rag)" />
        <path d="M 345 105 L 415 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-rag)" />
        <path d="M 555 105 L 625 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-rag)" />

        <g transform="translate(15, 45)">
          <rect width="120" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="60" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">INGESTION</text>
          <text x="60" y="55" fill="#ffffff" font-size="11" text-anchor="middle">PDF &amp; Markdown</text>
          <text x="60" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">PyMuPDF Chunker</text>
          <text x="60" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Overlap: 64 tokens</text>
          <text x="60" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Local Disk</text>
        </g>

        <g transform="translate(205, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="#00f0ff" stroke-width="1.5"/>
          <text x="70" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">EMBEDDING</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">MiniLM-L6-v2</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">384-Dim Dense</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">ONNX Quantized</text>
          <text x="70" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">CPU SIMD</text>
        </g>

        <g transform="translate(415, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.4)" stroke-width="1.5"/>
          <text x="70" y="30" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">FAISS INDEX</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">IndexFlatIP</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Exact Cosine Dot</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">&lt; 15ms @ 50K Chunks</text>
          <text x="70" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">In-Memory</text>
        </g>

        <g transform="translate(625, 45)">
          <rect width="120" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="60" y="30" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">SYNTHESIS</text>
          <text x="60" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Local LLM</text>
          <text x="60" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Streamlit Bot UI</text>
          <text x="60" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Context Windowing</text>
          <text x="60" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Air-Gapped</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'PyMuPDF Text Parser', role: 'Chunking pipeline that preserves document markdown headings and table structures.' },
      { name: 'FAISS FlatIP Index', role: 'Exact inner product vector similarity search running in RAM with zero external server dependencies.' },
      { name: 'Streamlit Glassmorphic GUI', role: 'Desktop-grade conversational UI with syntax highlighting and source citation pills.' }
    ],
    tradeoffs: [
      {
        decision: 'FAISS IndexFlatIP vs Approximate IVF-PQ',
        rationale: 'For personal document collections (< 100K chunks), memory is negligible (~150MB). IndexFlatIP delivers 100% mathematical recall without the indexing degradation of vector quantization.'
      }
    ]
  },

  'banking-api': {
    id: 'banking-api',
    title: 'Banking API Concurrency & Load Framework',
    category: 'Financial Infrastructure / Stress Testing',
    tagline: 'High-throughput concurrency validation framework ensuring zero double-spending, idempotent ledger mutations, and rock-solid failover under peak load.',
    metrics: [
      { label: 'Throughput Tested', value: '5,000 req/sec' },
      { label: 'Concurrency Contention', value: '0 Double Spends' },
      { label: 'Ledger Audit Pass', value: '100% Rate' },
      { label: 'Test Suites', value: 'Pytest + Selenium' }
    ],
    svgTopology: `
      <svg viewBox="0 0 760 210" class="arch-svg-diagram" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <marker id="arrow-bank" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#00f0ff"/>
          </marker>
        </defs>
        <path d="M 135 105 L 205 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-bank)" />
        <path d="M 345 105 L 415 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-bank)" />
        <path d="M 555 105 L 625 105" stroke="#00f0ff" stroke-width="2" marker-end="url(#arrow-bank)" />

        <g transform="translate(15, 45)">
          <rect width="120" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="60" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">STRESS HARNESS</text>
          <text x="60" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Asyncio Worker Pool</text>
          <text x="60" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">ThreadPoolExecutor</text>
          <text x="60" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Spike / Soak Waves</text>
          <text x="60" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">5,000 RPS</text>
        </g>

        <g transform="translate(205, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="#00f0ff" stroke-width="1.5"/>
          <text x="70" y="30" fill="#00f0ff" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">IDEMPOTENCY</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">UUID v4 Key Lock</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Distributed Mutex</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Redis Leased Locks</text>
          <text x="70" y="112" fill="#38bdf8" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Sub-Millisecond</text>
        </g>

        <g transform="translate(415, 45)">
          <rect width="140" height="120" rx="10" fill="#181822" stroke="rgba(0,240,255,0.4)" stroke-width="1.5"/>
          <text x="70" y="30" fill="#38bdf8" font-family="'Space Mono', monospace" font-size="11" font-weight="700" text-anchor="middle">BANKING CORE</text>
          <text x="70" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Flask Financial Mock</text>
          <text x="70" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">ACID Transfer Engine</text>
          <text x="70" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">Postgres Serializable</text>
          <text x="70" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Zero Drift</text>
        </g>

        <g transform="translate(625, 45)">
          <rect width="120" height="120" rx="10" fill="#181822" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="60" y="30" fill="#a1a1aa" font-family="'Space Mono', monospace" font-size="10" font-weight="700" text-anchor="middle">REPORTING</text>
          <text x="60" y="55" fill="#ffffff" font-size="11" text-anchor="middle">Pytest + Allure</text>
          <text x="60" y="72" fill="#a1a1aa" font-size="10" text-anchor="middle">Selenium UI E2E</text>
          <text x="60" y="90" fill="#a1a1aa" font-size="10" text-anchor="middle">p99 Latency Curves</text>
          <text x="60" y="112" fill="#00f0ff" font-size="9" font-family="'Space Mono', monospace" text-anchor="middle">Audit Logs</text>
        </g>
      </svg>
    `,
    components: [
      { name: 'Asyncio Burst Generator', role: 'Simulates high-velocity traffic spikes and race conditions against ledger balances.' },
      { name: 'Idempotency Key Validator', role: 'Guarantees repeated network requests with identical keys execute exactly once without double deduction.' },
      { name: 'Audit Trail Verifier', role: 'Validates that total debits equal total credits across all account states under simulated system crash.' }
    ],
    tradeoffs: [
      {
        decision: 'Optimistic Locking with Exponential Backoff vs Pessimistic DB Row Locks',
        rationale: 'Pessimistic row locking on hot accounts led to deadlock cascades under 5,000 RPS. Optimistic version checking with exponential jitter delivered 4.8x higher throughput.'
      }
    ]
  }
};
