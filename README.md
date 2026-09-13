# DebugAssist

**AI-Powered Log Analysis for Developers**

> Find Issues. Get Answers. Ship Faster.

DebugAssist helps developers stop manually searching through thousands of log lines. Upload or paste your application logs, and DebugAssist uses AI to identify the important errors, explain the root cause, and give you practical step-by-step fixes.

---

## Features

- **AI Log Analysis** — Sends relevant log excerpts to Google Gemini and receives structured JSON results
- **Secret Redaction** — Automatically masks passwords, API keys, tokens, and JWTs before sending to AI
- **Smart Excerpting** — For large logs, extracts ERROR/WARN/Exception lines with surrounding context instead of sending the entire file
- **File Upload or Paste** — Supports drag-and-drop `.log`/`.txt` files up to 20 MB, or paste directly
- **Professional Log Viewer** — Dark code-editor-style viewer with line numbers, level badges, search, and filter
- **Analysis History** — Every analysis is saved to PostgreSQL and viewable from the History page
- **Issue Cross-Linking** — Clicking an issue in the AI panel highlights the relevant log lines in the viewer

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Lucide React |
| Backend | Java 17, Spring Boot 3.2, Spring Web, Spring Data JPA |
| Database | PostgreSQL |
| AI | Google Gemini (`gemini-2.0-flash`) |
| Build | Maven (backend), npm (frontend) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                        │
│  DashboardPage → AnalyzePage → HistoryPage               │
│  (Vite dev server :5173, proxied to :8080)              │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP / REST
┌────────────────────────▼────────────────────────────────┐
│               Spring Boot Backend (:8080)                │
│                                                          │
│  AnalysisController                                      │
│       │                                                  │
│  LogAnalysisService                                      │
│    ├── LogSanitizationService  (redact secrets)          │
│    ├── LogExcerptService       (smart excerpting)        │
│    └── AiAnalysisService ──► GeminiAiAnalysisService    │
│                                      │                   │
│                               Gemini REST API            │
│                                                          │
│  AnalysisRepository ──► PostgreSQL                       │
└─────────────────────────────────────────────────────────┘
```

---

## AI Integration

The AI layer is intentionally isolated in `com.debugassist.ai`. Swapping providers only requires:
1. Implementing `AiAnalysisService`
2. Annotating it `@Primary`

**Current provider:** Google Gemini (`gemini-2.0-flash`)
- Free tier: 15 requests/minute, 1500 requests/day — plenty for local use
- Temperature: 0.1 (low, for consistent structured output)
- Response: structured JSON parsed directly into `AiAnalysisResult`

The AI prompt instructs Gemini to:
- Only flag meaningful problems (not normal INFO lines)
- Acknowledge uncertainty when log evidence is insufficient
- Understand Spring Boot, Java, PostgreSQL, HTTP, JDBC, Maven, and Linux server errors
- Return ordered issues (CRITICAL first)

---

## Secret Redaction

Before any log content is sent to the AI, `LogSanitizationService` applies regex-based masking:

| Pattern | Example Input | Output |
|---------|--------------|--------|
| Password fields | `password=MySecret123` | `password=[REDACTED]` |
| API keys | `api_key=sk-abc123` | `api_key=[REDACTED]` |
| Bearer tokens | `Authorization: Bearer eyJhb...` | `Authorization: Bearer [REDACTED]` |
| JWT tokens | `eyJhbGciOiJIUzI1Ni...` | `[JWT_REDACTED]` |
| JDBC credentials | `jdbc:postgresql://user:pass@host` | `jdbc:postgresql://[REDACTED]:[REDACTED]@host` |
| AWS keys | `AKIAIOSFODNN7EXAMPLE` | `[AWS_KEY_REDACTED]` |

---

## Project Structure

