import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  Layers,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import BlurText from "../components/reactbits/BlurText";
import CountUp from "../components/reactbits/CountUp";
import GradientText from "../components/reactbits/GradientText";
import ParticleField from "../components/reactbits/ParticleField";
import ScrollReveal from "../components/reactbits/ScrollReveal";
import SplitText from "../components/reactbits/SplitText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import TiltCard from "../components/reactbits/TiltCard";

const features = [
  {
    icon: BookOpen,
    badge: "bg-indigo-500/10 text-indigo-400",
    title: "Courses",
    desc: "Browse courses and offerings for your academic program in a single catalog.",
  },
  {
    icon: CalendarCheck,
    badge: "bg-emerald-500/10 text-emerald-400",
    title: "Attendance",
    desc: "Track class attendance and academic participation in real time.",
  },
  {
    icon: ClipboardList,
    badge: "bg-amber-500/10 text-amber-400",
    title: "Assessments",
    desc: "Manage assessments, marks and academic evaluations end to end.",
  },
  {
    icon: BarChart3,
    badge: "bg-violet-500/10 text-violet-400",
    title: "Results",
    desc: "View course results, transcripts and GPA in one place.",
  },
  {
    icon: Layers,
    badge: "bg-sky-500/10 text-sky-400",
    title: "Timetable",
    desc: "Weekly routines for students and teachers, always up to date.",
  },
  {
    icon: Wallet,
    badge: "bg-rose-500/10 text-rose-400",
    title: "Payments",
    desc: "Manage fees, payments and digital receipts securely.",
  },
];

const portals = [
  {
    icon: GraduationCap,
    chip: "bg-indigo-100 text-indigo-600",
    tag: "bg-indigo-50 text-indigo-700",
    title: "Students",
    desc: "Access courses, attendance, assessments, results and academic services.",
    cta: "Create student account",
    to: "/register",
  },
  {
    icon: Users,
    chip: "bg-emerald-100 text-emerald-600",
    tag: "bg-emerald-50 text-emerald-700",
    title: "Teachers",
    desc: "Manage assigned courses, exams, marks and student activities.",
    cta: "Teacher sign in",
    to: "/login",
  },
  {
    icon: UserCog,
    chip: "bg-violet-100 text-violet-600",
    tag: "bg-violet-50 text-violet-700",
    title: "Administrators",
    desc: "Manage academic structure, users, programs and university operations.",
    cta: "Administrator sign in",
    to: "/login",
  },
];

const stats = [
  { value: 13, suffix: "+", label: "Core academic modules" },
  { value: 3, suffix: "", label: "Role-based portals" },
  { value: 100, suffix: "%", label: "Cloud hosted & secure" },
  { value: 24, suffix: "/7", label: "Academic access" },
];

