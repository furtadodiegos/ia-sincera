# Supabase

## Auth

Providers habilitados:
- Google

Configuração:
- Redirect URL: `{site}/api/auth/callback`
- Trigger para criar perfil após signup

## Tables

### users

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  display_name text,
  about text CHECK (char_length(about) <= 280),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_username ON users(username);
```

### testimonials

```sql
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL CHECK (char_length(content) <= 140),
  created_at timestamptz DEFAULT now(),
  UNIQUE(author_id, profile_id)
);

CREATE INDEX idx_testimonials_profile ON testimonials(profile_id);
CREATE INDEX idx_testimonials_author ON testimonials(author_id);
```

## RLS Policies

### users

```sql
-- Leitura pública
CREATE POLICY "Users are viewable by everyone"
ON users FOR SELECT USING (true);

-- Update próprio perfil
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE USING (auth.uid() = id);

-- Delete próprio perfil
CREATE POLICY "Users can delete own profile"
ON users FOR DELETE USING (auth.uid() = id);
```

### testimonials

```sql
-- Leitura pública
CREATE POLICY "Testimonials are viewable by everyone"
ON testimonials FOR SELECT USING (true);

-- Insert autenticado
CREATE POLICY "Authenticated users can create testimonials"
ON testimonials FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Delete autor ou dono do perfil
CREATE POLICY "Author or profile owner can delete"
ON testimonials FOR DELETE USING (
  auth.uid() = author_id OR auth.uid() = profile_id
);
```

## Trigger: Criar perfil após signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'preferred_username',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```