```
debugassist/
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/debugassist/
│       │   ├── DebugassistApplication.java
│       │   ├── ai/
│       │   │   ├── AiAnalysisService.java        ← interface
│       │   │   ├── AiAnalysisResult.java
│       │   │   └── GeminiAiAnalysisService.java  ← implementation
│       │   ├── config/
│       │   │   ├── AppConfig.java
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   └── AnalysisController.java
│       │   ├── dto/
│       │   │   ├── AnalysisRequestDto.java
│       │   │   ├── AnalysisResponseDto.java
│       │   │   ├── AnalysisSummaryDto.java
│       │   │   └── IssueDto.java
│       │   ├── entity/
│       │   │   ├── Analysis.java
│       │   │   └── Issue.java
│       │   ├── exception/
│       │   │   ├── AnalysisException.java
│       │   │   └── GlobalExceptionHandler.java
│       │   ├── repository/
│       │   │   ├── AnalysisRepository.java
│       │   │   └── IssueRepository.java
│       │   └── service/
│       │       ├── LogAnalysisService.java
│       │       ├── LogExcerptService.java
│       │       └── LogSanitizationService.java
│       └── resources/
│           ├── application.properties
│           └── application.properties.example
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── types/index.ts
│       ├── services/api.ts
│       ├── utils/
│       │   ├── logParser.ts
│       │   ├── severity.ts
│       │   └── sampleLog.ts
│       ├── hooks/
│       ├── components/
│       │   ├── Layout/
│       │   ├── Upload/
│       │   ├── Analysis/
│       │   ├── History/
│       │   ├── Settings/
│       │   └── common/
│       └── pages/
│           ├── DashboardPage.tsx
│           ├── AnalyzePage.tsx
│           ├── HistoryPage.tsx
│           └── SettingsPage.tsx
├── sample.log
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze` | Analyze pasted log content (JSON body) |
| `POST` | `/api/analyze/upload` | Analyze uploaded log file (multipart) |
| `GET` | `/api/analyses` | Get analysis history list |
| `GET` | `/api/analyses/{id}` | Get full analysis by ID |
| `DELETE` | `/api/analyses/{id}` | Delete an analysis |

**Request body for `/api/analyze`:**
```json
{
  "logContent": "2024-09-03 ERROR NullPointerException at UserService.java:89",
  "fileName": "application.log"
}
```

**Response:**
```json
{
  "id": 1,
  "fileName": "application.log",
  "summary": "The application encountered a database authentication failure and a NullPointerException.",
  "totalLines": 80,
  "errorCount": 5,
  "warningCount": 3,
  "analysisTimeMs": 3241,
  "createdAt": "2024-09-03T14:21:45",
  "issues": [
    {
      "id": 1,
      "title": "PostgreSQL Authentication Failure",
      "severity": "CRITICAL",
      "category": "DATABASE",
      "errorMessage": "FATAL: password authentication failed for user \"appuser\"",
      "rootCause": "The Spring Boot application could not authenticate with PostgreSQL. The credentials in application.properties do not match the PostgreSQL user.",
      "confidence": 95,
      "solution": [
        "Check spring.datasource.username in application.properties",
        "Verify spring.datasource.password matches the PostgreSQL user's password",
        "Connect to PostgreSQL and run: ALTER USER appuser WITH PASSWORD 'newpassword';",
        "Restart the Spring Boot application after correcting credentials"
      ],
      "relatedLogLines": [
        "FATAL: password authentication failed for user \"appuser\"",
        "org.postgresql.util.PSQLException: FATAL: password authentication failed"
      ]
    }
  ]
}
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | *(required)* |
| `GEMINI_MODEL` | Gemini model name | `gemini-2.0-flash` |
| `DB_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/debugassist` |
| `DB_USERNAME` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | `postgres` |
| `MAX_LOG_SIZE_MB` | Max log upload size | `20` |
| `MAX_EXCERPT_LINES` | Max lines sent to AI | `300` |

---

# Local Setup Guide

## Prerequisites

- **Java 17+** (JDK, not JRE)
- **Maven 3.8+**
- **Node.js 18+** and npm
- **PostgreSQL 14+**
- **IntelliJ IDEA** (Community or Ultimate) — for the backend
- **VS Code** — for the frontend
- **pgAdmin 4** — for the database

---

## Step 1 — Get a Free Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key — you'll need it shortly

---

## Step 2 — Set Up PostgreSQL with pgAdmin

1. **Install PostgreSQL** from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Remember the superuser password you set during installation
   - Default port: `5432`

2. **Install pgAdmin 4** (bundled with PostgreSQL, or from [https://www.pgadmin.org/download/](https://www.pgadmin.org/download/))

3. **Create the database:**
   - Open pgAdmin 4
   - Expand Servers → PostgreSQL → right-click **Databases** → **Create → Database**
   - Name: `debugassist`
   - Click **Save**

4. That's it — Spring Boot will auto-create the tables (`analyses`, `issues`) on first startup via `spring.jpa.hibernate.ddl-auto=update`

---

## Step 3 — Set Up the Backend in IntelliJ IDEA

1. **Install IntelliJ IDEA** from [https://www.jetbrains.com/idea/download/](https://www.jetbrains.com/idea/download/) (Community edition is free)

2. **Install the Lombok plugin:**
   - File → Settings → Plugins → search "Lombok" → Install → Restart

3. **Open the project:**
   - File → Open → select the `debugassist/backend` folder
   - IntelliJ will detect the `pom.xml` and import as a Maven project

4. **Enable annotation processing:**
   - File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors
   - Check **Enable annotation processing**

5. **Set environment variables:**
   - Open `Run/Debug Configurations` (top-right dropdown → Edit Configurations)
   - Select the `DebugassistApplication` run config
   - Click **Modify options** → **Environment variables**
   - Add:
     ```
     GEMINI_API_KEY=your-actual-api-key-here
     DB_URL=jdbc:postgresql://localhost:5432/debugassist
     DB_USERNAME=postgres
     DB_PASSWORD=your-postgres-password
     ```

6. **Run the application:**
   - Click the green ▶ Run button
   - Look for `Started DebugassistApplication` in the console
   - Backend is now running at `http://localhost:8080`

