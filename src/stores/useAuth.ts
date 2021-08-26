import create from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  discordToken?: string;
  setDiscordToken: (discordToken: string) => void;
  setError: (error: string) => void;
  clearAuth: () => void;
  error?: string;
};

const useAuth = create(
  persist<State>(
    (set) => ({
      discordToken: undefined,
      setDiscordToken: (discordToken: string) => set({ discordToken }),
      setError: (error: string) => set({ error }),
      clearAuth: () => set({}, true),
    }),
    { name: 'auth-store' }
  )
);

export default useAuth;
