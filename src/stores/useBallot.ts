import create from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';

import useAuth from 'src/stores/useAuth';

type Project = {
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
};

export type State = {
  user?: User;
  isExpanded: boolean;
  init: (user: User) => void;
  isFull: () => boolean;
  isApproved: (slug: string) => boolean;
  isFavorite: (slug: string) => boolean;
  addFavoriteProject: (slug: string, name: string) => void;
  removeFavoriteProject: (slug: string) => void;
  moveFavoriteProject: (from: number, to: number) => void;
  addApprovedProject: (slug: string, name: string) => void;
  removeProject: (slug: string) => void;
};

const useBallot = create<State>((set, get) => ({
  user: undefined,
  isExpanded: false,

  init: (user: User) => set({ user }),

  isFull: () => {
    const { user } = get();
    return user ? user.favorites.length >= 3 : false;
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
      const { user, isFull, isFavorite } = state;
      if (!user) return state;
      if (isFull() || isFavorite(slug)) return state;

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

      const { favorites } = user;

      const isFavorite = favorites.findIndex(
        (project) => project.slug === slug
      );

      if (isFavorite > -1) {
        const clone = [...favorites];
        clone.splice(isFavorite, 1);
        return { ...state, user: { ...user, favorites: clone } };
      }

      return state;
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

  removeProject: (slug: string) => {
    set((state) => {
      const { user } = state;
      if (!user) return state;

      const { favorites, approved } = user;
      const userClone = { ...user };

      const searchCriteria = (project: { slug: string; name: string }) => {
        return project.slug === slug;
      };

      const isFavorite = favorites.findIndex(searchCriteria);

      if (isFavorite > -1) {
        const clone = [...favorites];
        clone.splice(isFavorite, 1);
        userClone.favorites = clone;
      }

      const isApproved = approved.findIndex(searchCriteria);

      if (isApproved > -1) {
        const clone = [...approved];
        clone.splice(isApproved, 1);
        userClone.approved = clone;
      }

      return { ...state, user: userClone };
    });
  },
}));

export default useBallot;
