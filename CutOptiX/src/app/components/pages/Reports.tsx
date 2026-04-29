import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { 
  FileText, 
  Download,
  FileSpreadsheet,
  FileType,
  Scissors,
  DollarSign,
  Eye,
  Calendar
} from "lucide-react";

const reports = [
  {
    id: "1",
    title: "Bill of Quantity (BOQ)",
    description: "Complete material and cost breakdown for the project",
    icon: DollarSign,
    date: "2026-04-15",
    status: "ready",
    color: "green",
  },
  {
    id: "2",
    title: "Cutting Chart",
    description: "Optimized cutting patterns and bar utilization plan",
    icon: Scissors,
    date: "2026-04-15",
    status: "ready",
    color: "blue",
  },
  {
    id: "3",
    title: "Project Quotation",
    description: "Client-facing quotation with pricing details",
    icon: FileText,
    date: "2026-04-15",
    status: "ready",
    color: "purple",
  },
  {
    id: "4",
    title: "Material Summary",
    description: "Summary of all materials required for fabrication",
    icon: FileSpreadsheet,
    date: "2026-04-15",
    status: "ready",
    color: "orange",
  },
];

const recentDownloads = [
  {
    id: "1",
    name: "BOQ_Project_A_15042026.pdf",
    type: "PDF",
    size: "245 KB",
    date: "2026-04-14",
  },
  {
    id: "2",
    name: "Cutting_Chart_Project_B.xlsx",
    type: "Excel",
    size: "128 KB",
    date: "2026-04-13",
  },
  {
    id: "3",
    name: "Quotation_Project_C.docx",
    type: "Word",
    size: "89 KB",
    date: "2026-04-12",
  },
];
import { useEffect, useState } from "react";

export function Reports() {
  const [projectReports, setProjectReports] = useState<any[]>([]);

  useEffect(() => {
    const savedProjects = localStorage.getItem("cutoptix_projects");
    if (savedProjects) {
      setProjectReports(JSON.parse(savedProjects));
    }
  }, []);
  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reports</h2>
          <p className="text-gray-500 mt-1">Generate and download project reports</p>
        </div>
      </div>

      {/* Available Reports */}
      <div>
        <h3 className="font-medium text-gray-900 mb-4">Project Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectReports.map((project) => (
            <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow border-blue-200 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-blue-100">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{project.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Project ID: {project.id} | Cost: {project.cost}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Created: {new Date(project.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => window.open(`/print-report/${project.id}`, '_blank')}
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </Card>
          ))}
          
          {reports.map((report) => (
            <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    report.color === "green"
                      ? "bg-green-100"
                      : report.color === "blue"
                      ? "bg-blue-100"
                      : report.color === "purple"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  <report.icon
                    className={`w-6 h-6 ${
                      report.color === "green"
                        ? "text-green-600"
                        : report.color === "blue"
                        ? "text-blue-600"
                        : report.color === "purple"
                        ? "text-purple-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{report.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Generated: {new Date(report.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </Button>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <FileSpreadsheet className="w-4 h-4" />
                  Excel
                </Button>
                <Button size="sm" variant="outline" className="gap-2">
                  <FileType className="w-4 h-4" />
                  Word
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Downloads */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900">Recent Downloads</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentDownloads.map((download) => (
            <div
              key={download.id}
              className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{download.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-gray-500">{download.type}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{download.size}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(download.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">Custom Report Generation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Generate custom reports with specific data points and formatting options. Select
              report type, date range, and export format.
            </p>
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4" />
              Create Custom Report
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Report Information</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>All reports are generated based on the latest project data</li>
              <li>Export formats: PDF (for sharing), Excel (for editing), Word (for customization)</li>
              <li>Reports are automatically saved for 30 days in your download history</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

const Plus = FileText;
