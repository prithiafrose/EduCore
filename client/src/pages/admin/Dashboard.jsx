import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  Banknote,
  AlertTriangle,
  CircleCheck,
  CalendarClock,
} from "lucide-react";
import api from "../../services/axios";
import StatCard from "../../components/ui/StatCard";
import AnimatedCard from "../../components/ui/AnimatedCard";
import DonutChart from "../../components/ui/DonutChart";
import ParticleField from "../../components/reactbits/ParticleField";
import GradientText from "../../components/reactbits/GradientText";
import ScrollReveal from "../../components/reactbits/ScrollReveal";
import TiltCard from "../../components/reactbits/TiltCard";
import SpotlightCard from "../../components/reactbits/SpotlightCard";

const ease = [0.22, 1, 0.36, 1];

function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    departments: 0,
  });

  const [revenue, setRevenue] = useState({
    collected: 0,
    outstanding: 0,
    paidCount: 0,
    pendingCount: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsResponse, revenueResponse] = await Promise.all([
          api.get("/admin"),
          api.get("/admin/revenue"),
        ]);

        setStats(statsResponse.data.data);

        setRevenue(revenueResponse.data.data);
      } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const revenueData = [
    { label: "Collected", value: revenue.collected || 0, color: "#10b981" },
    { label: "Outstanding", value: revenue.outstanding || 0, color: "#f59e0b" },
  ];

  const overviewStats = [
    {
      key: "students",
      icon: <Users size={20} />,
      label: "Students",
      value: stats.students,
      hint: "Registered students",
      accent: "indigo",
    },
    {
      key: "teachers",
      icon: <GraduationCap size={20} />,
      label: "Teachers",
      value: stats.teachers,
      hint: "Faculty members",
      accent: "emerald",
    },
    {
      key: "courses",
      icon: <BookOpen size={20} />,
      label: "Courses",
      value: stats.courses,
      hint: "Available courses",
      accent: "amber",
    },
    {
      key: "departments",
      icon: <Building2 size={20} />,
      label: "Departments",
      value: stats.departments,
      hint: "Academic departments",
      accent: "purple",
    },
  ];

  const revenueStats = [
    {
      key: "collected",
      icon: <Banknote size={20} />,
      label: "Total Collected",
      value: revenue.collected || 0,
      prefix: "৳",
      hint: "BDT collected",
      accent: "green",
    },
    {
      key: "outstanding",
      icon: <AlertTriangle size={20} />,
      label: "Outstanding",
      value: revenue.outstanding || 0,
      prefix: "৳",
      hint: "BDT pending",
      accent: "amber",
    },
    {
      key: "paid",
      icon: <CircleCheck size={20} />,
      label: "Paid Count",
      value: revenue.paidCount || 0,
      hint: "Paid payments",
      accent: "emerald",
    },
    {
      key: "pending",
      icon: <CalendarClock size={20} />,
      label: "Pending Count",
      value: revenue.pendingCount || 0,
      hint: "Pending payments",
      accent: "rose",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]"
      >
        <ParticleField className="opacity-80" quantity={45} color="#8b5cf6" />

        <div className="relative z-10 px-6 py-7">
          <div>
            <GradientText>
              <h3 className="text-xl font-bold tracking-tight">
                System Overview
              </h3>
            </GradientText>

            <p className="text-sm text-slate-400 mt-1">
              Key statistics from the university management system.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {overviewStats.map((card, index) => (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.12 + index * 0.08,
                  duration: 0.55,
                  ease,
                }}
              >
                <TiltCard
                  className="h-full rounded-2xl"
                  maxTilt={6}
                  scale={1.015}
                  glare
                >
                  <SpotlightCard className="h-full rounded-2xl">
                    <StatCard
                      icon={card.icon}
                      label={card.label}
                      value={card.value}
                      hint={card.hint}
                      accent={card.accent}
                      loading={loading}
                    />
                  </SpotlightCard>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <ScrollReveal>
        <div>
          <GradientText>
            <h3 className="text-lg font-bold tracking-tight">
              Revenue Overview
            </h3>
          </GradientText>

          <p className="text-sm text-slate-400 mt-1">
            Fee collection and payment statistics.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {revenueStats.map((card, index) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: 0.1 + index * 0.07,
                duration: 0.5,
                ease,
              }}
            >
              <StatCard
                icon={card.icon}
                label={card.label}
                value={card.value}
                prefix={card.prefix}
                hint={card.hint}
                accent={card.accent}
                loading={loading}
              />
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <AnimatedCard className="p-6" hover={false}>
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <DonutChart data={revenueData} centerLabel="৳" size={170} />

            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold text-white">
                Collection Breakdown
              </h4>

              <p className="text-sm text-slate-400 max-w-md">
                Share of collected versus outstanding fees across the
                university.
              </p>
            </div>
          </div>
        </AnimatedCard>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <AnimatedCard hover={false}>
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-xl font-semibold text-white">
              Recent Activity
            </h3>

            <p className="text-sm text-slate-400 mt-1">
              Latest administrative activity in EduCore.
            </p>
          </div>

          <div className="p-6">
            <motion.div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"
              >
                <CalendarClock size={18} />
              </motion.div>

              <div>
                <p className="text-sm font-medium text-slate-200">
                  No recent activity yet.
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Administrative activities will appear here.
                </p>
              </div>
            </motion.div>
          </div>
        </AnimatedCard>
      </ScrollReveal>
    </div>
  );
}

export default Dashboard;