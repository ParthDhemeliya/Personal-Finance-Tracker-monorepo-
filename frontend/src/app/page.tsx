"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  DollarSign,
  PieChart,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useTypedSelector";
import Head from "next/head";

const LandingPage = () => {
  const router = useRouter();
  const { user, hasFetchedUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (hasFetchedUser && user) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  }, [user, hasFetchedUser, router]);

  return (
    <>
      <Head>
        <title>Personal Finance Tracker - Home</title>
        <meta
          name="description"
          content="Take control of your financial future with our comprehensive tracking tools. Track income, expenses, set budgets, and achieve your goals with ease."
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-200 flex flex-col">
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600 animate-bounce" />
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                My Budget
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                type="button"
                className="cursor-pointer bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded px-4 py-2 shadow-sm transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/signup")}
                type="button"
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 shadow-sm transition"
              >
                Sign Up
              </button>
            </div>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 flex-1 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 drop-shadow-lg">
              Personal Finance Tracker
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
              Take control of your financial future with our comprehensive
              tracking tools.
              <br />
              <span className="text-blue-600 font-semibold">
                Monitor expenses
              </span>
              ,{" "}
              <span className="text-green-600 font-semibold">set budgets</span>,
              and{" "}
              <span className="text-purple-600 font-semibold">
                achieve your goals
              </span>{" "}
              with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/signup" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white px-8 sm:px-10 py-3 rounded-full text-base sm:text-lg flex items-center justify-center shadow-lg transition-all duration-200 group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition group border-t-4 border-blue-200 hover:border-blue-400">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Expense Tracking
                </h3>
                <p className="text-gray-600">
                  Monitor your daily expenses and categorize spending to
                  understand where your money goes.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition group border-t-4 border-green-200 hover:border-green-400">
                <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <PieChart className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Budget Planning
                </h3>
                <p className="text-gray-600">
                  Set monthly budgets and get alerts when you're approaching
                  your limits.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-xl hover:shadow-2xl transition group border-t-4 border-purple-200 hover:border-purple-400">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Financial Goals
                </h3>
                <p className="text-gray-600">
                  Track your progress towards savings goals and financial
                  milestones.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-4 py-8 mt-16">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 FinanceTracker. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
