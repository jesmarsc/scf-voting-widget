import { h } from 'preact';
import { useState } from 'preact/hooks';
import { forwardRef } from 'preact/compat';
import tw, { styled, theme } from 'twin.macro';

import { FaCaretRight } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

import { routes } from 'src/constants/routes';
import { unapproveProject, submitVote } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import Button from 'src/components/elements/Button';
import SVGSpinner from 'src/components/icons/SVGSpinner';

const Ballot = ({ ballotTitle = 'Your Ballot' }: BallotProps) => {
  const { user, isExpanded, isValid, removeApprovedProject, setVoted } =
    useBallot();

  const discordToken = useAuth((state) => state.discordToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!user || !discordToken) return null;

  const { approved, voted } = user;

  const handleSubmit = () => {
    const { user } = useBallot.getState();
    if (!user) return;

    setIsLoading(true);

    submitVote(discordToken)
      .then(() => {
        setVoted(true);
        window.open(routes.AIRTABLE, '__blank');
      })
      .finally(() => {
        setIsLoading(false);
        setIsConfirming(false);
      });
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

        <Footer>
          {voted ? (
            <FeedbackLink href={routes.AIRTABLE} target="__blank">
              Submit project feedback
            </FeedbackLink>
          ) : (
            <BallotButton
              isDisabled={!isValid()}
              onClick={() => setIsConfirming(true)}
            >
              Submit
            </BallotButton>
          )}
        </Footer>

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
  tw`box-border all:(m-0 p-0 [box-sizing: inherit])`,
]);

const BallotTitle = styled('div')([
  tw`flex items-center justify-between p-2 font-bold tracking-tight cursor-pointer`,
]);

const BallotContent = styled('div')([
  tw`relative flex flex-col h-[32rem] overflow-hidden`,
  ({ isExpanded }: { isExpanded: boolean }) =>
    isExpanded ? tw` max-h-[32rem]` : tw`max-h-0`,
]);

const ApprovedWrapper = styled('div')([
  tw`flex-1 shadow-inner bg-gray-100 overflow-y-auto`,
]);

const ProjectItem = styled(
  'div',
  forwardRef
)([
  tw`flex items-center p-2 font-sans [z-index: 1000] svg:(text-xl fill-current)`,
  ({ isFavorite }: { isFavorite?: boolean }) =>
    isFavorite
      ? tw`m-2! rounded cursor-pointer bg-stellar-purple all-child:(text-white)`
      : tw`not-first:(border-0 border-t-2 border-solid border-white) all-child:(text-gray-800)`,
]);

const ProjectName = styled('span')([
  tw`flex-1 whitespace-nowrap overflow-hidden text-ellipsis mx-2`,
]);

const ProjectButton = styled('button')([
  tw`flex items-center justify-center border-none cursor-pointer rounded svg:(text-base!)`,
  tw`m-0! p-0! leading-none! w-5 h-5 bg-transparent`,
]);

const ProjectDelete = styled(ProjectButton)([
  tw`bg-black transition-colors bg-opacity-10 hover:(bg-opacity-20) active:(bg-opacity-30)`,
]);

const Overlay = styled('div')([
  tw`absolute inset-0 p-4! flex flex-col justify-center items-center text-center transition-all opacity-0`,
  ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? tw`opacity-100` : tw`invisible`,
]);

const LoadingOverlay = styled(Overlay)(
  tw`text-white text-2xl bg-black bg-opacity-10 [z-index: 2000]`
);

const ConfirmingOverlay = styled(Overlay)(tw` bg-gray-100`);

const Footer = styled('div')(tw`p-2 flex items-center`);

const FeedbackLink = styled('a')(
  tw`block p-2 rounded text-center text-white bg-stellar-green no-underline w-full`
);

const BallotButton = styled(Button)([tw`px-4 py-2 shadow-none ml-auto`]);

export default Ballot;
