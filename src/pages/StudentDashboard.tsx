import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bot, TrendingUp, BookOpen, Building2, User, MapPin, Target, ChevronRight, Sparkles } from "lucide-react";
import SkillAssessment from "@/components/SkillAssessment";
import CareerResults from "@/components/CareerResults";

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [profileRes, assessRes, careerRes, collegeRes, companyRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("student_assessments").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("career_paths").select("*").limit(8),
        supabase.from("colleges").select("*").limit(6),
        supabase.from("companies").select("*").limit(6),
      ]);
      setProfile(profileRes.data);
      setAssessment(assessRes.data);
      setCareerPaths(careerRes.data || []);
      setColleges(collegeRes.data || []);
      setCompanies(companyRes.data || []);
    };
    fetchData();
  }, [user]);

  const levelLabel = (level: string) => {
    const labels: Record<string, string> = { school_10: "10th Grade", school_12: "12th Grade", ug: "Undergraduate", pg: "Postgraduate" };
    return labels[level] || "Student";
  };

  const formatSalary = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;

  const outlookColor = (o: string) => ({
    excellent: "bg-emerald-100 text-emerald-700",
    good: "bg-blue-100 text-blue-700",
    moderate: "bg-amber-100 text-amber-700",
    declining: "bg-red-100 text-red-700",
  }[o] || "bg-muted text-muted-foreground");

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Banner */}
        <div className="gradient-accent rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Welcome, {profile?.full_name || "Student"}!</h1>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {profile?.student_level && <Badge className="bg-white/20 text-white border-white/30">{levelLabel(profile.student_level)}</Badge>}
                {profile?.city && <Badge className="bg-white/20 text-white border-white/30 flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.city}</Badge>}
              </div>
            </div>
          </div>
          <Button onClick={() => navigate("/chatbot")} className="bg-white text-primary hover:bg-white/90 font-semibold">
            <Bot className="w-4 h-4 mr-2" /> Chat with AI Counselor
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="mb-6 bg-muted p-1 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="assess" className="rounded-lg">Skill Assessment</TabsTrigger>
            <TabsTrigger value="careers" className="rounded-lg">Career Paths</TabsTrigger>
            <TabsTrigger value="colleges" className="rounded-lg">Colleges</TabsTrigger>
            <TabsTrigger value="companies" className="rounded-lg">Companies</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { icon: Target, label: "Career Paths", val: `${careerPaths.length}+ Options`, color: "from-violet-500 to-purple-600", action: () => navigate("/careers") },
                { icon: BookOpen, label: "Colleges", val: `${colleges.length}+ Listed`, color: "from-blue-500 to-cyan-600", action: () => navigate("/colleges") },
                { icon: Building2, label: "Companies", val: `${companies.length}+ Companies`, color: "from-emerald-500 to-teal-600", action: () => navigate("/companies") },
              ].map(({ icon: Icon, label, val, color, action }) => (
                <div key={label} onClick={action} className="glass-card rounded-2xl p-5 cursor-pointer hover:shadow-elevated transition-all hover:-translate-y-1 group">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-display text-xl font-bold text-navy">{val}</div>
                  <div className="text-muted-foreground text-sm">{label}</div>
                </div>
              ))}
            </div>

            {assessment ? (
              <CareerResults assessment={assessment} careerPaths={careerPaths} />
            ) : (
              <div className="glass-card rounded-2xl p-8 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h3 className="font-display text-xl font-bold text-navy mb-2">Get Personalized Career Recommendations</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">Take our skill assessment to get AI-powered career path recommendations based on your skills, marks, and interests.</p>
                <Button onClick={() => document.querySelector('[value="assess"]')?.dispatchEvent(new MouseEvent("click"))} className="gradient-accent text-white border-0 hover:opacity-90">
                  Start Skill Assessment <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Assessment */}
          <TabsContent value="assess">
            <SkillAssessment userId={user?.id || ""} profile={profile} onComplete={(data) => setAssessment(data)} />
          </TabsContent>

          {/* Careers */}
          <TabsContent value="careers">
            <div className="grid md:grid-cols-2 gap-5">
              {careerPaths.map(career => (
                <div key={career.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate(`/careers`)}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display font-bold text-navy">{career.title}</h3>
                      <span className="text-xs text-muted-foreground capitalize">{career.category} · {career.required_degree}</span>
                    </div>
                    {career.growth_outlook && <Badge className={outlookColor(career.growth_outlook)}>{career.growth_outlook}</Badge>}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{career.description}</p>
                  {career.avg_salary_min && <div className="text-sm font-semibold text-emerald-600">{formatSalary(career.avg_salary_min)} – {formatSalary(career.avg_salary_max)} /year</div>}
                  {career.skills_required?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {career.skills_required.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Colleges */}
          <TabsContent value="colleges">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {colleges.map(college => (
                <div key={college.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate(`/colleges`)}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-navy mb-1">{college.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5" />{college.city}, {college.state}
                  </div>
                  <Badge className="text-xs capitalize bg-muted text-muted-foreground">{college.type}</Badge>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{college.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Companies */}
          <TabsContent value="companies">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {companies.map(company => (
                <div key={company.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate("/companies")}>
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="font-display font-bold text-navy mb-1">{company.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-3.5 h-3.5" />{company.city}, {company.state}
                  </div>
                  <div className="flex gap-2">
                    <Badge className="text-xs bg-muted text-muted-foreground">{company.industry}</Badge>
                    <Badge className="text-xs bg-muted text-muted-foreground capitalize">{company.company_size}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{company.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
