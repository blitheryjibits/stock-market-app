## 📈 Stock Market Dashboard

A modern, full‑stack stock market application built with Next.js, TypeScript, and Tailwind CSS — designed to demonstrate production‑grade architecture, clean UI patterns, and real‑world features such as authentication, persistent user data, and scheduled background jobs.

## 🚀 Overview

The Stock Market Dashboard provides a fast, intuitive interface for exploring real‑time stock data, managing a personalized watchlist, and viewing detailed company information. It combines a modern React architecture with server‑side rendering, API route handlers, and background processing to deliver a smooth, scalable experience.

## 🧩 Core Features

### 🔍 Real‑Time Stock Search

- Search and browse stocks with responsive, debounced queries

- Clean UI for price, change, and company metadata

- Built using optimized server components and lightweight client interactions

### ⭐ Watchlist Management

- Add/remove stocks from a personalized watchlist

- Watchlist persists across sessions

- Fully integrated authentication layer

### 👤 User Profiles

- Dedicated profile page with editable name and display name

- Profile data stored and synced through the database

### ⏱️ Scheduled Background Jobs

- Cron job implemented using Inngest

- Daily Cron jobs make calls to AI and send out custom emails

- Custom Welcome email is created and sent on successful sign-up

### 🧠 AI‑Generated Market Insights (Automated Email Digest)

A scheduled background job uses Inngest to trigger a daily workflow that fetches the latest stock‑related news and sends users a personalized email digest.
The system calls an AI API to:

- analyze the most relevant market headlines

- summarize key movements

- generate a custom, human‑readable narrative

- tailor the content to the user’s watchlist

This creates a fully automated “morning briefing” experience, combining real‑time data, AI‑powered summarization, and scheduled serverless execution.

### 🎨 Modern, Responsive UI

Styled with Tailwind CSS for rapid iteration and consistent design

Uses Geist, Vercel’s modern font family, automatically optimized by Next.js

Fully responsive layout across desktop and mobile

## 🛠️ Tech Stack

### Frontend

Next.js (App Router) — server components, layouts, route handlers

React 18 — concurrent rendering, client/server boundaries

Tailwind CSS — utility‑first styling

TypeScript — strict typing across the entire codebase

### Backend

Next.js API Routes — server‑side data fetching and business logic

Inngest — background jobs and scheduled tasks

Database Layer — used for profiles and watchlists

### Tooling & Infrastructure

Vercel — deployment platform

ESLint + Prettier — code quality and formatting

GitHub Actions — CI/CD workflows suggested by GitHub based on stack

## 📂 Project Structure

```Code
├── app
│   ├── (auth)
│   │   ├── layout.tsx
│   │   ├── sign-in
│   │   │   └── page.tsx
│   │   └── sign-up
│   │       └── page.tsx
│   ├── (root)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── stocks
│   │   │   └── [symbol]
│   │   │       └── page.tsx
│   │   └── watchlist
│   │       └── page.tsx
│   ├── api
│   │   └── inngest
│   │       └── route.ts
│   ├── globals.css
│   ├── icon.png
│   └── layout.tsx
├── components
│   ├── forms
│   │   ├── CountrySelectField.tsx
│   │   ├── FooterLink.tsx
│   │   ├── InputField.tsx
│   │   ├── ProfileForm.tsx
│   │   └── SelectField.tsx
│   ├── Header.tsx
│   ├── NavItems.tsx
│   ├── SearchCommand.tsx
│   ├── TradingViewWidget.tsx
│   ├── ui
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   └── sonner.tsx
│   ├── UserDropdown.tsx
│   ├── WatchlistButton.tsx
│   └── WatchlistList.tsx
├── database
│   ├── models
│   │   ├── userProfile.model.ts
│   │   └── watchlist.model.ts
│   └── mongoose.ts
├── hooks
│   ├── useDebounce.ts
│   └── useTradingViewWidget.tsx
├── lib
│   ├── actions
│   │   ├── auth.actions.ts
│   │   ├── finnhub.actions.ts
│   │   ├── profile.actions.ts
│   │   ├── user.actions.ts
│   │   └── watchlist.actions.ts
│   ├── better-auth
│   │   ├── auth.ts
│   │   └── plugins
│   │       └── displayName.ts
│   ├── cloudinary.ts
│   ├── constants.ts
│   ├── inngest
│   │   ├── client.ts
│   │   ├── functions.ts
│   │   └── prompts.ts
│   ├── nodemailer
│   │   ├── index.ts
│   │   └── templates.ts
│   └── utils.ts
├── next-env.d.ts
├── README.md
└── types
    └── global.d.ts
```

---

### 📦 Deployment

This project is optimized for deployment on **Vercel**, the recommended platform for Next.js applications.
See the deployment history in the repo for production previews and updates.

### 📜 License

Released under the **MIT License**.
This license provides flexibility for both personal and commercial use, while maintaining attribution to the original author.

### 🙌 Contributions

Contributions, issues, and feature requests are welcome.
