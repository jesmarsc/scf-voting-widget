interface Project {
  id: string;
  name: string;
  slug: string;
  approved_count: number;
}

type PartialProject = Pick<Project, 'id' | 'name' | 'slug'>;

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
  approved: PartialProject[];
  hash?: string;
  isAdmin: boolean;
  publicKey?: string;
  timestamp?: number;
  voted: boolean;
}
