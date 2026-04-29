import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { 
  Scissors, 
  Play, 
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";

const bars = [
  {
    id: "BAR-001",
    length: 6000,
    cuts: [
      { id: "C1", length: 1200, code: "W-001" },
      { id: "C2", length: 1500, code: "W-002" },
      { id: "C3", length: 2800, code: "D-001" },
    ],
    waste: 500,
    efficiency: 91.7,
  },
  {
    id: "BAR-002",
    length: 6000,
    cuts: [
      { id: "C4", length: 1200, code: "W-003" },
      { id: "C5", length: 1200, code: "W-004" },
      { id: "C6", length: 1500, code: "W-005" },
      { id: "C7", length: 1800, code: "D-002" },
    ],
    waste: 300,
    efficiency: 95.0,
  },
  {
    id: "BAR-003",
    length: 6000,
    cuts: [
      { id: "C8", length: 2400, code: "W-006" },
      { id: "C9", length: 2200, code: "W-007" },
      { id: "C10", length: 900, code: "W-008" },
    ],
    waste: 500,
    efficiency: 91.7,
  },
];

const stats = [
  {
    label: "Total Bars Used",
    value: "3",
    icon: BarChart3,
    color: "blue",
  },
  {
    label: "Total Waste",
    value: "1,300 mm",
    icon: AlertTriangle,
    color: "orange",
  },
  {
    label: "Avg Efficiency",
    value: "92.8%",
    icon: CheckCircle2,
    color: "green",
  },
  {
    label: "Material Saved",
    value: "18.5%",
    icon: TrendingDown,
    color: "purple",
  },
];

export function Optimization() {
  const navigate = useNavigate();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleFinish = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const draftStr = localStorage.getItem("current_draft_project");
      if (draftStr) {
        const draft = JSON.parse(draftStr);
        const existingStr = localStorage.getItem("cutoptix_projects");
        const existing = existingStr ? JSON.parse(existingStr) : [];
        // update status and add optimization data
        draft.status = "in-progress";
        draft.optimization = {
          totalBars: 3,
          wasteSaved: "1,300 mm",
          efficiency: "92.8%",
          materialSaved: "18.5%"
        };
        localStorage.setItem("cutoptix_projects", JSON.stringify([draft, ...existing]));
        localStorage.removeItem("current_draft_project");
      }
      navigate("/");
    }, 1500);
  };

  return (
    <div className="max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Optimization</h2>
          <p className="text-gray-500 mt-1">Bar cutting optimization and waste minimization</p>
        </div>
        <Button 
          onClick={handleFinish} 
          disabled={isOptimizing}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-4 h-4" />
          {isOptimizing ? "Optimizing..." : "Finish & Save to Dashboard"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="flex items-start gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "orange"
                    ? "bg-orange-100"
                    : stat.color === "green"
                    ? "bg-green-100"
                    : "bg-purple-100"
                }`}
              >
                <stat.icon
                  className={`w-5 h-5 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "orange"
                      ? "text-orange-600"
                      : stat.color === "green"
                      ? "text-green-600"
                      : "text-purple-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Optimization Visualization */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Scissors className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Cutting Plan Visualization</h3>
              <p className="text-sm text-gray-500">Visual representation of optimized bar cuts</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {bars.map((bar) => {
            const totalCutLength = bar.cuts.reduce((sum, cut) => sum + cut.length, 0);
            return (
              <div key={bar.id} className="space-y-3">
                {/* Bar Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{bar.id}</h4>
                    <p className="text-sm text-gray-500">
                      Total: {bar.length}mm | Used: {totalCutLength}mm | Waste: {bar.waste}mm
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Efficiency:</span>
                    <span
                      className={`text-sm font-medium ${
                        bar.efficiency >= 95
                          ? "text-green-600"
                          : bar.efficiency >= 90
                          ? "text-blue-600"
                          : "text-orange-600"
                      }`}
                    >
                      {bar.efficiency}%
                    </span>
                  </div>
                </div>

                {/* Bar Visualization */}
                <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden">
                  {/* Cuts */}
                  <div className="absolute inset-0 flex">
                    {bar.cuts.map((cut, index) => {
                      const widthPercent = (cut.length / bar.length) * 100;
                      const colors = [
                        "bg-blue-500",
                        "bg-purple-500",
                        "bg-green-500",
                        "bg-pink-500",
                        "bg-indigo-500",
                      ];
                      return (
                        <div
                          key={cut.id}
                          className={`relative h-full ${
                            colors[index % colors.length]
                          } border-r-2 border-white flex flex-col items-center justify-center text-white group hover:brightness-110 transition-all`}
                          style={{ width: `${widthPercent}%` }}
                        >
                          <span className="text-xs font-medium">{cut.code}</span>
                          <span className="text-xs opacity-90">{cut.length}mm</span>
                        </div>
                      );
                    })}
                    {/* Waste */}
                    <div
                      className="relative h-full bg-gradient-to-r from-orange-300 to-red-400 flex flex-col items-center justify-center text-white"
                      style={{ width: `${(bar.waste / bar.length) * 100}%` }}
                    >
                      <AlertTriangle className="w-4 h-4 mb-1" />
                      <span className="text-xs font-medium">Waste</span>
                      <span className="text-xs">{bar.waste}mm</span>
                    </div>
                  </div>
                </div>

                {/* Cut Details */}
                <div className="flex flex-wrap gap-2">
                  {bar.cuts.map((cut, index) => {
                    const colors = [
                      "bg-blue-100 text-blue-700 border-blue-200",
                      "bg-purple-100 text-purple-700 border-purple-200",
                      "bg-green-100 text-green-700 border-green-200",
                      "bg-pink-100 text-pink-700 border-pink-200",
                      "bg-indigo-100 text-indigo-700 border-indigo-200",
                    ];
                    return (
                      <div
                        key={cut.id}
                        className={`px-3 py-1.5 rounded-md border text-xs font-medium ${
                          colors[index % colors.length]
                        }`}
                      >
                        {cut.code}: {cut.length}mm
                      </div>
                    );
                  })}
                  <div className="px-3 py-1.5 rounded-md border border-orange-200 bg-orange-100 text-orange-700 text-xs font-medium">
                    Waste: {bar.waste}mm
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-6 bg-gray-50">
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-700">Window Cut</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm text-gray-700">Door Cut</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-orange-300 to-red-400 rounded"></div>
            <span className="text-sm text-gray-700">Waste Material</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-700">&gt;95% Efficiency</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-gray-700">&lt;90% Efficiency</span>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-green-900 mb-1">Optimization Complete</h4>
            <p className="text-sm text-green-700">
              The algorithm has minimized waste to 7.2% (1,300mm total). This optimization saves
              approximately 18.5% compared to non-optimized cutting patterns. You can now generate
              the cutting chart report.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
