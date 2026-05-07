import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { 
  FolderPlus, 
  FileText, 
  DollarSign, 
  Package, 
  TrendingDown, 
  Plus,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Link } from "react-router";

const stats = [
  {
    title: "Total Projects",
    value: "127",
    icon: FolderPlus,
    change: "+12%",
    color: "blue",
  },
  {
    title: "Total Cost",
    value: "₹48,562",
    icon: DollarSign,
    change: "+8%",
    color: "green",
  },
  {
    title: "Material Usage",
    value: "3,842 m",
    icon: Package,
    change: "+5%",
    color: "purple",
  },
  {
    title: "Waste Saved",
    value: "18.5%",
    icon: TrendingDown,
    change: "+3%",
    color: "orange",
  },
];

const initialProjects = [
  {
    id: "PRJ-001",
    name: "Residential Complex A",
    date: "2026-04-14",
    cost: "₹12,450",
    status: "completed",
  },
  {
    id: "PRJ-002",
    name: "Commercial Building B",
    date: "2026-04-13",
    cost: "₹8,320",
    status: "in-progress",
  },
  {
    id: "PRJ-003",
    name: "Office Tower C",
    date: "2026-04-12",
    cost: "₹15,890",
    status: "completed",
  },
  {
    id: "PRJ-004",
    name: "Shopping Mall D",
    date: "2026-04-11",
    cost: "₹6,720",
    status: "pending",
  },
  {
    id: "PRJ-005",
    name: "Hotel Project E",
    date: "2026-04-10",
    cost: "₹9,540",
    status: "completed",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-700",
      };
    case "in-progress":
      return {
        label: "In Progress",
        icon: Clock,
        className: "bg-blue-100 text-blue-700",
      };
    case "pending":
      return {
        label: "Pending",
        icon: AlertCircle,
        className: "bg-amber-100 text-amber-700",
      };
    default:
      return {
        label: status,
        icon: Clock,
        className: "bg-muted text-muted-foreground",
      };
  }
};

import { useEffect, useState } from "react";

export function Dashboard() {
  const [recentProjects, setRecentProjects] = useState(initialProjects);

  useEffect(() => {
    const savedProjects = localStorage.getItem("cutoptix_projects");
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setRecentProjects([...parsed, ...initialProjects]);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Dashboard</h2>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your overview.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/reports">
            <Button variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
              <Download className="w-4 h-4" />
              Generate Report
            </Button>
          </Link>
          <Link to="/new-project">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-semibold text-foreground mt-2">{stat.value}</p>
                <p className="text-sm text-green-500 mt-2">{stat.change} from last month</p>
              </div>
              <div
                className={`p-3 rounded-lg ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "green"
                    ? "bg-green-100"
                    : stat.color === "purple"
                    ? "bg-purple-100"
                    : "bg-orange-100"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                      ? "text-green-600"
                      : stat.color === "purple"
                      ? "text-purple-600"
                      : "text-orange-600"
                  }`}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/design-input">
          <Card className="p-6 hover:shadow-lg transition-all hover:border-blue-200 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Create New Design</h3>
                <p className="text-sm text-muted-foreground">Start a new project design</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/optimization">
          <Card className="p-6 hover:shadow-lg transition-all hover:border-purple-200 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Run Optimization</h3>
                <p className="text-sm text-muted-foreground">Optimize material cutting</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/reports">
          <Card className="p-6 hover:shadow-lg transition-all hover:border-green-200 cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Download Reports</h3>
                <p className="text-sm text-muted-foreground">View and export reports</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Projects Table */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Recent Projects</h3>
            <Link to="/reports">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">View All</Button>
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Project ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentProjects.map((project) => {
                const statusConfig = getStatusConfig(project.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <tr key={project.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {project.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {project.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(project.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {project.cost}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.className}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
