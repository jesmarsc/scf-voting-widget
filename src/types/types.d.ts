interface Project {
  name: string;
  slug: string;
  budget: number;
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  banner?: string;
  accent_color?: number;
  locale?: string;
  verified?: boolean;
  email?: string;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

interface User extends DiscordUser {
  voted: boolean;
  favorites: Project[];
  approved: Project[];
  isAdmin: boolean;
  budget: number;
  timestamp?: number;
}

interface DetailedProject extends Project {
  id: string;
  score: number;
  approved_count: number;
}
