import { useState } from "react";
import { Copy, Link2, Mail, Users, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTitle: string;
}

type Permission = "view" | "comment" | "edit";

export function ShareDialog({ isOpen, onClose, sessionTitle }: ShareDialogProps) {
  const [permission, setPermission] = useState<Permission>("view");
  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);

  const shareLink = `https://gemini-cocreate.app/session/${Date.now()}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteByEmail = () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    toast.success(`Invitation sent to ${email}!`);
    setEmail("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{sessionTitle}"</DialogTitle>
          <DialogDescription>
            Invite others to collaborate on this session
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Copy Link */}
          <div className="space-y-3">
            <Label>Share link</Label>
            <div className="flex gap-2">
              <Input value={shareLink} readOnly className="flex-1 h-10" />
              <Button
                variant={copied ? "default" : "outline"}
                size="icon"
                onClick={handleCopyLink}
                className="h-10 w-10"
              >
                {copied ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anyone with the link can {permission === "view" ? "view" : permission === "comment" ? "view and comment on" : "view and edit"} this session
            </p>
          </div>

          {/* Permission Level */}
          <div className="space-y-3">
            <Label>Permission level</Label>
            <Select value={permission} onValueChange={(v) => setPermission(v as Permission)}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <div>
                      <p className="font-medium">View</p>
                      <p className="text-xs text-muted-foreground">Can only view</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="comment">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Comment</p>
                      <p className="text-xs text-muted-foreground">Can view and comment</p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="edit">
                  <div className="flex items-center gap-3">
                    <Link2 className="w-4 h-4" />
                    <div>
                      <p className="font-medium">Edit</p>
                      <p className="text-xs text-muted-foreground">Can view and edit</p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invite by Email */}
          <div className="space-y-3">
            <Label>Invite by email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleInviteByEmail()}
                className="h-10"
              />
              <Button onClick={handleInviteByEmail} className="h-10 px-4 gap-2">
                <Mail className="w-4 h-4" />
                Invite
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose} className="h-10 px-6">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
