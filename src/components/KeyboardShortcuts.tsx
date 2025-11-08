import { Command } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Separator } from "./ui/separator";

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: "General",
    items: [
      { keys: ["Cmd", "/"], description: "Open keyboard shortcuts" },
      { keys: ["Cmd", "K"], description: "Quick command palette" },
      { keys: ["Cmd", "N"], description: "New chat session" },
      { keys: ["Cmd", "S"], description: "Save current work" },
    ]
  },
  {
    category: "Navigation",
    items: [
      { keys: ["Cmd", "B"], description: "Toggle session sidebar" },
      { keys: ["Cmd", "Shift", "W"], description: "Switch to whiteboard" },
      { keys: ["Cmd", "Shift", "C"], description: "Switch to chat" },
      { keys: ["Esc"], description: "Close current modal" },
    ]
  },
  {
    category: "Chat",
    items: [
      { keys: ["Enter"], description: "Send message" },
      { keys: ["Shift", "Enter"], description: "New line" },
      { keys: ["Cmd", "E"], description: "Edit last message" },
      { keys: ["Cmd", "Shift", "S"], description: "Save to snippets" },
    ]
  },
  {
    category: "Whiteboard",
    items: [
      { keys: ["P"], description: "Select pen tool" },
      { keys: ["E"], description: "Select eraser" },
      { keys: ["Cmd", "Z"], description: "Undo" },
      { keys: ["Cmd", "Shift", "Z"], description: "Redo" },
    ]
  }
];

export function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Command className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Master these shortcuts to speed up your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {shortcuts.map((section, index) => (
            <div key={section.category}>
              {index > 0 && <Separator className="my-6" />}
              <div className="space-y-4">
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider">
                  {section.category}
                </h3>
                <div className="space-y-3">
                  {section.items.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1.5">
                        {shortcut.keys.map((key, keyIdx) => (
                          <kbd
                            key={keyIdx}
                            className="px-3 py-1.5 text-xs bg-muted border border-border rounded font-medium"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
