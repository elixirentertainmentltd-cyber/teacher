import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="free-bar">Free for everyone. No subscriptions, no sign-ups, just learning. <span aria-hidden="true">✦</span></div>
      <div className="container header-inner">
        <Link href="/" className="brand-link" aria-label="Teach Me a Lesson home"><img src="/brand/teach-me-a-lesson-logo.png" alt="Teach Me a Lesson by We Are Elixir" width="240" height="120" /></Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/">Home</Link><Link href="/resources">All resources</Link><Link href="/resources?type=interactive">Games</Link><Link href="/resources?type=printable">Worksheets</Link><Link href="/tools">Teacher tools</Link>
        </nav>
        <Link href="/resources" className="nav-cta"><Sparkles size={17}/> Explore free resources <ArrowUpRight size={17}/></Link>
      </div>
    </header>
  );
}
