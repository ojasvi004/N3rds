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

// Type definitions for the data structure
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
  churnOverview: ChurnOverviewItem[]; // ✅ Ensure churnOverview is an array
}

export default function Dashboard() {
  const [data, setData] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("../data/business.json")
      .then((module) => {
        setData(module.default as DataType);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading data:", error);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Format numbers
  const formatNumber = (number: number, decimals = 0): string => {
    return number.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // Format currency
  const formatCurrency = (amount: number, decimals = 2): string => {
    return `$${formatNumber(amount, decimals)}`;
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
    <div className="bg-gray-50 min-h-screen">
      <Head>
        <title>MRR & Churn Overview</title>
        <meta name="description" content="MRR and Churn metrics dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold text-gray-700">Stripe MRR & Churn Overview</h1>
          <div className="bg-orange-500 text-white rounded px-3 py-1 text-sm">Note: Showing sample data</div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-blue-500 font-medium">ARR</div>
            <div className="text-3xl font-bold">{formatCurrency(data.overview.arr.value)}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-green-500 font-medium">MRR</div>
            <div className="text-3xl font-bold">{formatCurrency(data.overview.mrr.value)}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-xs text-purple-500 font-medium">Customers</div>
            <div className="text-3xl font-bold">{formatNumber(data.overview.customers.value)}</div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* MRR Growth Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-700">MRR Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformMonthlyData(data.mrrGrowth?.monthlyData)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value / 1000}k`} />
                  <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "MRR"]} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* MRR by Plan Radar Chart */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-700">MRR by Plan</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={generateRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="MRR Distribution" dataKey="A" stroke="#36A2EB" fill="#36A2EB" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Churn Overview Table */}
        <div className="bg-white rounded-lg shadow p-4 mt-4">
          <h3 className="text-lg font-medium text-gray-700">Churn Overview</h3>
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-2">Metric</th>
                <th className="py-2">Value</th>
                <th className="py-2">Change</th>
              </tr>
            </thead>
            <tbody>
              {data.churnOverview.map((item, index) => (
                <tr key={index} className="border-t text-gray-700">
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