import create from 'zustand';
import { persist } from 'zustand/middleware';

type State = {
  discordToken?: string;
  setDiscordToken: (discordToken: string) => void;
  cleanupAuth: () => void;
};

const useAuth = create(
  persist<State>(
    (set) => ({
      discordToken: undefined,
      setDiscordToken: (discordToken: string) => set({ discordToken }),
      cleanupAuth: () =>
        set(({ discordToken, ...restState }) => restState, true),
    }),
    { name: 'auth-store' }
  )
);

export default useAuth;
