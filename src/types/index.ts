// 新闻类型
export interface News {
  _id: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  images?: string[];
  video_url?: string;
  category: 'news' | 'event' | 'skill' | 'video';
  tags: string[];
  source: string;
  source_url?: string;
  author: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_top: boolean;
  is_ai_generated: boolean;
  ai_summary?: string;
  ai_keywords?: string[];
  created_at: string;
  updated_at: string;
}

// AI分析类型
export interface AIAnalysis {
  _id: string;
  user_id: string;
  video_url: string;
  video_thumbnail: string;
  analysis_type: 'grip' | 'stance' | 'power' | 'comprehensive';
  score: number;
  grip_score: number;
  stance_score: number;
  power_score: number;
  rhythm_score: number;
  highlights: string[];
  improvements: string[];
  training_suggestions: string[];
  key_frames: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

// 球房类型
export interface Venue {
  _id: string;
  name: string;
  cover_image: string;
  images: string[];
  description: string;
  address: string;
  city: string;
  district: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  phone: string;
  business_hours: {
    start: string;
    end: string;
  };
  rating: number;
  review_count: number;
  price_range: {
    min: number;
    max: number;
  };
  tables: {
    chinese: number;
    american: number;
    british: number;
  };
  facilities: string[]; // ['空调', 'WiFi', '餐饮', '休息区', '球具店']
  table_brand?: string;
  member_price?: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  promotions?: string[];
  status: 'open' | 'closed' | 'maintenance';
  created_at: string;
  updated_at: string;
}

// 球房评价类型
export interface VenueReview {
  _id: string;
  venue_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  environment_rating: number;
  service_rating: number;
  facility_rating: number;
  content: string;
  images?: string[];
  like_count: number;
  created_at: string;
}

// 赛事类型
export interface Event {
  _id: string;
  name: string;
  cover_image: string;
  description: string;
  organizer: string;
  venue_id: string;
  venue_name: string;
  event_type: 'amateur' | 'professional' | 'commercial';
  game_type: 'chinese' | 'american' | 'snooker';
  format: 'knockout' | 'round-robin' | 'mixed';
  prize_money: number;
  prize_distribution: string;
  registration_fee: number;
  registration_start: string;
  registration_end: string;
  event_start: string;
  event_end: string;
  max_participants: number;
  current_participants: number;
  status: 'registration' | 'ongoing' | 'completed' | 'cancelled';
  rules: string;
  requirements: string[];
  announcements?: {
    title: string;
    content: string;
    created_at: string;
  }[];
  created_at: string;
  updated_at: string;
}

// 赛事报名类型
export interface EventRegistration {
  _id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_phone: string;
  skill_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  note?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  created_at: string;
}

// 教练类型
export interface Coach {
  _id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  bio: string;
  credentials: string[];
  teaching_experience: number;
  student_count: number;
  satisfaction_rate: number;
  teaching_types: string[];
  specialties: string[];
  venue_ids: string[];
  venue_names: string[];
  price_range: {
    min: number;
    max: number;
  };
  prices: {
    beginner: number;
    intermediate: number;
    professional: number;
    youth: number;
  };
  rating: number;
  review_count: number;
  video_count: number;
  available_times: {
    date: string;
    slots: {
      start: string;
      end: string;
      available: boolean;
    }[];
  }[];
  status: 'available' | 'busy' | 'offline';
  created_at: string;
  updated_at: string;
}

// 教练视频类型
export interface CoachVideo {
  _id: string;
  coach_id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: number;
  view_count: number;
  like_count: number;
  tags: string[];
  created_at: string;
}

// 预约类型
export interface Booking {
  _id: string;
  user_id: string;
  coach_id: string;
  coach_name: string;
  venue_id: string;
  venue_name: string;
  booking_date: string;
  time_slot: {
    start: string;
    end: string;
  };
  teaching_type: 'beginner' | 'intermediate' | 'professional' | 'youth';
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'refunded';
  note?: string;
  created_at: string;
}

// 评论类型
export interface Comment {
  _id: string;
  target_type: 'news' | 'venue' | 'coach' | 'event';
  target_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  parent_id?: string;
  reply_to?: string;
  like_count: number;
  created_at: string;
}

// 收藏类型
export interface Favorite {
  _id: string;
  user_id: string;
  target_type: 'news' | 'venue' | 'coach' | 'event';
  target_id: string;
  created_at: string;
}

// 用户类型
export interface User {
  _id: string;
  uid?: string;
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
  gender?: 'male' | 'female' | 'secret';
  age?: number;
  city?: string;
  bio?: string;
  skill_level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master';
  skill_points: number;
  ranking?: number;
  member_type?: 'normal' | 'gold' | 'platinum' | 'diamond';
  member_expire_at?: string;
  analysis_count: number;
  event_count: number;
  created_at: string;
  updated_at: string;
}
