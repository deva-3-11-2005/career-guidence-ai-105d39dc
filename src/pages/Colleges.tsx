import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, BookOpen, Globe, Phone } from "lucide-react";

export default function Colleges() {
  const [colleges, setColleges] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    supabase.from("colleges").select("*").order("name").then(({ data }) => setColleges(data || []));
  }, []);

  const filtered = colleges.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)) &&
      (!cityFilter || c.city.toLowerCase().includes(cityFilter.toLowerCase())) &&
      (!typeFilter || c.type === typeFilter)
    );
  });

  const typeColor: Record<string, string> = { government: "bg-blue-100 text-blue-700", private: "bg-purple-100 text-purple-700", deemed: "bg-amber-100 text-amber-700" };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero */}
      <div className="gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Find Your Perfect College</h1>
          <p className="text-white/70 mb-6">Explore colleges across India with admission details and cutoffs</p>
          <div className="max-w-xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search colleges or cities..." className="pl-10 h-11 bg-white border-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Filter by city..." className="w-48 h-9" />
          <div className="flex gap-2">
            {["", "government", "private", "deemed"].map(t => (
              <button key={t} onClick={() => setTypeFilter(t)} className={`px-4 py-1.5 rounded-lg text-sm font-medium border-2 transition-colors ${typeFilter === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                {t === "" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <span className="text-sm text-muted-foreground self-center">{filtered.length} results</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(college => (
            <div key={college.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-bold text-navy mb-1.5 leading-tight">{college.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5" />{college.area ? `${college.area}, ` : ""}{college.city}, {college.state}
              </div>
              {college.type && <Badge className={`text-xs mb-3 ${typeColor[college.type] || "bg-muted text-muted-foreground"} capitalize`}>{college.type}</Badge>}
              {college.description && <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{college.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3 mt-auto">
                {college.website && <a href={college.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors"><Globe className="w-3.5 h-3.5" />Website</a>}
                {college.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{college.phone}</span>}
                {college.established_year && <span>Est. {college.established_year}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No colleges found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
