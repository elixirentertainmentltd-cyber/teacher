import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock3, Gamepad2, GraduationCap, HeartHandshake, Printer, Search, Sparkles, Timer, WandSparkles } from "lucide-react";
import { RESOURCES, STAGES, resourceHref } from "@/lib/resources";

const features = [
  { title: "Interactive games", description: "Play and practise with learning activities that make things click.", href: "/resources?type=interactive", icon: Gamepad2, tone: "games-tile", action: "Explore games" },
  { title: "Printable resources", description: "Create worksheets, check answers and print for free.", href: "/resources?type=printable", icon: Printer, tone: "print-tile", action: "Find worksheets" },
  { title: "Teacher tools", description: "Simple classroom helpers, including a timer and pupil picker.", href: "/tools", icon: Timer, tone: "tools-tile", action: "Open tools" },
  { title: "SEND & inclusive learning", description: "Browse accessible resource categories as our collection grows.", href: "/resources?subject=Special%20Education", icon: HeartHandshake, tone: "send-tile", action: "Explore support" }
];
const symbols: Record<string,string> = { "clock-adventures": "◷", "number-bonds": "10", "addition-subtraction": "+", "spelling": "Aa", "times-tables": "×", "punctuation": "?!", "fractions": "½", "percentages": "%", "algebra": "x²" };

export default function HomePage() {
  return (
    <>
      <section className="hero-shell refresh-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15}/> FREE LEARNING FOR EVERYONE</div>
            <h1>Learn a little.<br/><span className="hero-marker">Love it a lot.</span></h1>
            <p className="hero-lead">Colourful interactive activities, ready-to-print worksheets and useful classroom tools. Made for UK teachers, families and curious learners from KS1 to GCSE.</p>
            <div className="hero-actions"><Link className="button button-primary" href="/resources">Explore free resources <ArrowRight size={19}/></Link><Link className="button button-outline" href="/tools">Classroom tools <WandSparkles size={18}/></Link></div>
            <div className="hero-facts"><span><CheckCircle2 size={18}/> Always free</span><span><CheckCircle2 size={18}/> No sign-up needed</span><span><CheckCircle2 size={18}/> Play, print and learn</span></div>
          </div>
          <div className="hero-art" aria-label="Teachrex, the Teach Me a Lesson mascot">
            <div className="hero-art-blob"/><span className="hero-float float-one"><Sparkles size={18}/> You've got this!</span><span className="hero-float float-two"><BookOpen size={18}/> Big ideas start small</span>
            <img className="hero-mascot" src="/brand/teachrex.png" alt="Teachrex, the colourful Teach Me a Lesson mascot" width="620" height="620"/>
          </div>
        </div>
      </section>
      <div className="rainbow-strip" aria-hidden="true"/>
      <section className="section quick-find">
        <div className="container">
          <div className="section-kicker"><Search size={17}/> WHERE SHALL WE START?</div>
          <div className="section-header"><div><h2>Everything you need to<br/><em>make learning fun.</em></h2><p>Browse our growing collection of free classroom resources, without subscriptions or locked content.</p></div></div>
          <div className="discovery-grid">{features.map(feature=><Link href={feature.href} key={feature.title} className={"discovery-card "+feature.tone}><span className="discovery-icon"><feature.icon size={27}/></span><h3>{feature.title}</h3><p>{feature.description}</p><span className="discovery-action">{feature.action} <ArrowUpRight size={17}/></span></Link>)}</div>
        </div>
      </section>
      <section className="section stage-section">
        <div className="container"><div className="section-kicker"><GraduationCap size={17}/> LEARN AT YOUR LEVEL</div><div className="section-header"><div><h2>Pick your <em>key stage.</em></h2><p>From early primary learning to GCSE practice, find resources matched to your stage.</p></div><Link className="text-link" href="/resources">Browse every resource <ArrowUpRight size={18}/></Link></div>
          <div className="stage-grid">{STAGES.map((stage,index)=><Link className={"stage-card stage-"+(index+1)} key={stage.id} href={"/resources?stage="+stage.id}><span className="stage-icon"><GraduationCap size={25}/></span><span className="stage-id">{stage.id}</span><strong>{stage.label}</strong><span className="stage-years">{stage.years}</span><span className="stage-caption">{stage.caption}</span><span className="stage-arrow"><ArrowUpRight size={18}/></span></Link>)}</div>
        </div>
      </section>
      <section className="section resources-section">
        <div className="container"><div className="section-kicker"><BookOpen size={17}/> TRY SOMETHING TODAY</div><div className="section-header"><div><h2>Ready to <em>learn?</em></h2><p>Real activities already available. Choose a game to play or a worksheet to customise and print.</p></div><Link className="text-link" href="/resources">See all {RESOURCES.length} resources <ArrowUpRight size={18}/></Link></div>
          <div className="resource-grid">{RESOURCES.slice(0,6).map(item=><Link href={resourceHref(item)} key={item.slug} className={"resource-card accent-"+item.colour}><div className="resource-top"><span className="resource-subject">{item.subject} · {item.category}</span><span className="round-arrow"><ArrowUpRight size={18}/></span></div><div className="resource-doodle" aria-hidden="true">{symbols[item.slug]||"✎"}</div><span className="resource-type">{item.type==="Interactive activity"?"Play online":"Make & print"}</span><h3>{item.title}</h3><p>{item.description}</p><div className="resource-footer"><span>{item.stages.join(" · ")}</span><span>{item.years}</span></div></Link>)}</div>
        </div>
      </section>
      <section className="section tools-highlight"><div className="container tools-highlight-inner"><div className="tools-illustration" aria-hidden="true"><div className="tool-plate"><Clock3 size={72} strokeWidth={1.8}/><span>05:00</span></div><span className="tools-decoration d1">✳</span><span className="tools-decoration d2">✦</span></div><div className="tools-copy"><div className="section-kicker"><WandSparkles size={17}/> MADE FOR BUSY CLASSROOMS</div><h2>Little tools.<br/><em>Big difference.</em></h2><p>Keep activities moving with a classroom countdown and pick a pupil fairly. Just open the tool and go.</p><Link className="button button-primary" href="/tools">Explore teacher tools <ArrowRight size={18}/></Link></div></div></section>
      <section className="section how-section" id="how-it-works"><div className="container"><div className="section-kicker"><CheckCircle2 size={17}/> SIMPLE, FREE AND FRIENDLY</div><div className="section-header"><div><h2>Three steps to <em>get going.</em></h2><p>No accounts, payment details or special software required.</p></div></div><div className="how-grid"><div><div className="how-icon purple"><Search size={25}/></div><span className="how-number">01</span><h3>Find it</h3><p>Search by subject, year, key stage or resource type.</p></div><div><div className="how-icon pink"><Gamepad2 size={25}/></div><span className="how-number">02</span><h3>Play or make</h3><p>Open an interactive activity or customise your own worksheet.</p></div><div><div className="how-icon green"><Printer size={25}/></div><span className="how-number">03</span><h3>Learn anywhere</h3><p>Use it in class, at home or print to save as a PDF.</p></div></div></div></section>
      <section className="bottom-cta"><div className="container cta-inner"><div><span className="cta-tag">FREE FOR EVERY LEARNER</span><h2>Learning is better<br/>when everyone can join in.</h2><p>Explore the library, get inspired and make your next lesson brighter.</p></div><Link href="/resources" className="button button-light">Start exploring <ArrowRight size={19}/></Link></div></section>
    </>
  );
}
