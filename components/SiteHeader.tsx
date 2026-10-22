import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label="Teach Me a Lesson home">
          <img src="/brand/teach-me-a-lesson-logo.png" alt="Teach Me a Lesson by We Are Elixir" width="240" height="120" />
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/resources">Resources</Link>
          <Link href="/tools">Teacher tools</Link>
          <Link href="/#how-it-works" className="nav-about">How it works</Link>
        </nav>
        <Link href="/resources" className="nav-cta"><Sparkles size={17} /> Find a resource <ArrowUpRight size={17} /></Link>
      </div>
    </header>
  );
}
