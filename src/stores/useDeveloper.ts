import create from 'zustand';
import { persist } from 'zustand/middleware';
import { getDeveloper } from 'src/utils/api';
import useError from './useError';
import useAuth from './useAuth';
import { useEffect } from 'preact/hooks';

const mustJoinError = 'Must join Stellar Dev to Export proof';

type State = {
  developer?: Developer;
  setDeveloper: (developer: Developer) => void;
  cleanupDeveloper: () => void;
};

const developerStore = create(
  persist<State>(
    (set) => ({
      developer: undefined,
      setDeveloper: (developer: Developer) => set({ developer }),
      cleanupDeveloper: () =>
        set(({ developer, ...restState }) => restState, true),
    }),
    { name: 'developer-store' }
  )
);

const useDeveloper = () => {
  const { discordToken, cleanupAuth } = useAuth();
  const { developer, setDeveloper, cleanupDeveloper } = developerStore();

  const refreshDeveloper = async () => {
    if (!discordToken) return cleanupDeveloper();
    try {
      setDeveloper(await getDeveloper(discordToken));
    } catch (e: any) {
      console.log('error from auth', e);
      if (e.message === 'Unknown Member' && e.code === 10007) {
        useError.getState().setError(mustJoinError);
      }
      if (e.message === '401: Unauthorized' && e.status === 400) {
        cleanupDeveloper();
        cleanupAuth();
      }
    }
  };

  useEffect(() => {
    refreshDeveloper();
  }, [discordToken]);

  return { developer, discordToken, refreshDeveloper };
};

export default useDeveloper;
