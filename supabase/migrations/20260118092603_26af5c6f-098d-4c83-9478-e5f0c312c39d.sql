-- Crear enums para los tipos
CREATE TYPE public.layer_type AS ENUM ('identity', 'communication', 'information', 'intelligence', 'economy', 'governance', 'documentation');
CREATE TYPE public.repo_status AS ENUM ('active', 'development', 'planning', 'paused');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE public.task_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE public.deployment_env AS ENUM ('staging', 'production');
CREATE TYPE public.deployment_status AS ENUM ('success', 'pending', 'failed');
CREATE TYPE public.user_role AS ENUM ('admin', 'viewer');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de roles (separada por seguridad)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  UNIQUE(user_id, role)
);

-- Tabla de repositorios
CREATE TABLE public.repositories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  layer layer_type NOT NULL,
  stack TEXT[] DEFAULT '{}',
  status repo_status DEFAULT 'planning',
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de módulos
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer layer_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tareas
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status task_status DEFAULT 'todo',
  priority task_priority DEFAULT 'medium',
  assignee UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de despliegues
CREATE TABLE public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repository_id UUID REFERENCES public.repositories(id) ON DELETE CASCADE,
  environment deployment_env NOT NULL,
  version TEXT NOT NULL,
  status deployment_status DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de configuración
CREATE TABLE public.configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  environment TEXT DEFAULT 'all',
  is_secret BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(key, environment)
);

-- Tabla de historial de progreso (para gráficos)
CREATE TABLE public.progress_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer layer_type NOT NULL,
  progress INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_history ENABLE ROW LEVEL SECURITY;

-- Función helper para verificar rol admin
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Función helper para verificar si es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Políticas RLS para profiles
CREATE POLICY "Usuarios pueden ver su perfil" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY "Usuarios pueden actualizar su perfil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins pueden ver todos los perfiles" ON public.profiles
  FOR SELECT USING (public.is_admin());

-- Políticas RLS para user_roles (solo admins)
CREATE POLICY "Admins pueden gestionar roles" ON public.user_roles
  FOR ALL USING (public.is_admin());

CREATE POLICY "Usuarios pueden ver su propio rol" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas RLS para repositories (admins escriben, auth lee)
CREATE POLICY "Usuarios autenticados pueden ver repositorios" ON public.repositories
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden gestionar repositorios" ON public.repositories
  FOR ALL USING (public.is_admin());

-- Políticas RLS para modules
CREATE POLICY "Usuarios autenticados pueden ver módulos" ON public.modules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden gestionar módulos" ON public.modules
  FOR ALL USING (public.is_admin());

-- Políticas RLS para tasks
CREATE POLICY "Usuarios autenticados pueden ver tareas" ON public.tasks
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden gestionar tareas" ON public.tasks
  FOR ALL USING (public.is_admin());

CREATE POLICY "Usuarios pueden actualizar sus tareas asignadas" ON public.tasks
  FOR UPDATE USING (auth.uid() = assignee);

-- Políticas RLS para deployments
CREATE POLICY "Usuarios autenticados pueden ver despliegues" ON public.deployments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden gestionar despliegues" ON public.deployments
  FOR ALL USING (public.is_admin());

-- Políticas RLS para configs (solo admins)
CREATE POLICY "Admins pueden gestionar configs" ON public.configs
  FOR ALL USING (public.is_admin());

