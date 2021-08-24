import create from 'zustand';
import { persist } from 'zustand/middleware';
import { arrayMove } from '@dnd-kit/sortable';

export type State = {
  isFull: () => boolean;
  isExpanded: boolean;
  approvedProjects: { id: string; name: string }[];
  favoriteProjects: { id: string; name: string }[];
  includes: (slug: string) => boolean;
  moveFavoriteProject: (from: number, to: number) => void;
  addFavoriteProject: (slug: string, name: string) => void;
  addApprovedProject: (slug: string, name: string) => void;
  removeProject: (slug: string) => void;
};

const useBallot = create(
  persist<State>(
    (set, get) => ({
      isExpanded: false,
      approvedProjects: [],
      favoriteProjects: [],

      isFull: () => {
        const { favoriteProjects } = get();
        return favoriteProjects.length >= 3;
      },

      includes: (slug: string) => {
        const { approvedProjects, favoriteProjects } = get();
        return [...favoriteProjects, ...approvedProjects].some(
          (project) => project.id === slug
        );
      },

      moveFavoriteProject: (from: number, to: number) => {
        set((state) => ({
          ...state,
          favoriteProjects: arrayMove(state.favoriteProjects, from, to),
        }));
      },

      addFavoriteProject: (slug: string, name: string) => {
        set((state) => {
          const { favoriteProjects } = state;
          /* Safety check: avoid duplicates and respect max length */
          if (state.includes(slug) || state.isFull()) return state;

          const project = { id: slug, name };
          const clone = [...favoriteProjects];
          clone.push(project);

          return {
            ...state,
            favoriteProjects: clone,
          };
        });
      },

      addApprovedProject: (slug: string, name: string) => {
        set((state) => {
          const { includes, approvedProjects } = state;
          /* Safety check: avoid duplicates */
          if (includes(slug)) return state;

          const project = { id: slug, name };
          const clone = [...approvedProjects];
          clone.push(project);
          clone.sort((a, b) => a.name.localeCompare(b.name));

          return { ...state, approvedProjects: clone };
        });
      },

      removeProject: (slug: string) => {
        set((state) => {
          const { approvedProjects, favoriteProjects } = state;

          const searchCriteria = (project: { id: string; name: string }) => {
            return project.id === slug;
          };

          const isFavorite = favoriteProjects.findIndex(searchCriteria);

          if (isFavorite > -1) {
            const clone = [...favoriteProjects];
            clone.splice(isFavorite, 1);
            return { ...state, favoriteProjects: clone };
          }

          const isApproved = approvedProjects.findIndex(searchCriteria);

          if (isApproved > -1) {
            const clone = [...approvedProjects];
            clone.splice(isApproved, 1);
            return { ...state, approvedProjects: clone };
          }

          return state;
        });
      },
    }),
    { name: 'ballot-store' }
  )
);

export default useBallot;
