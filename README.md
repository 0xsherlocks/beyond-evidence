# Beyond Evidence

**A Premium LMS & Research Hub for Forensic Science**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Sanity](https://img.shields.io/badge/Sanity-Studio-F03E2F?style=flat&logo=sanity)](https://www.sanity.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer-Motion-0055FF?style=flat&logo=framer)](https://www.framer.com/motion/)

</div>

## Overview

**Beyond Evidence** is a modern, CMS-driven educational platform designed for students, researchers, and professionals in forensic science and criminology. Evolving from a resource directory into a full-scale **Learning Management System (LMS)**, it provides an interactive syllabus, dynamic quizzes, real-time job alerts, and curated tools to help academics excel in their careers.

The platform is built with a focus on premium aesthetics, featuring a "glassmorphic" forensic theme, smooth dynamic animations, and a fully customizable content pipeline powered by Sanity CMS.

## Key Features

- 🎓 **LMS Course Player (Syllabus):** A beautiful, responsive course player supporting native Rich Text. Instructors can craft lesson modules with inline images, custom alignments, blockquotes, and lists directly from Sanity, completely replacing the need for clunky PDF downloads.
- 📝 **Interactive Quiz System:** A dedicated testing center where students can take quizzes across different subjects. Features a comprehensive post-quiz review that highlights correct/incorrect answers and displays detailed instructor explanations.
- 🔔 **Dynamic Notifications & Alerts:** A hybrid notification center that intelligently merges live RSS feeds from top Indian Government Job portals with custom, rich-text "Official Announcements" pushed directly from Sanity Studio.
- 📚 **Study Material & Competitive Exams:** Curated learning tracks for highly sought-after exams like UGC NET JRF, CUET, and DFSS vacancies.
- 🔬 **Research Desk:** A step-by-step roadmap and categorized resource hub (Databases, AI Tools, Citation Generators) with custom Sanity-uploaded logos.
- ✨ **Premium UI/UX:** Built with Tailwind CSS and Framer Motion for scroll-triggered staggered animations, interactive hover states, and dynamic layout routing.

## The Sanity Studio CMS

The content architecture is meticulously organized in the embedded Sanity Studio (`/studio`):

- **Subjects (Syllabus):** Create and manage subjects, upload cover images, and use the Portable Text editor to build out full-length course modules.
- **Quizzes:** Create dedicated quizzes linked to specific subjects. Add multiple-choice questions, set correct answers, and write detailed explanations.
- **Official Announcements (Alerts):** Push "NEW" pulsing alerts to the website. Clicking them opens dedicated landing pages with rich text, external links, and downloadable PDF attachments.
- **Singletons:** Manage Site Settings, Navigation menus, and static pages (Home, About, Research) seamlessly.

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **CMS:** [Sanity](https://www.sanity.io/) (Embedded Studio v3)
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

### Scheduled Notification Sync

Vercel Cron is not required. Configure a cron-job.org job after deploying the app:

- URL: `https://<your-domain>/api/cron/sync-notifications`
- Method: `GET`
- Header: `Authorization: Bearer <CRON_SECRET>`
- Schedule: choose the interval you need, such as every 6 hours

This endpoint syncs the enabled RSS feeds from Sanity and marks old notifications. Each Sanity feed can define its URL, source label, and an optional category override. Use `Automatic` to classify items from their titles, or choose Jobs, Internships, Exams, Scholarships, Workshops, Conferences, or Other. Create a second cron-job.org job for `https://<your-domain>/api/cron/sync-conferences` if you also want EasyChair conferences refreshed. Keep `CRON_SECRET`, `DATABASE_URL`, and the Sanity environment variables configured in Vercel.

## Project Structure

- `src/app/`: Next.js App Router pages (`/syllabus`, `/quiz`, `/notification`, etc.).
- `src/components/`: Reusable React components (UI elements, Layouts, PageHero).
- `src/sanity/`: Sanity CMS configuration, custom Structure Builders, schemas, and GROQ queries.
- `src/lib/`: Utility functions including the dynamic RSS feed fetcher (`fetchRss.ts`).
