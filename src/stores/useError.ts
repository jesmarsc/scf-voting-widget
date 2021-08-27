import create from 'zustand';

type State = {
  error?: string;
  setError: (error: string) => void;
  cleanupError: () => void;
};

const useError = create<State>((set) => ({
  error: undefined,
  setError: (error: string) => set({ error }),
  cleanupError: () => set(({ error, ...restState }) => restState, true),
}));

export default useError;
