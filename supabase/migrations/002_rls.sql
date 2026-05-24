-- supabase/migrations/002_rls.sql

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles públicos para lectura" ON profiles FOR SELECT USING (true);
CREATE POLICY "Usuario edita su propio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- STAMPS
CREATE POLICY "Stamps públicos para lectura" ON stamps FOR SELECT USING (true);
CREATE POLICY "Usuario crea sus stamps" ON stamps FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Usuario edita sus stamps" ON stamps FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Usuario borra sus stamps" ON stamps FOR DELETE USING (auth.uid() = owner_id);

-- MATCHES
CREATE POLICY "Usuario ve sus matches" ON matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Sistema crea matches" ON matches FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Participantes actualizan status" ON matches FOR UPDATE
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- CHATS
CREATE POLICY "Participantes ven su chat" ON chats FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);
CREATE POLICY "Sistema crea chats" ON chats FOR INSERT
  WITH CHECK (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- MESSAGES
CREATE POLICY "Participantes ven mensajes" ON messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_a_id FROM chats WHERE id = chat_id
      UNION
      SELECT user_b_id FROM chats WHERE id = chat_id
    )
  );
CREATE POLICY "Participantes envían mensajes" ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- RATINGS
CREATE POLICY "Ratings públicos" ON ratings FOR SELECT USING (true);
CREATE POLICY "Usuario califica una vez por match" ON ratings FOR INSERT
  WITH CHECK (auth.uid() = rater_id);

-- REPORTS
CREATE POLICY "Usuario reporta" ON reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- BLOCKS
CREATE POLICY "Usuario ve sus bloqueos" ON blocks FOR SELECT
  USING (auth.uid() = blocker_id);
CREATE POLICY "Usuario bloquea" ON blocks FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Usuario desbloquea" ON blocks FOR DELETE USING (auth.uid() = blocker_id);
