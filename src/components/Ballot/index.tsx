import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import freighter from '@stellar/freighter-api';
import tw, { styled, theme } from 'twin.macro';

import { FaCaretRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { stellarExpertTxLink } from 'src/constants';
import { routes } from 'src/constants/routes';
import { submitVote, submitXdr, getUser } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import useWallet from 'src/utils/hooks/useWallet';

import Button from 'src/components/Button';
import SVGSpinner from 'src/components/icons/SVGSpinner';
import ErrorCard from 'src/components/Error/ErrorCard';
import useBallotState from 'src/stores/useBallotState';

//TODO: Potentially refactor freighter.isConnected() into wallet hook.

const Ballot = ({ ballotTitle = 'Your Ballot' }: BallotProps) => {
  const { wallet } = useWallet();
  const {
    user,
    isExpanded,
    isValid,
    removeApprovedProject,
    approved,
    fetchData,
  } = useBallotState();

  const discordToken = useAuth((state) => state.discordToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [discordToken]);

  if (!user || !discordToken) return null;

  const { voted } = user;

  const handleSubmit = async () => {
    const publicKey = await wallet.getPublicKey();
    setIsLoading(true);

    try {
      const { xdr } = await submitVote(discordToken, publicKey);

      const signedXdr = await wallet.signTransaction(xdr, { publicKey });

      await submitXdr(discordToken, signedXdr);

      const user = await getUser(discordToken);

      useBallot.getState().setUser(user);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  const handleRemove = async (id: string) => {
    setIsLoading(true);

    try {
      await removeApprovedProject(id);
    } catch (e) {
      setError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BallotContainer>
      <BallotTitle
        onClick={() =>
          useBallot.setState((state) => ({ isExpanded: !state.isExpanded }))
        }
      >
        <div tw="flex items-center gap-2 text-xl">
          <FaCaretRight css={isExpanded && tw`transform rotate-90`} />
          <span>{ballotTitle}</span>
        </div>
      </BallotTitle>

      <BallotContent isExpanded={isExpanded}>
        <ApprovedWrapper>
          {approved().map(({ id, name }) => (
            <ProjectItem key={id}>
              <ProjectName>{name}</ProjectName>

              {!voted && (
                <ProjectDelete title="Remove" onClick={() => handleRemove(id)}>
                  <IoClose />
                </ProjectDelete>
              )}
            </ProjectItem>
          ))}
        </ApprovedWrapper>

        <div tw="p-2">
          {voted ? (
            <div tw="flex gap-2">
              {user.hash && (
                <ExternalLink
                  href={stellarExpertTxLink(user.hash)}
                  target="__blank"
                >
                  Transaction
                </ExternalLink>
              )}

              <ExternalLink
                tw="bg-stellar-green"
                href={routes.DEV_DISCORD}
                target="__blank"
              >
                Give feedback
              </ExternalLink>
            </div>
          ) : (
            <div tw="flex gap-2">
              {!freighter.isConnected() && (
                <span tw="bg-stellar-salmon text-white rounded p-1 text-center">
                  Install
                  <a
                    tw="px-1 font-semibold text-white"
                    href={wallet.metadata.url}
                    target="__blank"
                  >
                    {wallet.metadata.name}
                  </a>
                  to submit your vote.
                </span>
              )}

              <BallotButton
                isDisabled={!isValid() || !freighter.isConnected()}
                onClick={() => setIsConfirming(true)}
              >
                Submit
              </BallotButton>
            </div>
          )}
        </div>

        <ConfirmingOverlay isVisible={isConfirming}>
          <div>
            <p tw="font-bold">Are you sure?</p>
            <p>You will be unable to change your vote once submitted.</p>
          </div>

          <div tw="flex mt-4 gap-2">
            <BallotButton onClick={handleSubmit}>Confirm</BallotButton>

            <BallotButton
              color={theme`colors.stellar.salmon`}
              onClick={() => setIsConfirming(false)}
            >
              Cancel
            </BallotButton>
          </div>
        </ConfirmingOverlay>

        <LoadingOverlay isVisible={isLoading}>
          <SVGSpinner />
        </LoadingOverlay>

        <Overlay isVisible={error} tw="block text-left bg-gray-200">
          <ErrorCard tw="h-full" error={error} onClose={() => setError(null)} />
        </Overlay>
      </BallotContent>
    </BallotContainer>
  );
};

interface BallotProps {
  ballotTitle?: string;
  warningText?: string;
  successText?: string;
}

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans rounded-lg overflow-hidden shadow-lg border border-solid border-gray-200 bg-white [z-index: 1000]`,
  tw`flex flex-col w-72 max-h-[min(30rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 [box-sizing: inherit])`,
]);

const BallotTitle = styled('div')([
  tw`flex items-center justify-between p-2 font-bold tracking-tight cursor-pointer`,
]);

const BallotContent = styled('div')([
  tw`relative flex flex-col h-[32rem] overflow-hidden`,
  ({ isExpanded }: { isExpanded: boolean }) =>
    isExpanded ? tw`max-h-[32rem]` : tw`max-h-0`,
]);

const ApprovedWrapper = styled('div')([
  tw`flex-1 shadow-inner bg-gray-100 overflow-y-auto`,
]);

const ProjectItem = styled('div')([
  tw`flex items-center gap-2 p-2 font-sans not-first:(border-0 border-t-2 border-solid border-white)`,
]);

const ProjectName = styled('span')([
  tw`flex-1 whitespace-nowrap overflow-hidden text-ellipsis`,
]);

const ProjectDelete = styled('button')([
  tw`flex items-center justify-center p-0.5 border-none cursor-pointer rounded svg:(text-base)`,
  tw`bg-black/10 active:(bg-black/20) transition-colors`,
]);

const Overlay = styled('div')<{ isVisible: boolean }>([
  tw`absolute inset-0 p-4 flex flex-col justify-center items-center text-center transition-all opacity-0`,
  ({ isVisible }) => (isVisible ? tw`opacity-100` : tw`invisible`),
]);

const LoadingOverlay = styled(Overlay)(tw`text-white text-2xl bg-black/20`);

const ConfirmingOverlay = styled(Overlay)(tw`bg-gray-100`);

const ExternalLink = styled('a')(
  tw`flex items-center justify-center p-2 rounded text-center text-white bg-stellar-purple no-underline w-full`
);

const BallotButton = styled(Button)([tw`p-2 shadow-none ml-auto`]);

export default Ballot;
