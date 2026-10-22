import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, ClipboardList, Heart, Lightbulb, PencilLine, Printer, Search, Sparkles, Star, Timer, WandSparkles } from "lucide-react";
import { RESOURCES, STAGES } from "@/lib/resources";

export default function HomePage() {
  return (
    <>
      <section className="hero-shell">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> MADE FOR REAL UK CLASSROOMS <Sparkles size={14}/></div>
            <h1>Great lessons.<br/><span className="hero-marker">Less legwork.</span></h1>
            <p className="hero-lead">Worksheets, clever classroom tools and little sparks of inspiration for teachers who already have enough on their plates.</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/resources">Explore free resources <ArrowRight size={19}/></Link>
              <Link className="button button-outline" href="/tools">Try teacher tools <WandSparkles size={18}/></Link>
            </div>
            <div className="hero-facts">
              <span><CheckCircle2 size={18}/> KS1 to KS4</span><span><CheckCircle2 size={18}/> Made for UK teachers</span><span><CheckCircle2 size={18}/> Print and use</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Teachrex, the Teach Me a Lesson mascot">
            <div className="hero-art-blob" />
            <span className="hero-float float-one"><Star size={18} fill="currentColor"/> Lightbulb moments</span>
            <span className="hero-float float-two"><Heart size={19} fill="currentColor"/> Learning made fun</span>
            <img className="hero-mascot" src="/brand/teachrex.png" alt="Teachrex, our rainbow-haired classroom mascot holding teaching books and a star pointer" width="620" height="620" />
            <span className="hero-star star-one">✦</span><span className="hero-star star-two">✳</span>
          </div>
        </div>
      </section>

      <div className="rainbow-strip" aria-hidden="true"/>
      <section className="section stage-section">
        <div className="container">
          <div className="section-kicker"><Sparkles size={17}/> SOMETHING FOR EVERY STAGE</div>
          <div className="section-header"><div><h2>Find your happy place<br/><em>in the classroom.</em></h2><p>From first phonics and number bonds to secondary maths and GCSE practice.</p></div><Link className="text-link" href="/resources">Browse everything <ArrowUpRight size={18}/></Link></div>
          <div className="stage-grid">
            {STAGES.map((stage,index) => (
              <Link className={"stage-card stage-"+(index+1)} key={stage.id} href={"/resources?stage="+stage.id}>
                <span className="stage-icon">{[<PencilLine key="p" size={25}/>,<BookOpen key="b" size={25}/>,<Lightbulb key="l" size={25}/>,<Star key="s" size={25}/>][index]}</span>
                <span className="stage-id">{stage.id}</span>
                <strong>{stage.label}</strong>
                <span className="stage-years">{stage.years}</span>
                <span className="stage-caption">{stage.caption}</span>
                <span className="stage-arrow"><ArrowUpRight size={18}/></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section resources-section">
        <div className="container">
          <div className="section-kicker"><BookOpen size={17}/> READY WHEN YOU ARE</div>
          <div className="section-header"><div><h2>Less prep. <em>More “aha!”</em></h2><p>Our resource library is being rebuilt. New classroom activities will appear here when ready.</p></div><Link className="text-link" href="/resources">All resources <ArrowUpRight size={18}/></Link></div>
          <div className="empty-state"><h3>New resources coming soon</h3><p>We are preparing a fresh classroom collection.</p></div>
        </div>
      </section>

      <section className="section tools-highlight">
        <div className="container tools-highlight-inner">
          <div className="tools-illustration" aria-hidden="true"><div className="tool-plate"><Timer size={75} strokeWidth={1.8}/><span>05:00</span></div><span className="tools-decoration d1">✳</span><span className="tools-decoration d2">✦</span></div>
          <div className="tools-copy"><div className="section-kicker"><WandSparkles size={17}/> A LITTLE HELP GOES A LONG WAY</div><h2>Make every minute<br/><em>in class count.</em></h2><p>Need a quick timer or a fair way to pick a pupil? Our no-fuss classroom tools are ready for your next lesson.</p><Link className="button button-primary" href="/tools">Open teacher tools <ArrowRight size={19}/></Link></div>
        </div>
      </section>

      <section className="section how-section" id="how-it-works">
        <div className="container">
          <div className="section-kicker"><Heart size={17}/> SIMPLE BY DESIGN</div>
          <div className="section-header"><div><h2>A little easier, <em>every day.</em></h2><p>No complicated setup. Just classroom-ready starting points.</p></div></div>
          <div className="how-grid">
            <div><div className="how-icon purple"><Search size={25}/></div><span className="how-number">01</span><h3>Find it</h3><p>Search by Key Stage or subject to find something useful.</p></div>
            <div><div className="how-icon pink"><ClipboardList size={25}/></div><span className="how-number">02</span><h3>Make it yours</h3><p>Refresh maths questions or add your own spelling words.</p></div>
            <div><div className="how-icon green"><Printer size={25}/></div><span className="how-number">03</span><h3>Teach it</h3><p>Print the worksheet or save it as a PDF from your browser.</p></div>
          </div>
        </div>
      </section>
      <section className="bottom-cta"><div className="container cta-inner"><div><span className="cta-tag">THE BEST LESSONS START HERE</span><h2>Ready to give learning<br/>a little more colour?</h2><p>Your next classroom breakthrough is only a click away.</p></div><Link href="/resources" className="button button-light">Find your next resource <ArrowRight size={20}/></Link></div></section>
    </>
  );
}
