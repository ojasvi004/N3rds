"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface Overview {
  arr: { value: number };
  mrr: { value: number };
  customers: { value: number };
}

interface MonthlyData {
  month: string;
  value: number;
}

interface MRRByPlan {
  categories: string[];
  values: number[];
}

interface ChurnOverviewItem {
  metric: string;
  value: number;
  percentChange: number;
  trend: string;
  isPercentage?: boolean;
}

interface DataType {
  overview: Overview;
  mrrGrowth: { monthlyData: MonthlyData[] };
  mrrByPlan: MRRByPlan;
  churnOverview: ChurnOverviewItem[]; 
}

export default function Dashboard() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Load data from JSON file
    import("../data/business.json")
      .then((module) => {
        setData(module.default as DataType);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });

    // Check if user has a theme preference stored
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (loading || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Format numbers for Indian locale
  const formatNumber = (number: number, decimals = 0): string => {
    return number.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format currency in Indian Rupees
  const formatCurrency = (amount: number, decimals = 2): string => {
    return `₹${formatNumber(amount, decimals)}`;
  };

  // Transform data for charts
  const transformMonthlyData = (dataArray: MonthlyData[]) =>
    dataArray.map((item) => ({ name: item.month, value: item.value }));

  // Radar chart data for MRR by Plan
  const generateRadarData = () => {
    if (!data?.mrrByPlan?.categories || !data?.mrrByPlan?.values) return [];
    return data.mrrByPlan.categories.map((category, index) => ({
      subject: category,
      A: data.mrrByPlan.values[index],
      fullMark: 100,
    }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"}`}>
      <Head>
        <title>MRR & Churn Overview - India</title>
        <meta name="description" content="MRR and Churn metrics dashboard (India)" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="p-6">
        {/* Header Section with Theme Toggle */}
        <div className="flex justify-between items-center mb-4">
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-black"}`}>
            Indian Business MRR & Churn Overview
          </h1>
          
          <div className="flex items-center gap-4">
          <div className="bg-pink-400 text-white rounded-xl px-3 py-1 text-sm">
              Showing Indian market data
            </div>
            <button
              onClick={toggleTheme}
              className={`px-3 py-1 rounded-lg flex items-center gap-2 ${
                darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  
                </>
              )}
            </button>
           
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* MRR Growth Chart */}
          <div className={`rounded-lg shadow p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium text-pink-500">MRR Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformMonthlyData(data.mrrGrowth?.monthlyData as MonthlyData[])}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                  <YAxis 
                    tickFormatter={(value: number) => `${value / 1000}k`} 
                    stroke={darkMode ? "#9CA3AF" : "#6B7280"} 
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, "MRR"]}
                    contentStyle={{ 
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      color: darkMode ? "#FFFFFF" : "#000000",
                      border: darkMode ? "1px solid #374151" : "1px solid #E5E7EB"
                    }} 
                  />
                  <Line type="monotone" dataKey="value" stroke="#FF1493" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MRR by Plan Radar Chart */}
          <div className={`rounded-lg shadow p-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-lg font-medium text-pink-500">MRR by Plan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generateRadarData()}>
                  <PolarGrid stroke={darkMode ? "#374151" : "#e5e7eb"} />
                  <PolarAngleAxis dataKey="subject" stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={darkMode ? "#9CA3AF" : "#6B7280"} />
                  <Radar name="MRR Distribution" dataKey="A" stroke="#FF1493" fill="#FF1493" fillOpacity={0.6} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? "#1F2937" : "#FFFFFF",
                      color: darkMode ? "#FFFFFF" : "#000000",
                      border: darkMode ? "1px solid #374151" : "1px solid #E5E7EB"
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Churn Overview Table */}
        <div className={`rounded-lg shadow p-4 mt-4 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <h3 className={`text-lg font-medium ${darkMode ? "text-white" : "text-black"}`}>Churn Overview</h3>
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="text-left text-pink-500 text-sm">
                <th className="py-2">Metric</th>
                <th className="py-2">Value</th>
                <th className="py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.churnOverview.map((item, index) => (
                <tr key={index} className={`border-t ${darkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-black"}`}>
                  <td className="py-2">{item.metric}</td>
                  <td className="py-2">
                    {item.isPercentage ? `${item.value}%` : formatCurrency(item.value)}
                  </td>
                  <td className={`py-2 ${item.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {item.percentChange}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}