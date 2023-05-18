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
  needsWork: PartialProject[];
  hash?: string;
  isAdmin: boolean;
  publicKey?: string;
  timestamp?: number;
  voted: boolean;
}

type DiscordConnection = {
  id: string;
  name: string;
  type: string;
  revoked?: boolean;
  verified: boolean;
  two_way_link: boolean;
  visibility: number;
};

interface Developer extends DiscordUser {
  publicKeys: string[];
  connections: DiscordConnection[];
}

interface SignedMessage {
  pk: string;
  message?: string;
  signature?: string;
}
