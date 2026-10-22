import Link from "next/link";
import { Heart, ArrowUpRight } from "lucide-react";
export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div>
          <Link href="/" className="footer-brand">Teach Me a Lesson<span>.</span></Link>
          <p>Bright ideas for busy UK classrooms, from Year 1 to Year 11.</p>
          <span className="footer-small">A We Are Elixir brand.</span>
        </div>
        <div className="footer-links">
          <Link href="/resources">Teaching resources <ArrowUpRight size={14}/></Link>
          <Link href="/tools">Classroom tools <ArrowUpRight size={14}/></Link>
          <a href="https://weareelixir.co.uk/" target="_blank" rel="noopener noreferrer">We Are Elixir <ArrowUpRight size={14}/></a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} We Are Elixir. Made for UK classrooms.</span>
        <span>Made with <Heart size={13} fill="currentColor" /> a little extra imagination.</span>
      </div>
    </footer>
  );
}
