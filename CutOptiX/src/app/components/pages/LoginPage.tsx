import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Scissors } from "lucide-react";
import { toast } from "sonner";
import loginBg from "@/assets/login-bg.png";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded authentication logic as requested
    setTimeout(() => {
      if (email === "sample1@test.com" && password === "pass123") {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error("Invalid email or password. Please try again.");
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-[1200px] h-[800px] bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col md:flex-row">

        {/* Left Side - Image/Typography */}
        <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          <img
            src={loginBg}
            alt="Login background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative h-full flex flex-col justify-between p-8 lg:p-12 text-white">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] font-medium text-white/70 uppercase">A Wise Quote</span>
              <div className="h-[1px] w-12 bg-white/30" />
            </div>

            <div className="max-w-md">
              <h1 className="text-4xl lg:text-6xl font-serif leading-tight mb-6">
                Get Everything <br /> You Want
              </h1>
              <p className="text-white/70 text-sm lg:text-base leading-relaxed max-w-xs">
                You can get everything you want if you work hard, trust the process, and stick to the plan.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8 lg:p-16 flex flex-col">
          <div className="flex justify-center md:justify-end mb-12">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-[#030213] rounded-md flex items-center justify-center">
                <Scissors className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">CutOptix</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full">
            <div className="text-center md:text-left mb-10">
              <h2 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-2">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Enter your email and password to access your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200 transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-black border-black' : 'border-gray-300 group-hover:border-gray-400'}`}>
                    {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="text-xs text-gray-600 font-medium">Remember me</span>
                </label>
                <Link to="#" className="text-xs text-gray-900 font-semibold hover:underline">Forgot Password</Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-[#030213] text-white rounded-xl font-medium hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <button
                type="button"
                className="w-full h-12 bg-white border border-gray-100 text-gray-900 rounded-xl font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In with Google
              </button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Don't have an account? <Link to="#" className="text-gray-900 font-bold hover:underline">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
