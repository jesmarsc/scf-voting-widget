type User = {
  id: string;
  email: string;
  voted: boolean;
  favorites: Project[];
  approved: Project[];
  avatar: string;
  username: string;
  discriminator: string;
  role: 'admin' | 'verified';
};

type Project = {
  name: string;
  slug: string;
};
