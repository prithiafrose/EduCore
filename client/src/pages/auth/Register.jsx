import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  IdCard,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";

import { registerStudent } from "../../services/authApi";
import { getPublicPrograms } from "../../services/programApi";
import BlurText from "../../components/reactbits/BlurText";
import GradientText from "../../components/reactbits/GradientText";
import ParticleField from "../../components/reactbits/ParticleField";
import SplitText from "../../components/reactbits/SplitText";

const perks = [
  { icon: GraduationCap, text: "Register for academic courses" },
  { icon: CalendarCheck, text: "Follow your class routine" },
  { icon: BarChart3, text: "View results & transcripts" },
  { icon: Wallet, text: "Manage fees & payments" },
];

const inputClass =
  "h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [programId, setProgramId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await getPublicPrograms();
        setPrograms(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load academic programs.");
      } finally {
        setLoadingPrograms(false);
      }
    };

    loadPrograms();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!programId) {
      setError("Please select your academic program.");
      return;
    }

    try {
      setLoading(true);

      await registerStudent(name, studentId, email, programId, password);

      setSuccess(
        "Your account has been created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
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
        className="absolute -left-24 bottom-0 h-[360px] w-[360px] rounded-full bg-violet-600/20 blur-[100px]"
      />
      <ParticleField quantity={60} color="#818cf8" className="opacity-70" />

      <Link
        to="/"
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/50 backdrop-blur-xl lg:grid-cols-2"
        >
          {/* =====================================================
              LEFT BRANDING PANEL
          ====================================================== */}
          <div className="relative hidden flex-col justify-between overflow-hidden border-r border-white/5 bg-slate-900/60 p-12 lg:flex">
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl"
            />

            {/* Branding */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold shadow-lg shadow-indigo-500/30">
                E
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight">EduCore</p>
                <p className="text-xs text-slate-400">University Portal</p>
              </div>
            </div>

            {/* Message */}
            <div className="relative z-10 max-w-md">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                <span className="text-xs font-semibold tracking-wide text-indigo-300">
                  STUDENT PORTAL
                </span>
              </div>

              <div className="text-4xl font-bold leading-tight tracking-tight">
                <BlurText text="Start your" delay={60} direction="top" />
                <span className="block">
                  <GradientText
                    colors={["#818cf8", "#c084fc", "#22d3ee", "#818cf8"]}
                    animationSpeed={5}
                  >
                    <BlurText text="academic journey." delay={140} direction="top" />
                  </GradientText>
                </span>
              </div>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Create your EduCore account and get access to your academic
                information, courses, attendance, assessments, results and
                university services.
              </p>

              {/* Perks */}
              <div className="mt-10 space-y-4">
                {perks.map(({ icon: Icon, text }, index) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-indigo-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">{text}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Secure JWT-based access
            </div>
          </div>

          {/* =====================================================
              RIGHT FORM PANEL
          ====================================================== */}
          <div className="p-8 sm:p-10 lg:p-12">
            {/* Mobile branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white">
                E
              </div>
              <div>
                <p className="text-lg font-bold text-white">EduCore</p>
                <p className="text-xs text-slate-500">University Portal</p>
              </div>
            </div>

            {/* Header */}
            <div className="mb-8">
              <p className="text-xs font-bold tracking-[0.18em] text-indigo-400">
                STUDENT REGISTRATION
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                <SplitText text="Create your account" by="char" delay={60} />
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-400">
                Enter your academic information to create your EduCore student
                account.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-sm text-red-300"
              >
                <span className="mt-0.5 font-bold">!</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3.5 text-sm text-emerald-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Student ID + Email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Student ID
                  </label>
                  <div className="relative">
                    <IdCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2022330001"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    University Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Program */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Academic Program
                </label>
                <div className="relative">
                  <BookOpen className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <select
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                    disabled={loadingPrograms}
                    className={`${inputClass} appearance-none pr-10 text-slate-300`}
                    required
                  >
                    <option value="" className="bg-slate-900">
                      {loadingPrograms
                        ? "Loading academic programs..."
                        : "Select your academic program"}
                    </option>
                    {programs.map((program) => (
                      <option
                        key={program.id}
                        value={program.id}
                        className="bg-slate-900"
                      >
                        {program.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  Choose the program in which you are currently enrolled.
                </p>
              </div>

              {/* Password Section */}
              <div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        className="h-12 w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 hover:border-white/20 focus:border-indigo-400 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Use at least 6 characters for your password.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-indigo-400 hover:to-violet-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating your account...
                  </>
                ) : (
                  <>
                    Create Student Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            {/* Login link */}
            <div className="mt-8 border-t border-white/5 pt-6 text-center">
              <p className="text-sm text-slate-400">
                Already have an EduCore account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-500">
              © {new Date().getFullYear()} EduCore
              <span className="mx-2">•</span>
              University Portal
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Register;