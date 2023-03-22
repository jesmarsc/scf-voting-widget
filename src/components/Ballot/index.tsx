import { h } from 'preact';
import { useState } from 'preact/hooks';
import tw, { styled, theme } from 'twin.macro';

import { FaCaretRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { stellarExpertTxLink } from 'src/constants';
import { routes } from 'src/constants/routes';
import { unapproveProject, submitVote, submitXdr } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import useWallet from 'src/utils/hooks/useWallet';

import Button from 'src/components/Button';
import SVGSpinner from 'src/components/icons/SVGSpinner';

const Ballot = ({ ballotTitle = 'Your Ballot' }: BallotProps) => {
  const { wallet } = useWallet();
  const { user, isExpanded, isValid, removeApprovedProject, setVoted } =
    useBallot();

  const discordToken = useAuth((state) => state.discordToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!user || !discordToken) return null;

  const { approved, voted } = user;

  const handleSubmit = async () => {
    const publicKey = await wallet.getPublicKey();
    setIsLoading(true);

    try {
      const { xdr } = await submitVote(discordToken, publicKey);

      const signedXdr = await wallet.signTransaction(xdr, { publicKey });

      await submitXdr(discordToken, signedXdr);

      setVoted(true);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  const handleRemove = (slug: string) => {
    setIsLoading(true);

    unapproveProject(slug, discordToken)
      .then(() => removeApprovedProject(slug))
      .finally(() => setIsLoading(false));
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
          {approved.map(({ slug, name }) => (
            <ProjectItem key={slug}>
              <ProjectName>{name}</ProjectName>

              {!voted && (
                <ProjectDelete
                  title="Remove"
                  onClick={() => handleRemove(slug)}
                >
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
                href={routes.DEV_DISCORD}
                target="__blank"
                tw="bg-stellar-green"
              >
                Give feedback
              </ExternalLink>
            </div>
          ) : (
            <BallotButton
              isDisabled={!isValid()}
              onClick={() => setIsConfirming(true)}
            >
              Submit
            </BallotButton>
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
