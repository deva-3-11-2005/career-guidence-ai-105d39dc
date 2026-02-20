import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const outlookColor: Record<string, string> = {
  excellent: "bg-emerald-100 text-emerald-700",
  good: "bg-blue-100 text-blue-700",
  moderate: "bg-amber-100 text-amber-700",
  declining: "bg-red-100 text-red-700",
};

export default function Careers() {
  const [careers, setCareers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("career_paths").select("*").order("title").then(({ data }) => setCareers(data || []));
  }, []);

  const categories = [...new Set(careers.map(c => c.category))];
  const filtered = careers.filter(c => {
    const q = search.toLowerCase();
    return (!q || c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) && (!catFilter || c.category === catFilter);
  });

  const formatSalary = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Explore Career Paths</h1>
          <p className="text-white/70 mb-6">Discover hundreds of career options with salary insights and growth outlook</p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search careers..." className="pl-10 h-11 bg-white border-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setCatFilter("")} className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${!catFilter ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>All</button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium border-2 transition-colors capitalize ${catFilter === cat ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>{cat}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(career => (
            <div key={career.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => navigate("/chatbot")}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-accent flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy">{career.title}</h3>
                    <span className="text-xs text-muted-foreground capitalize">{career.category}</span>
                  </div>
                </div>
                {career.growth_outlook && <Badge className={`text-xs shrink-0 ${outlookColor[career.growth_outlook]}`}>{career.growth_outlook}</Badge>}
              </div>
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{career.description}</p>
              <div className="flex flex-wrap gap-4 text-sm mb-3">
                {career.avg_salary_min && <span className="font-semibold text-emerald-600">{formatSalary(career.avg_salary_min)} – {formatSalary(career.avg_salary_max)} /yr</span>}
                {career.required_stream && <span className="text-muted-foreground capitalize">Stream: {career.required_stream}</span>}
              </div>
              {career.required_degree && <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />{career.required_degree}</div>}
              {career.skills_required?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {career.skills_required.map((s: string) => (
                    <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-16 text-muted-foreground">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No career paths found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
