import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
export default function SiteFooter() {
  return <footer className="footer">
    <div className="container footer-main">
      <div><Link href="/" className="footer-brand">Teach Me a Lesson<span>.</span></Link><p>Free teaching resources, games and classroom tools for learners in the UK, from Year 1 to Year 11.</p><span className="footer-small">Teach Me a Lesson by We Are Elixir · Always free to use.</span></div>
      <div className="footer-links">
        <Link href="/resources">Resource library <ArrowUpRight size={14}/></Link>
        <Link href="/resources?type=interactive">Games <ArrowUpRight size={14}/></Link>
        <Link href="/resources?type=printable">Worksheets <ArrowUpRight size={14}/></Link>
        <Link href="/tools">Classroom tools <ArrowUpRight size={14}/></Link>
        <a href="https://weareelixir.co.uk/" target="_blank" rel="noopener noreferrer">We Are Elixir <ArrowUpRight size={14}/></a>
      </div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} We Are Elixir. All rights reserved.</span><span>Made with <Heart size={13} fill="currentColor"/> care for curious minds.</span></div>
  </footer>;
}
