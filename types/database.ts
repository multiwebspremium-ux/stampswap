export type Rarity = 'common' | 'rare' | 'star' | 'ultra'
export type StampType = 'have' | 'want'
export type MatchStatus = 'pending' | 'accepted' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  username: string
  full_name: string
  city: string
  avatar_url: string | null
  verified: boolean
  reputation_score: number
  trades_count: number
  last_seen: string
  created_at: string
}

export interface Stamp {
  id: string
  owner_id: string
  number: number
  player_name: string
  country: string
  rarity: Rarity
  quantity: number
  type: StampType
  image_url: string | null
  created_at: string
}

export interface Match {
  id: string
  user_a_id: string
  user_b_id: string
  stamp_a_id: string
  stamp_b_id: string
  status: MatchStatus
  created_at: string
}

export interface Chat {
  id: string
  match_id: string
  user_a_id: string
  user_b_id: string
  created_at: string
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string | null
  image_url: string | null
  created_at: string
}

export interface Rating {
  id: string
  match_id: string
  rater_id: string
  rated_id: string
  score: number
  comment: string | null
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'reputation_score' | 'trades_count' | 'verified'>
        Update: Partial<Profile>
      }
      stamps: {
        Row: Stamp
        Insert: Omit<Stamp, 'id' | 'created_at'>
        Update: Partial<Stamp>
      }
      matches: {
        Row: Match
        Insert: Omit<Match, 'id' | 'created_at' | 'status'>
        Update: Partial<Match>
      }
      chats: {
        Row: Chat
        Insert: Omit<Chat, 'id' | 'created_at'>
        Update: Partial<Chat>
      }
      messages: {
        Row: Message
        Insert: Omit<Message, 'id' | 'created_at'>
        Update: Partial<Message>
      }
      ratings: {
        Row: Rating
        Insert: Omit<Rating, 'id' | 'created_at'>
        Update: Partial<Rating>
      }
    }
  }
}
