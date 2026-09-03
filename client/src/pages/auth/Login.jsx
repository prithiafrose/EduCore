import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authApi";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const data = await loginUser(email, password);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(data.data.user)
      );

      const role = data.data.user.role;

      if (role === "ADMIN") {
        navigate("/admin");
      } else if (role === "TEACHER") {
        navigate("/teacher");
      } else if (role === "STUDENT") {
        navigate("/student");
      }
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Invalid email or password."
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
                UNIVERSITY PORTAL
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight">
                Welcome
                <span className="block text-indigo-400">
                  back to EduCore.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                Sign in to manage your academic activities,
                courses, attendance, assessments, results and
                university services.
              </p>

              {/* Portal information */}
              <div className="mt-10 flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-800 text-xl">
                  🎓
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    One portal. Everything academic.
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Secure access for students, teachers and administrators
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
              RIGHT LOGIN PANEL
          ====================================================== */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 lg:py-12">

            {/* Mobile Branding */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">

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
                ACCOUNT LOGIN
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Sign in
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter your credentials to access your EduCore
                account.
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

            {/* Login Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-6"
            >

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

              </div>

              {/* Password */}
              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign In"}
              </button>

            </form>

            {/* Register */}
            <div className="mt-8 border-t border-slate-100 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Don't have a student account?{" "}

                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 transition hover:text-indigo-700"
                >
                  Create an account
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

export default Login;