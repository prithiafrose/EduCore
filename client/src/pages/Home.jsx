import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-md shadow-indigo-600/20">
              E
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                EduCore
              </h1>

              <p className="text-xs text-slate-500">
                University Portal
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              About
            </a>

            <a
              href="#services"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Services
            </a>

            <a
              href="#access"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Portal Access
            </a>

          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
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

          {/* Background decoration */}
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-100/70 blur-3xl" />

          <div className="absolute -left-40 top-60 h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

            {/* Hero Content */}
            <div>

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">

                <span className="h-2 w-2 rounded-full bg-indigo-600" />

                <span className="text-xs font-bold tracking-wide text-indigo-700">
                  UNIVERSITY MANAGEMENT PORTAL
                </span>

              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Your university,
                <span className="block text-indigo-600">
                  connected in one place.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-500 sm:text-lg">
                EduCore brings academic information and university
                services together in one secure and easy-to-use
                digital platform for students, teachers and
                administrators.
              </p>

              {/* Hero Buttons */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30"
                >
                  Access Portal
                  <span className="ml-2">
                    →
                  </span>
                </Link>

                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Create Student Account
                </Link>

              </div>

            </div>


            {/* Hero Visual */}
            <div className="relative">

              <div className="relative mx-auto max-w-lg">

                {/* Main card */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-300/40">

                  {/* Dashboard header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
                        E
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          EduCore
                        </p>

                        <p className="text-xs text-slate-400">
                          Academic Portal
                        </p>
                      </div>

                    </div>

                    <div className="h-8 w-8 rounded-full bg-slate-100" />

                  </div>

                  {/* Welcome */}
                  <div className="py-6">

                    <p className="text-xs font-medium text-slate-400">
                      WELCOME TO YOUR PORTAL
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                      Everything academic,
                      <span className="block text-indigo-600">
                        in one place.
                      </span>
                    </h3>

                  </div>

                  {/* Dashboard cards */}
                  <div className="grid grid-cols-2 gap-4">

                    <div className="rounded-2xl bg-indigo-50 p-5">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                        📚
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-800">
                        Courses
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Academic courses
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                        📊
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-800">
                        Results
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Academic performance
                      </p>

                    </div>

                    <div className="rounded-2xl bg-slate-50 p-5">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg shadow-sm">
                        ✓
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-800">
                        Attendance
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Track attendance
                      </p>

                    </div>

                    <div className="rounded-2xl bg-indigo-50 p-5">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                        💳
                      </div>

                      <p className="mt-4 text-sm font-bold text-slate-800">
                        Payments
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Manage payments
                      </p>

                    </div>

                  </div>

                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-xl sm:block">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      ✓
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        PLATFORM
                      </p>

                      <p className="text-sm font-bold text-slate-800">
                        Secure & Connected
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            ABOUT
        ====================================================== */}
        <section
          id="about"
          className="border-y border-slate-200 bg-white"
        >

          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                ABOUT EDUCORE
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                A smarter way to manage university life
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-500 sm:text-base">
                EduCore provides a centralized digital environment
                where students, teachers and administrators can
                manage the academic activities that matter most.
              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            SERVICES
        ====================================================== */}
        <section
          id="services"
          className="bg-slate-50"
        >

          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            <div className="mb-12">

              <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                PLATFORM FEATURES
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Everything you need
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                Access the core academic services of your
                university through a single platform.
              </p>

            </div>


            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* Course */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                  📚
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Courses
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View courses and course offerings for your
                  academic program.
                </p>

              </div>


              {/* Attendance */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                  ✓
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Attendance
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep track of class attendance and academic
                  participation.
                </p>

              </div>


              {/* Assessments */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl">
                  📝
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Assessments
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Manage assessments, marks and academic
                  evaluations.
                </p>

              </div>


              {/* Results */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl">
                  📊
                </div>

                <h3 className="mt-5 font-bold text-slate-900">
                  Results
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View course results and academic performance
                  in one place.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            PORTAL ACCESS
        ====================================================== */}
        <section
          id="access"
          className="bg-white"
        >

          <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">

            <div className="mx-auto max-w-3xl text-center">

              <p className="text-xs font-bold tracking-[0.18em] text-indigo-600">
                PORTAL ACCESS
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                One platform for everyone
              </h2>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                EduCore provides role-based access so every user
                gets the tools relevant to their responsibilities.
              </p>

            </div>


            <div className="mt-12 grid gap-6 md:grid-cols-3">

              {/* Student */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-xl">
                  🎓
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Students
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Access courses, attendance, assessments,
                  results and other academic services.
                </p>

                <Link
                  to="/register"
                  className="mt-6 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Create student account →
                </Link>

              </div>


              {/* Teacher */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl">
                  👨‍🏫
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Teachers
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Manage assigned courses, assessments, exams,
                  marks and student academic activities.
                </p>

                <Link
                  to="/login"
                  className="mt-6 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Teacher sign in →
                </Link>

              </div>


              {/* Admin */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl">
                  ⚙
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  Administrators
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Manage academic structure, users, courses,
                  programs, teachers and university operations.
                </p>

                <Link
                  to="/login"
                  className="mt-6 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Administrator sign in →
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CTA
        ====================================================== */}
        <section className="px-6 pb-20 lg:px-8">

          <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-900 px-8 py-14 text-center shadow-xl sm:px-12">

            <p className="text-xs font-bold tracking-[0.18em] text-indigo-400">
              GET STARTED
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to access EduCore?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
              Sign in to your existing account or create a new
              student account to get started.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <Link
                to="/login"
                className="rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="rounded-xl border border-slate-700 bg-slate-800 px-7 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                Student Registration
              </Link>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-8">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white">
              E
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                EduCore
              </p>

              <p className="text-xs text-slate-400">
                University Portal
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} EduCore. All rights reserved.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;