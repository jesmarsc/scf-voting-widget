import { unstable_batchedUpdates } from 'preact/compat';
import create from 'zustand';
import { arrayMove } from 'react-movable';
import { persist } from 'zustand/middleware';

import useAuth from 'src/stores/useAuth';
import useError from 'src/stores/useError';
import { getUser } from 'src/utils/api';

export type State = {
  user?: User;
  isExpanded: boolean;
  init: (user: User) => void;
  cleanupBallot: () => void;
  isFull: () => boolean;
  isValid: () => boolean;
  isFavorite: (slug: string) => boolean;
  isApproved: (slug: string) => boolean;
  isWithinBudget: (amount: number) => boolean;
  getAllocation: () => number;
  addFavoriteProject: (slug: string) => void;
  removeFavoriteProject: (slug: string) => void;
  moveFavoriteProject: (from: number, to: number) => void;
  addApprovedProject: (project: Project) => void;
  removeApprovedProject: (slug: string) => void;
  setVoted: (voted: boolean) => void;
};

const useBallot = create(
  persist<State>(
    (set, get) => ({
      user: undefined,
      isExpanded: false,

      init: (user: User) => {
        user.approved.sort((a, b) => a.name.localeCompare(b.name));
        set({ user });
      },

      cleanupBallot: () =>
        set(({ user, isExpanded, ...restState }) => restState, true),

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
          ? user.approved.some((project) => project.slug === slug)
          : false;
      },

      isWithinBudget: (amount: number) => {
        const { getAllocation, user } = get();

        if (!user) return false;

        return getAllocation() + amount <= user.budget;
      },

      getAllocation: () => {
        const { user } = get();

        if (!user) return 0;

        return user.approved.reduce((acc, val) => (acc += val.awardAmount), 0);
      },

      addFavoriteProject: (slug: string) => {
        set((state) => {
          const { user, isFull, isFavorite, isApproved } = state;

          if (!user) return state;
          if (isFull() || isFavorite(slug) || !isApproved(slug)) return state;

          const project = user.approved.find(
            (project) => project.slug === slug
          );

          if (!project) return state;

          const favorites = [...user.favorites, project];

          return {
            ...state,
            user: { ...user, favorites },
          };
        });
      },

      removeFavoriteProject: (slug: string) => {
        set((state) => {
          const { user } = state;
          if (!user) return state;

          const favorites = user.favorites.filter(
            (project) => project.slug !== slug
          );

          return {
            ...state,
            user: { ...user, favorites },
          };
        });
      },

      moveFavoriteProject: (from: number, to: number) => {
        set((state) => {
          const { user } = state;
          if (!user) return state;

          const favorites = arrayMove(user.favorites, from, to);

          return {
            ...state,
            user: {
              ...user,
              favorites,
            },
          };
        });
      },

      addApprovedProject: (project: Project) => {
        set((state) => {
          const { slug } = project;
          const { user, isApproved } = state;

          if (!user || isApproved(slug)) return state;

          const approved = [...user.approved, project];
          approved.sort((a, b) => a.name.localeCompare(b.name));

          return { ...state, user: { ...user, approved } };
        });
      },

      removeApprovedProject: (slug: string) => {
        const { removeFavoriteProject } = get();
        removeFavoriteProject(slug);

        set((state) => {
          const { user } = state;
          if (!user) return state;

          const approved = user.approved.filter(
            (project) => project.slug !== slug
          );

          return {
            ...state,
            user: { ...user, approved },
          };
        });
      },

      setVoted: (voted: boolean) => {
        set((state) => {
          const { user } = state;
          if (!user) return state;

          return {
            ...state,
            user: { ...user, voted },
          };
        });
      },
    }),
    { name: 'ballot-store' }
  )
);

/* Fetch user if logged in. */
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
        useAuth.getState().cleanupAuth();
        useBallot.getState().cleanupBallot();
        if (!error.message) {
          useError.getState().setError('Something went wrong');
        } else {
          useError.getState().setError(error.message);
        }
      });
    });
}

export default useBallot;
