import { unstable_batchedUpdates } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { getUser } from 'src/utils/api';
import useAuth from './useAuth';
import useBallot from './useBallot';
import useError from './useError';

const useBallotState = () => {
  const { discordToken } = useAuth();

  useEffect(() => {
    if (!discordToken) return;
    getUser(discordToken)
      .then((user) =>
        unstable_batchedUpdates(() => {
          useBallot.getState().init(user);
        })
      )
      .catch((error) => {
        /* TODO: HANDLE UNAUTHERIZED USER */
        unstable_batchedUpdates(() => {
          useAuth.getState().cleanupAuth();
          useBallot.getState().cleanupBallot();
          if (!error.message) {
            useError.getState().setError('Something went wrong');
          } else {
            useError.getState().setError(error.message);
          }
        });
      });
  }, [discordToken]);

  return null;
};

export default useBallotState;
