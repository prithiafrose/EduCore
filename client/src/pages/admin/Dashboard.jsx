import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/axios";
import StatCard from "../../components/ui/StatCard";
import AnimatedCard from "../../components/ui/AnimatedCard";
import DonutChart from "../../components/ui/DonutChart";
import SpotlightCard from "../../components/reactbits/SpotlightCard";

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

  return (
        <div className="p-8">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">
                System Overview
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Key statistics from the university management system.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="♙"
                  label="Students"
                  value={stats.students}
                  hint="Registered students"
                  accent="indigo"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="♙"
                  label="Teachers"
                  value={stats.teachers}
                  hint="Faculty members"
                  accent="emerald"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="▤"
                  label="Courses"
                  value={stats.courses}
                  hint="Available courses"
                  accent="amber"
                  loading={loading}
                />
              </SpotlightCard>

              <SpotlightCard className="rounded-2xl">
                <StatCard
                  icon="▦"
                  label="Departments"
                  value={stats.departments}
                  hint="Academic departments"
                  accent="purple"
                  loading={loading}
                />
              </SpotlightCard>
            </div>

            <div className="mt-8">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">
                  Revenue Overview
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Fee collection and payment statistics.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                  icon="৳"
                  label="Total Collected"
                  value={revenue.collected || 0}
                  prefix="৳"
                  hint="BDT collected"
                  accent="green"
                  loading={loading}
                />

                <StatCard
                  icon="৳"
                  label="Outstanding"
                  value={revenue.outstanding || 0}
                  prefix="৳"
                  hint="BDT pending"
                  accent="amber"
                  loading={loading}
                />

                <StatCard
                  icon="✓"
                  label="Paid Count"
                  value={revenue.paidCount || 0}
                  hint="Paid payments"
                  accent="emerald"
                  loading={loading}
                />

                <StatCard
                  icon="!"
                  label="Pending Count"
                  value={revenue.pendingCount || 0}
                  hint="Pending payments"
                  accent="rose"
                  loading={loading}
                />
              </div>

              <AnimatedCard className="mt-8 p-6" hover={false}>
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <DonutChart
                    data={revenueData}
                    centerLabel="৳"
                    size={170}
                  />

                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Collection Breakdown
                    </h4>

                    <p className="text-sm text-slate-500 max-w-md">
                      Share of collected versus outstanding fees across
                      the university.
                    </p>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            <AnimatedCard className="mt-8" hover={false}>
              <div className="px-6 py-5 border-b border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900">
                  Recent Activity
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Latest administrative activity in EduCore.
                </p>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 18 }}
                  className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  i
                </motion.div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    No recent activity yet.
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Administrative activities will appear here.
                  </p>
                </div>
              </div>

              </div>
            </AnimatedCard>
          </div>
  );
}

export default Dashboard;