import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const SKILL_OPTIONS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Programming", "Data Analysis", "Communication", "Leadership", "Problem Solving", "Design", "Writing", "Accounting", "Marketing", "Research"];

const INTEREST_OPTIONS = ["Technology & Computers", "Medicine & Healthcare", "Business & Entrepreneurship", "Arts & Design", "Teaching & Education", "Law & Justice", "Engineering & Construction", "Finance & Banking", "Media & Journalism", "Sports & Fitness"];

interface Props {
  userId: string;
  profile: any;
  onComplete: (data: any) => void;
}

export default function SkillAssessment({ userId, profile, onComplete }: Props) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    student_level: profile?.student_level || "",
    stream: "",
    marks_percentage: 75,
    skills: [] as string[],
    interests: [] as string[],
    preferred_city: profile?.city || "",
  });
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill: string) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s => s !== skill) : [...f.skills, skill].slice(0, 8),
    }));
  };

  const toggleInterest = (interest: string) => {
    setForm(f => ({
      ...f,
      interests: f.interests.includes(interest) ? f.interests.filter(i => i !== interest) : [...f.interests, interest].slice(0, 5),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("student_assessments").insert({
      user_id: userId,
      ...form,
    }).select().single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Assessment Complete!", description: "Your personalized career recommendations are ready." });
      onComplete(data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${s <= step ? "gradient-accent text-white" : "bg-muted text-muted-foreground"}`}>{s}</div>
            {s < 3 && <div className={`h-0.5 w-16 transition-colors ${s < step ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">Step {step} of 3</span>
      </div>

      <div className="glass-card rounded-2xl p-7">
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Your Academic Profile</h2>
              <p className="text-muted-foreground text-sm">Tell us about your current education level</p>
            </div>
            <div>
              <Label className="font-medium text-navy">Current Level</Label>
              <Select value={form.student_level} onValueChange={v => setForm({ ...form, student_level: v })}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select your level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school_10">10th Grade</SelectItem>
                  <SelectItem value="school_12">12th Grade</SelectItem>
                  <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                  <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form.student_level === "school_12" || form.student_level === "ug" || form.student_level === "pg") && (
              <div>
                <Label className="font-medium text-navy">Stream / Branch</Label>
                <Select value={form.stream} onValueChange={v => setForm({ ...form, stream: v })}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select stream" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Science (PCM/PCB)</SelectItem>
                    <SelectItem value="commerce">Commerce</SelectItem>
                    <SelectItem value="arts">Arts / Humanities</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="management">Management / BBA</SelectItem>
                    <SelectItem value="law">Law</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label className="font-medium text-navy">Overall Marks / Percentage: <span className="text-primary">{form.marks_percentage}%</span></Label>
              <Slider
                value={[form.marks_percentage]}
                min={30} max={100} step={1}
                onValueChange={([v]) => setForm({ ...form, marks_percentage: v })}
                className="mt-3"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>30%</span><span>100%</span></div>
            </div>
            <div>
              <Label className="font-medium text-navy">Preferred City (for college/job search)</Label>
              <Input value={form.preferred_city} onChange={e => setForm({ ...form, preferred_city: e.target.value })} placeholder="e.g., Mumbai, Delhi, Bangalore" className="mt-1.5 h-11" />
            </div>
            <Button onClick={() => setStep(2)} className="w-full gradient-accent text-white border-0 h-11 font-semibold hover:opacity-90" disabled={!form.student_level}>
              Next: Skills →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Your Skills</h2>
              <p className="text-muted-foreground text-sm">Select up to 8 skills you're good at or interested in</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILL_OPTIONS.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.skills.includes(skill)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/50"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{form.skills.length}/8 skills selected</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 h-11">← Back</Button>
              <Button onClick={() => setStep(3)} className="flex-1 gradient-accent text-white border-0 h-11 font-semibold hover:opacity-90" disabled={form.skills.length === 0}>
                Next: Interests →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-display text-2xl font-bold text-navy mb-1">Your Interests</h2>
              <p className="text-muted-foreground text-sm">Select up to 5 fields you're passionate about</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
                    form.interests.includes(interest)
                      ? "border-secondary bg-secondary/10 text-secondary"
                      : "border-border bg-background text-foreground hover:border-secondary/50"
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">{form.interests.length}/5 interests selected</div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 h-11">← Back</Button>
              <Button onClick={handleSubmit} className="flex-1 gradient-accent text-white border-0 h-11 font-semibold hover:opacity-90" disabled={loading || form.interests.length === 0}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                {loading ? "Analyzing..." : "Get My Career Matches"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
