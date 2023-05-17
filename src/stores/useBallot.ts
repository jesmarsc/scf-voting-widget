import create from 'zustand';
import { persist } from 'zustand/middleware';

export type State = {
  user?: User;
  isExpanded: boolean;
  init: (user: User) => void;
  cleanupBallot: () => void;
  isValid: () => boolean;
  isApproved: (slug: string) => boolean;
  needsWork: (slug: string) => boolean;
  addApprovedProject: (project: PartialProject) => void;
  addNeedsWorkProject: (project: PartialProject) => void;
  removeApprovedProject: (slug: string) => void;
  removeNeedsWorkProject: (slug: string) => void;
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

      isValid: () => {
        const { user } = get();

        if (!user) return false;

        return user.approved.length > 0;
      },

      isApproved: (slug: string) => {
        const { user } = get();

        if (!user) return false;

        return user.approved.some((project) => project.slug === slug);
      },

      needsWork: (slug: string) => {
        const { user } = get();

        if (!user) return false;

        return user.needsWork?.some((project) => project.slug === slug);
      },

      addNeedsWorkProject: (project: PartialProject) => {
        set((state) => {
          const { slug } = project;
          const { user, needsWork } = state;

          if (!user || needsWork(slug)) return state;

          const neutral = [...user.needsWork, project];

          neutral.sort((a, b) => a.name.localeCompare(b.name));

          return { ...state, user: { ...user, needsWork: neutral } };
        });
      },

      removeNeedsWorkProject: (slug: string) => {
        set((state) => {
          const { user } = state;

          if (!user) return state;

          const neutral = user.needsWork.filter(
            (project) => project.slug !== slug
          );

          return { ...state, user: { ...user, needsWork: neutral } };
        });
      },

      addApprovedProject: (project: PartialProject) => {
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
        set((state) => {
          const { user } = state;

          if (!user) return state;

          const approved = user.approved.filter(
            (project) => project.slug !== slug
          );

          return { ...state, user: { ...user, approved } };
        });
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
