import { Fragment, h } from 'preact';
import { useState } from 'preact/hooks';
import { forwardRef, memo } from 'preact/compat';
import define from 'preact-custom-element';

import { List } from 'react-movable';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot, { Project } from 'src/stores/useBallot';
import Button from 'src/components/elements/Button';
import { unapproveProject, saveFavorites, submitVote } from 'src/utils/api';
import SVGCaretForward from 'src/assets/SVGCaretForward';
import SVGSpinner from 'src/assets/SVGSpinner';

const randomData = () => {
  return Array.from({ length: 100 }, () => ({
    id: Math.random().toString(36).substr(2),
    name: Math.random().toString(36).substr(2),
  }));
};

const ITEM_HEIGHT = 42;

const Ballot = () => {
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

  const handleSubmit = async () => {
    setIsLoading(true);
    submitVote(
      favorites.map((project) => project.slug),
      discordToken
    )
      .then(() => {
        setVoted(true);
      })
      .finally(() => {
        setIsLoading(false);
        setIsConfirming(false);
      });
  };

  const handleSave = async (projects: Project[] = favorites) => {
    setIsLoading(true);
    saveFavorites(
      projects.map((project) => project.slug),
      discordToken
    )
      .catch((error) => {
        /* TODO: REVERT FAVORITES ON ERRORS */
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleRemove = async (slug: string) => {
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
        <span>Your Ballot</span>
      </BallotTitle>

      <BallotContent isExpanded={isExpanded}>
        {!voted ? (
          <Fragment>
            {isFull() && (
              <BallotSubtitle>Your favorites are full.</BallotSubtitle>
            )}

            <List
              transitionDuration={100}
              values={favorites}
              onChange={({ oldIndex, newIndex }) => {
                moveFavoriteProject(oldIndex, newIndex);
                handleSave(useBallot.getState().user?.favorites);
              }}
              renderList={({ children, props }) => (
                <div {...props}>{children}</div>
              )}
              renderItem={({ value: { slug, name }, props, index }) => (
                <ProjectItem key={slug} isFavorite {...props}>
                  <ProjectFavorite
                    onClick={() => {
                      removeFavoriteProject(slug);
                      handleSave(useBallot.getState().user?.favorites);
                    }}
                  >
                    ★
                  </ProjectFavorite>
                  <ProjectName>{`${index! + 1}. ${name}`}</ProjectName>
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
                        onClick={() => {
                          addFavoriteProject(slug, name);
                          handleSave(useBallot.getState().user?.favorites);
                        }}
                      >
                        ☆
                      </ProjectFavorite>
                      <ProjectName>{name}</ProjectName>
                      <ProjectDelete onClick={() => handleRemove(slug)}>
                        x
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

        {!voted && (
          <Fragment>
            <Footer>
              <BallotButton
                disabled={!isValid()}
                title={!isValid() ? 'You need at least 3 favorites.' : ''}
                onClick={() => setIsConfirming(true)}
              >
                Submit
              </BallotButton>
            </Footer>

            <LoadingOverlay isVisible={isLoading}>
              <SVGSpinner />
            </LoadingOverlay>

            <ConfirmingOverlay isVisible={isConfirming}>
              <div>
                <p>
                  <strong>Are you sure?</strong>
                </p>
                <p>You will be unable to change your vote once submitted.</p>
              </div>
              <ButtonGroup>
                <BallotButton onClick={handleSubmit}>Confirm</BallotButton>
                <BallotButton danger onClick={() => setIsConfirming(false)}>
                  Cancel
                </BallotButton>
              </ButtonGroup>
            </ConfirmingOverlay>
          </Fragment>
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

const BallotSubtitle = styled('p')([tw`bg-red-100 py-1 px-4`]);

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
  tw`flex items-center p-2 font-sans z-index[1010]`,
  ({ isFavorite }: { isFavorite?: boolean }) =>
    isFavorite
      ? tw`m-2! rounded cursor-pointer bg-stellar-purple all-child:(text-white)`
      : tw`not-first:(border-0 border-t-2 border-solid border-white) all-child:(text-gray-800)`,
]);

const ProjectName = styled('span')([
  tw`flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis mx-2`,
  // tw`relative after:(content absolute top-0 right-0 w-1/4 h-full pointer-events-none bg-gradient-to-l from-stellar-purple to-transparent)`,
]);

const ProjectButton = styled('button')([
  tw`flex items-center justify-center border-none cursor-pointer rounded text-base`,
  tw`m-0! p-0! leading-none! w-5 h-5 bg-transparent`,
]);

const ProjectFavorite = ProjectButton;

const ProjectDelete = styled(ProjectButton)([
  tw`bg-black transition-colors bg-opacity-10 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

const BallotButton = styled(Button)([tw`px-4 py-2 shadow-none`]);

const Footer = styled('div')([tw`flex p-2 justify-end`]);

const Overlay = styled('div')([
  tw`absolute inset-0 p-4! flex flex-col justify-center items-center text-center transition-all opacity-0`,
  ({ isVisible }: { isVisible: boolean }) =>
    isVisible ? tw`opacity-100` : tw`invisible`,
]);

const LoadingOverlay = styled(Overlay)(
  tw`text-white text-2xl bg-black bg-opacity-10`
);

const ConfirmingOverlay = styled(Overlay)(tw` bg-gray-100`);

const ButtonGroup = styled('div')(tw`flex mt-4 gap-2`);

define(Ballot, 'vote-ballot');
