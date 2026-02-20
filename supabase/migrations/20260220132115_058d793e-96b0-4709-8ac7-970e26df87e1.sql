
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  student_level TEXT CHECK (student_level IN ('school_10', 'school_12', 'ug', 'pg')),
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Colleges table
CREATE TABLE public.colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT,
  state TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  type TEXT CHECK (type IN ('government', 'private', 'deemed')),
  established_year INTEGER,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('school', 'ug', 'pg', 'diploma', 'certificate')),
  stream TEXT CHECK (stream IN ('science', 'commerce', 'arts', 'engineering', 'medical', 'management', 'law', 'other')),
  duration_years NUMERIC(3,1),
  cutoff_general NUMERIC(5,2),
  cutoff_obc NUMERIC(5,2),
  cutoff_sc_st NUMERIC(5,2),
  fees_per_year NUMERIC(12,2),
  seats INTEGER,
  description TEXT,
  future_scope TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Career paths table
CREATE TABLE public.career_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technology', 'medical', 'engineering', 'arts', 'commerce', 'science', 'management', 'law', 'other')),
  description TEXT,
  required_stream TEXT,
  required_degree TEXT,
  avg_salary_min NUMERIC(12,2),
  avg_salary_max NUMERIC(12,2),
  growth_outlook TEXT CHECK (growth_outlook IN ('excellent', 'good', 'moderate', 'declining')),
  skills_required TEXT[],
  related_courses TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  address TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  company_size TEXT CHECK (company_size IN ('startup', 'small', 'medium', 'large', 'mnc')),
  description TEXT,
  logo_url TEXT,
  founded_year INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Job roles table
CREATE TABLE public.job_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  career_path_id UUID REFERENCES public.career_paths(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  required_degree TEXT,
  required_stream TEXT,
  experience_min INTEGER DEFAULT 0,
  experience_max INTEGER,
  salary_min NUMERIC(12,2),
  salary_max NUMERIC(12,2),
  skills_required TEXT[],
  description TEXT,
  is_internship BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Student skill assessments
CREATE TABLE public.student_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  student_level TEXT NOT NULL,
  stream TEXT,
  marks_percentage NUMERIC(5,2),
  skills TEXT[],
  interests TEXT[],
  preferred_city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies: profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies: user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies: public read tables
CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admins can manage colleges" ON public.colleges FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view career paths" ON public.career_paths FOR SELECT USING (true);
CREATE POLICY "Admins can manage career paths" ON public.career_paths FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Admins can manage companies" ON public.companies FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT USING (true);
CREATE POLICY "Admins can manage job roles" ON public.job_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies: student data
CREATE POLICY "Users own assessments" ON public.student_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins view all assessments" ON public.student_assessments FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users own chat messages" ON public.chat_messages FOR ALL USING (auth.uid() = user_id);

-- Trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile and student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), NEW.email);

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed initial skills data
INSERT INTO public.skills (name, category) VALUES
  ('Mathematics', 'academic'), ('Physics', 'academic'), ('Chemistry', 'academic'),
  ('Biology', 'academic'), ('Computer Science', 'technical'), ('Programming', 'technical'),
  ('Data Analysis', 'technical'), ('Communication', 'soft'), ('Leadership', 'soft'),
  ('Problem Solving', 'soft'), ('Design', 'creative'), ('Writing', 'creative'),
  ('Accounting', 'professional'), ('Marketing', 'professional'), ('Research', 'academic');

