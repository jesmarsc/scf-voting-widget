import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import define from 'preact-custom-element';
import { List } from 'react-movable';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import SVGCaretForward from 'src/assets/SVGCaretForward';

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
          renderItem={({ value: { id, name }, props, index }) => (
            <ProjectItem
              {...props}
              style={{
                ...props.style,
                margin: '0.5rem',
              }}
              isFavorite
            >
              <ProjectFavorite
                onClick={() => {
                  removeProject(id);
                  addApprovedProject(id, name);
                }}
              />

              <ProjectName>
                <ProjectPosition>{`${index! + 1}. `}</ProjectPosition>
                {name}
              </ProjectName>
              <ProjectDelete onClick={() => removeProject(id)} />
            </ProjectItem>
          )}
        />

        <ApprovedContainer>
          {approvedProjects.map(({ id, name }) => (
            <ProjectItem key={id}>
              <ProjectFavorite
                onClick={() => {
                  if (!isFull()) {
                    removeProject(id);
                    addFavoriteProject(id, name);
                  }
                }}
              />
              <ProjectName>{name}</ProjectName>
              <ProjectDelete onClick={() => removeProject(id)} />
            </ProjectItem>
          ))}
        </ApprovedContainer>
      </BallotContent>
    </BallotContainer>
  );
};

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans overflow-hidden rounded-lg shadow-lg border border-solid border-gray-100 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(50rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const BallotTitle = styled('h3')([
  tw`flex items-center text-2xl p-4 font-bold tracking-tight cursor-pointer`,
]);

const BallotCaret = styled(SVGCaretForward)([
  tw`transition-transform mt-1 mr-2`,
  ({ isExpanded }) => isExpanded && tw`transform rotate-90`,
]);

const BallotSubtitle = styled('p')([tw`bg-red-100 py-1 px-4`]);

const Title = styled('h3')(tw`text-gray-800 m-2`);

const BallotContent = styled('div')([tw`flex flex-col max-height[30rem]`]);

const ApprovedContainer = styled('div')(tw`overflow-y-auto flex-1`);

const ProjectItem = styled(
  'div',
  forwardRef
)([
  tw`flex items-center p-2 m-2 rounded-md font-sans list-none select-none z-index[1010] text-white bg-stellar-purple`,
  ({ isFavorite }: any) => isFavorite && tw`cursor-pointer bg-blue-500`,
]);

const ProjectName = styled('span')([
  tw`relative flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis mx-2`,
  //tw`after:(content absolute top-0 right-0 w-1/4 h-full pointer-events-none bg-gradient-to-l from-stellar-purple to-transparent)`,
]);

const ProjectPosition = styled('span')([tw`font-bold`]);

const ProjectFavorite = styled('button')([
  tw`after:content['★'] border-none py-0.5 px-2 cursor-pointer rounded font-semibold text-white bg-black`,
  tw`transition-colors bg-opacity-20 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

const ProjectDelete = styled('button')([
  tw`after:content['x'] border-none py-0.5 px-2 cursor-pointer rounded font-semibold text-white bg-black`,
  tw`transition-colors bg-opacity-20 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

define(Ballot, 'vote-ballot');
