import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Users, BookOpen, Building2, TrendingUp, MapPin, Shield } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({ users: 0, colleges: 0, companies: 0, careers: 0 });
  const [colleges, setColleges] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [careers, setCareers] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [collegeForm, setCollegeForm] = useState({ name: "", city: "", state: "", type: "government", description: "" });
  const [companyForm, setCompanyForm] = useState({ name: "", industry: "", city: "", state: "", company_size: "medium", description: "" });
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/login");
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchAll = async () => {
      const [collegeRes, companyRes, careerRes, userRes] = await Promise.all([
        supabase.from("colleges").select("*").order("created_at", { ascending: false }),
        supabase.from("companies").select("*").order("created_at", { ascending: false }),
        supabase.from("career_paths").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);
      setColleges(collegeRes.data || []);
      setCompanies(companyRes.data || []);
      setCareers(careerRes.data || []);
      setUsers(userRes.data || []);
      setStats({ users: userRes.data?.length || 0, colleges: collegeRes.data?.length || 0, companies: companyRes.data?.length || 0, careers: careerRes.data?.length || 0 });
    };
    fetchAll();
  }, [isAdmin]);

  const addCollege = async () => {
    const { data, error } = await supabase.from("colleges").insert(collegeForm).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setColleges(prev => [data, ...prev]);
    setStats(s => ({ ...s, colleges: s.colleges + 1 }));
    setDialogOpen(null);
    setCollegeForm({ name: "", city: "", state: "", type: "government", description: "" });
    toast({ title: "College added successfully" });
  };

  const deleteCollege = async (id: string) => {
    await supabase.from("colleges").delete().eq("id", id);
    setColleges(prev => prev.filter(c => c.id !== id));
    setStats(s => ({ ...s, colleges: s.colleges - 1 }));
    toast({ title: "College deleted" });
  };

  const addCompany = async () => {
    const { data, error } = await supabase.from("companies").insert(companyForm).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setCompanies(prev => [data, ...prev]);
    setStats(s => ({ ...s, companies: s.companies + 1 }));
    setDialogOpen(null);
    setCompanyForm({ name: "", industry: "", city: "", state: "", company_size: "medium", description: "" });
    toast({ title: "Company added successfully" });
  };

  const deleteCompany = async (id: string) => {
    await supabase.from("companies").delete().eq("id", id);
    setCompanies(prev => prev.filter(c => c.id !== id));
    setStats(s => ({ ...s, companies: s.companies - 1 }));
    toast({ title: "Company deleted" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Admin Banner */}
        <div className="bg-navy rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-white/60 text-sm">Manage all platform data from here</p>
            </div>
          </div>
          <Badge className="bg-amber-400 text-amber-900 font-semibold">Administrator</Badge>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Registered Users", val: stats.users, color: "from-violet-500 to-purple-600" },
            { icon: BookOpen, label: "Colleges", val: stats.colleges, color: "from-blue-500 to-cyan-600" },
            { icon: Building2, label: "Companies", val: stats.companies, color: "from-emerald-500 to-teal-600" },
            { icon: TrendingUp, label: "Career Paths", val: stats.careers, color: "from-orange-500 to-amber-600" },
          ].map(({ icon: Icon, label, val, color }) => (
            <div key={label} className="glass-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-display text-3xl font-bold text-navy">{val}</div>
              <div className="text-muted-foreground text-sm">{label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="colleges">
          <TabsList className="mb-6 bg-muted p-1 rounded-xl">
            <TabsTrigger value="colleges" className="rounded-lg">Colleges</TabsTrigger>
            <TabsTrigger value="companies" className="rounded-lg">Companies</TabsTrigger>
            <TabsTrigger value="careers" className="rounded-lg">Career Paths</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">Users</TabsTrigger>
          </TabsList>

          {/* Colleges Tab */}
          <TabsContent value="colleges">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-navy">Colleges Management</h2>
              <Dialog open={dialogOpen === "college"} onOpenChange={open => setDialogOpen(open ? "college" : null)}>
                <DialogTrigger asChild>
                  <Button className="gradient-accent text-white border-0 hover:opacity-90"><Plus className="w-4 h-4 mr-2" />Add College</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>Add New College</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div><Label>College Name</Label><Input value={collegeForm.name} onChange={e => setCollegeForm({ ...collegeForm, name: e.target.value })} placeholder="e.g., IIT Bombay" className="mt-1.5" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>City</Label><Input value={collegeForm.city} onChange={e => setCollegeForm({ ...collegeForm, city: e.target.value })} placeholder="Mumbai" className="mt-1.5" /></div>
                      <div><Label>State</Label><Input value={collegeForm.state} onChange={e => setCollegeForm({ ...collegeForm, state: e.target.value })} placeholder="Maharashtra" className="mt-1.5" /></div>
                    </div>
                    <div><Label>Type</Label>
                      <Select value={collegeForm.type} onValueChange={v => setCollegeForm({ ...collegeForm, type: v })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="government">Government</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                          <SelectItem value="deemed">Deemed University</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Description</Label><Textarea value={collegeForm.description} onChange={e => setCollegeForm({ ...collegeForm, description: e.target.value })} placeholder="Brief description..." className="mt-1.5" rows={3} /></div>
                    <Button onClick={addCollege} className="w-full gradient-accent text-white border-0 hover:opacity-90" disabled={!collegeForm.name || !collegeForm.city}>Add College</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {colleges.map(college => (
                <div key={college.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-navy text-sm leading-tight">{college.name}</h3>
                    <button onClick={() => deleteCollege(college.id)} className="text-destructive hover:opacity-70 ml-2 shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2"><MapPin className="w-3 h-3" />{college.city}, {college.state}</div>
                  <Badge className="text-xs bg-muted text-muted-foreground capitalize">{college.type}</Badge>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Companies Tab */}
          <TabsContent value="companies">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-navy">Companies Management</h2>
              <Dialog open={dialogOpen === "company"} onOpenChange={open => setDialogOpen(open ? "company" : null)}>
                <DialogTrigger asChild>
                  <Button className="gradient-accent text-white border-0 hover:opacity-90"><Plus className="w-4 h-4 mr-2" />Add Company</Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader><DialogTitle>Add New Company</DialogTitle></DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div><Label>Company Name</Label><Input value={companyForm.name} onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })} placeholder="e.g., Infosys" className="mt-1.5" /></div>
                    <div><Label>Industry</Label><Input value={companyForm.industry} onChange={e => setCompanyForm({ ...companyForm, industry: e.target.value })} placeholder="e.g., Information Technology" className="mt-1.5" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>City</Label><Input value={companyForm.city} onChange={e => setCompanyForm({ ...companyForm, city: e.target.value })} placeholder="Bangalore" className="mt-1.5" /></div>
                      <div><Label>State</Label><Input value={companyForm.state} onChange={e => setCompanyForm({ ...companyForm, state: e.target.value })} placeholder="Karnataka" className="mt-1.5" /></div>
                    </div>
                    <div><Label>Company Size</Label>
                      <Select value={companyForm.company_size} onValueChange={v => setCompanyForm({ ...companyForm, company_size: v })}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="startup">Startup</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                          <SelectItem value="mnc">MNC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Description</Label><Textarea value={companyForm.description} onChange={e => setCompanyForm({ ...companyForm, description: e.target.value })} placeholder="Brief description..." className="mt-1.5" rows={3} /></div>
                    <Button onClick={addCompany} className="w-full gradient-accent text-white border-0 hover:opacity-90" disabled={!companyForm.name || !companyForm.industry || !companyForm.city}>Add Company</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {companies.map(company => (
                <div key={company.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-navy text-sm leading-tight">{company.name}</h3>
                    <button onClick={() => deleteCompany(company.id)} className="text-destructive hover:opacity-70 ml-2 shrink-0"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2"><MapPin className="w-3 h-3" />{company.city}, {company.state}</div>
                  <div className="flex gap-2">
                    <Badge className="text-xs bg-muted text-muted-foreground">{company.industry}</Badge>
                    <Badge className="text-xs bg-muted text-muted-foreground capitalize">{company.company_size}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Careers Tab */}
          <TabsContent value="careers">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-navy">Career Paths</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {careers.map(career => (
                <div key={career.id} className="glass-card rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-navy">{career.title}</h3>
                    <Badge className="text-xs bg-muted text-muted-foreground capitalize ml-2 shrink-0">{career.category}</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2">{career.description}</p>
                  {career.avg_salary_min && (
                    <div className="text-sm font-semibold text-emerald-600">
                      ₹{(career.avg_salary_min / 100000).toFixed(1)}L – ₹{(career.avg_salary_max / 100000).toFixed(1)}L /year
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <h2 className="font-display text-xl font-bold text-navy mb-4">Registered Users</h2>
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-navy">Name</th>
                    <th className="text-left px-5 py-3 font-semibold text-navy">Email</th>
                    <th className="text-left px-5 py-3 font-semibold text-navy">Level</th>
                    <th className="text-left px-5 py-3 font-semibold text-navy">City</th>
                    <th className="text-left px-5 py-3 font-semibold text-navy">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 font-medium text-navy">{u.full_name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3"><Badge className="text-xs bg-muted text-muted-foreground">{u.student_level || "—"}</Badge></td>
                      <td className="px-5 py-3 text-muted-foreground">{u.city || "—"}</td>
                      <td className="px-5 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