---

## Step 4 — Set Up the Frontend in VS Code

1. **Install VS Code** from [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Install recommended extensions:**
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript (built-in)

3. **Open the frontend folder:**
   ```bash
   code debugassist/frontend
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```

6. Open `http://localhost:5173` in your browser.

> **Note:** The Vite dev server proxies all `/api` requests to `http://localhost:8080` automatically — no CORS issues during development.

---

## Step 5 — Test It

1. Go to `http://localhost:5173`
2. Click **Sample Log** tab
3. Click **Load Sample Log** → the sample log loads into the paste area
4. Click **Analyze Logs**
5. Watch the analyzing progress screen
6. View the AI analysis results with highlighted issues and step-by-step fixes
7. Check **History** — your analysis is saved in PostgreSQL

---

# Free Deployment Guide

Deploy DebugAssist completely free using **Render** (backend + database) and **Vercel** (frontend).

---

## Deploy Database on Render (Free PostgreSQL)

1. Go to [https://render.com](https://render.com) and create a free account
2. Click **New → PostgreSQL**
3. Settings:
   - Name: `debugassist-db`
   - Region: closest to you
   - Plan: **Free**
4. Click **Create Database**
5. Copy the **Internal Database URL** — you'll use it for the backend

---

## Deploy Backend on Render (Free Web Service)

1. Push your `backend` folder to a GitHub repository
2. On Render: **New → Web Service**
3. Connect your GitHub repo
4. Settings:
   - **Name:** `debugassist-backend`
   - **Root Directory:** `backend`
   - **Runtime:** Java
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/debugassist-backend-0.0.1-SNAPSHOT.jar`
   - **Plan:** Free
5. Add **Environment Variables:**
   ```
   GEMINI_API_KEY=your-api-key
   DB_URL=<Internal Database URL from step above>
   DB_USERNAME=<from Render DB page>
   DB_PASSWORD=<from Render DB page>
   ```
6. Click **Deploy**

> ⚠️ Free Render instances spin down after 15 minutes of inactivity. The first request after inactivity takes ~30 seconds to wake up. This is normal for the free tier.

---

## Deploy Frontend on Vercel (Free)

1. Push your `frontend` folder to a GitHub repository (can be the same repo)
2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub
3. Click **New Project → Import** your repo
4. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add **Environment Variable:**
   ```
   VITE_API_BASE_URL=https://debugassist-backend.onrender.com
   ```
6. Update `src/services/api.ts` — change the baseURL line to:
   ```typescript
   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
   ```
7. Update `vite.config.ts` CORS config to allow your Vercel URL on the backend (update `CorsConfig.java` origins)
8. Click **Deploy**

Your app will be live at `https://your-project.vercel.app` 🎉

---

## Example Log Analysis

Upload `sample.log` (included in this repo) to see DebugAssist in action. It contains:

| Issue | Severity |
|-------|----------|
| PostgreSQL authentication failure (`PSQLException`) | CRITICAL |
| NullPointerException in `UserService.sendWelcomeEmail` | ERROR |
| Payment gateway connection timeout | ERROR |
| SMTP email server unreachable | ERROR |
| HikariCP connection pool exhausted | WARNING |
| Deprecated Spring configuration properties | WARNING |

---

## How Secret Redaction Works

1. User uploads log containing: `spring.datasource.password=MySecretPass123`
2. `LogSanitizationService.sanitize()` runs regex patterns against the content
3. Output sent to AI: `spring.datasource.password=[REDACTED]`
4. AI never sees the actual secret
5. The redacted log is **never stored** — only the AI analysis results go to PostgreSQL

Patterns masked: passwords, API keys, Bearer tokens, Basic auth, JWTs, JDBC credentials with embedded passwords, AWS access keys, private keys, client secrets.

---

## Troubleshooting

**Backend won't start:**
- Check Java 17 is installed: `java -version`
- Check PostgreSQL is running: `pg_isready -h localhost`
- Verify the `debugassist` database exists in pgAdmin

**"AI analysis failed" error:**
- Verify `GEMINI_API_KEY` is set correctly
- Check the key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- Check IntelliJ console for the actual HTTP error

**Frontend shows "Cannot connect to server":**
- Make sure the Spring Boot backend is running on port 8080
- Check `http://localhost:8080/api/analyses` returns `[]` in your browser

**Tables not created:**
- Check `spring.jpa.hibernate.ddl-auto=update` is in `application.properties`
- Look for Hibernate DDL errors in the IntelliJ console
