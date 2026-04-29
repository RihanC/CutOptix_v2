import { Card } from "../ui/card";
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const costTrendData = [
  { month: "Oct", cost: 42000, projects: 18 },
  { month: "Nov", cost: 45000, projects: 22 },
  { month: "Dec", cost: 38000, projects: 16 },
  { month: "Jan", cost: 51000, projects: 24 },
  { month: "Feb", cost: 48000, projects: 21 },
  { month: "Mar", cost: 52000, projects: 26 },
  { month: "Apr", cost: 48562, projects: 23 },
];

const materialUsageData = [
  { name: "Aluminum Profiles", value: 45, color: "#3b82f6" },
  { name: "Glass", value: 28, color: "#8b5cf6" },
  { name: "Hardware", value: 15, color: "#10b981" },
  { name: "Mesh", value: 8, color: "#f59e0b" },
  { name: "Other", value: 4, color: "#6b7280" },
];

const monthlyProjectsData = [
  { month: "Oct", completed: 16, inProgress: 2, pending: 0 },
  { month: "Nov", completed: 19, inProgress: 3, pending: 0 },
  { month: "Dec", completed: 14, inProgress: 2, pending: 0 },
  { month: "Jan", completed: 22, inProgress: 2, pending: 0 },
  { month: "Feb", completed: 18, inProgress: 3, pending: 0 },
  { month: "Mar", completed: 24, inProgress: 2, pending: 0 },
  { month: "Apr", completed: 20, inProgress: 2, pending: 1 },
];

const kpiData = [
  {
    title: "Total Revenue (YTD)",
    value: "₹324,562",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "green",
  },
  {
    title: "Avg Project Cost",
    value: "₹2,513",
    change: "+3.2%",
    trend: "up",
    icon: BarChart3,
    color: "blue",
  },
  {
    title: "Material Efficiency",
    value: "92.8%",
    change: "+1.8%",
    trend: "up",
    icon: Package,
    color: "purple",
  },
  {
    title: "Waste Reduction",
    value: "18.5%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingDown,
    color: "orange",
  },
];

export function Analytics() {
  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Analytics</h2>
          <p className="text-gray-500 mt-1">Performance metrics and insights</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white">
            <option>Last 7 months</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Last year</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{kpi.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  kpi.color === "green"
                    ? "bg-green-100"
                    : kpi.color === "blue"
                    ? "bg-blue-100"
                    : kpi.color === "purple"
                    ? "bg-purple-100"
                    : "bg-orange-100"
                }`}
              >
                <kpi.icon
                  className={`w-6 h-6 ${
                    kpi.color === "green"
                      ? "text-green-600"
                      : kpi.color === "blue"
                      ? "text-blue-600"
                      : kpi.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Trend Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Cost Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={costTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total Cost (₹)"
                dot={{ fill: "#3b82f6", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Material Usage Pie Chart */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Material Usage Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={materialUsageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {materialUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Monthly Projects Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyProjectsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[4, 4, 0, 0]} />
            <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pending" fill="#f59e0b" name="Pending" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-green-900">Revenue Growth</h4>
          </div>
          <p className="text-sm text-green-700">
            Revenue increased by 12.5% year-to-date, with March being the highest performing month.
          </p>
        </Card>

        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-blue-900">Efficiency Improvement</h4>
          </div>
          <p className="text-sm text-blue-700">
            Material efficiency improved to 92.8%, saving costs and reducing environmental impact.
          </p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <h4 className="font-medium text-purple-900">Project Completion</h4>
          </div>
          <p className="text-sm text-purple-700">
            Average of 20 projects completed per month with 95% on-time delivery rate.
          </p>
        </Card>
      </div>
    </div>
  );
}
