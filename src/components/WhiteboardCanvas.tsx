import { useState, useRef, useEffect } from "react";
import { 
  Pencil, Square, Circle, Type, Eraser, Undo2, Redo2, 
  Trash2, Download, Sparkles, Eye, EyeOff, Lock, Unlock,
  Layers, MessageSquare
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

type Tool = "pen" | "shape-square" | "shape-circle" | "text" | "eraser";

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
}

interface WhiteboardCanvasProps {
  darkMode: boolean;
}

export function WhiteboardCanvas({ darkMode }: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool>("pen");
  const [isDrawing, setIsDrawing] = useState(false);
  const [layers, setLayers] = useState<Layer[]>([
    { id: "1", name: "Layer 1", visible: true, locked: false }
  ]);
  const [selectedLayer, setSelectedLayer] = useState("1");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set background
    ctx.fillStyle = darkMode ? "#1a1a1a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [darkMode]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = darkMode ? "#ffffff" : "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === "pen") {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (selectedTool === "eraser") {
      ctx.clearRect(x - 5, y - 5, 10, 10);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = darkMode ? "#1a1a1a" : "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    toast.success("Canvas cleared");
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = url;
    link.click();
    toast.success("Whiteboard exported!");
  };

  const handleAIAssist = () => {
    toast.success("AI generating diagram...");
    // Simulate AI generation
    setTimeout(() => {
      toast.success("Diagram generated! Check the canvas.");
    }, 2000);
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
    ));
  };

  const toggleLayerLock = (layerId: string) => {
    setLayers(layers.map(layer =>
      layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
    ));
  };

  const addLayer = () => {
    const newLayer: Layer = {
      id: Date.now().toString(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false
    };
    setLayers([...layers, newLayer]);
    setSelectedLayer(newLayer.id);
    toast.success("New layer added");
  };

  return (
    <div className="h-full flex">
      {/* Left Panel - Layers */}
      <div className="w-72 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span className="text-sm">Layers</span>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={addLayer}>
            <Pencil className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {layers.map(layer => (
              <div
                key={layer.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                  selectedLayer === layer.id ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedLayer(layer.id)}
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                >
                  {layer.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
                <span className="flex-1 text-sm truncate">{layer.name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer.id);
                  }}
                >
                  {layer.locked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Unlock className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="border-b border-border p-4 flex items-center gap-3 bg-card">
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              size="icon"
              variant={selectedTool === "pen" ? "default" : "ghost"}
              className="h-9 w-9"
              onClick={() => setSelectedTool("pen")}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={selectedTool === "shape-square" ? "default" : "ghost"}
              className="h-9 w-9"
              onClick={() => setSelectedTool("shape-square")}
            >
              <Square className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={selectedTool === "shape-circle" ? "default" : "ghost"}
              className="h-9 w-9"
              onClick={() => setSelectedTool("shape-circle")}
            >
              <Circle className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={selectedTool === "text" ? "default" : "ghost"}
              className="h-9 w-9"
              onClick={() => setSelectedTool("text")}
            >
              <Type className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant={selectedTool === "eraser" ? "default" : "ghost"}
              className="h-9 w-9"
              onClick={() => setSelectedTool("eraser")}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          <Button size="icon" variant="ghost" className="h-9 w-9">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <Redo2 className="w-4 h-4" />
          </Button>

          <Separator orientation="vertical" className="h-8" />

          <Button
            size="sm"
            variant="default"
            className="h-9 px-4 bg-gradient-to-r from-purple-500 to-blue-600 gap-2"
            onClick={handleAIAssist}
          >
            <Sparkles className="w-4 h-4" />
            AI Assist
          </Button>

          <div className="flex-1" />

          <Button size="sm" variant="ghost" className="h-9 gap-2" onClick={handleClear}>
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
          <Button size="sm" variant="ghost" className="h-9 gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 overflow-auto bg-muted/20 p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full max-w-5xl mx-auto bg-background rounded-lg shadow-2xl overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-crosshair"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </motion.div>
        </div>

        {/* Bottom Bar - Collaborators */}
        <div className="border-t border-border p-4 flex items-center gap-3 bg-card">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 border-2 border-background flex items-center justify-center"
                title={`User ${i}`}
              >
                <span className="text-xs text-white">U{i}</span>
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">3 collaborators active</span>
        </div>
      </div>

      {/* Right Panel - AI Notes */}
      <div className="w-80 border-l border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm">AI Suggestions</span>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Try adding a flowchart to visualize your process</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Consider grouping related items with color coding</p>
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
