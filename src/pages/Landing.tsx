import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Menu, ShieldCheck, ArrowRight, Download, Check, X,
  Video, AudioWaveform, MessageCircleHeart, Apple, Clock,
  Leaf, MessageCircle, Plus, Mail,
  MessageSquare, User, Send, Heart, Mic, PlayCircle,
  Gamepad2, Brain, Volume2
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pageContainer = "mx-auto w-full max-w-[1120px] px-4 sm:px-5 lg:px-6";
const sectionY = "py-12 sm:py-14 lg:py-16";
const sectionHeader = "mx-auto mb-8 max-w-2xl text-center sm:mb-10";
const sectionTitle = "text-[clamp(1.75rem,3.4vw,2.65rem)] font-extrabold leading-[1.08] tracking-tight text-stone-800";
const sectionLead = "mx-auto max-w-2xl text-[clamp(0.92rem,1.1vw,1rem)] font-medium leading-6 text-stone-500";
const cardRadius = "rounded-[1.5rem]";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="selection:bg-orange-200 selection:text-orange-900 min-h-screen flex flex-col font-sans overflow-x-hidden">
      <div className="orb-1"></div>
      <div className="orb-2"></div>

      {/* Navigation */}
      <nav className="fixed left-0 right-0 z-50 flex flex-col items-center pt-2.5 sm:pt-3">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="glass-nav flex w-[calc(100vw_-_2.5rem)] max-w-[1120px] items-center justify-between rounded-2xl border border-stone-200 px-2.5 py-2.5 shadow-sm min-[360px]:w-[calc(100vw_-_2rem)] sm:px-3.5 md:rounded-full lg:px-4"
        >
          <a className="group flex min-w-0 items-center gap-2.5 select-none sm:gap-3" href="#">
            <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full shadow-sm min-[360px]:h-8 min-[360px]:w-8 sm:h-9 sm:w-9">
              <img src="/images/MumaaAIlogo.png" alt="Mumaa Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex min-w-0 flex-col leading-none">
              <div className="truncate text-[15px] font-black tracking-tight text-stone-800 min-[360px]:text-lg sm:text-xl">AI MUMAA</div>
              <span className="mt-0.5 hidden text-[8px] font-bold uppercase tracking-[0.1em] text-orange-500 min-[360px]:block sm:text-[9px]">A PARENTING COMPANION</span>
            </div>
          </a>

          <div className="hidden items-center gap-4 text-[13px] font-bold text-stone-500 lg:flex xl:gap-6">
            <a className="hover:text-orange-500 transition-colors" href="#hero">Home</a>
            <a className="hover:text-orange-500 transition-colors" href="#features">App Features</a>
            <a className="hover:text-orange-500 transition-colors" href="#toys">Play Family</a>
            <a className="hover:text-orange-500 transition-colors" href="#faq-section">FAQ</a>
            <a className="hover:text-orange-500 transition-colors" href="#contact">Contact</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://mumaa-vc-one.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-3.5 py-2 text-[13px] font-bold text-rose-600 transition-all hover:bg-rose-100 md:flex"
            >
              <Video className="w-4 h-4" /> Live Consult
            </a>
            <Link to="/auth" className="gradient-peach hidden items-center gap-2 rounded-full border border-white px-3.5 py-2 text-[13px] font-bold text-orange-900 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg sm:flex lg:px-4">
              <Sparkles className="w-4 h-4" /> Launch Mumaa
            </Link>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-full p-1.5 text-stone-600 transition-colors hover:bg-stone-100 sm:p-2 lg:hidden">
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </motion.div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 flex w-[calc(100vw_-_2.5rem)] max-w-[1120px] flex-col gap-1.5 rounded-2xl border border-stone-100 bg-white/90 p-2.5 shadow-2xl backdrop-blur-xl min-[360px]:w-[calc(100vw_-_2rem)] sm:gap-2 sm:p-3"
          >
            <a href="#hero" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:px-4 sm:py-3">Home</a>
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:px-4 sm:py-3">App Features</a>
            <a href="#toys" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:px-4 sm:py-3">Play Family</a>
            <a href="#faq-section" onClick={() => setIsMobileMenuOpen(false)} className="block rounded-xl px-3 py-2.5 font-bold text-stone-600 transition-colors hover:bg-orange-50 hover:text-orange-600 sm:px-4 sm:py-3">FAQ</a>
            <div className="mt-2 pt-4 border-t border-stone-100 flex flex-col gap-3">
              <Link to="/auth" className="gradient-peach block rounded-xl px-3 py-2.5 text-center font-bold text-orange-900 shadow-md transition-colors sm:px-4 sm:py-3">Launch Mumaa</Link>
            </div>
          </motion.div>
        )}
      </nav>

      <main className="flex-grow pt-20 lg:pt-24">
        {/* Hero Section */}
        <section id="hero" className="relative max-w-7xl mx-auto px-6 pt-10 pb-24 grid lg:grid-cols-2 gap-12 items-center min-h-[85vh]">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative z-10 order-2 lg:order-1"
          >
            <motion.div variants={fadeIn} className="mb-4 flex flex-wrap gap-2.5 lg:mb-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 shadow-sm">
                <ShieldCheck className="w-4 h-4" />
                100% Private & Safe
              </div>
            </motion.div>

            <motion.h1 variants={fadeIn} className="mb-4 max-w-3xl text-[clamp(2.15rem,4.65vw,3.75rem)] font-extrabold leading-[1.04] tracking-tight text-stone-800">
              Maa sab samajhti hai, <br />
              Par <span className="text-orange-500 inline-block relative">
                Mumaa
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-orange-200" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span> <br /> maa ko samajhti hai.
            </motion.h1>
            <motion.p variants={fadeIn} className="mb-6 max-w-xl text-[clamp(0.92rem,1.25vw,1.02rem)] font-medium leading-6 text-stone-500 sm:mb-7">
              Your calm, AI-powered parenting companion. Get expert guidance, softly translate baby cries, track growth, and explore safe physical learning toys.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col gap-3 sm:flex-row">
              <Link to="/auth" className="gradient-peach flex items-center justify-center gap-2 rounded-full border border-white px-5 py-3 text-[15px] font-bold text-orange-900 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl">
                Enter Workspace <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="MummA_Cry_Analyzer (2).apk" download className="flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white px-5 py-3 text-[15px] font-bold text-stone-600 shadow-sm transition-all hover:-translate-y-1 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600">
                <Download className="w-5 h-5" /> Download App
              </a>
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-1 flex items-center justify-center lg:order-2"
          >
            <div className="absolute h-[84%] w-[84%] rounded-full bg-gradient-to-tr from-orange-200/50 to-rose-200/50 opacity-70 blur-[64px]" />
            <div className="relative flex aspect-square w-full max-w-[min(70vw,390px)] items-center justify-center lg:max-w-[405px] xl:max-w-[420px]">
              <div className="relative h-[90%] w-[90%] overflow-hidden rounded-[2rem] border-[6px] border-white/80 bg-white shadow-2xl backdrop-blur-sm sm:rounded-[2.5rem]">
                <img src="/images/pexels-daniel-reche-718241-1556706.jpg" alt="Mother and Child" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-orange-900/5 mix-blend-overlay pointer-events-none"></div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-5 flex items-center gap-2.5 rounded-2xl border border-white bg-white/90 p-2.5 shadow-xl backdrop-blur sm:-right-2 lg:-right-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-500 shadow-inner">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">AI Insight</div>
                  <div className="text-[13px] font-bold text-stone-800">Baby is sleepy</div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 left-0 flex items-center gap-2.5 rounded-2xl border border-white bg-white/90 p-2.5 shadow-xl backdrop-blur sm:-left-2 lg:-left-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500 shadow-inner">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Routine</div>
                  <div className="text-[13px] font-bold text-stone-800">Feeding Logged</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Trust & Research Insights */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="trust" 
          className="max-w-7xl mx-auto px-6 py-20"
        >
          <motion.div variants={fadeIn} className={sectionHeader}>
            <h2 className={`${sectionTitle} mb-4`}>Backed by Science. <br /><span className="text-emerald-500">Driven by Empathy.</span></h2>
            <p className={sectionLead}>We analyzed thousands of parenting journeys to build an AI that actually reduces stress, rather than adding to it.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-5">
            {[
              { num: '78%', title: 'Less Midnight Anxiety', desc: 'Mothers using MUMAA report significantly less panic during late-night crying, thanks to instant, calming AI translations.', color: 'text-emerald-400' },
              { num: '100K+', title: 'Cry Patterns Analyzed', desc: 'Our acoustic AI models are trained on vast pediatric datasets to accurately and gently distinguish hunger, pain, and sleepiness.', color: 'text-sky-400' },
              { num: '100%', title: 'Camera-Free Privacy', desc: 'We strictly avoid intrusive video monitoring. All vision and audio checks are processed securely, on demand, with your permission.', color: 'text-rose-400' }
            ].map((stat, idx) => (
              <motion.div
                variants={fadeIn}
                key={idx} 
                className="bg-white/80 backdrop-blur rounded-[2.5rem] p-10 border border-white shadow-xl hover:shadow-2xl transition-shadow text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className={`text-[clamp(2.2rem,4.2vw,3.05rem)] font-black ${stat.color} mb-3 tracking-tight drop-shadow-sm`}>{stat.num}</div>
                <h3 className="relative z-10 mb-2.5 text-base font-extrabold text-stone-800">{stat.title}</h3>
                <p className="relative z-10 text-sm font-medium leading-6 text-stone-500">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Testimonials */}
        {/* <section className="py-20 overflow-hidden border-y border-stone-200/50 bg-stone-50/50 relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-stone-50/80 via-transparent to-stone-50/80 z-10 pointer-events-none"></div>
            <div className="text-center mb-12 relative z-20">
                <h2 className="text-3xl font-extrabold text-stone-800">Loved by Mothers Everywhere</h2>
            </div>
            <div className="flex w-max gap-8 animate-marquee hover:[animation-play-state:paused] relative z-0">
                {[1, 2, 3, 4, 1, 2].map((_, index) => (
                    <div key={index} className="w-[380px] bg-white border border-white p-8 rounded-[2rem] shadow-lg flex-shrink-0">
                        <div className="flex text-yellow-400 mb-5 gap-1">
                            <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                        </div>
                        <p className="text-stone-600 text-[15px] font-medium italic mb-6 leading-relaxed">"The Cry Translator is absolute magic. It correctly identified that my 2-month old was overtired when I thought he was hungry. Saved me so many tears!"</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                            <h4 className="text-stone-800 font-bold text-sm">Priya Sharma <br/><span className="text-stone-400 font-medium text-xs uppercase tracking-wider">Mumbai</span></h4>
                        </div>
                    </div>
                ))}
            </div>
        </section> */}

        {/* App Features */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="features" 
          className="py-24 relative"
        >
          <div className={pageContainer}>
            <motion.div variants={fadeIn} className={sectionHeader}>
              <h2 className={`${sectionTitle} mb-4`}>A Full <span className="text-indigo-500">Village of Support</span></h2>
              <p className={sectionLead}>Everything you need in one calm, beautifully organized app.</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {[
                {
                  title: 'Video Consults', badge: 'Expert Led', badgeClass: 'text-teal-600 bg-teal-50 border-teal-100', color: 'teal', icon: Video, desc: 'Live expert nannies for real-time video triage, sleep and feeding support.', points: ['Certified Nannies', 'Video Triage', 'Sleep Support', 'Feeding Help'], link: '#nanny-feature', linkText: 'Learn More',
                  containerClass: 'hover:border-teal-200 hover:shadow-teal-100/50', bgClass: 'bg-teal-50', iconBg: 'bg-teal-100', iconColor: 'text-teal-500', textHover: 'group-hover:text-teal-500', dotClass: 'bg-teal-400', btnClass: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200'
                },
                {
                  title: 'Cry Translator', badge: 'Popular', badgeClass: 'text-rose-500 bg-rose-50 border-rose-100', color: 'rose', icon: AudioWaveform, desc: "AI-powered acoustic analysis to decode baby cries in 10 seconds.", points: ['Acoustic Analysis', '10s Recording', 'Predicts Needs', 'Instant Action'], link: '/auth', linkText: 'Try Now',
                  containerClass: 'hover:border-rose-200 hover:shadow-rose-100/50', bgClass: 'bg-rose-50', iconBg: 'bg-rose-100', iconColor: 'text-rose-500', textHover: 'group-hover:text-rose-500', dotClass: 'bg-rose-400', btnClass: 'gradient-rose text-rose-900 border border-white'
                },
                {
                  title: 'AI Saheli', badge: '24/7 Expert', badgeClass: 'text-indigo-600 bg-indigo-50 border-indigo-100', color: 'indigo', icon: MessageCircleHeart, desc: 'Your 24/7 empathetic assistant covering 20+ categories with Hinglish support.', points: ['20+ Categories', 'Hinglish Chat', 'Context-Aware', 'Expert Guidance'], link: '/auth', linkText: 'Chat Now',
                  containerClass: 'hover:border-indigo-200 hover:shadow-indigo-100/50', bgClass: 'bg-indigo-50', iconBg: 'bg-indigo-100', iconColor: 'text-indigo-500', textHover: 'group-hover:text-indigo-500', dotClass: 'bg-indigo-400', btnClass: 'gradient-lavender text-indigo-900 border border-white'
                },
                {
                  title: 'Single Parenting', badge: 'Empower', badgeClass: 'text-rose-600 bg-rose-50 border-rose-100', color: 'rose', icon: Heart, desc: 'Dedicated tools, checklists and emotional support tailored for solo parents.', points: ['Solo Parent Guide', 'Checklists', 'Legal Basics', 'Support Groups'], link: '/auth', linkText: 'Get Support',
                  containerClass: 'hover:border-rose-200 hover:shadow-rose-100/50', bgClass: 'bg-rose-50', iconBg: 'bg-rose-100', iconColor: 'text-rose-500', textHover: 'group-hover:text-rose-500', dotClass: 'bg-rose-400', btnClass: 'gradient-rose text-rose-900 border border-white'
                },
                {
                  title: 'Daily Routines', badge: 'Smart', badgeClass: 'text-orange-600 bg-orange-50 border-orange-100', color: 'orange', icon: Clock, desc: 'Smart logging, sleep tracking, growth checks and flexible scheduling.', points: ['Smart Logging', 'Sleep Tracking', 'Growth Checks', 'Scheduling'], link: '/auth', linkText: 'Build Plan',
                  containerClass: 'hover:border-orange-200 hover:shadow-orange-100/50', bgClass: 'bg-orange-50', iconBg: 'bg-orange-100', iconColor: 'text-orange-500', textHover: 'group-hover:text-orange-500', dotClass: 'bg-orange-400', btnClass: 'gradient-peach text-orange-900 border border-white'
                },
                {
                  title: 'Care Guides', badge: 'Visual', badgeClass: 'text-emerald-600 bg-emerald-50 border-emerald-100', color: 'emerald', icon: PlayCircle, desc: 'Short, expert-curated video guides covering baby care and parenting tips.', points: ['Short Guides', 'Expert Tips', 'Care Techniques', 'Quick Ideas'], link: '/auth', linkText: 'Watch Now',
                  containerClass: 'hover:border-emerald-200 hover:shadow-emerald-100/50', bgClass: 'bg-emerald-50', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500', textHover: 'group-hover:text-emerald-500', dotClass: 'bg-emerald-400', btnClass: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                },
                {
                  title: 'Nutrition AI', badge: 'Custom', badgeClass: 'text-sky-600 bg-sky-50 border-sky-100', color: 'sky', icon: Apple, desc: 'Indian-rooted baby weaning, mom recovery diet and recipe guidance.', points: ['Indian-Rooted', 'Baby Weaning', 'Mom Recovery', 'Recipe Guide'], link: '/auth', linkText: 'Build Plan',
                  containerClass: 'hover:border-sky-200 hover:shadow-sky-100/50', bgClass: 'bg-sky-50', iconBg: 'bg-sky-100', iconColor: 'text-sky-500', textHover: 'group-hover:text-sky-500', dotClass: 'bg-sky-400', btnClass: 'gradient-blue text-sky-900 border border-white'
                },
                {
                  title: 'Play Tools', badge: 'Growth', badgeClass: 'text-pink-600 bg-pink-50 border-pink-100', color: 'pink', icon: Gamepad2, desc: 'Age-wise toy recommendations that support sensory and motor development.', points: ['Sensory Support', 'Motor Skills', 'Cognitive Growth', 'Age-Wise'], link: '/auth', linkText: 'Shop Now',
                  containerClass: 'hover:border-pink-200 hover:shadow-pink-100/50', bgClass: 'bg-pink-50', iconBg: 'bg-pink-100', iconColor: 'text-pink-500', textHover: 'group-hover:text-pink-500', dotClass: 'bg-pink-400', btnClass: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200'
                },
                {
                  title: 'Mind Games', badge: 'Brain', badgeClass: 'text-violet-600 bg-violet-50 border-violet-100', color: 'violet', icon: Brain, desc: 'Interactive games scientifically designed to stimulate baby\'s brain development.', points: ['Brain Training', 'Interactive Play', 'Learning Games', 'Research Based'], link: '/auth', linkText: 'Play Now',
                  containerClass: 'hover:border-violet-200 hover:shadow-violet-100/50', bgClass: 'bg-violet-50', iconBg: 'bg-violet-100', iconColor: 'text-violet-500', textHover: 'group-hover:text-violet-500', dotClass: 'bg-violet-400', btnClass: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
                },
                {
                  title: 'Voice Personalization', badge: 'Soothing', badgeClass: 'text-purple-600 bg-purple-50 border-purple-100', color: 'purple', icon: Mic, desc: 'Personalize soothing audio and lullabies using the mother\'s unique voice.', points: ['Voice Matching', 'Secure Tech', 'Soothing Audio', 'Lullabies'], link: '/auth', linkText: 'Personalize',
                  containerClass: 'hover:border-purple-200 hover:shadow-purple-100/50', bgClass: 'bg-purple-50', iconBg: 'bg-purple-100', iconColor: 'text-purple-500', textHover: 'group-hover:text-purple-500', dotClass: 'bg-purple-400', btnClass: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                },
                {
                  title: 'Sleep Sanctuary', badge: 'Calm', badgeClass: 'text-cyan-600 bg-cyan-50 border-cyan-100', color: 'cyan', icon: Volume2, desc: 'A library of white noise and nature sounds to help babies sleep faster.', points: ['White Noise', 'Nature Sounds', 'Sleep Library', 'Settling Audio'], link: '/auth', linkText: 'Play Audio',
                  containerClass: 'hover:border-cyan-200 hover:shadow-cyan-100/50', bgClass: 'bg-cyan-50', iconBg: 'bg-cyan-100', iconColor: 'text-cyan-500', textHover: 'group-hover:text-cyan-500', dotClass: 'bg-cyan-400', btnClass: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200'
                },
                {
                  title: 'Traditional Wisdom', badge: 'Heritage', badgeClass: 'text-amber-600 bg-amber-50 border-amber-100', color: 'amber', icon: Leaf, desc: 'Home remedies, Ayurvedic basics and traditional elder wisdom.', points: ['Home Remedies', 'Ayurvedics', 'Elder Guidance', 'Natural Care'], link: '/auth', linkText: 'Explore',
                  containerClass: 'hover:border-amber-200 hover:shadow-amber-100/50', bgClass: 'bg-amber-50', iconBg: 'bg-amber-100', iconColor: 'text-amber-500', textHover: 'group-hover:text-amber-500', dotClass: 'bg-amber-400', btnClass: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                },
              ].map((feature, i) => {
                const Icon = feature.icon;

                return (
                  <motion.div variants={fadeIn} key={i} className={`group relative flex flex-col overflow-hidden border border-stone-100 bg-white/80 p-5 shadow-md backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg lg:p-6 ${cardRadius} ${feature.containerClass}`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] -mr-6 -mt-6 transition-transform duration-700 group-hover:scale-125 opacity-70 ${feature.bgClass}`}></div>
                    <div className={`relative z-10 mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-white shadow-sm ${feature.iconBg}`}>
                      <Icon className={`h-5 w-5 ${feature.iconColor}`} />
                    </div>
                    <div className="relative z-10 mb-3 flex items-start justify-between gap-3">
                      <Link to={feature.link}>
                        <h3 className={`cursor-pointer text-[clamp(1.12rem,1.7vw,1.35rem)] font-extrabold tracking-tight text-stone-800 transition-colors ${feature.textHover}`}>{feature.title}</h3>
                      </Link>
                      <span className={`font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest border shadow-sm bg-white ${feature.badgeClass}`}>{feature.badge}</span>
                    </div>
                    <p className="relative z-10 mb-5 flex-1 text-sm font-medium leading-6 text-stone-500">{feature.desc}</p>
                    <div className="relative z-10 mb-5 grid grid-cols-2 gap-x-3 gap-y-2">
                      {feature.points.map((pt, j) => (
                        <div key={j} className="flex items-center gap-2 text-[13px] font-bold text-stone-600">
                          <div className={`w-2 h-2 rounded-full ${feature.dotClass}`}></div>{pt}
                        </div>
                      ))}
                    </div>
                    <div className="relative z-10 mt-auto flex h-11 gap-3">
                      <Link className="flex-1" to={feature.link}>
                        <button className={`flex h-full w-full items-center justify-center gap-2 rounded-2xl text-sm font-bold shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${feature.btnClass}`}>
                          <Icon className="w-5 h-5" /> {feature.linkText}
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* On-Demand Nanny Consultations */}
        <section id="nanny-feature" className={`${sectionY} relative overflow-hidden`}>
          <div className={pageContainer}>
            <div className="relative grid items-center gap-5 overflow-hidden rounded-[1.5rem] border border-white bg-gradient-to-br from-orange-50/50 to-rose-50/50 p-4 shadow-[0_8px_30px_-6px_rgba(251,113,133,0.1)] sm:p-6 lg:grid-cols-2 lg:gap-7 lg:p-8">
              {/* Background Glow */}
              <div className="absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-white/60 blur-[70px] pointer-events-none"></div>

              {/* Text Content */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                className="relative z-10"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-600 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" /> Coming Soon
                </div>
                <h2 className="mb-4 text-[clamp(1.6rem,3vw,2.35rem)] font-black leading-[1.08] tracking-tight text-stone-800">
                  Bridging the Gap: <br /><span className="text-rose-500">On-Demand Nanny Consultations</span>
                </h2>
                <p className="mb-5 max-w-xl text-[clamp(0.88rem,1.05vw,0.95rem)] font-medium leading-6 text-stone-600">
                  AI is highly efficient, but we know that some complex parenting moments simply require human empathy, warmth, and lived experience.
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                      <Video className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-stone-800">Expert Video Triage</h4>
                      <p className="mt-1 text-[13px] font-medium leading-6 text-stone-500">Connect with <b>Certified Expert Nannies</b> with <b>8+ years of experience</b> for immediate, face-to-face guidance.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-500 shadow-sm">
                      <User className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-stone-800">Your Digital Village</h4>
                      <p className="mt-1 text-[13px] font-medium leading-6 text-stone-500">Replaces the lost guidance of the joint family with highly vetted nanny professionals specializing in newborn care.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-500 shadow-sm">
                      <MessageSquare className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-bold text-stone-800">Verified Support Network</h4>
                      <p className="mt-1 text-[13px] font-medium leading-6 text-stone-500">Every nanny in our network is hand-picked for their empathy, warmth, and years of lived professional experience.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <a 
                    href="https://mumaa-vc-one.vercel.app/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-4.5 py-2.5 text-sm font-black text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-rose-600 hover:shadow-xl"
                  >
                    <Video className="h-5 w-5" /> Start Live Consultation
                  </a>
                </div>
              </motion.div>

              {/* Visual Element */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative flex justify-center items-center z-10"
              >
                <div className="relative aspect-[9/18.5] w-[min(60vw,200px)] overflow-hidden rounded-[1.75rem] border-[5px] border-stone-800 bg-stone-900 shadow-2xl lg:w-[215px]">
                  {/* Dynamic Island */}
                  {/* <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-20"></div> */}

                  <img src="/public/images/nanny.png" alt="Video Call" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-orange-900/10 pointer-events-none"></div>
                  
                  {/* Caller UI */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[85%] bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-rose-400 border-2 border-white overflow-hidden">
                        <img src="/images/pexels-daniel-reche-718241-1556706.jpg" alt="Nanny" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-white/70 uppercase tracking-widest leading-none mb-1">Consulting</div>
                        <div className="text-xs font-black text-white leading-none">Expert Nanny</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white"><Video className="w-4 h-4" /></div>
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white"><Mic className="w-4 h-4" /></div>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white"><X className="w-4 h-4" /></div>
                    </div>
                  </div>
                </div>

                {/* Floating Status */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-3 -top-4 z-20 flex items-center gap-2 rounded-xl border border-stone-100 bg-white/95 px-3 py-2 shadow-xl backdrop-blur-md"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                    <Video className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] font-black uppercase leading-none tracking-widest text-emerald-500">Status</div>
                    <div className="text-xs font-black leading-none text-stone-800">Nanny Online</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Play Family */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="toys" 
          className="py-24 relative bg-gradient-to-b from-stone-50 to-white"
        >
          <div className={pageContainer}>
            <motion.div variants={fadeIn} className={sectionHeader}>
              <h2 className={`${sectionTitle} mb-4`}>Meet the <span className="text-orange-500">MUMAA Play Family</span></h2>
              <p className={sectionLead}>Physical companions powered by our calming AI. From storytellers to logical guides, safe and screen-free.</p>
            </motion.div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {[
                        {name: 'Mimi', img: 'mimi.png', color: 'pink', border: 'hover:border-pink-300 hover:shadow-pink-100/50', dot: 'bg-pink-400', badge: 'text-pink-600 bg-pink-50', points: ['Screen-free fun', 'Sleep Companion', 'Voice Cloning', 'Safe WiFi Setup'], desc: 'The perfect starter AI companion. Mimi tells calming stories to comfort your child.'},
                        {name: 'Simba', img: 'simba.png', color: 'orange', border: 'hover:border-orange-300 hover:shadow-orange-100/50', dot: 'bg-orange-400', badge: 'text-orange-600 bg-orange-50', points: ['Screen-free fun', 'Sleep Guardian', 'Voice Cloning', 'Safe WiFi Setup'], desc: 'A brave lion protector. Roars softly when picked up to guard the bedroom door.'},
                        {name: 'Prince', img: 'prince.png', color: 'indigo', border: 'hover:border-indigo-300 hover:shadow-indigo-100/50', dot: 'bg-indigo-400', badge: 'text-indigo-600 bg-indigo-50', points: ['Screen-free fun', 'Motion Guide', 'Voice Cloning', 'Safe WiFi Setup'], desc: 'Encourages early crawling! Motivates your little one to chase and move playfully.'},
                        {name: 'Arnie', img: 'arnie.png', color: 'amber', border: 'hover:border-amber-300 hover:shadow-amber-100/50', dot: 'bg-amber-400', badge: 'text-amber-600 bg-amber-50', points: ['Screen-free fun', 'Sleep Companion', 'Voice Cloning', 'Safe Touch'], desc: 'A soft, huggable friend that glows gently. Plays calming lullabies to help your baby sleep.'},
                        {name: 'Chichi', img: 'chichi.png', color: 'sky', border: 'hover:border-sky-300 hover:shadow-sky-100/50', dot: 'bg-sky-400', badge: 'text-sky-600 bg-sky-50', points: ['Screen-free fun', 'Musical Play', 'Voice Cloning', 'Safe WiFi Setup'], desc: 'The gentle party starter! Chichi plays peaceful nursery rhymes and spins softly.'},
                        {name: 'Duke', img: 'duke.png', color: 'emerald', border: 'hover:border-emerald-300 hover:shadow-emerald-100/50', dot: 'bg-emerald-400', badge: 'text-emerald-600 bg-emerald-50', points: ['Screen-free fun', 'Sleep Guardian', 'Voice Cloning', 'Safe WiFi Setup'], desc: 'A smart guardian. Duke alerts you if the baby cries and plays soothing sounds remotely.'},
                    ].map((toy, i) => (
                        <motion.div variants={fadeIn} key={i} className={`group relative bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 shadow-lg flex flex-col ${toy.border}`}>
                            <div className="aspect-square bg-stone-100 relative overflow-hidden flex items-center justify-center cursor-pointer">
                                <img alt={toy.name} className="product-image transition-transform duration-1000 group-hover:scale-110 absolute inset-0 w-full h-full object-cover" src={`/images/${toy.img}`} />
                                <div className={`absolute top-4 right-4 backdrop-blur text-xs font-bold px-4 py-2 rounded-xl border border-white/50 shadow-md z-10 flex items-center gap-1.5 ${toy.badge}`}>
                                    <Sparkles className="w-3.5 h-3.5" /> AI Inside
                                </div>
                            </div>
                            <div className="p-8 flex-1 flex flex-col border-t border-stone-100">
                                <h3 className="text-3xl font-extrabold text-stone-800 mb-4 tracking-tight">{toy.name}</h3>
                                <p className="text-stone-500 text-[15px] mb-8 font-medium leading-relaxed flex-1">{toy.desc}</p>
                                <div className="mb-8 grid grid-cols-2 gap-4">
                                    {toy.points.map((pt, j) => (
                                        <div key={j} className="flex items-center gap-2 text-sm font-bold text-stone-600">
                                            <div className={`w-2 h-2 rounded-full ${toy.dot}`}></div>{pt}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-3 h-14 mt-auto">
                                    <Link className="flex-1" to="/auth">
                                        <button className="w-full h-full bg-stone-800 border border-stone-800 text-white text-[15px] font-bold rounded-2xl hover:bg-stone-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:-translate-y-0.5">
                                            <MessageCircle className="w-5 h-5" /> Chat Mumaa
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          id="faq-section" 
          className="py-24 px-6 relative"
        >
            <div className="container mx-auto max-w-3xl">
                <motion.div variants={fadeIn} className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-6">Common Questions</h2>
                    <p className="text-stone-500 font-medium text-[1.1rem]">Everything you need to know about MUMAA.</p>
                </motion.div>
                <div className="space-y-5">
                    {[
                        { q: "Is my baby's data safe and private?", a: "Absolutely. We adhere to strict privacy guidelines. All data (like photos or audio clips) is processed securely on demand and is never used to train external public models without explicit consent. You can delete your logs at any time." },
                        { q: "Do I need a subscription?", a: "MUMAA's core tracking tools, AI chat, and basic cry analysis are completely free. Premium features like advanced detailed vision checks and unlimited generated lullabies may be part of future premium tiers." },
                        { q: "What age is MUMAA suitable for?", a: "MUMAA is primarily designed for expecting mothers and parents of children aged 0 to 7 years. The AI dynamically adapts its advice, diet charts, and play ideas based on the exact age you input in your profile." },
                        { q: "Is the Cry Analyzer medically certified?", a: "Our Cry Translator is a supportive AI tool designed to provide gentle suggestions based on acoustic patterns, but it is not a medical device. Always consult your pediatrician if your baby's crying seems unusual or if they show signs of distress or illness." },
                        { q: "Does it understand Indian languages?", a: "Yes! You can configure the AI Chat and content generators to respond in English, Hindi (Devanagari), or Hinglish. We also specialize in traditional Indian postpartum and weaning diet suggestions." }
                    ].map((faq, index) => (
                        <motion.div variants={fadeIn} key={index} className={`border rounded-[2rem] bg-white overflow-hidden shadow-sm transition-colors duration-300 ${activeFaq === index ? 'border-orange-200 shadow-md ring-4 ring-orange-50' : 'border-stone-200'}`}>
                            <button onClick={() => toggleFaq(index)} className="w-full flex items-center justify-between p-8 text-left hover:bg-stone-50 transition-colors">
                                <span className={`font-extrabold text-lg ${activeFaq === index ? 'text-orange-600' : 'text-stone-800'}`}>{faq.q}</span>
                                <Plus className={`w-6 h-6 transition-transform duration-500 ${activeFaq === index ? 'rotate-45 text-orange-500' : 'text-stone-400'}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFaq === index ? 'max-h-[500px] opacity-100 bg-stone-50/50' : 'max-h-0 opacity-0 bg-white'}`}>
                                <div className="p-8 pt-0 text-stone-500 font-medium text-[15px] leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }}></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>

        {/* Contact Section */}
        <section id="contact" className="py-24 border-t border-stone-200/50 bg-stone-50/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-100/40 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-indigo-100/40 blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    <motion.div 
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeIn}
                      className="flex-1 text-center lg:text-left"
                    >
                        <h2 className="text-5xl lg:text-6xl font-extrabold text-stone-800 mb-6">We're Here For You, <br /><span className="text-orange-500">Mama.</span></h2>
                        <p className="text-stone-500 font-medium text-lg mb-12 leading-relaxed max-w-md mx-auto lg:mx-0">Have a question about the app, need technical help, or just want to share feedback? Send us a note.</p>

                        <div className="space-y-6 inline-flex flex-col text-left">
                            <div className="flex items-center gap-6 p-5 bg-white rounded-3xl shadow-md border border-white hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-100 shadow-inner">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-1">Email Us</p>
                                    <p className="font-extrabold text-stone-700 text-lg">aimumaa1201@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-5 bg-white rounded-3xl shadow-md border border-white hover:-translate-y-1 transition-transform">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-100 shadow-inner">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-1">Support</p>
                                    <p className="font-extrabold text-stone-700 text-lg">24/7 AI Chat Companion</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      className="flex-1 w-full bg-white border border-white p-10 lg:p-12 rounded-[3rem] shadow-2xl"
                    >
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                                        <input required placeholder="Priya Sharma" className="w-full bg-stone-50/50 border border-stone-200 text-stone-800 font-bold pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all hover:bg-stone-50" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
                                        <input required placeholder="priya@example.com" type="email" className="w-full bg-stone-50/50 border border-stone-200 text-stone-800 font-bold pl-14 pr-5 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all hover:bg-stone-50" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">I am interested in</label>
                                <select className="w-full bg-stone-50/50 border border-stone-200 text-stone-800 font-bold px-6 py-4 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all appearance-none cursor-pointer hover:bg-stone-50">
                                    <option>General Support</option>
                                    <option>Feedback on App</option>
                                    <option>Bug Report</option>
                                    <option>Partnership</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold text-stone-400 uppercase tracking-widest ml-2">Message</label>
                                <textarea rows={4} required placeholder="Tell us how we can help..." className="w-full bg-stone-50/50 border border-stone-200 text-stone-800 font-bold px-6 py-5 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all resize-none hover:bg-stone-50"></textarea>
                            </div>
                            <button type="submit" className="w-full gradient-peach text-orange-900 font-bold text-lg py-5 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md">
                                Send Message <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
      </main>

      <a href="#" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group" aria-label="Chat on WhatsApp">
        <span className="absolute right-16 bg-white text-stone-700 font-bold text-xs px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-stone-100 shadow-md pointer-events-none">Message Support</span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 text-sm mt-auto z-10">
          <div className="max-w-7xl mx-auto px-6 pt-20 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                  <div className="col-span-1 lg:col-span-2">
                      <a className="flex items-center gap-4 mb-8 select-none" href="#">
                          <img src="/images/MumaaAIlogo.png" alt="Mumaa Logo" className="w-12 h-12 object-cover rounded-2xl shadow-sm border border-stone-100" />
                          <span className="text-3xl font-black tracking-tighter text-stone-800">AI MUMAA</span>
                      </a>
                      <p className="text-stone-500 font-medium text-[15px] leading-relaxed max-w-sm mb-8">
                          India's most calming AI parenting companion. Reassuring insights, secure analysis, and absolute peace of mind.
                      </p>
                      <div className="flex items-center gap-4">
                          <a href="#" className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shadow-sm hover:-translate-y-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                          </a>
                          <a href="#" className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm hover:-translate-y-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                          </a>
                          <a href="#" className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 hover:text-sky-500 hover:border-sky-200 hover:bg-sky-50 transition-all shadow-sm hover:-translate-y-1">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                          </a>
                      </div>
                  </div>
                  <div>
                      <h4 className="text-stone-800 font-extrabold mb-6 text-[11px] uppercase tracking-widest">Platform</h4>
                      <ul className="space-y-4 text-stone-500 font-medium text-[15px]">
                          <li><Link className="hover:text-orange-500 transition-colors" to="/auth">AI Chat App</Link></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="/MummA_Cry_Analyzer (2).apk">Download APK</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#features">All Features</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-stone-800 font-extrabold mb-6 text-[11px] uppercase tracking-widest">Company</h4>
                      <ul className="space-y-4 text-stone-500 font-medium text-[15px]">
                          <li><a className="hover:text-orange-500 transition-colors" href="#trust">About Us</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#toys">Play Family</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#contact">Contact Support</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#">Blog</a></li>
                      </ul>
                  </div>
                  <div>
                      <h4 className="text-stone-800 font-extrabold mb-6 text-[11px] uppercase tracking-widest">Policies</h4>
                      <ul className="space-y-4 text-stone-500 font-medium text-[15px]">
                          <li><a className="hover:text-orange-500 transition-colors" href="#">Privacy Policy</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#">Terms & Conditions</a></li>
                          <li><a className="hover:text-orange-500 transition-colors" href="#">Data Security</a></li>
                      </ul>
                  </div>
              </div>
              <div className="border-t border-stone-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <p className="text-stone-400 font-medium text-xs">© 2026 Mumaa AI · All rights reserved.</p>
                  <p className="text-stone-400 font-medium text-xs">Made with <span className="text-rose-500 animate-pulse">♥</span> for parents everywhere</p>
              </div>
          </div>
      </footer>
    </div>
  );
}