-- Seed career paths
INSERT INTO public.career_paths (title, category, description, required_stream, required_degree, avg_salary_min, avg_salary_max, growth_outlook, skills_required, related_courses) VALUES
  ('Software Engineer', 'technology', 'Design and develop software applications and systems', 'science', 'B.Tech/B.E. Computer Science', 400000, 2500000, 'excellent', ARRAY['Programming', 'Problem Solving', 'Mathematics'], ARRAY['B.Tech CSE', 'BCA', 'MCA']),
  ('Data Scientist', 'technology', 'Analyze complex data to help businesses make better decisions', 'science', 'B.Tech/B.Sc Statistics/Math', 600000, 3000000, 'excellent', ARRAY['Data Analysis', 'Mathematics', 'Programming', 'Research'], ARRAY['M.Sc Data Science', 'B.Tech CSE', 'M.Tech AI']),
  ('Doctor (MBBS)', 'medical', 'Diagnose and treat patients in hospitals and clinics', 'science', 'MBBS', 600000, 4000000, 'excellent', ARRAY['Biology', 'Chemistry', 'Communication'], ARRAY['MBBS', 'MD', 'MS']),
  ('Civil Engineer', 'engineering', 'Design and oversee construction of infrastructure', 'science', 'B.Tech Civil Engineering', 300000, 1200000, 'good', ARRAY['Mathematics', 'Physics', 'Problem Solving'], ARRAY['B.Tech Civil', 'Diploma Civil']),
  ('Chartered Accountant', 'commerce', 'Manage financial records, audits and tax planning', 'commerce', 'CA + B.Com', 500000, 2000000, 'good', ARRAY['Accounting', 'Mathematics', 'Research'], ARRAY['B.Com', 'CA', 'CMA']),
  ('Graphic Designer', 'arts', 'Create visual content for brands and communications', 'arts', 'B.Des/BFA', 250000, 1200000, 'good', ARRAY['Design', 'Communication'], ARRAY['B.Des', 'BFA', 'Diploma Design']),
  ('MBA Manager', 'management', 'Lead business operations and strategic decision-making', 'commerce', 'MBA', 500000, 3000000, 'excellent', ARRAY['Leadership', 'Communication', 'Marketing', 'Problem Solving'], ARRAY['MBA', 'PGDM', 'BBA']),
  ('Lawyer', 'law', 'Provide legal counsel and represent clients in courts', 'arts', 'LLB/LLM', 350000, 2000000, 'moderate', ARRAY['Communication', 'Research', 'Writing'], ARRAY['LLB', 'LLM', 'BA LLB']);

-- Seed sample colleges
INSERT INTO public.colleges (name, city, state, area, type, description) VALUES
  ('Indian Institute of Technology Delhi', 'New Delhi', 'Delhi', 'Hauz Khas', 'government', 'Premier technical institution known for engineering and science programs'),
  ('Indian Institute of Management Ahmedabad', 'Ahmedabad', 'Gujarat', 'Vastrapur', 'government', 'Top business school offering MBA and executive programs'),
  ('AIIMS New Delhi', 'New Delhi', 'Delhi', 'Ansari Nagar', 'government', 'Premier medical institute for MBBS and medical specializations'),
  ('Symbiosis International University', 'Pune', 'Maharashtra', 'Lavale', 'deemed', 'Leading private university with diverse programs'),
  ('Manipal Academy of Higher Education', 'Manipal', 'Karnataka', 'Manipal', 'deemed', 'Multi-disciplinary private university with strong industry connections');

-- Seed sample companies
INSERT INTO public.companies (name, industry, city, state, company_size, description) VALUES
  ('Tata Consultancy Services', 'Information Technology', 'Mumbai', 'Maharashtra', 'mnc', 'India largest IT services company with global operations'),
  ('Infosys', 'Information Technology', 'Bengaluru', 'Karnataka', 'mnc', 'Global leader in next-generation digital services'),
  ('Wipro', 'Information Technology', 'Bengaluru', 'Karnataka', 'mnc', 'Technology services and consulting company'),
  ('HDFC Bank', 'Banking & Finance', 'Mumbai', 'Maharashtra', 'large', 'Leading private sector bank in India'),
  ('Apollo Hospitals', 'Healthcare', 'Chennai', 'Tamil Nadu', 'large', 'Premier healthcare provider with hospitals across India');
