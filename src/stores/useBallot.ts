import { unstable_batchedUpdates } from 'preact/compat';
import create from 'zustand';
import { arrayMove } from 'react-movable';

import useAuth from 'src/stores/useAuth';
import useError from 'src/stores/useError';
import { getUser } from 'src/utils/api';

export type Project = {
  name: string;
  slug: string;
};

export type User = {
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

export type State = {
  user?: User;
  isExpanded: boolean;
  init: (user: User) => void;
  isFull: () => boolean;
  isValid: () => boolean;
  isApproved: (slug: string) => boolean;
  isFavorite: (slug: string) => boolean;
  addFavoriteProject: (slug: string, name: string) => void;
  removeFavoriteProject: (slug: string) => void;
  moveFavoriteProject: (from: number, to: number) => void;
  addApprovedProject: (slug: string, name: string) => void;
  removeApprovedProject: (slug: string) => void;
  setVoted: (voted: boolean) => void;
};

const removeProject = (projects: Project[], slug: string) => {
  const clone = [...projects];

  const isIncluded = clone.findIndex((project) => project.slug === slug);

  if (isIncluded > -1) {
    clone.splice(isIncluded, 1);
    return clone;
  }

  return projects;
};

const useBallot = create<State>((set, get) => ({
  user: undefined,
  isExpanded: true,

  init: (user: User) => {
    user.approved.sort((a, b) => a.name.localeCompare(b.name));
    set({ user });
  },

  isFull: () => {
    const { user } = get();
    return user ? user.favorites.length >= 3 : false;
  },

  isValid: () => {
    const { user } = get();
    return user ? user.favorites.length === 3 : false;
  },

  isFavorite: (slug: string) => {
    const { user } = get();
    return user
      ? user.favorites.some((project) => project.slug === slug)
      : false;
  },

  isApproved: (slug: string) => {
    const { user } = get();
    return user
      ? [...user.favorites, ...user.approved].some(
          (project) => project.slug === slug
        )
      : false;
  },

  addFavoriteProject: (slug: string, name: string) => {
    set((state) => {
      const { user, isFull, isFavorite, isApproved } = state;
      if (!user) return state;
      if (isFull() || isFavorite(slug) || !isApproved(slug)) return state;

      const project = { slug, name };
      const favoritesClone = [...user.favorites, project];

      return {
        ...state,
        user: { ...user, favorites: favoritesClone },
      };
    });
  },

  removeFavoriteProject: (slug: string) => {
    set((state) => {
      const { user } = state;
      if (!user) return state;

      const newFavorites = removeProject(user.favorites, slug);

      return {
        ...state,
        user: { ...user, favorites: newFavorites },
      };
    });
  },

  moveFavoriteProject: (from: number, to: number) => {
    set((state) => {
      const { user } = state;
      if (!user) return state;

      return {
        ...state,
        user: {
          ...user,
          favorites: arrayMove(user.favorites, from, to),
        },
      };
    });
  },

  addApprovedProject: (slug: string, name: string) => {
    set((state) => {
      const { user, isApproved } = state;
      if (isApproved(slug) || !user) return state;

      const project = { slug, name };
      const approvedClone = [...user.approved, project];
      approvedClone.sort((a, b) => a.name.localeCompare(b.name));

      return { ...state, user: { ...user, approved: approvedClone } };
    });
  },

  removeApprovedProject: (slug: string) => {
    const { removeFavoriteProject } = get();
    removeFavoriteProject(slug);

    set((state) => {
      const { user } = state;
      if (!user) return state;

      return {
        ...state,
        user: { ...user, approved: removeProject(user.approved, slug) },
      };
    });
  },

  setVoted: (voted) => {
    set((state) => {
      const { user } = state;
      if (!user) return state;

      return {
        ...state,
        user: { ...user, voted },
      };
    });
  },
}));

const { discordToken } = useAuth.getState();

if (discordToken) {
  getUser(discordToken)
    .then((user) =>
      unstable_batchedUpdates(() => {
        useBallot.getState().init(user);
      })
    )
    .catch((error) => {
      /* TODO: HANDLE UNAUTHERIZED USER */
      unstable_batchedUpdates(() => {
        useAuth.getState().clearAuth();
        if (!error.message) {
          useError.getState().setError('Something went wrong');
        } else {
          useError.getState().setError(error.message);
        }
      });
    });
}

export default useBallot;
