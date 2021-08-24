import { h } from 'preact';
import { forwardRef, memo } from 'preact/compat';
import define from 'preact-custom-element';

import { List } from 'react-movable';
import { FixedSizeList, areEqual } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import SVGCaretForward from 'src/assets/SVGCaretForward';

const randomData = () => {
  return Array.from({ length: 100 }, () => ({
    id: Math.random().toString(36).substr(2),
    name: Math.random().toString(36).substr(2),
  }));
};

const ITEM_HEIGHT = 42;

const Ballot = () => {
  const {
    isFull,
    isExpanded,
    approvedProjects,
    favoriteProjects,
    addApprovedProject,
    addFavoriteProject,
    moveFavoriteProject,
    removeProject,
  } = useBallot();

  const discordToken = useAuth((state) => state.discordToken);

  if (!discordToken) return null;

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

      {isFull() && <BallotSubtitle>Your favorites are full.</BallotSubtitle>}

      <BallotContent isExpanded={isExpanded}>
        <List
          transitionDuration={100}
          values={favoriteProjects}
          onChange={({ oldIndex, newIndex }) =>
            moveFavoriteProject(oldIndex, newIndex)
          }
          renderList={({ children, props }) => <div {...props}>{children}</div>}
          renderItem={({ value: { id, name }, props, index }) => {
            return (
              <ProjectItem isFavorite {...props}>
                <ProjectFavorite
                  onClick={() => {
                    removeProject(id);
                    addApprovedProject(id, name);
                  }}
                >
                  ★
                </ProjectFavorite>
                <ProjectName>{`${index! + 1}. ${name}`}</ProjectName>
                <ProjectDelete onClick={() => removeProject(id)}>
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
                itemCount={approvedProjects.length}
                itemData={approvedProjects}
                itemSize={ITEM_HEIGHT}
              >
                {memo(({ index, data, style }: any) => {
                  const { id, name } = data[index];

                  return (
                    <ProjectItem style={style}>
                      <ProjectFavorite
                        onClick={() => {
                          if (!isFull()) {
                            removeProject(id);
                            addFavoriteProject(id, name);
                          }
                        }}
                      >
                        ☆
                      </ProjectFavorite>
                      <ProjectName>{name}</ProjectName>
                      <ProjectDelete onClick={() => removeProject(id)}>
                        x
                      </ProjectDelete>
                    </ProjectItem>
                  );
                }, areEqual)}
              </FixedSizeList>
            )}
          </AutoSizer>
        </ApprovedContainer>
      </BallotContent>
    </BallotContainer>
  );
};

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans rounded-lg overflow-hidden shadow-lg border border-solid border-gray-200 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(30rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const BallotContent = styled('div')([
  tw`flex flex-col h-96!`,
  ({ isExpanded }: { isExpanded: boolean }) =>
    isExpanded ? tw` max-height[24rem]` : tw`max-h-0`,
]);

const ApprovedContainer = styled('div')([tw`flex-1 shadow-inner bg-blue-600`]);

const BallotTitle = styled('h3')([
  tw`flex items-center text-2xl p-2 font-bold tracking-tight cursor-pointer`,
]);

const BallotSubtitle = styled('p')([tw`bg-red-100 py-1 px-4`]);

const BallotCaret = styled(SVGCaretForward)<{ isExpanded?: boolean }>([
  tw`transition-transform mt-1 mr-2`,
  ({ isExpanded }) => (isExpanded ? tw`transform rotate-90` : ''),
]);

const ProjectItem = styled(
  'div',
  forwardRef
)([
  tw`flex items-center p-2 font-sans z-index[1010] text-white`,
  ({ isFavorite }: { isFavorite?: boolean }) =>
    isFavorite
      ? tw`rounded cursor-pointer text-white bg-stellar-purple m-2!`
      : tw`not-first:(border-0 border-t-2 border-solid border-white)`,
]);

const ProjectName = styled('span')([
  tw`flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis mx-2`,
  // tw`relative after:(content absolute top-0 right-0 w-1/4 h-full pointer-events-none bg-gradient-to-l from-stellar-purple to-transparent)`,
]);

const BaseButton = styled('button')([
  tw`flex items-center justify-center p-0! border-none cursor-pointer rounded text-base width[2ch]`,
  tw`bg-black transition-colors bg-opacity-20 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

const ProjectFavorite = styled(BaseButton)(tw`text-yellow-300`);

const ProjectDelete = styled(BaseButton)(tw`text-white`);

define(Ballot, 'vote-ballot');
