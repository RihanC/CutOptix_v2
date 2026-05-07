import { Outlet, NavLink, useNavigate, useLocation, useOutlet } from "react-router";
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
import { useState, useEffect, useRef, useMemo } from "react";
import { User as UserIcon, LogOut, Camera, Search, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState({ name: "User", email: "user@example.com", role: "Admin" });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();

  // Load projects for search
  const projects = useMemo(() => {
    const saved = localStorage.getItem("cutoptix_projects");
    return saved ? JSON.parse(saved) : [];
  }, [showSearch]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return [];
    
    const query = searchQuery.toLowerCase();
    const results: any[] = [];

    // Search Menu Items
    menuItems.forEach(item => {
      if (item.label.toLowerCase().includes(query)) {
        results.push({ type: 'page', label: item.label, path: item.path, icon: item.icon });
      }
    });

    // Search Projects
    projects.forEach((proj: any) => {
      if (proj.name.toLowerCase().includes(query) || proj.id.toLowerCase().includes(query)) {
        results.push({ type: 'project', label: proj.name, id: proj.id, path: `/optimization` }); // navigate to opt for now
      }
    });

    return results;
  }, [searchQuery, projects]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowSearch((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  const handleSearchSelect = (path: string) => {
    navigate(path);
    setShowSearch(false);
    setSearchQuery("");
  };
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      <header className="fixed top-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-md border-b border-border z-30 transition-colors">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-muted-foreground hover:bg-muted rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 flex items-center justify-center overflow-hidden rounded-xl">
                <img src={logo} alt="CutOptix Logo" className="h-full w-full object-contain" />
              </div>
              <h1 className="font-bold text-2xl tracking-tighter text-foreground">CutOptix</h1>
            </div>

            {/* Quick Search Trigger */}
            <button 
              onClick={() => setShowSearch(true)}
              className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-lg text-muted-foreground transition-all group ml-8"
            >
              <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="text-sm">Search projects...</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-card px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
          <div className="flex items-center gap-4 relative">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <motion.button 
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 border border-red-500 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </motion.button>
            
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

            <AnimatePresence>
              {showProfileCard && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-14 right-0 w-80 bg-card rounded-2xl shadow-xl border border-border p-6 z-50"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-medium overflow-hidden border-4 border-white dark:border-[#2d2b4a] shadow-md">
                        {profileImage ? (
                          <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-2 bg-white dark:bg-[#2d2b4a] rounded-full shadow-lg border border-border text-foreground hover:text-blue-600 transition-colors"
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
                    
                    <h3 className="mt-4 font-semibold text-lg text-foreground">{user.name}</h3>
                    <p className="text-muted-foreground text-sm mb-6">{user.email}</p>
                    
                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Role</p>
                          <p className="text-sm font-medium text-foreground">{user.role || "Project Manager"}</p>
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-20 left-0 bottom-0 w-64 bg-card/80 backdrop-blur-md border-r border-border z-20 transition-transform duration-300 lg:translate-x-0 transition-colors ${
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
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm tracking-wide ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
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
      <main className="pt-20 lg:pl-64 overflow-x-hidden">
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="w-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Command Palette */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSearch(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl z-[101] overflow-hidden"
            >
              <div className="p-4 border-b border-border flex items-center gap-3">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type to search projects or pages..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground py-2"
                />
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 text-muted-foreground">
                  ESC
                </kbd>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1">
                    {filteredItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearchSelect(item.path)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-primary/5 text-left group transition-all"
                      >
                        <div className="p-2 bg-muted rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {item.icon ? <item.icon className="w-4 h-4" /> : <Command className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-12 text-center">
                    <Search className="w-12 h-12 text-muted/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {menuItems.slice(0, 4).map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleSearchSelect(item.path)}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted text-left transition-all group"
                        >
                          <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-card border border-border rounded">Enter</kbd> to select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-card border border-border rounded">↑↓</kbd> to navigate
                  </span>
                </div>
                <span>CutOptix Search</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
