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
  Shield
} from "lucide-react";

export function Settings() {
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-medium">
              A
            </div>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" defaultValue="Admin User" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" defaultValue="admin@cutoptix.com" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" defaultValue="CutOptix Industries" className="bg-white" />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
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
            <Input id="currentPassword" type="password" className="bg-white" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" className="bg-white" />
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
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
              <Save className="w-4 h-4" />
              Update Password
            </Button>
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Project Completion Alerts</p>
              <p className="text-sm text-gray-500">Get notified when projects are completed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Marketing Communications</p>
              <p className="text-sm text-gray-500">Updates about new features and tips</p>
            </div>
            <Switch />
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
