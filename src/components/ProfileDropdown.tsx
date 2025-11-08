import { User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner@2.0.3";

interface ProfileDropdownProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSettings: () => void;
}

export function ProfileDropdown({ darkMode, onToggleDarkMode, onOpenSettings }: ProfileDropdownProps) {
  const handleProfile = () => {
    onOpenSettings();
  };

  const handleSettings = () => {
    onOpenSettings();
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              U
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-center gap-3 p-3">
          <Avatar className="w-11 h-11">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              U
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">User</p>
            <p className="text-xs text-muted-foreground">user@email.com</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile} className="gap-3 py-2.5">
          <User className="w-4 h-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings} className="gap-3 py-2.5">
          <Settings className="w-4 h-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onToggleDarkMode} className="gap-3 py-2.5">
          {darkMode ? (
            <>
              <Sun className="w-4 h-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              Dark Mode
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-3 py-2.5">
          <LogOut className="w-4 h-4" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}