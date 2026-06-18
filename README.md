# Beyond Evidence

**A Premium Academic & Research Hub for Forensic Science**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/Sanity-Studio-F03E2F?style=flat&logo=sanity)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat&logo=framer)](https://www.framer.com/motion/)

</div>

## Overview

**Beyond Evidence** is a modern, CMS-driven educational platform designed for students, researchers, and professionals in forensic science and criminology. It provides an interactive directory of topics, a comprehensive research guide, and curated tools to help academics find, organize, and publish research.

The platform is built with a focus on premium aesthetics, featuring a "glassmorphic" forensic theme, smooth dynamic animations, and a fully customizable content pipeline powered by Sanity CMS.

## Key Features

- 📚 **Interactive Topics Directory:** A sleek, peer-reviewed hub of forensic protocols, articles, and research modules with real-time search filtering.
- 🔬 **Research Desk:** A step-by-step roadmap and categorized resource hub (Databases, AI Tools, Citation Generators) with fallback icon support and custom Sanity-uploaded logos.
- 📝 **Sanity CMS Integration:** Fully customized singleton schemas for real-time content updates without touching code. Editors can manage texts, links, and imagery directly from the `/studio` route.
- ✨ **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for scroll-triggered staggered animations, glassmorphic cards, and dynamic layout routing.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **CMS:** [Sanity](https://www.sanity.io/) (Embedded Studio)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your machine.

### 1. Clone & Install

```bash
git clone https://github.com/0xsherlocks/beyond-evidence.git
cd beyond-evidence
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root of the project and add your Sanity project details:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

### 3. Run the Development Server

Start the Next.js dev server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Access Sanity Studio

You can manage all the content directly from your local browser. Navigate to:

```text
http://localhost:3000/studio
```

## Project Structure

- `src/app/`: Next.js App Router pages (Home, Topics, Research, Quiz, Contact, Notification).
- `src/components/`: Reusable React components (UI elements, Layout, PageHero).
- `src/sanity/`: Sanity CMS configuration, schemas, queries, and client setup.
