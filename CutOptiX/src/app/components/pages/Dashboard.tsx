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
import { motion } from "framer-motion";
import emptyIllustration from "@/assets/empty-state.png";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

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
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedProjects = localStorage.getItem("cutoptix_projects");
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      setRecentProjects(parsed);
    } else {
      // If no projects in localStorage, we can either show empty or keep initial
      // setRecentProjects(initialProjects); // Let's keep it empty for the "Empty State" demo if no local projects
    }
    setIsLoading(false);
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
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-default group overflow-hidden relative">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-start justify-between relative z-10"
              >
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">{stat.title}</p>
                  <p className="text-3xl font-bold text-foreground mt-1 tracking-tighter">{stat.value}</p>
                  <p className="text-xs font-medium text-green-500 mt-2 flex items-center gap-1">
                    <TrendingDown className="w-3 h-3 rotate-180" />
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-lg ${
                    stat.color === "blue"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : stat.color === "green"
                      ? "bg-green-100 dark:bg-green-900/30"
                      : stat.color === "purple"
                      ? "bg-purple-100 dark:bg-purple-900/30"
                      : "bg-orange-100 dark:bg-orange-900/30"
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
              </motion.div>
              {/* Decorative background glow on hover */}
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/design-input">
          <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 hover:shadow-xl transition-all hover:border-primary/50 cursor-pointer group bg-gradient-to-br from-card to-card/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Create New Design</h3>
                  <p className="text-sm text-muted-foreground">Start a new project design</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>

        <Link to="/optimization">
          <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 hover:shadow-xl transition-all hover:border-primary/50 cursor-pointer group bg-gradient-to-br from-card to-card/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Run Optimization</h3>
                  <p className="text-sm text-muted-foreground">Optimize material cutting</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>

        <Link to="/reports">
          <motion.div whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="p-6 hover:shadow-xl transition-all hover:border-primary/50 cursor-pointer group bg-gradient-to-br from-card to-card/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">Download Reports</h3>
                  <p className="text-sm text-muted-foreground">View and export reports</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Link>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground tracking-tight">Recent Projects</h3>
          {recentProjects.length > 0 && (
            <Button variant="ghost" className="text-sm text-primary hover:bg-primary/5">View All</Button>
          )}
        </div>

        {recentProjects.length > 0 ? (
          <Card className="overflow-hidden border-border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Project ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Created Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cost Estimate</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentProjects.map((project, idx) => {
                    const status = getStatusConfig(project.status);
                    return (
                      <motion.tr 
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-foreground">{project.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-1 rounded">{project.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{project.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-foreground">{project.cost}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${status.className}`}>
                            <status.icon className="w-3 h-3" />
                            {status.label}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-12 text-center"
          >
            <div className="relative w-full max-w-sm aspect-square mb-8">
              <img 
                src={emptyIllustration} 
                alt="No projects yet" 
                className="w-full h-full object-contain drop-shadow-2xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground tracking-tight mb-2">No projects found</h3>
            <p className="text-muted-foreground max-w-md mb-8">
              You haven't created any optimization projects yet. Start by adding your first design input to see analytics and reports.
            </p>
            <Link to="/design-input">
              <Button className="px-8 py-6 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 gap-2 text-lg font-semibold group transition-all">
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Your First Project
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
