import { useState } from "react";
import { ArrowLeft, Upload, Check, User, Bell, Zap, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { motion } from "motion/react";

interface SettingsPageProps {
  onBack: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsPage({ onBack, darkMode, onToggleDarkMode }: SettingsPageProps) {
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@email.com");
  const [bio, setBio] = useState("");
  const [expertiseLevel, setExpertiseLevel] = useState("intermediate");
  const [tonePreference, setTonePreference] = useState("balanced");
  const [responseLength, setResponseLength] = useState("medium");
  const [autosave, setAutosave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [collaboration, setCollaboration] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  const handleImageUpload = (type: 'profile' | 'banner') => {
    toast.success(`${type === 'profile' ? 'Profile picture' : 'Banner'} upload coming soon!`);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg text-foreground">Settings & Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          {/* Profile Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl mb-1">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Customize your profile information
              </p>
            </div>

            {/* Banner Upload */}
            <div className="relative h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg overflow-hidden group">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleImageUpload('banner')}
                className="absolute top-4 right-4 h-9 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Upload className="w-4 h-4" />
                Change banner
              </Button>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex items-end gap-4 -mt-16 px-4">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center border-4 border-background">
                  <User className="w-14 h-14 text-white" />
                </div>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => handleImageUpload('profile')}
                  className="absolute bottom-0 right-0 rounded-full w-9 h-9 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid gap-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>
          </motion.section>

          <Separator />

          {/* AI Preferences */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl mb-1">AI Preferences</h2>
              <p className="text-sm text-muted-foreground">
                Customize how AI responds to you
              </p>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="expertise">Expertise Level</Label>
                <Select value={expertiseLevel} onValueChange={setExpertiseLevel}>
                  <SelectTrigger id="expertise">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner - Detailed explanations</SelectItem>
                    <SelectItem value="intermediate">Intermediate - Balanced approach</SelectItem>
                    <SelectItem value="expert">Expert - Concise & technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Response Tone</Label>
                <Select value={tonePreference} onValueChange={setTonePreference}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                    <SelectItem value="creative">Creative & Playful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Response Length</Label>
                <Select value={responseLength} onValueChange={setResponseLength}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short - Quick answers</SelectItem>
                    <SelectItem value="medium">Medium - Balanced detail</SelectItem>
                    <SelectItem value="long">Long - Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.section>

          <Separator />

          {/* App Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4"
          >
            <div>
              <h2 className="text-xl mb-1">App Settings</h2>
              <p className="text-sm text-muted-foreground">
                Configure app behavior and features
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                    </p>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={onToggleDarkMode} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <Zap className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Autosave</p>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your work
                    </p>
                  </div>
                </div>
                <Switch checked={autosave} onCheckedChange={setAutosave} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <Bell className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and alerts
                    </p>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <User className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Collaboration</p>
                    <p className="text-sm text-muted-foreground">
                      Enable real-time collaboration features
                    </p>
                  </div>
                </div>
                <Switch checked={collaboration} onCheckedChange={setCollaboration} />
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <div className="flex justify-end gap-3 pt-6">
            <Button variant="outline" onClick={onBack} className="h-10 px-6">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="min-w-[140px] h-10 px-6">
              {saving ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Saved!
                </motion.div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
