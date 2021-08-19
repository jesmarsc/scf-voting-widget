import create from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  discordToken?: string;
  setDiscordToken: (discordToken: string) => void;
  clearAuth: () => void;
};

const useAuth = create(
  persist<State>(
    (set) => ({
      setDiscordToken: (discordToken: string) => set({ discordToken }),
      clearAuth: () => set(({ discordToken, ...oldState }) => oldState, true),
    }),
    { name: 'auth-store' }
  )
);

export default useAuth;