# Teach Me a Lesson

A playful, UK-first teaching resources website for **Key Stages 1–4 (Years 1–11)**, from **We Are Elixir**.

## What works in this first release

- Resource library with search and Key Stage / subject filters
- Eight functioning printable worksheet generators for maths and English
- Spelling sheets using teacher-supplied words
- Question refresh, answer-key toggle and browser print / Save as PDF
- Classroom countdown timer and a random pupil picker (names stay in the browser)
- Responsive homepage, branded with the approved **mascot-free logo** and a **separate Teachrex image**

This first version provides original practice activities; it is **not an exam-board-endorsed or curriculum-certified pack**. Expand and quality-check resources against the relevant English national curriculum / GCSE specifications before representing them as comprehensive.

## Start locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000. Also run `npm run typecheck` and `npm run build`.

## Stack

Next.js App Router, React, TypeScript and CSS. No database or sign-in required for this first phase.

## Brand source of truth

We Are Elixir shared Google Drive, **Teach Me a Lesson** folder. Keep the logo free of the mascot; Teachrex is a separate brand asset. Both supplied image files are included under `public/brand/`.

## Next improvements

Teacher-reviewed resource catalogue, subject and year-specific curriculum tagging, saved teacher collections, accessibility testing, printable PDF layouts, content management and eventual account features. Do not collect pupil information without a clear safeguarding and privacy design.

## Deployment

Connect this repository to a Next.js-capable hosting service such as Vercel. No production deployment or domain mapping is configured by this commit.
