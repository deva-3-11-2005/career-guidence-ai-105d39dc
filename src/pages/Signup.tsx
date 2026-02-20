import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { GraduationCap, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", studentLevel: "", city: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.password || !form.studentLevel) return;
    if (form.password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: form.fullName.trim() }
      }
    });
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      // Update profile with additional data
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        await supabase.from("profiles").update({
          student_level: form.studentLevel,
          city: form.city.trim() || null,
        }).eq("user_id", sessionData.session.user.id);
        navigate("/student");
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
        navigate("/login");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 gradient-hero flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-400 blur-3xl animate-pulse-slow" />
        </div>
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl gradient-emerald flex items-center justify-center mx-auto mb-6 shadow-hero">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4">Start Your Journey</h2>
          <p className="text-white/70 text-lg max-w-sm">Create your free account and get personalized AI-powered career guidance tailored just for you.</p>
          <div className="mt-8 space-y-3 text-left">
            {["Personalized career recommendations", "AI chatbot counselor 24/7", "College & company finder", "Skill-based job matching"].map(item => (
              <div key={item} className="flex items-center gap-3 text-white/80">
                <div className="w-5 h-5 rounded-full gradient-emerald flex items-center justify-center shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="mb-8">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg gradient-emerald flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-navy">CareerAI</span>
            </Link>
            <h1 className="font-display text-3xl font-bold text-navy">Create Account</h1>
            <p className="text-muted-foreground mt-1">Join thousands of students finding their path</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label className="text-navy font-medium">Full Name</Label>
              <Input
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Your full name"
                required
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label className="text-navy font-medium">Email Address</Label>
              <Input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="mt-1.5 h-11"
              />
            </div>
            <div>
              <Label className="text-navy font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Min. 6 characters"
                  required
                  className="h-11 pr-10"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label className="text-navy font-medium">I am a...</Label>
              <Select onValueChange={v => setForm({ ...form, studentLevel: v })} required>
                <SelectTrigger className="mt-1.5 h-11">
                  <SelectValue placeholder="Select your current level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school_10">10th Grade Student</SelectItem>
                  <SelectItem value="school_12">12th Grade Student</SelectItem>
                  <SelectItem value="ug">Undergraduate (UG) Student</SelectItem>
                  <SelectItem value="pg">Postgraduate (PG) Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-navy font-medium">City (Optional)</Label>
              <Input
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                placeholder="Your city (for local recommendations)"
                className="mt-1.5 h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 gradient-accent text-white border-0 font-semibold hover:opacity-90 mt-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {loading ? "Creating Account..." : "Create Free Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
