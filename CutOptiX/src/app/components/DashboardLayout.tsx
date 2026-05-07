import { Outlet, NavLink, useNavigate } from "react-router";
import { 
  LayoutDashboard, 
  FolderPlus, 
  FileInput, 
  Scissors, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { User as UserIcon, LogOut, Camera } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const menuItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/new-project", label: "New Project", icon: FolderPlus },
  { path: "/design-input", label: "Design Input", icon: FileInput },
  { path: "/optimization", label: "Optimization", icon: Scissors },
  { path: "/reports", label: "Reports", icon: FileText },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [user, setUser] = useState({ name: "Admin User", email: "admin@cutoptix.com" });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) setUser(JSON.parse(savedUser));
      
      const savedImage = localStorage.getItem("profileImage");
      if (savedImage) setProfileImage(savedImage);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem("profileImage", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-card border-b border-border z-30 transition-colors">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5 text-foreground" /> : <Menu className="w-5 h-5 text-foreground" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 flex items-center justify-center overflow-hidden rounded-xl">
                <img src={logo} alt="CutOptix Logo" className="h-full w-full object-contain" />
              </div>
              <h1 className="font-bold text-2xl tracking-tight text-foreground">CutOptix</h1>
            </div>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 border border-red-500 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
            
            <button 
              onClick={() => setShowProfileCard(!showProfileCard)}
              className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all"
            >
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </button>

            {/* Profile Card Dropdown */}
            {showProfileCard && (
              <div className="absolute top-14 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-medium overflow-hidden border-4 border-white shadow-md">
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange}
                    />
                  </div>
                  
                  <h3 className="mt-4 font-semibold text-lg text-gray-900">{user.name}</h3>
                  <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                  
                  <div className="w-full space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Role</p>
                        <p className="text-sm font-medium text-gray-700">{user.role || "Project Manager"}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                      onClick={() => setShowProfileCard(false)}
                    >
                      View Full Profile
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 bottom-0 w-64 bg-card border-r border-border z-20 transition-transform duration-300 lg:translate-x-0 transition-colors ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="pt-20 lg:pl-64">
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
