import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap, Menu, X, LogOut, LayoutDashboard, MessageCircle } from "lucide-react";

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-navy/95 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl gradient-emerald flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Career<span style={{ color: "hsl(160 84% 55%)" }}>AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Home</Link>
          <Link to="/careers" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Careers</Link>
          <Link to="/colleges" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Colleges</Link>
          <Link to="/companies" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Companies</Link>
          {user && (
            <Link to="/chatbot" className="text-white/70 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />AI Chat
            </Link>
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(isAdmin ? "/admin" : "/student")}
                className="text-white/80 hover:text-white hover:bg-white/10"
              >
                <LayoutDashboard className="w-4 h-4 mr-1.5" />
                Dashboard
              </Button>
              <Button
                size="sm"
                onClick={handleSignOut}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
              >
                <LogOut className="w-4 h-4 mr-1.5" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")} className="text-white/80 hover:text-white hover:bg-white/10">
                Login
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")} className="gradient-emerald text-white hover:opacity-90 border-0">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-navy-dark border-t border-white/10 px-4 py-4 flex flex-col gap-3">
          <Link to="/" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/careers" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Careers</Link>
          <Link to="/colleges" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Colleges</Link>
          <Link to="/companies" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>Companies</Link>
          {user && <Link to="/chatbot" className="text-white/70 hover:text-white text-sm" onClick={() => setMenuOpen(false)}>AI Chat</Link>}
          <div className="flex gap-3 pt-2">
            {user ? (
              <>
                <Button size="sm" onClick={() => { navigate(isAdmin ? "/admin" : "/student"); setMenuOpen(false); }} className="flex-1 bg-white/10 text-white">Dashboard</Button>
                <Button size="sm" onClick={handleSignOut} className="flex-1 bg-white/10 text-white">Sign Out</Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => { navigate("/login"); setMenuOpen(false); }} className="flex-1 bg-white/10 text-white">Login</Button>
                <Button size="sm" onClick={() => { navigate("/signup"); setMenuOpen(false); }} className="flex-1 gradient-emerald text-white border-0">Sign Up</Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
