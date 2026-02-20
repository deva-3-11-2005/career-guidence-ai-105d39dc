import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, TrendingUp, MapPin, Bot, Users, BookOpen, Building2, ArrowRight, Star, CheckCircle } from "lucide-react";

const stats = [
  { label: "Career Paths", value: "200+", icon: TrendingUp },
  { label: "Colleges Listed", value: "500+", icon: Building2 },
  { label: "Companies", value: "300+", icon: Users },
  { label: "Students Guided", value: "10K+", icon: GraduationCap },
];

const features = [
  {
    icon: Bot,
    title: "AI Career Counselor",
    desc: "Get personalized career advice from our intelligent chatbot trained on thousands of career profiles.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: TrendingUp,
    title: "Smart Recommendations",
    desc: "Enter your skills, marks & interests to receive tailored career path suggestions with salary insights.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: MapPin,
    title: "Location-Based Search",
    desc: "Find colleges and companies near you with address, contact info, and admission details.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: BookOpen,
    title: "Complete Course Guide",
    desc: "Detailed information on courses, cutoffs, fees, duration, and future scope across all streams.",
    color: "from-orange-500 to-amber-600",
  },
];

const testimonials = [
  { name: "Priya Sharma", role: "B.Tech Student, IIT Delhi", text: "CareerAI helped me choose the right stream after 12th. The AI chatbot answered all my doubts about JEE preparation!", rating: 5 },
  { name: "Rahul Gupta", role: "MBA Graduate", text: "The skill-based recommendation system was spot on. I discovered career options I'd never considered before.", rating: 5 },
  { name: "Ananya Singh", role: "Medical Student, AIIMS", text: "Found the perfect medical college with the location-based search. Cutoff data was incredibly accurate.", rating: 5 },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-emerald-400 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-400 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        </div>
        <div className="relative container mx-auto px-4 pt-20 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20 text-sm px-4 py-1.5">
              🎓 India's #1 AI-Powered Career Guidance Platform
            </Badge>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your{" "}
              <span className="relative">
                <span style={{ color: "hsl(160 84% 55%)" }}>Perfect Career</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M0 6 Q75 0 150 6 Q225 12 300 6" stroke="hsl(160 84% 55%)" strokeWidth="2.5" fill="none" opacity="0.6"/>
                </svg>
              </span>{" "}
              Path
            </h1>
            <p className="text-white/75 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered guidance for students from 10th grade to postgraduate level. 
              Discover careers, explore colleges, and connect with opportunities across India.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/signup")}
                className="gradient-emerald text-white border-0 px-8 py-6 text-base font-semibold shadow-hero hover:opacity-90 hover:scale-105 transition-all"
              >
                Start Your Journey Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/careers")}
                className="bg-white/10 text-white border-white/30 px-8 py-6 text-base font-semibold hover:bg-white/20"
              >
                Explore Careers
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60 text-sm">
              {["No registration fee", "AI-powered guidance", "Updated daily"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" style={{ color: "hsl(160 84% 55%)" }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-2xl p-5 text-center group hover:bg-white/15 transition-colors">
                <Icon className="w-6 h-6 mx-auto mb-2" style={{ color: "hsl(160 84% 55%)" }} />
                <div className="font-display text-2xl font-bold text-white">{value}</div>
                <div className="text-white/60 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who is this for? */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-navy mb-3">Guidance for Every Student</h2>
            <p className="text-muted-foreground">Whether you're in school or college, we have you covered</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div onClick={() => navigate("/signup")} className="glass-card rounded-2xl p-7 cursor-pointer hover:shadow-elevated transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🏫</span>
              </div>
              <h3 className="font-display text-xl font-bold text-navy mb-2">School Students</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                10th & 12th grade students: Get stream selection guidance, understand career options, and discover the right path after board exams.
              </p>
              <ul className="space-y-1.5">
                {["Stream selection (Science/Commerce/Arts)", "JEE, NEET, CLAT entrance guidance", "Nearby school & college recommendations"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(160 84% 39%)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div onClick={() => navigate("/signup")} className="glass-card rounded-2xl p-7 cursor-pointer hover:shadow-elevated transition-all group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="font-display text-xl font-bold text-navy mb-2">College Students</h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                UG & PG students: Explore career paths, discover companies hiring for your degree, and plan your higher studies.
              </p>
              <ul className="space-y-1.5">
                {["Career paths based on your degree", "Companies & internship opportunities", "Higher studies: MBA, MS, M.Tech options"].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "hsl(160 84% 39%)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-navy mb-3">Powerful Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to make the right career decision</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card rounded-2xl p-6 hover:shadow-elevated transition-all hover:-translate-y-1 group">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-navy mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-navy mb-3">Student Success Stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="glass-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed italic">"{text}"</p>
                <div>
                  <div className="font-semibold text-navy text-sm">{name}</div>
                  <div className="text-xs text-muted-foreground">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Career Path?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto">Join thousands of students who found clarity with CareerAI</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/signup")} className="gradient-emerald text-white border-0 px-8 font-semibold hover:opacity-90">
              Create Free Account <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/chatbot")} className="bg-white/10 text-white border-white/30 px-8 hover:bg-white/20">
              <Bot className="w-5 h-5 mr-2" /> Chat with AI Counselor
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-dark py-10 text-white/60 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-display font-bold text-white text-lg mb-3">CareerAI</div>
              <p className="text-sm leading-relaxed">India's most comprehensive AI-powered career guidance platform for students.</p>
            </div>
            <div>
              <div className="font-semibold text-white/80 mb-3">Explore</div>
              <div className="space-y-2">
                <div><a href="/careers" className="hover:text-white transition-colors">Career Paths</a></div>
                <div><a href="/colleges" className="hover:text-white transition-colors">Colleges</a></div>
                <div><a href="/companies" className="hover:text-white transition-colors">Companies</a></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white/80 mb-3">Students</div>
              <div className="space-y-2">
                <div><a href="/student" className="hover:text-white transition-colors">Dashboard</a></div>
                <div><a href="/chatbot" className="hover:text-white transition-colors">AI Chatbot</a></div>
                <div><a href="/skill-assessment" className="hover:text-white transition-colors">Skill Assessment</a></div>
              </div>
            </div>
            <div>
              <div className="font-semibold text-white/80 mb-3">Account</div>
              <div className="space-y-2">
                <div><a href="/signup" className="hover:text-white transition-colors">Sign Up</a></div>
                <div><a href="/login" className="hover:text-white transition-colors">Login</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 text-center">
            © 2026 CareerAI. Empowering students across India 🇮🇳
          </div>
        </div>
      </footer>
    </div>
  );
}
