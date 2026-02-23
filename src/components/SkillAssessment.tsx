import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles, ExternalLink, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

const SKILL_OPTIONS = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "Programming", "Data Analysis", "Communication", "Leadership", "Problem Solving", "Design", "Writing", "Accounting", "Marketing", "Research"];

const INTEREST_OPTIONS = ["Technology & Computers", "Medicine & Healthcare", "Business & Entrepreneurship", "Arts & Design", "Teaching & Education", "Law & Justice", "Engineering & Construction", "Finance & Banking", "Media & Journalism", "Sports & Fitness"];

// Level-specific suggestions with Coursera free course links
const SUGGESTIONS: Record<string, {
  title: string;
  description: string;
  groups?: { name: string; subjects: string[]; careers: string[]; courses: { title: string; url: string }[] }[];
  degrees?: { name: string; duration: string; careers: string[]; courses: { title: string; url: string }[] }[];
  additionalCourses?: { title: string; url: string }[];
}> = {
  school_10: {
    title: "🏫 After 10th Grade – Choose Your 11th Group",
    description: "Based on your marks and interests, here are the best 11th-grade streams for you:",
    groups: [
      {
        name: "Science (PCM – Physics, Chemistry, Maths)",
        subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science / IP"],
        careers: ["Engineering", "Data Science", "Architecture", "Pilot", "Merchant Navy"],
        courses: [
          { title: "Introduction to Programming with Python", url: "https://www.coursera.org/learn/python" },
          { title: "Mathematics for Machine Learning", url: "https://www.coursera.org/specializations/mathematics-machine-learning" },
          { title: "Learning How to Learn", url: "https://www.coursera.org/learn/learning-how-to-learn" },
          { title: "Fundamentals of Physics", url: "https://www.coursera.org/learn/understanding-einstein-mechanics" },
        ],
      },
      {
        name: "Science (PCMC – Physics, Chemistry, Maths, Computer Science)",
        subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science", "English"],
        careers: ["Software Engineer", "Data Scientist", "AI/ML Engineer", "Full Stack Developer", "Cybersecurity Analyst", "Cloud Architect"],
        courses: [
          { title: "CS50: Introduction to Computer Science", url: "https://www.coursera.org/learn/cs50" },
          { title: "Python for Everybody", url: "https://www.coursera.org/specializations/python" },
          { title: "Introduction to Programming with Python", url: "https://www.coursera.org/learn/python" },
          { title: "Mathematics for Machine Learning", url: "https://www.coursera.org/specializations/mathematics-machine-learning" },
          { title: "Google IT Support Certificate", url: "https://www.coursera.org/professional-certificates/google-it-support" },
        ],
      },
      {
        name: "Science (PCB – Physics, Chemistry, Biology)",
        subjects: ["Physics", "Chemistry", "Biology", "English", "Psychology / IP"],
        careers: ["Doctor (MBBS)", "Dentist", "Pharmacist", "Biotechnology", "Veterinary Science"],
        courses: [
          { title: "Introduction to Biology", url: "https://www.coursera.org/learn/biology" },
          { title: "Anatomy Specialization", url: "https://www.coursera.org/specializations/anatomy" },
          { title: "Medical Neuroscience", url: "https://www.coursera.org/learn/medical-neuroscience" },
        ],
      },
      {
        name: "Commerce",
        subjects: ["Accountancy", "Business Studies", "Economics", "English", "Maths / IP"],
        careers: ["CA (Chartered Accountant)", "CS (Company Secretary)", "MBA", "Banking", "Financial Analyst"],
        courses: [
          { title: "Financial Markets by Yale", url: "https://www.coursera.org/learn/financial-markets-global" },
          { title: "Introduction to Accounting", url: "https://www.coursera.org/learn/wharton-accounting" },
          { title: "Economics of Money and Banking", url: "https://www.coursera.org/learn/money-banking" },
        ],
      },
      {
        name: "Arts / Humanities",
        subjects: ["History", "Political Science", "Geography", "Psychology", "English"],
        careers: ["Lawyer", "Civil Services (IAS/IPS)", "Journalist", "Psychologist", "Social Worker"],
        courses: [
          { title: "Introduction to Psychology", url: "https://www.coursera.org/learn/introduction-psychology" },
          { title: "Modern World History", url: "https://www.coursera.org/learn/modern-world" },
          { title: "English Composition", url: "https://www.coursera.org/learn/english-composition" },
        ],
      },
    ],
  },
  school_11: {
    title: "📚 11th Grade – Strengthen Your Stream",
    description: "Enhance your skills with additional courses relevant to your chosen group:",
    groups: [
      {
        name: "Science (PCM) – Additional Courses",
        subjects: [],
        careers: [],
        courses: [
          { title: "Intro to Computer Science (CS50 on edX/Coursera)", url: "https://www.coursera.org/learn/cs50" },
          { title: "Calculus for Beginners", url: "https://www.coursera.org/learn/introduction-to-calculus" },
          { title: "Python for Everybody", url: "https://www.coursera.org/specializations/python" },
          { title: "Physics: Mechanics", url: "https://www.coursera.org/learn/mechanics" },
          { title: "Preparing for JEE/Competitive Exams – Math", url: "https://www.coursera.org/learn/pre-calculus" },
        ],
      },
      {
        name: "Computer Science (PCMC) – Additional Courses",
        subjects: [],
        careers: [],
        courses: [
          { title: "Java Programming and Software Engineering", url: "https://www.coursera.org/specializations/java-programming" },
          { title: "Web Design for Everybody (HTML, CSS, JS)", url: "https://www.coursera.org/specializations/web-design" },
          { title: "Data Structures and Algorithms", url: "https://www.coursera.org/specializations/data-structures-algorithms" },
          { title: "Google IT Automation with Python", url: "https://www.coursera.org/professional-certificates/google-it-automation" },
          { title: "Introduction to Cybersecurity", url: "https://www.coursera.org/learn/intro-cyber-security" },
        ],
      },
      {
        name: "Science (PCB) – Additional Courses",
        subjects: [],
        careers: [],
        courses: [
          { title: "Human Anatomy", url: "https://www.coursera.org/learn/anatomy403-1x" },
          { title: "Genetics and Evolution", url: "https://www.coursera.org/learn/genetics-evolution" },
          { title: "Drug Discovery", url: "https://www.coursera.org/learn/drug-discovery" },
          { title: "NEET Preparation – Biology Fundamentals", url: "https://www.coursera.org/learn/biology" },
        ],
      },
      {
        name: "Commerce – Additional Courses",
        subjects: [],
        careers: [],
        courses: [
          { title: "Financial Accounting Fundamentals", url: "https://www.coursera.org/learn/uva-darden-financial-accounting" },
          { title: "Intro to Marketing", url: "https://www.coursera.org/learn/wharton-marketing" },
          { title: "Excel Skills for Business", url: "https://www.coursera.org/specializations/excel" },
          { title: "Entrepreneurship Specialization", url: "https://www.coursera.org/specializations/wharton-entrepreneurship" },
        ],
      },
      {
        name: "Arts / Humanities – Additional Courses",
        subjects: [],
        careers: [],
        courses: [
          { title: "Creative Writing", url: "https://www.coursera.org/specializations/creative-writing" },
          { title: "Social Psychology", url: "https://www.coursera.org/learn/social-psychology" },
          { title: "Introduction to Philosophy", url: "https://www.coursera.org/learn/philosophy" },
          { title: "Public Speaking", url: "https://www.coursera.org/learn/public-speaking" },
        ],
      },
    ],
  },
  school_12: {
    title: "🎓 After 12th Grade – College Degree Suggestions",
    description: "Based on your stream and marks, here are the best degree programs and supplementary courses:",
    degrees: [
      {
        name: "B.Tech / B.E. (Engineering)",
        duration: "4 years",
        careers: ["Software Engineer", "Data Scientist", "Civil Engineer", "Mechanical Engineer"],
        courses: [
          { title: "Google IT Support Certificate", url: "https://www.coursera.org/professional-certificates/google-it-support" },
          { title: "Algorithms by Stanford", url: "https://www.coursera.org/specializations/algorithms" },
          { title: "Machine Learning by Andrew Ng", url: "https://www.coursera.org/learn/machine-learning" },
        ],
      },
      {
        name: "MBBS / BDS (Medical)",
        duration: "5.5 / 4 years",
        careers: ["Doctor", "Surgeon", "Dentist", "Researcher"],
        courses: [
          { title: "Anatomy Specialization", url: "https://www.coursera.org/specializations/anatomy" },
          { title: "Medical Terminology", url: "https://www.coursera.org/learn/clinical-terminology" },
          { title: "First Aid", url: "https://www.coursera.org/learn/first-aid" },
        ],
      },
      {
        name: "B.Com / BBA (Commerce & Business)",
        duration: "3 years",
        careers: ["Chartered Accountant", "Financial Analyst", "HR Manager", "Entrepreneur"],
        courses: [
          { title: "Financial Markets by Yale", url: "https://www.coursera.org/learn/financial-markets-global" },
          { title: "Business Foundations", url: "https://www.coursera.org/specializations/wharton-business-foundations" },
          { title: "Google Digital Marketing", url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce" },
        ],
      },
      {
        name: "BA / B.Sc. (Arts & Science)",
        duration: "3 years",
        careers: ["Civil Services", "Journalist", "Teacher", "Psychologist", "Social Worker"],
        courses: [
          { title: "The Science of Well-Being", url: "https://www.coursera.org/learn/the-science-of-well-being" },
          { title: "Journalism for Social Change", url: "https://www.coursera.org/learn/journalism-social-change" },
          { title: "Graphic Design Specialization", url: "https://www.coursera.org/specializations/graphic-design" },
        ],
      },
      {
        name: "BCA / B.Sc. IT (Computer Applications)",
        duration: "3 years",
        careers: ["Web Developer", "App Developer", "System Admin", "Cloud Engineer"],
        courses: [
          { title: "Web Development with React", url: "https://www.coursera.org/specializations/full-stack-react" },
          { title: "Google UX Design", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
          { title: "AWS Cloud Practitioner", url: "https://www.coursera.org/professional-certificates/aws-cloud-technology-consultant" },
        ],
      },
      {
        name: "B.Tech CSE / IT (Computer Science & Engineering)",
        duration: "4 years",
        careers: ["Software Engineer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer", "Cybersecurity Specialist", "Full Stack Developer"],
        courses: [
          { title: "Machine Learning by Andrew Ng", url: "https://www.coursera.org/learn/machine-learning" },
          { title: "Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning" },
          { title: "Google Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
          { title: "Meta Front-End Developer", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
          { title: "IBM Full Stack Software Developer", url: "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer" },
        ],
      },
      {
        name: "LLB / BA LLB (Law)",
        duration: "3 / 5 years",
        careers: ["Lawyer", "Judge", "Legal Advisor", "Corporate Law"],
        courses: [
          { title: "Introduction to Law", url: "https://www.coursera.org/learn/introduction-to-law" },
          { title: "International Law", url: "https://www.coursera.org/learn/international-law" },
          { title: "Contract Law", url: "https://www.coursera.org/learn/contract-law" },
        ],
      },
    ],
  },
  ug: {
    title: "🎯 Undergraduate – Career & Higher Study Options",
    description: "Boost your career prospects with these additional skills and certifications:",
    additionalCourses: [
      { title: "Google Data Analytics Certificate", url: "https://www.coursera.org/professional-certificates/google-data-analytics" },
      { title: "IBM Data Science Professional", url: "https://www.coursera.org/professional-certificates/ibm-data-science" },
      { title: "Meta Front-End Developer", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer" },
      { title: "Google Project Management", url: "https://www.coursera.org/professional-certificates/google-project-management" },
      { title: "AWS Solutions Architect", url: "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect" },
      { title: "Deep Learning Specialization", url: "https://www.coursera.org/specializations/deep-learning" },
      { title: "Digital Marketing & E-commerce", url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce" },
      { title: "Business Analytics Specialization", url: "https://www.coursera.org/specializations/business-analytics" },
    ],
  },
  pg: {
    title: "🚀 Postgraduate – Advanced Certifications",
    description: "Level up with industry-recognized certifications:",
    additionalCourses: [
      { title: "Machine Learning Engineering for Production (MLOps)", url: "https://www.coursera.org/specializations/machine-learning-engineering-for-production-mlops" },
      { title: "Google Advanced Data Analytics", url: "https://www.coursera.org/professional-certificates/google-advanced-data-analytics" },
      { title: "Strategic Leadership & Management", url: "https://www.coursera.org/specializations/strategic-leadership" },
      { title: "AI for Everyone by Andrew Ng", url: "https://www.coursera.org/learn/ai-for-everyone" },
      { title: "Blockchain Specialization", url: "https://www.coursera.org/specializations/blockchain" },
      { title: "Google Cybersecurity Certificate", url: "https://www.coursera.org/professional-certificates/google-cybersecurity" },
    ],
  },
};

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
  const [showResults, setShowResults] = useState(false);
  const [savedAssessment, setSavedAssessment] = useState<any>(null);

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
      toast({ title: "Assessment Complete!", description: "Your personalized suggestions are ready." });
      setSavedAssessment(data);
      setShowResults(true);
      onComplete(data);
    }
    setLoading(false);
  };

  const suggestion = SUGGESTIONS[form.student_level];

  // Filter groups/degrees based on stream & marks
  const getFilteredGroups = () => {
    if (!suggestion?.groups) return suggestion?.groups;
    return suggestion.groups;
  };

  const getFilteredDegrees = () => {
    if (!suggestion?.degrees) return suggestion?.degrees;
    const streamMap: Record<string, string[]> = {
      science: ["B.Tech", "MBBS", "BCA", "B.Sc"],
      computer_science: ["B.Tech CSE", "BCA", "B.Sc. IT"],
      commerce: ["B.Com", "BBA"],
      arts: ["BA", "LLB"],
      engineering: ["B.Tech", "BCA"],
      medical: ["MBBS"],
      management: ["BBA", "B.Com"],
      law: ["LLB"],
    };
    const allowed = streamMap[form.stream];
    if (!allowed) return suggestion.degrees;
    return suggestion.degrees.filter(d => allowed.some(a => d.name.includes(a)));
  };

  if (showResults && suggestion) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-7">
          <h2 className="font-display text-2xl font-bold text-navy mb-2">{suggestion.title}</h2>
          <p className="text-muted-foreground mb-1">{suggestion.description}</p>
          {form.marks_percentage >= 85 && (
            <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">🌟 Excellent marks – Top options recommended!</span>
          )}
          {form.marks_percentage >= 60 && form.marks_percentage < 85 && (
            <span className="inline-block text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">📘 Good marks – Many options available</span>
          )}
          {form.marks_percentage < 60 && (
            <span className="inline-block text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">💪 Focus on skill-building courses below</span>
          )}
        </div>

        {/* Groups (10th / 11th) */}
        {getFilteredGroups()?.map((group) => (
          <div key={group.name} className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-lg">{group.name}</h3>
                {group.subjects.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Subjects:</span> {group.subjects.join(", ")}
                  </p>
                )}
                {group.careers.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Career Options:</span> {group.careers.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-navy flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Free Coursera Courses
              </h4>
              {group.courses.map((course) => (
                <a
                  key={course.url}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border hover:border-primary/30 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{course.title}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Degrees (12th) */}
        {getFilteredDegrees()?.map((degree) => (
          <div key={degree.name} className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-navy text-lg">{degree.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  <span className="font-medium">Duration:</span> {degree.duration} · <span className="font-medium">Careers:</span> {degree.careers.join(", ")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-navy flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> Supplementary Free Courses
              </h4>
              {degree.courses.map((course) => (
                <a
                  key={course.url}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-secondary/5 border border-border hover:border-secondary/30 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-secondary transition-colors">{course.title}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-secondary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Additional Courses (UG / PG) */}
        {suggestion.additionalCourses && (
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-display font-bold text-navy text-lg mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" /> Recommended Certifications & Courses
            </h3>
            <div className="grid gap-2">
              {suggestion.additionalCourses.map((course) => (
                <a
                  key={course.url}
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-primary/5 border border-border hover:border-primary/30 transition-all group"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{course.title}</span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        <Button onClick={() => { setShowResults(false); setStep(1); }} variant="outline" className="w-full h-11">
          ← Retake Assessment
        </Button>
      </div>
    );
  }

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
              <Select value={form.student_level} onValueChange={v => setForm({ ...form, student_level: v, stream: "" })}>
                <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select your level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="school_10">10th Grade</SelectItem>
                  <SelectItem value="school_11">11th Grade</SelectItem>
                  <SelectItem value="school_12">12th Grade</SelectItem>
                  <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                  <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(form.student_level === "school_11" || form.student_level === "school_12" || form.student_level === "ug" || form.student_level === "pg") && (
              <div>
                <Label className="font-medium text-navy">Stream / Branch</Label>
                <Select value={form.stream} onValueChange={v => setForm({ ...form, stream: v })}>
                  <SelectTrigger className="mt-1.5 h-11"><SelectValue placeholder="Select stream" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="science">Science (PCM/PCB)</SelectItem>
                    <SelectItem value="computer_science">Computer Science (PCMC/CSE/IT)</SelectItem>
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
