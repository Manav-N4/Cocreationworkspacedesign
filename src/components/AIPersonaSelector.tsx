import { Lightbulb, Microscope, Code, Palette, GraduationCap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type AIPersona = "brainstormer" | "critic" | "developer" | "designer" | "professor";

interface AIPersonaSelectorProps {
  value: AIPersona;
  onChange: (value: AIPersona) => void;
}

const personas = [
  {
    value: "brainstormer" as AIPersona,
    label: "Brainstormer",
    icon: Lightbulb,
    description: "Creative & idea-focused"
  },
  {
    value: "critic" as AIPersona,
    label: "Critic",
    icon: Microscope,
    description: "Analytical & detailed"
  },
  {
    value: "developer" as AIPersona,
    label: "Developer",
    icon: Code,
    description: "Technical & practical"
  },
  {
    value: "designer" as AIPersona,
    label: "Designer",
    icon: Palette,
    description: "Visual & aesthetic"
  },
  {
    value: "professor" as AIPersona,
    label: "Professor",
    icon: GraduationCap,
    description: "Educational & thorough"
  }
];

export function AIPersonaSelector({ value, onChange }: AIPersonaSelectorProps) {
  const currentPersona = personas.find(p => p.value === value) || personas[0];
  const Icon = currentPersona.icon;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">AI Persona:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[200px] h-9 border-border">
          <div className="flex items-center gap-2">
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          {personas.map((persona) => {
            const PersonaIcon = persona.icon;
            return (
              <SelectItem key={persona.value} value={persona.value}>
                <div className="flex items-center gap-3">
                  <PersonaIcon className="w-4 h-4" />
                  <div>
                    <div className="font-medium">{persona.label}</div>
                    <div className="text-xs text-muted-foreground">{persona.description}</div>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
