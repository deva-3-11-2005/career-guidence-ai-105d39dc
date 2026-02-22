import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ChevronRight } from "lucide-react";

interface Props {
  assessment: any;
  careerPaths: any[];
}

function matchScore(career: any, assessment: any): number {
  let score = 0;
  // Skill match
  const assessmentSkills = (assessment.skills || []).map((s: string) => s.toLowerCase());
  const careerSkills = (career.skills_required || []).map((s: string) => s.toLowerCase());
  const skillMatches = assessmentSkills.filter((s: string) => careerSkills.some((cs: string) => cs.includes(s) || s.includes(cs)));
  score += skillMatches.length * 20;

  // Stream match
  if (assessment.stream && career.required_stream) {
    if (assessment.stream === career.required_stream) score += 30;
  }

  // Marks bonus
  if (assessment.marks_percentage >= 85) score += 15;
  else if (assessment.marks_percentage >= 70) score += 10;
  else if (assessment.marks_percentage >= 55) score += 5;

  // Interest match by category
  const interests = (assessment.interests || []).join(" ").toLowerCase();
  if (career.category === "technology" && interests.includes("tech")) score += 20;
  if (career.category === "medical" && interests.includes("medicine")) score += 20;
  if (career.category === "management" && interests.includes("business")) score += 20;
  if (career.category === "arts" && interests.includes("arts")) score += 20;
  if (career.category === "law" && interests.includes("law")) score += 20;
  if (career.category === "commerce" && interests.includes("finance")) score += 20;

  return Math.min(score, 100);
}

export default function CareerResults({ assessment, careerPaths }: Props) {
  const navigate = useNavigate();

  const scored = careerPaths
    .map(c => ({ ...c, score: matchScore(c, assessment) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const formatSalary = (n: number) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n?.toLocaleString()}`;
  const outlookColor = (o: string) => ({ excellent: "bg-emerald-100 text-emerald-700", good: "bg-blue-100 text-blue-700", moderate: "bg-amber-100 text-amber-700" }[o] || "bg-muted text-muted-foreground");

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-display text-xl font-bold text-navy">Your Career Matches</h2>
          <p className="text-muted-foreground text-sm">Based on your skills, marks, and interests</p>
        </div>
        <Badge className="gradient-emerald text-white border-0 px-3 py-1.5">
          <TrendingUp className="w-3.5 h-3.5 mr-1.5" />AI Powered
        </Badge>
      </div>

      <div className="space-y-4">
        {scored.map((career, i) => (
          <div key={career.id} className="glass-card rounded-2xl p-5 hover:shadow-elevated transition-all hover:-translate-y-0.5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white font-display font-bold text-lg shrink-0">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-bold text-navy">{career.title}</h3>
                  <div className="flex items-center gap-2">
                    {career.growth_outlook && <Badge className={outlookColor(career.growth_outlook)}>{career.growth_outlook}</Badge>}
                    <div className="text-sm font-semibold" style={{ color: `hsl(${Math.max(0, career.score * 1.2)} 70% 40%)` }}>
                      {career.score}% match
                    </div>
                  </div>
                </div>
                {/* Match bar */}
                <div className="h-1.5 bg-muted rounded-full mb-3 overflow-hidden">
                  <div className="h-full rounded-full gradient-emerald transition-all" style={{ width: `${career.score}%` }} />
                </div>
                <p className="text-muted-foreground text-sm mb-2">{career.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {career.avg_salary_min && (
                    <span className="font-semibold text-emerald-600">{formatSalary(career.avg_salary_min)} – {formatSalary(career.avg_salary_max)}</span>
                  )}
                  {career.required_degree && <span className="text-muted-foreground">{career.required_degree}</span>}
                </div>
                {career.skills_required?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {career.skills_required.map((s: string) => (
                      <span key={s} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Button onClick={() => navigate("/chatbot")} className="gradient-accent text-white border-0 hover:opacity-90">
          Discuss these careers with AI Counselor <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
