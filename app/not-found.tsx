import Link from "next/link";
export default function NotFound(){return <div className="container notfound"><div className="notfound-emoji">✏️</div><h1>Oops, wrong classroom!</h1><p>We couldn’t find that page, but there’s plenty more to explore.</p><Link href="/resources" className="button button-primary">Find a resource →</Link></div>;}
