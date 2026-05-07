import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Lock,
  Globe,
  Save,
  Shield,
  Camera,
  Moon,
  Sun
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export function Settings() {
  const [user, setUser] = useState({ name: "", email: "", phone: "", company: "" });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "+1 (555) 123-4567",
        company: parsedUser.company || "CutOptix Industries"
      });
    }

    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) setProfileImage(savedImage);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleProfileSave = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const updatedUser = { ...currentUser, ...user };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    
    // Also update in user list
    const users = JSON.parse(localStorage.getItem("cutoptix_users") || "[]");
    const updatedUsers = users.map((u: any) => u.email === currentUser.email ? { ...u, ...user } : u);
    localStorage.setItem("cutoptix_users", JSON.stringify(updatedUsers));
    
    toast.success("Profile updated successfully!");
    window.location.reload(); // Refresh to update header
  };

  const handlePasswordUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    const users = JSON.parse(localStorage.getItem("cutoptix_users") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email && u.password === passwords.current);
    
    if (userIndex === -1 && passwords.current !== "pass123") { // Special case for hardcoded admin
      toast.error("Current password incorrect!");
      return;
    }

    if (userIndex !== -1) {
      users[userIndex].password = passwords.new;
      localStorage.setItem("cutoptix_users", JSON.stringify(users));
    }
    
    toast.success("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
        toast.success("Profile photo updated!");
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    toast.info(`Switched to ${newMode ? 'Dark' : 'Light'} Mode`);
  };
  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your account and application preferences</p>
      </div>

      {/* Profile Settings */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Profile Information</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-medium overflow-hidden border-2 border-white shadow-sm">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
            <div>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>Change Photo</Button>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={user.name} 
                onChange={(e) => setUser({...user, name: e.target.value})}
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={user.email} 
                onChange={(e) => setUser({...user, email: e.target.value})}
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={user.phone} 
                onChange={(e) => setUser({...user, phone: e.target.value})}
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={user.company} 
                onChange={(e) => setUser({...user, company: e.target.value})}
                className="bg-white" 
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleProfileSave}>
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Security</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input 
              id="currentPassword" 
              type="password" 
              value={passwords.current}
              onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              className="bg-white" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                className="bg-white" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                className="bg-white" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
            </div>
            <Switch />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700" onClick={handlePasswordUpdate}>
              <Save className="w-4 h-4" />
              Update Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              {isDarkMode ? <Moon className="w-5 h-5 text-yellow-600" /> : <Sun className="w-5 h-5 text-yellow-600" />}
            </div>
            <h3 className="font-semibold text-gray-900">Appearance</h3>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Dark Mode</p>
              <p className="text-sm text-gray-500">Adjust the appearance of the dashboard</p>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
          </div>
        </div>
      </Card>

      {/* Regional Settings */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Globe className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Regional Settings</h3>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>UTC-8 (Pacific Time)</option>
                <option>UTC-5 (Eastern Time)</option>
                <option>UTC+0 (GMT)</option>
                <option>UTC+1 (Central European)</option>
                <option>UTC+5:30 (India)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>INR (₹)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
                <option>GBP (£)</option>
                <option>JPY (¥)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="units">Measurement Units</Label>
              <select
                id="units"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option>Metric (mm, m, kg)</option>
                <option>Imperial (in, ft, lb)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
              <Save className="w-4 h-4" />
              Save Preferences
            </Button>
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="overflow-hidden border-red-200">
        <div className="p-6 border-b border-red-200 bg-red-50">
          <h3 className="font-semibold text-red-900">Danger Zone</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
