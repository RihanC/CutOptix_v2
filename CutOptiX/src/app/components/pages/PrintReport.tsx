import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../ui/button";

export function PrintReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const savedProjects = localStorage.getItem("cutoptix_projects");
    if (savedProjects) {
      const parsed = JSON.parse(savedProjects);
      const found = parsed.find((p: any) => p.id === id);
      if (found) {
        setProject(found);
        setTimeout(() => window.print(), 500); // trigger print after render
      }
    }
  }, [id]);

  if (!project) return <div className="p-8">Loading or not found...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-black min-h-screen">
      <div className="flex items-center justify-between border-b pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CutOptix Optimization Report</h1>
          <p className="text-gray-500 mt-2">Project ID: {project.id}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-gray-900">{project.name}</p>
          <p className="text-sm text-gray-500">{project.date}</p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Project Details</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-medium">Client Name:</span> {project.clientName || "N/A"}</div>
            <div><span className="font-medium">Location:</span> {project.location || "N/A"}</div>
            <div><span className="font-medium">Budget (Cost):</span> {project.cost}</div>
            <div><span className="font-medium">Total Units:</span> {project.units || "N/A"}</div>
            <div><span className="font-medium">Deadline:</span> {project.deadline || "N/A"}</div>
          </div>
          {project.description && (
            <div className="mt-4 text-sm">
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-700">{project.description}</p>
            </div>
          )}
        </section>

        {project.designEntries && project.designEntries.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Design Inputs</h2>
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3">Code</th>
                  <th className="py-2 px-3">Typology</th>
                  <th className="py-2 px-3">Dimensions (W x H)</th>
                  <th className="py-2 px-3">Glass</th>
                  <th className="py-2 px-3">Finish</th>
                  <th className="py-2 px-3">Mesh</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {project.designEntries.map((entry: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 px-3">{entry.code || "N/A"}</td>
                    <td className="py-2 px-3 capitalize">{entry.typology || "N/A"}</td>
                    <td className="py-2 px-3">{entry.width || 0}mm x {entry.height || 0}mm</td>
                    <td className="py-2 px-3 capitalize">{entry.glassType || "N/A"}</td>
                    <td className="py-2 px-3 capitalize">{entry.finish?.replace(/-/g, ' ') || "N/A"}</td>
                    <td className="py-2 px-3">{entry.mesh ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {project.optimization && (
          <section>
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Optimization Results</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded border border-blue-100">
                <div className="text-blue-600 font-semibold mb-1">Total Bars Used</div>
                <div className="text-xl">{project.optimization.totalBars}</div>
              </div>
              <div className="bg-green-50 p-4 rounded border border-green-100">
                <div className="text-green-600 font-semibold mb-1">Avg Efficiency</div>
                <div className="text-xl">{project.optimization.efficiency}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded border border-orange-100">
                <div className="text-orange-600 font-semibold mb-1">Waste Generated</div>
                <div className="text-xl">{project.optimization.wasteSaved}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded border border-purple-100">
                <div className="text-purple-600 font-semibold mb-1">Material Saved</div>
                <div className="text-xl">{project.optimization.materialSaved}</div>
              </div>
            </div>
          </section>
        )}
      </div>

      <div className="mt-12 pt-8 border-t text-center text-sm text-gray-500 no-print">
        <Button onClick={() => navigate(-1)} variant="outline" className="mr-4">Back</Button>
        <Button onClick={() => window.print()} className="bg-blue-600">Print Again</Button>
      </div>
    </div>
  );
}
