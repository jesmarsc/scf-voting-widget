import create from 'zustand';
import { combine, persist } from 'zustand/middleware';

type State = {
  ballotItems: { name: string; slug: string }[];
  toggleItem: (itemData: { name: string; slug: string }) => void;
};

const useBallot = create(
  persist<State>(
    (set) => ({
      ballotItems: [],
      toggleItem: (itemData) => {
        const { slug } = itemData;
        set((state) => {
          const ballotCopy = [...state.ballotItems];
          const itemIndex = ballotCopy.findIndex(
            (ballotItem) => ballotItem.slug === slug
          );

          itemIndex < 0
            ? ballotCopy.push(itemData)
            : ballotCopy.splice(itemIndex, 1);
          return { ballotItems: ballotCopy };
        });
      },
    }),
    { name: 'ballot' }
  )
);

export default useBallot;
