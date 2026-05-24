-- supabase/migrations/001_schema.sql

-- PROFILES (extends auth.users)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  full_name text NOT NULL,
  city text NOT NULL,
  avatar_url text,
  verified boolean DEFAULT false,
  reputation_score numeric(3,2) DEFAULT 0,
  trades_count integer DEFAULT 0,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- STAMPS
CREATE TABLE stamps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  number integer NOT NULL,
  player_name text NOT NULL,
  country text NOT NULL,
  rarity text NOT NULL CHECK (rarity IN ('common','rare','star','ultra')),
  quantity integer DEFAULT 1,
  type text NOT NULL CHECK (type IN ('have','want')),
  image_url text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX stamps_owner_idx ON stamps(owner_id);
CREATE INDEX stamps_number_idx ON stamps(number);

-- MATCHES
CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stamp_a_id uuid NOT NULL REFERENCES stamps(id) ON DELETE CASCADE,
  stamp_b_id uuid NOT NULL REFERENCES stamps(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','completed','cancelled')),
  created_at timestamptz DEFAULT now()
);

-- CHATS
CREATE TABLE chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  user_a_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_b_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- MESSAGES
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  CHECK (content IS NOT NULL OR image_url IS NOT NULL)
);
CREATE INDEX messages_chat_idx ON messages(chat_id, created_at);

-- RATINGS
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  rater_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(match_id, rater_id)
);

-- REPORTS
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- BLOCKS
CREATE TABLE blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

-- AUTO-CREATE PROFILE ON REGISTER
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, username, full_name, city)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'city'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- UPDATE reputation_score AFTER RATING
CREATE OR REPLACE FUNCTION update_reputation()
RETURNS trigger AS $$
BEGIN
  UPDATE profiles
  SET reputation_score = (
    SELECT ROUND(AVG(score)::numeric, 2)
    FROM ratings
    WHERE rated_id = NEW.rated_id
  )
  WHERE id = NEW.rated_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_rating_created
  AFTER INSERT ON ratings
  FOR EACH ROW EXECUTE FUNCTION update_reputation();