-- Políticas RLS para progress_history
CREATE POLICY "Usuarios autenticados pueden ver historial" ON public.progress_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins pueden insertar historial" ON public.progress_history
  FOR INSERT WITH CHECK (public.is_admin());

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER repositories_updated_at BEFORE UPDATE ON public.repositories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER modules_updated_at BEFORE UPDATE ON public.modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER configs_updated_at BEFORE UPDATE ON public.configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insertar datos de ejemplo
INSERT INTO public.repositories (name, url, layer, stack, status, description) VALUES
  ('isabella-core', 'https://github.com/OsoPanda1/isabella-core', 'intelligence', ARRAY['Python', 'FastAPI', 'LangChain'], 'active', 'Núcleo de Isabella AI - Pipeline principal de procesamiento'),
  ('bookpi', 'https://github.com/OsoPanda1/bookpi', 'intelligence', ARRAY['TypeScript', 'Supabase'], 'development', 'Registro cognitivo inmutable - Ledger de conocimiento'),
  ('tamvai-api', 'https://github.com/OsoPanda1/tamvai-api', 'intelligence', ARRAY['TypeScript', 'Express', 'OpenAI'], 'active', 'API unificada de inteligencia TAMV'),
  ('msr-contracts', 'https://github.com/OsoPanda1/msr-contracts', 'economy', ARRAY['Solidity', 'Hardhat'], 'development', 'Contratos inteligentes MSR blockchain'),
  ('utamv-token', 'https://github.com/OsoPanda1/utamv-token', 'economy', ARRAY['Solidity', 'TypeScript'], 'planning', 'Token UTAMV - Economía del ecosistema'),
  ('telegram-bot', 'https://github.com/OsoPanda1/telegram-bot', 'communication', ARRAY['Python', 'Telethon'], 'active', 'Bot principal de comunicación Telegram'),
  ('did-service', 'https://github.com/OsoPanda1/did-service', 'identity', ARRAY['TypeScript', 'DID'], 'planning', 'Servicio de identidad descentralizada'),
  ('rsshub-tamv', 'https://github.com/OsoPanda1/rsshub-tamv', 'information', ARRAY['Node.js', 'RSS'], 'development', 'Agregador de información TAMV');

INSERT INTO public.modules (layer, name, description, progress) VALUES
  ('identity', 'DID Core', 'Identidad descentralizada', 25),
  ('identity', 'Membresías', 'Sistema de membresías', 10),
  ('communication', 'Telegram Bot', 'Bot de Telegram', 75),
  ('communication', 'Federation', 'Mensajería federada', 15),
  ('information', 'RSSHub', 'Agregador RSS', 40),
  ('information', 'Ingestion', 'Pipeline de ingesta', 30),
  ('intelligence', 'Isabella Core', 'IA principal', 60),
  ('intelligence', 'BookPI', 'Registro cognitivo', 45),
  ('intelligence', 'MiniAIs', 'IAs especializadas', 35),
  ('intelligence', 'Filter Core', 'Filtro emocional', 50),
  ('economy', 'MSR Contracts', 'Contratos blockchain', 55),
  ('economy', 'UTAMV', 'Token económico', 20),
  ('economy', 'Lotería', 'Sistema de lotería', 30),
  ('governance', 'Protocolos', 'Reglas del sistema', 40),
  ('governance', 'Playbooks', 'Guías operativas', 35),
  ('documentation', 'Whitepapers', 'Documentación técnica', 65),
  ('documentation', 'API Docs', 'Documentación API', 50);

-- Insertar historial de progreso para gráficos
INSERT INTO public.progress_history (layer, progress, recorded_at) VALUES
  ('identity', 10, NOW() - INTERVAL '30 days'),
  ('identity', 15, NOW() - INTERVAL '20 days'),
  ('identity', 18, NOW() - INTERVAL '10 days'),
  ('identity', 18, NOW()),
  ('communication', 30, NOW() - INTERVAL '30 days'),
  ('communication', 40, NOW() - INTERVAL '20 days'),
  ('communication', 42, NOW() - INTERVAL '10 days'),
  ('communication', 45, NOW()),
  ('information', 20, NOW() - INTERVAL '30 days'),
  ('information', 28, NOW() - INTERVAL '20 days'),
  ('information', 32, NOW() - INTERVAL '10 days'),
  ('information', 35, NOW()),
  ('intelligence', 35, NOW() - INTERVAL '30 days'),
  ('intelligence', 42, NOW() - INTERVAL '20 days'),
  ('intelligence', 45, NOW() - INTERVAL '10 days'),
  ('intelligence', 48, NOW()),
  ('economy', 25, NOW() - INTERVAL '30 days'),
  ('economy', 30, NOW() - INTERVAL '20 days'),
  ('economy', 33, NOW() - INTERVAL '10 days'),
  ('economy', 35, NOW()),
  ('governance', 20, NOW() - INTERVAL '30 days'),
  ('governance', 30, NOW() - INTERVAL '20 days'),
  ('governance', 35, NOW() - INTERVAL '10 days'),
  ('governance', 38, NOW()),
  ('documentation', 40, NOW() - INTERVAL '30 days'),
  ('documentation', 50, NOW() - INTERVAL '20 days'),
  ('documentation', 55, NOW() - INTERVAL '10 days'),
  ('documentation', 58, NOW());