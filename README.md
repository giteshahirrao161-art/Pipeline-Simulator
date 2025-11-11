# Pipeline-Simulator
devops-pipeline-simulator/
│
├── server/                     # Backend (Node.js + Express + MongoDB + WebSockets)
│   ├── src/
│   │   ├── index.js            # Backend entry point
│   │   ├── models/             # MongoDB schemas
│   │   │   ├── Pipeline.js
│   │   │   └── Run.js
│   │   ├── routes/             # REST API routes
│   │   │   ├── pipelines.js
│   │   │   └── runs.js
│   │   └── services/           # CI/CD execution engine
│   │       └── executor.js
│   ├── package.json
│   └── .env                    # Environment variables (MongoDB URI, Port)
│
├── client/                     # Frontend (React + Vite + Tailwind + Framer Motion)
│   ├── src/
│   │   ├── App.jsx             # Routing + layout + sidebar
│   │   ├── main.jsx            # React entry + removes loading skeleton
│   │   ├── styles.css          # Global UI theme + components
│   │   ├── api.js              # API + WebSocket helpers
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Collapsible animated sidebar
│   │   │   ├── PipelineCard.jsx
│   │   │   ├── RunTimeline.jsx
│   │   │   └── ui/
│   │   │       └── Button.jsx  # Reusable button component
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Pipelines.jsx
│   │       └── Runs.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
