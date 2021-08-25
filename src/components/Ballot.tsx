import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { forwardRef, memo } from 'preact/compat';
import define from 'preact-custom-element';

import { List } from 'react-movable';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import Button from 'src/components/elements/Button';
import { getUser, unapproveProject, saveFavorites } from 'src/utils/api';
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
    init,
    isFull,
    isExpanded,
    isFavorite,
    addFavoriteProject,
    removeFavoriteProject,
    moveFavoriteProject,
    removeProject,
  } = useBallot();

  const discordToken = useAuth((state) => state.discordToken);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (discordToken) {
      getUser(discordToken).then((user) => init(user));
    }
    return () => {};
  }, [discordToken]);

  if (!user || !discordToken) return null;

  const handleSubmit = async () => {
    // const res = await submitFavorites(
    //   favoriteProjects.map((project) => project.id)
    // );
  };

  const handleSave = async () => {
    setIsSaving(true);
    await saveFavorites(
      favorites.map((project) => project.slug),
      discordToken
    ).finally(() => setIsSaving(false));
  };

  const handleRemove = async (slug: string) => {
    setIsLoading(true);
    unapproveProject(slug, discordToken)
      .then(() => removeProject(slug))
      .finally(() => setIsLoading(false));
  };

  const { favorites, approved } = user;

  const approvedFiltered = approved.filter(
    (project) => !isFavorite(project.slug)
  );

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
        <LoadingOverlay isLoading={isLoading}>
          <SVGSpinner />
        </LoadingOverlay>

        {isFull() && <BallotSubtitle>Your favorites are full.</BallotSubtitle>}

        <List
          transitionDuration={100}
          values={favorites}
          onChange={({ oldIndex, newIndex }) =>
            moveFavoriteProject(oldIndex, newIndex)
          }
          renderList={({ children, props }) => <div {...props}>{children}</div>}
          renderItem={({ value: { slug, name }, props, index }) => {
            return (
              <ProjectItem key={slug} isFavorite {...props}>
                <ProjectFavorite onClick={() => removeFavoriteProject(slug)}>
                  ★
                </ProjectFavorite>
                <ProjectName>{`${index! + 1}. ${name}`}</ProjectName>
                <ProjectDelete onClick={() => handleRemove(slug)}>
                  x
                </ProjectDelete>
              </ProjectItem>
            );
          }}
        />

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

                  return (
                    <ProjectItem key={slug} style={style}>
                      <ProjectFavorite
                        onClick={() => addFavoriteProject(slug, name)}
                      >
                        ☆
                      </ProjectFavorite>
                      <ProjectName>{name}</ProjectName>
                      <ProjectDelete onClick={() => handleRemove(slug)}>
                        x
                      </ProjectDelete>
                    </ProjectItem>
                  );
                }, areEqual)}
              </FixedSizeList>
            )}
          </AutoSizer>
        </ApprovedContainer>

        <Footer>
          <BallotButton onClick={handleSave}>Save</BallotButton>
          <BallotButton onClick={() => setIsConfirming(true)}>
            Submit
          </BallotButton>
        </Footer>

        {isConfirming && (
          <Confirmation>
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
          </Confirmation>
        )}
      </BallotContent>
    </BallotContainer>
  );
};

const LoadingOverlay = styled('div')([
  tw`absolute flex justify-center items-center text-center inset-0 bg-black bg-opacity-50 z-index[2000] text-white text-2xl transition-all opacity-0`,
  ({ isLoading }: { isLoading: boolean }) =>
    isLoading ? tw`opacity-100` : tw`invisible`,
]);

const Confirmation = styled('div')(
  tw`absolute inset-0 flex flex-col p-4 items-center justify-center bg-gray-100 text-center`
);

const ButtonGroup = styled('div')(tw`flex mt-4 gap-2`);

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

const Footer = styled('div')([tw`flex p-2 justify-between`]);

const BallotButton = styled(Button)([tw`px-4 py-2 shadow-none`]);

define(Ballot, 'vote-ballot');