const mockupCards = [
  {
    icon: BookOpen,
    tint: "bg-indigo-50 text-indigo-600",
    title: "Courses",
    desc: "Academic courses",
  },
  {
    icon: BarChart3,
    tint: "bg-slate-50 text-slate-500",
    title: "Results",
    desc: "Performance",
  },
  {
    icon: CalendarCheck,
    tint: "bg-slate-50 text-slate-500",
    title: "Attendance",
    desc: "Track classes",
  },
  {
    icon: Wallet,
    tint: "bg-indigo-50 text-indigo-600",
    title: "Payments",
    desc: "Manage fees",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
              E
            </div>
            <div>
              <p className="text-lg font-bold tracking-tight text-white">
                EduCore
              </p>
              <p className="text-xs text-slate-400">University Portal</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {[
              ["About", "#about"],
              ["Features", "#features"],
              ["Portal Access", "#access"],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-400 transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}
      <main>
        <section className="relative overflow-hidden">
          {/* Background layers */}
          <div
            aria-hidden="true"
            className="bg-grid absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
          />
          <div
            aria-hidden="true"
            className="absolute -top-48 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[120px]"
          />
          <div
            aria-hidden="true"
            className="absolute -right-24 top-40 h-[360px] w-[360px] rounded-full bg-violet-600/20 blur-[100px]"
          />
          <div
            aria-hidden="true"
            className="absolute -left-24 bottom-0 h-[320px] w-[320px] rounded-full bg-cyan-500/15 blur-[100px]"
          />
          <ParticleField quantity={90} color="#818cf8" className="opacity-80" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:px-8 lg:py-32">
            {/* Hero copy */}
            <div>
              <ScrollReveal delay={0.05} y={20}>
                <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold tracking-wide text-indigo-300">
                    UNIVERSITY MANAGEMENT PORTAL
                  </span>
                </div>
              </ScrollReveal>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                <span className="block">
                  <SplitText text="Your university," delay={100} />
                </span>
                <span className="block">
                  <GradientText
                    colors={["#818cf8", "#c084fc", "#22d3ee", "#818cf8"]}
                    animationSpeed={5}
                  >
                    <SplitText text="connected in one place." delay={320} />
                  </GradientText>
                </span>
              </h1>

              <ScrollReveal delay={0.2}>
                <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                  EduCore brings academic information and university services
                  together in one secure, easy-to-use digital platform for
                  students, teachers and administrators.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
                  >
                    Access Portal
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    Create Student Account
                  </Link>
                </div>
              </ScrollReveal>
            </div>

            {/* Hero visual */}
            <ScrollReveal delay={0.15} y={48} className="relative">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20 blur-2xl"
              />
              <TiltCard className="ec-float" maxTilt={7} glare>
                <SpotlightCard
                  className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl"
                  spotlightColor="rgba(129, 140, 248, 0.18)"
                >
                  {/* Mockup header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
                        E
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">EduCore</p>
                        <p className="text-xs text-slate-500">Academic Portal</p>
                      </div>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-white/10" />
                  </div>

                  {/* Mockup welcome */}
                  <div className="py-6">
                    <p className="text-xs font-medium tracking-wide text-slate-500">
                      WELCOME TO YOUR PORTAL
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-white">
                      Everything academic,
                      <span className="block text-indigo-400">
                        in one place.
                      </span>
                    </h3>
                  </div>

                  {/* Mockup grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {mockupCards.map(({ icon: Icon, tint, title, desc }) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/5 bg-white/[0.05] p-5 transition hover:bg-white/[0.08]"
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tint}`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="mt-4 text-sm font-bold text-white">
                          {title}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">{desc}</p>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </TiltCard>

              {/* Floating badges */}
              <div className="ec-float-delayed absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 shadow-xl backdrop-blur sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">PLATFORM</p>
                    <p className="text-sm font-bold text-white">
                      Secure & Connected
                    </p>
                  </div>
                </div>
              </div>

              <div className="ec-float absolute -top-5 -right-4 hidden rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 backdrop-blur md:block">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-indigo-400" />
                  <p className="text-sm font-semibold text-white">
                    Real-time updates
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Stats band */}
          <div className="relative border-t border-white/5">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-6 py-12 md:grid-cols-4 lg:px-8">
              {stats.map(({ value, suffix, label }, index) => (
                <ScrollReveal key={label} delay={index * 0.08}>
                  <div className="text-center">
                    <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                      <CountUp
                        to={value}
                        duration={value === 24 ? 1.5 : 2.2}
                        className="bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
                      />
                      <span className="text-indigo-400">{suffix}</span>
                    </p>
                    <p className="mt-2 text-xs font-medium tracking-wide text-slate-500 uppercase">
                      {label}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURES
        ====================================================== */}
        <section id="features" className="scroll-mt-24 bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <ScrollReveal className="mb-14 max-w-2xl">
              <p className="text-xs font-bold tracking-[0.18em] text-indigo-400">
                PLATFORM FEATURES
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to run
                <span className="block">
                  <GradientText
                    colors={["#818cf8", "#c084fc", "#22d3ee", "#818cf8"]}
                    animationSpeed={6}
                  >
                    university life.
                  </GradientText>
                </span>
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                Access the core academic services of your university through a
                single, connected platform.
              </p>
            </ScrollReveal>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, badge, title, desc }, index) => (
                <ScrollReveal key={title} delay={index * 0.06} className="h-full">
                  <Link to="/login" className="block h-full group rounded-2xl" aria-label={`Explore the ${title} module`}>
                    <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-white/[0.03] transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.06] group-hover:-translate-y-1.5">
                      <div className="flex h-full flex-col p-6">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${badge}`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="mt-5 font-bold text-white">{title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {desc}
                        </p>
                        <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-indigo-400 transition-all duration-300 group-hover:gap-2.5 group-hover:text-indigo-300">
                          Explore module <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </SpotlightCard>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            ABOUT
        ====================================================== */}
        <section id="about" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-10 rounded-full bg-indigo-600/15 blur-[100px]"
                />
                <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8">
                  <BlurText
                    text="A smarter way to manage university life."
                    delay={35}
                    className="text-3xl font-bold leading-snug tracking-tight text-white sm:text-4xl"
                    direction="top"
                  />
                  <p className="mt-6 text-sm leading-7 text-slate-400 sm:text-base">
                    EduCore provides a centralized digital environment where
                    students, teachers and administrators manage the academic
                    activities that matter most — with a modern interface, real
                    time updates and secure role-based access.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {["Secure auth", "Real-time", "Role-based", "Cloud hosted"].map(
                      (tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-slate-300"
                        >
                          {tag}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Security first",
                    desc: "JWT authentication, hashed credentials and role-based authorization protect every account.",
                  },
                  {
                    icon: Rocket,
                    title: "Deployed & ready",
                    desc: "Hosted on modern cloud infrastructure with a live production build for every role.",
                  },
                  {
                    icon: Zap,
                    title: "One connected workflow",
                    desc: "Courses, attendance, assignments, results and payments flow together seamlessly.",
                  },
                ].map(({ icon: Icon, title, desc }, index) => (
                  <ScrollReveal key={title} delay={index * 0.08}>
                    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">
                          {desc}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            PORTAL ACCESS
        ====================================================== */}
        <section id="access" className="scroll-mt-24 bg-slate-950">
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <ScrollReveal className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold tracking-[0.18em] text-indigo-400">
                PORTAL ACCESS
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                One platform for everyone
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                EduCore provides role-based access so every user gets the tools
                relevant to their responsibilities.
              </p>
            </ScrollReveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {portals.map(({ icon: Icon, chip, tag, title, desc, cta, to }, index) => (
                <ScrollReveal key={title} delay={index * 0.08}>
                  <SpotlightCard className="group h-full rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${chip}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span
                      className={`mt-6 inline-block rounded-full px-3 py-1 text-xs font-semibold ${tag}`}
                    >
                      {title}
                    </span>
                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      {desc}
                    </p>
                    <Link
                      to={to}
                      className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition group-hover:gap-2.5 hover:text-indigo-300"
                    >
                      {cta} <ArrowRight className="h-4 w-4" />
                    </Link>
                  </SpotlightCard>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="px-6 pb-24 lg:px-8">
          <ScrollReveal>
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-16 text-center sm:px-12">
              <div
                aria-hidden="true"
                className="absolute -top-32 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/30 blur-[100px]"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-violet-600/25 blur-[90px]"
              />
              <ParticleField quantity={40} color="#a5b4fc" />

              <div className="relative">
                <p className="text-xs font-bold tracking-[0.18em] text-indigo-400">
                  GET STARTED
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  <GradientText
                    colors={["#ffffff", "#c7d2fe", "#a5b4fc", "#e0e7ff"]}
                    animationSpeed={3}
                  >
                    Ready to access EduCore?
                  </GradientText>
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                  Sign in to your existing account or create a new student
                  account to get started.
                </p>

                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="rounded-xl bg-indigo-500 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-400"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur transition hover:bg-white/10"
                  >
                    Student Registration
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-white/5 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
              E
            </div>
            <div>
              <p className="text-sm font-bold text-white">EduCore</p>
              <p className="text-xs text-slate-500">University Portal</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} EduCore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;