import create from 'zustand';
import { combine, persist } from 'zustand/middleware';

type State = {
  isFull: boolean;
  ballotItems: { name: string; slug: string }[];
  toggleItem: (itemData: { name: string; slug: string }) => void;
};

const useBallot = create(
  persist<State>(
    (set) => ({
      isFull: false,
      ballotItems: [],
      toggleItem: (itemData) => {
        const { slug } = itemData;
        set((state) => {
          const ballotCopy = [...state.ballotItems];
          const itemIndex = ballotCopy.findIndex(
            (ballotItem) => ballotItem.slug === slug
          );

          itemIndex < 0
            ? ballotCopy.length < 10 && ballotCopy.push(itemData)
            : ballotCopy.splice(itemIndex, 1);

          return {
            ...state,
            ballotItems: ballotCopy,
            isFull: ballotCopy.length >= 10,
          };
        });
      },
    }),
    { name: 'ballot' }
  )
);

export default useBallot;
