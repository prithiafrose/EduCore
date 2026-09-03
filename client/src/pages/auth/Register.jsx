import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerStudent } from "../../services/authApi";
import { getPrograms } from "../../services/programApi";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [programId, setProgramId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [programs, setPrograms] = useState([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        const data = await getPrograms();
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

      await registerStudent(
        name,
        studentId,
        email,
        programId,
        password
      );

      setSuccess(
        "Your account has been created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">

      {/* Main Card */}
      <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* =====================================================
              LEFT BRANDING PANEL
          ====================================================== */}
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-slate-900 p-12 text-white">

            {/* Decorative circles */}
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/20" />

            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/10" />

            <div className="absolute right-10 top-1/2 h-32 w-32 rounded-full bg-indigo-400/5" />

            {/* Branding */}
            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500 text-lg font-bold shadow-lg">
                  E
                </div>

                <div>
                  <h1 className="text-xl font-bold tracking-tight">
                    EduCore
                  </h1>

                  <p className="text-xs text-slate-400">
                    University Portal
                  </p>
                </div>

              </div>

            </div>

            {/* Main message */}
            <div className="relative z-10 max-w-md">

              <div className="mb-5 inline-flex rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-xs font-medium text-slate-300">
                STUDENT PORTAL
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight">
                Your academic journey,
                <span className="block text-indigo-400">
                  all in one place.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Create your EduCore account and get access to
                your academic information, courses, attendance,
                assessments, results and university services.
              </p>

              {/* Academic icon */}
              <div className="mt-10 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-xl">
                  🎓
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Welcome to EduCore
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Your digital university experience
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="relative z-10">
              <p className="text-xs text-slate-500">
                Secure • Simple • Connected
              </p>
            </div>

          </div>

          {/* =====================================================
              RIGHT FORM PANEL
          ====================================================== */}
          <div className="px-6 py-8 sm:px-10 sm:py-10 lg:px-14 lg:py-12">

            {/* Mobile Branding */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
                E
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  EduCore
                </h1>

                <p className="text-xs text-slate-500">
                  University Portal
                </p>
              </div>

            </div>

            {/* Header */}
            <div className="mb-8">

              <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                STUDENT REGISTRATION
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Create your account
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Enter your academic information to create your
                EduCore student account.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-700">

                <span className="mt-0.5 font-bold">
                  !
                </span>

                <span>{error}</span>

              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">

                <span className="mt-0.5 font-bold">
                  ✓
                </span>

                <span>{success}</span>

              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleRegister}
              className="space-y-6"
            >

              {/* Full Name */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

              </div>

              {/* Student ID + Email */}
              <div className="grid gap-6 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Student ID
                  </label>

                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) =>
                      setStudentId(e.target.value)
                    }
                    placeholder="e.g. 2022330001"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    University Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@university.edu"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

              </div>

              {/* Program */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Academic Program
                </label>

                <select
                  value={programId}
                  onChange={(e) =>
                    setProgramId(e.target.value)
                  }
                  disabled={loadingPrograms}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                  required
                >
                  <option value="">
                    {loadingPrograms
                      ? "Loading academic programs..."
                      : "Select your academic program"}
                  </option>

                  {programs.map((program) => (
                    <option
                      key={program.id}
                      value={program.id}
                    >
                      {program.name}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs text-slate-400">
                  Choose the program in which you are currently
                  enrolled.
                </p>

              </div>

              {/* Password Section */}
              <div>

                <div className="grid gap-6 sm:grid-cols-2">

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Create a password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />

                  </div>

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />

                  </div>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Use at least 6 characters for your password.
                </p>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating your account..."
                  : "Create Student Account"}
              </button>

            </form>

            {/* Login */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Already have an EduCore account?{" "}

                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>

            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} EduCore
              <span className="mx-2">•</span>
              University Portal
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;