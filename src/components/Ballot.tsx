import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { forwardRef, memo } from 'preact/compat';
import { List } from 'react-movable';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import tw, { styled, theme } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import Button from 'src/components/elements/Button';
import { unapproveProject, saveFavorites, submitVote } from 'src/utils/api';
import { routes } from 'src/constants/routes';

import SVGCaretForward from 'src/assets/SVGCaretForward';
import SVGSpinner from 'src/assets/SVGSpinner';
import SVGArrowAlignV from 'src/assets/SVGArrowAlignV';
import SVGClose from 'src/assets/SVGClose';
import SVGStar from 'src/assets/SVGStar';
import SVGStarOutline from 'src/assets/SVGStarOutline';
import SVGLinkOutline from 'src/assets/SVGLinkOutline';

const ITEM_HEIGHT = 42;

type Props = {
  ballotTitle?: string;
  warningText?: string;
  successText?: string;
};

const Ballot = ({
  ballotTitle = 'Your Ballot',
  warningText = 'You need to star at least 3 favorites.',
  successText = 'Your favorites are full.',
}: Props) => {
  const {
    user,
    isFull,
    isValid,
    isExpanded,
    isFavorite,
    addFavoriteProject,
    removeFavoriteProject,
    moveFavoriteProject,
    removeApprovedProject,
    setVoted,
  } = useBallot();

  const discordToken = useAuth((state) => state.discordToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!user || !discordToken) return null;

  const { favorites, approved, voted } = user;

  const approvedFiltered = approved.filter(
    (project) => !isFavorite(project.slug)
  );

  const handleSubmit = () => {
    const { user } = useBallot.getState();
    if (!user) return;

    setIsLoading(true);
    submitVote(
      user.favorites.map((project) => project.slug),
      discordToken
    )
      .then(() => {
        setVoted(true);
        window.open(routes.AIRTABLE, '__blank');
      })
      .finally(() => {
        setIsLoading(false);
        setIsConfirming(false);
      });
  };

  const handleSave = (rollback: Project[]) => {
    const { user } = useBallot.getState();
    if (!user || user.favorites === rollback) return;

    setIsLoading(true);
    saveFavorites(
      user.favorites.map((project) => project.slug),
      discordToken
    )
      .catch(() => {
        useBallot.setState((state) => {
          const { user } = state;
          if (!user) return state;
          return { ...state, user: { ...user, favorites: rollback } };
        });
      })
      .finally(() => setIsLoading(false));
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
        <BallotCaret isExpanded={isExpanded} />
        <span>{ballotTitle}</span>
      </BallotTitle>

      <BallotContent isExpanded={isExpanded}>
        {!voted ? (
          <Fragment>
            {isFull() ? (
              <BallotSubtitle>{successText}</BallotSubtitle>
            ) : (
              <BallotSubtitle danger>{warningText}</BallotSubtitle>
            )}

            <List
              transitionDuration={100}
              values={favorites}
              onChange={({ oldIndex, newIndex }) => {
                const rollback = favorites;
                moveFavoriteProject(oldIndex, newIndex);
                handleSave(rollback);
              }}
              renderList={({ children, props }) => (
                <div {...props}>{children}</div>
              )}
              renderItem={({ value: { slug, name }, props, index }) => (
                <ProjectItem key={slug} isFavorite {...props}>
                  <ProjectFavorite
                    title="Unfavorite"
                    onClick={() => {
                      const rollback = favorites;
                      removeFavoriteProject(slug);
                      handleSave(rollback);
                    }}
                  >
                    <SVGStar />
                  </ProjectFavorite>
                  <ProjectName>{`${index! + 1}. ${name}`}</ProjectName>
                  <SVGArrowAlignV />
                </ProjectItem>
              )}
            />
          </Fragment>
        ) : (
          <div>
            {favorites.map(({ slug, name }, index) => (
              <ProjectItem key={slug} isFavorite>
                <ProjectName>{`${index! + 1}. ${name}`}</ProjectName>
              </ProjectItem>
            ))}
          </div>
        )}

        <ApprovedContainer>
          <AutoSizer disableWidth>
            {({ height }) => (
              <FixedSizeList
                width={'100%'}
                height={height}
                itemCount={approvedFiltered.length}
                itemData={approvedFiltered}
                itemSize={ITEM_HEIGHT}
              >
                {memo(({ index, data, style }: any) => {
                  const { slug, name } = data[index];

                  return !voted ? (
                    <ProjectItem key={slug} style={style}>
                      <ProjectFavorite
                        title="Favorite"
                        onClick={() => {
                          const rollback = favorites;
                          addFavoriteProject(slug, name);
                          handleSave(rollback);
                        }}
                      >
                        <SVGStarOutline />
                      </ProjectFavorite>
                      <ProjectName>{name}</ProjectName>
                      <ProjectDelete
                        title="Remove"
                        onClick={() => handleRemove(slug)}
                      >
                        <SVGClose />
                      </ProjectDelete>
                    </ProjectItem>
                  ) : (
                    <ProjectItem key={slug} style={style}>
                      <ProjectName>{name}</ProjectName>
                    </ProjectItem>
                  );
                }, areEqual)}
              </FixedSizeList>
            )}
          </AutoSizer>
        </ApprovedContainer>

        {!voted ? (
          <Fragment>
            <Footer>
              <BallotButton
                disabled={!isValid()}
                title={
                  !isValid() ? 'You need at least 3 favorites.' : undefined
                }
                onClick={() => setIsConfirming(true)}
              >
                Submit
              </BallotButton>
            </Footer>

            <ConfirmingOverlay isVisible={isConfirming}>
              <div>
                <p>
                  <strong>Are you sure?</strong>
                </p>
                <p>You will be unable to change your vote once submitted.</p>
              </div>
              <ButtonGroup>
                <BallotButton onClick={handleSubmit}>Confirm</BallotButton>
                <BallotButton
                  color={theme`colors.stellar.salmon`}
                  onClick={() => setIsConfirming(false)}
                >
                  Cancel
                </BallotButton>
              </ButtonGroup>
            </ConfirmingOverlay>
            <LoadingOverlay isVisible={isLoading}>
              <SVGSpinner />
            </LoadingOverlay>
          </Fragment>
        ) : (
          <Footer>
            <a
              tw="flex gap-1 items-end justify-center font-semibold"
              href={routes.AIRTABLE}
              target="__blank"
            >
              <SVGLinkOutline /> Submit project feedback.
            </a>
          </Footer>
        )}
      </BallotContent>
    </BallotContainer>
  );
};

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans rounded-lg overflow-hidden shadow-lg border border-solid border-gray-200 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(30rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const BallotTitle = styled('h3')([
  tw`flex items-center text-2xl p-2 font-bold tracking-tight cursor-pointer`,
]);

const BallotSubtitle = styled('p')([
  tw`bg-green-100 py-1 px-4`,
  ({ danger }: { danger?: boolean }) => (danger ? tw`bg-red-100` : ''),
]);

const BallotCaret = styled(SVGCaretForward)<{ isExpanded?: boolean }>([
  tw`transition-transform mt-1 mr-2`,
  ({ isExpanded }) => (isExpanded ? tw`transform rotate-90` : ''),
]);

const BallotContent = styled('div')([
  tw`relative flex flex-col height[32rem] overflow-hidden`,
  ({ isExpanded }: { isExpanded: boolean }) =>
    isExpanded ? tw` max-height[32rem]` : tw`max-h-0`,
]);

const ApprovedContainer = styled('div')([tw`flex-1 shadow-inner bg-gray-100`]);

const ProjectItem = styled(
  'div',
  forwardRef
)([
  tw`flex items-center p-2 font-sans z-index[1010] svg:(text-xl fill-current)`,
  ({ isFavorite }: { isFavorite?: boolean }) =>
    isFavorite
      ? tw`m-2! rounded cursor-pointer bg-stellar-purple all-child:(text-white)`
      : tw`not-first:(border-0 border-t-2 border-solid border-white) all-child:(text-gray-800)`,
]);

const ProjectName = styled('span')([
  tw`flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis mx-2`,
]);

const ProjectButton = styled('button')([
  tw`flex items-center justify-center border-none cursor-pointer rounded svg:(text-base!)`,
  tw`m-0! p-0! leading-none! w-5 h-5 bg-transparent`,
]);

const ProjectFavorite = ProjectButton;

const ProjectDelete = styled(ProjectButton)([
  tw`bg-black transition-colors bg-opacity-10 hover:(bg-opacity-20) active:(bg-opacity-30)`,
]);

const BallotButton = styled(Button)([tw`px-4 py-2 shadow-none ml-auto`]);

const Footer = styled('div')([tw`p-2`]);

const Overlay = styled('div')([
  tw`absolute inset-0 p-4! flex flex-col justify-center items-center text-center transition-all opacity-0`,
  ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? tw`opacity-100` : tw`invisible`,
]);

const LoadingOverlay = styled(Overlay)(
  tw`text-white text-2xl bg-black bg-opacity-10 z-index[2000]`
);

const ConfirmingOverlay = styled(Overlay)(tw` bg-gray-100`);

const ButtonGroup = styled('div')(tw`flex mt-4 gap-2`);

export default Ballot;
