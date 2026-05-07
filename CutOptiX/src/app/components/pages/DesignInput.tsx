import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { 
  FileInput, 
  Plus, 
  Trash2,
  Send
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface DesignEntry {
  id: string;
  code: string;
  width: string;
  height: string;
  typology: string;
  glassType: string;
  mesh: boolean;
  finish: string;
}

export function DesignInput() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<DesignEntry[]>([
    {
      id: "1",
      code: "",
      width: "",
      height: "",
      typology: "",
      glassType: "",
      mesh: false,
      finish: "",
    },
  ]);

  const addEntry = () => {
    setEntries([
      ...entries,
      {
        id: Date.now().toString(),
        code: "",
        width: "",
        height: "",
        typology: "",
        glassType: "",
        mesh: false,
        finish: "",
      },
    ]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((entry) => entry.id !== id));
    }
  };

  const updateEntry = (id: string, field: keyof DesignEntry, value: any) => {
    setEntries(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  return (
    <div className="max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Design Input</h2>
          <p className="text-muted-foreground mt-1">Enter window and door specifications</p>
        </div>
        <Button onClick={addEntry} variant="outline" className="gap-2 border-border text-foreground hover:bg-muted">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Input Form */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FileInput className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-foreground">Specification Details</h3>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {entries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Entry Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Item #{index + 1}
                </span>
                {entries.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEntry(entry.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Entry Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                {/* Window/Door Code */}
                <div className="space-y-2">
                  <Label htmlFor={`code-${entry.id}`} className="text-foreground">Window/Door Code *</Label>
                  <Input
                    id={`code-${entry.id}`}
                    placeholder="e.g., W-001"
                    value={entry.code}
                    onChange={(e) => updateEntry(entry.id, "code", e.target.value)}
                    className="bg-card text-foreground border-border"
                  />
                </div>

                {/* Width */}
                <div className="space-y-2">
                  <Label htmlFor={`width-${entry.id}`} className="text-foreground">Width (mm) *</Label>
                  <Input
                    id={`width-${entry.id}`}
                    type="number"
                    placeholder="e.g., 1200"
                    value={entry.width}
                    onChange={(e) => updateEntry(entry.id, "width", e.target.value)}
                    className="bg-card text-foreground border-border"
                  />
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label htmlFor={`height-${entry.id}`} className="text-foreground">Height (mm) *</Label>
                  <Input
                    id={`height-${entry.id}`}
                    type="number"
                    placeholder="e.g., 1500"
                    value={entry.height}
                    onChange={(e) => updateEntry(entry.id, "height", e.target.value)}
                    className="bg-card text-foreground border-border"
                  />
                </div>

                {/* Typology */}
                <div className="space-y-2">
                  <Label htmlFor={`typology-${entry.id}`}>Typology *</Label>
                  <Select
                    value={entry.typology}
                    onValueChange={(value) => updateEntry(entry.id, "typology", value)}
                  >
                    <SelectTrigger id={`typology-${entry.id}`} className="bg-white">
                      <SelectValue placeholder="Select typology" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sliding">Sliding Window</SelectItem>
                      <SelectItem value="casement">Casement Window</SelectItem>
                      <SelectItem value="fixed">Fixed Window</SelectItem>
                      <SelectItem value="door-single">Single Door</SelectItem>
                      <SelectItem value="door-double">Double Door</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Glass Type */}
                <div className="space-y-2">
                  <Label htmlFor={`glass-${entry.id}`}>Glass Type *</Label>
                  <Select
                    value={entry.glassType}
                    onValueChange={(value) => updateEntry(entry.id, "glassType", value)}
                  >
                    <SelectTrigger id={`glass-${entry.id}`} className="bg-white">
                      <SelectValue placeholder="Select glass type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clear">Clear Glass</SelectItem>
                      <SelectItem value="tinted">Tinted Glass</SelectItem>
                      <SelectItem value="frosted">Frosted Glass</SelectItem>
                      <SelectItem value="tempered">Tempered Glass</SelectItem>
                      <SelectItem value="laminated">Laminated Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Finish */}
                <div className="space-y-2">
                  <Label htmlFor={`finish-${entry.id}`}>Finish *</Label>
                  <Select
                    value={entry.finish}
                    onValueChange={(value) => updateEntry(entry.id, "finish", value)}
                  >
                    <SelectTrigger id={`finish-${entry.id}`} className="bg-white">
                      <SelectValue placeholder="Select finish" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="powder-coated-white">Powder Coated White</SelectItem>
                      <SelectItem value="powder-coated-black">Powder Coated Black</SelectItem>
                      <SelectItem value="anodized">Anodized Aluminum</SelectItem>
                      <SelectItem value="wood-grain">Wood Grain</SelectItem>
                      <SelectItem value="custom">Custom Color</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mesh Toggle */}
                <div className="space-y-2 flex flex-col justify-end">
                  <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
                    <Label htmlFor={`mesh-${entry.id}`} className="cursor-pointer text-foreground">
                      Include Mesh
                    </Label>
                    <Switch
                      id={`mesh-${entry.id}`}
                      checked={entry.mesh}
                      onCheckedChange={(checked) =>
                        updateEntry(entry.id, "mesh", checked)
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              {index < entries.length - 1 && (
                <div className="h-px bg-border my-6" />
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Total Items: <span className="font-medium text-foreground">{entries.length}</span>
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={addEntry} className="gap-2">
                <Plus className="w-4 h-4" />
                Add More
              </Button>
              <Button 
                className="gap-2 bg-blue-600 hover:bg-blue-700" 
                onClick={() => {
                  const draftStr = localStorage.getItem("current_draft_project");
                  if (draftStr) {
                    const draft = JSON.parse(draftStr);
                    draft.designEntries = entries;
                    localStorage.setItem("current_draft_project", JSON.stringify(draft));
                  }
                  navigate("/optimization");
                }}
              >
                <Send className="w-4 h-4" />
                Generate Output
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Help Card */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <div className="shrink-0">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
              <FileInput className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Input Guidelines</h4>
            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
              <li>Ensure all required fields (*) are filled before generating output</li>
              <li>Dimensions should be in millimeters (mm)</li>
              <li>Use standard codes for easy identification (e.g., W-001, D-001)</li>
              <li>Click "Generate Output" to proceed to optimization</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
