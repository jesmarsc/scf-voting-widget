import create from 'zustand';
import { persist } from 'zustand/middleware';

export type State = {
  user?: User;
  ballot?: Project[];
  isExpanded: boolean;
  init: (user: User, ballot: Project[]) => void;
  setUser: (user: User) => void;
  setBallot: (ballot: Project[]) => void;
  cleanupBallot: () => void;
  isValid: () => boolean;
  isApproved: (id: string) => boolean;
  isUnapproved: (id: string) => boolean;
  needsWork: (slug: string) => boolean;
  allNeedsWork: () => Project[];
  approved: () => Project[];
  unapproved: () => Project[];
  setVoted: (voted: boolean) => void;
};

const useBallot = create(
  persist<State>(
    (set, get) => ({
      user: undefined,
      ballot: undefined,
      isExpanded: false,

      init: (user: User, ballot: Project[]) => {
        ballot.sort((a, b) => a.name.localeCompare(b.name));
        set({ user, ballot });
      },

      setUser: (updatedUser: User) => {
        set(({ user, ...restState }) => {
          return { ...restState, user: updatedUser };
        });
      },

      setBallot: (updatedBallot: Project[]) => {
        updatedBallot.sort((a, b) => a.name.localeCompare(b.name));
        set(({ ballot, ...restState }) => {
          return { ...restState, ballot: updatedBallot };
        });
      },

      cleanupBallot: () =>
        set(({ user, isExpanded, ...restState }) => restState, true),

      isValid: () => {
        const { user, ballot } = get();
        if (!user || !ballot) return false;

        return ballot.map((project) => project.score === 1).length > 0;
      },

      isApproved: (id: string) => {
        const { user, ballot } = get();
        if (!user || !ballot) return false;

        return ballot.some(
          (project) => project.id === id && project.score === 1
        );
      },

      isUnapproved: (id: string) => {
        const { user, ballot } = get();
        if (!user || !ballot) return false;

        return ballot.some(
          (project) => project.id === id && project.score === -1
        );
      },

      allNeedsWork: () => {
        const { user, ballot } = get();
        if (!user || !ballot) return [];

        return ballot.filter((project) => project.needs_work === true);
      },

      approved: () => {
        const { user, ballot } = get();
        if (!user || !ballot) return [];

        return ballot.filter((project) => project.score === 1);
      },

      unapproved: () => {
        const { user, ballot } = get();
        if (!user || !ballot) return [];

        return ballot.filter((project) => project.score === -1);
      },

      needsWork: (id: string) => {
        const { user, ballot, allNeedsWork } = get();
        if (!user || !ballot) return false;

        return allNeedsWork().some((project) => project.id === id);
      },

      setVoted: (voted: boolean) => {
        set((state) => {
          const { user } = state;

          if (!user) return state;

          return { ...state, user: { ...user, voted } };
        });
      },
    }),
    { name: 'ballot-store' }
  )
);

export default useBallot;
