import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, MapPin, GraduationCap, Mail, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    city: "",
    student_level: "",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setForm({
            full_name: data.full_name || "",
            email: data.email || "",
            city: data.city || "",
            student_level: data.student_level || "",
          });
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name,
        city: form.city,
        student_level: form.student_level,
      })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile Updated!", description: "Your changes have been saved." });
    }
    setSaving(false);
  };

  const levelLabel = (level: string) => {
    const labels: Record<string, string> = {
      school_10: "10th Grade",
      school_11: "11th Grade",
      school_12: "12th Grade",
      ug: "Undergraduate",
      pg: "Postgraduate",
    };
    return labels[level] || "Not set";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="gradient-accent rounded-2xl p-6 mb-8 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
            <p className="text-white/70 text-sm">Manage your personal information</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-7 space-y-6">
          {/* Full Name */}
          <div>
            <Label className="font-medium text-navy flex items-center gap-1.5">
              <User className="w-4 h-4" /> Full Name
            </Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="mt-1.5 h-11"
              placeholder="Your full name"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <Label className="font-medium text-navy flex items-center gap-1.5">
              <Mail className="w-4 h-4" /> Email
            </Label>
            <Input value={form.email} disabled className="mt-1.5 h-11 bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          {/* City */}
          <div>
            <Label className="font-medium text-navy flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> City
            </Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="mt-1.5 h-11"
              placeholder="e.g., Mumbai, Delhi, Bangalore"
            />
          </div>

          {/* Student Level */}
          <div>
            <Label className="font-medium text-navy flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Education Level
            </Label>
            <Select value={form.student_level} onValueChange={(v) => setForm({ ...form, student_level: v })}>
              <SelectTrigger className="mt-1.5 h-11">
                <SelectValue placeholder="Select your level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school_10">10th Grade</SelectItem>
                <SelectItem value="school_11">11th Grade</SelectItem>
                <SelectItem value="school_12">12th Grade</SelectItem>
                <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                <SelectItem value="pg">Postgraduate (PG)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Save */}
          <Button
            onClick={handleSave}
            className="w-full gradient-accent text-white border-0 h-11 font-semibold hover:opacity-90"
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
