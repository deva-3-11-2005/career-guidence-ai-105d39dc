import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Building2, Globe, Phone } from "lucide-react";

const sizeLabel: Record<string, string> = { startup: "Startup", small: "Small", medium: "Mid-size", large: "Large", mnc: "MNC" };
const sizeColor: Record<string, string> = { startup: "bg-violet-100 text-violet-700", small: "bg-blue-100 text-blue-700", medium: "bg-teal-100 text-teal-700", large: "bg-emerald-100 text-emerald-700", mnc: "bg-amber-100 text-amber-700" };

export default function Companies() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");

  useEffect(() => {
    supabase.from("companies").select("*").order("name").then(({ data }) => setCompanies(data || []));
  }, []);

  const industries = [...new Set(companies.map(c => c.industry))];

  const filtered = companies.filter(c => {
    const q = search.toLowerCase();
    return (
      (!q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)) &&
      (!cityFilter || c.city.toLowerCase().includes(cityFilter.toLowerCase())) &&
      (!industryFilter || c.industry === industryFilter)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="gradient-hero py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Explore Top Companies</h1>
          <p className="text-white/70 mb-6">Discover companies hiring across India — from startups to MNCs</p>
          <div className="max-w-xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search companies, industries..." className="pl-10 h-11 bg-white border-0" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-wrap gap-3 mb-6">
          <Input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Filter by city..." className="w-48 h-9" />
          <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="border border-border rounded-lg px-3 h-9 text-sm bg-background text-foreground">
            <option value="">All Industries</option>
            {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
          <span className="text-sm text-muted-foreground self-center">{filtered.length} results</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(company => (
            <div key={company.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-navy mb-1">{company.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{company.industry}</p>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3.5 h-3.5" />{company.city}, {company.state}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {company.company_size && <Badge className={`text-xs ${sizeColor[company.company_size] || "bg-muted text-muted-foreground"}`}>{sizeLabel[company.company_size] || company.company_size}</Badge>}
                {company.founded_year && <Badge className="text-xs bg-muted text-muted-foreground">Est. {company.founded_year}</Badge>}
              </div>
              {company.description && <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{company.description}</p>}
              <div className="flex flex-wrap gap-3 text-xs text-muted-foreground border-t border-border pt-3">
                {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors"><Globe className="w-3.5 h-3.5" />Website</a>}
                {company.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{company.phone}</span>}
                {company.email && <span className="truncate">{company.email}</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center py-16 text-muted-foreground">
              <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No companies found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
