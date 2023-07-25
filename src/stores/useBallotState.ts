import { unstable_batchedUpdates } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { getUser, getVotes, voteProject } from 'src/utils/api';
import useAuth from './useAuth';
import useBallot from './useBallot';
import useError from './useError';
import { vote } from '../constants/vote';

const useBallotState = () => {
  const { discordToken } = useAuth();
  const ballotState = useBallot();
  const { user } = ballotState;

  const fetchData = async () => {
    if (!discordToken) return;
    if (user) return;

    try {
      const [user, ballot] = await Promise.all([
        await getUser(discordToken),
        await getVotes(discordToken),
      ]);
      unstable_batchedUpdates(() => {
        useBallot.getState().init(user, ballot);
      });
    } catch (error: any) {
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
    }
  };

  const refreshBallot = async () => {
    if (!discordToken) return;
    const ballot = await getVotes(discordToken);
    unstable_batchedUpdates(() => {
      useBallot.getState().setBallot(ballot);
    });
  };

  const addApprovedProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.APPROVED, discordToken);
    await refreshBallot();
  };

  const removeApprovedProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.NEUTRAL, discordToken);
    await refreshBallot();
  };

  const addUnapprovedProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.UNAPPROVED, discordToken);
    await refreshBallot();
  };

  const removeUnapprovedProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.NEUTRAL, discordToken);
    await refreshBallot();
  };

  const addNeedsWorkProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.NEUTRAL, discordToken, true);
    await refreshBallot();
  };

  const removeNeedsWorkProject = async (id: string) => {
    if (!discordToken) return;
    await voteProject(id, vote.NEUTRAL, discordToken, false);
    await refreshBallot();
  };

  return {
    addApprovedProject,
    addNeedsWorkProject,
    removeApprovedProject,
    removeNeedsWorkProject,
    addUnapprovedProject,
    removeUnapprovedProject,
    fetchData,
    ...ballotState,
  };
};

export default useBallotState;
