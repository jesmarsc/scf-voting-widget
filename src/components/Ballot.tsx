import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import define from 'preact-custom-element';
import { List, arrayMove } from 'react-movable';
import tw, { styled } from 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';

import SVGCaretForward from 'src/assets/SVGCaretForward';

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans overflow-hidden rounded-lg shadow-lg border border-solid border-gray-100 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(42rem, calc(100vh - 2rem))]`,
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

const BallotContent = styled('p')([
  tw`transition[max-height 500ms]`,
  ({ isExpanded }) =>
    isExpanded ? tw`delay-150 max-height[100vh]` : tw`max-h-0`,
]);

const BallotItemsContainer = styled(
  'ul',
  forwardRef
)([tw`overflow-y-auto bg-gray-100`]);

const BallotItem = styled(
  'li',
  forwardRef
)([
  tw`flex items-center py-2 px-4 rounded-md cursor-pointer text-white font-sans list-none bg-stellar-purple z-index[1010]`,
]);

const BallotItemName = styled('span')([
  tw`relative flex-1 whitespace-nowrap overflow-hidden mx-4`,
  tw`after:(content absolute top-0 right-0 w-1/4 h-full pointer-events-none bg-gradient-to-l from-stellar-purple to-transparent)`,
]);

const BallotItemNumber = styled('span')([tw`font-bold`]);

const BallotItemDelete = styled('button')([
  tw`border-none py-0.5 px-2 cursor-pointer rounded transition-colors font-semibold text-white bg-black bg-opacity-20 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

const Ballot = () => {
  const { ballotItems, isFull, isExpanded } = useBallot();
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
      {isFull && <BallotSubtitle>Your ballot is full.</BallotSubtitle>}
      <BallotContent isExpanded={isExpanded}>
        <List
          transitionDuration={150}
          lockVertically
          values={ballotItems}
          onChange={({ oldIndex, newIndex }) =>
            useBallot.setState({
              ballotItems: arrayMove(ballotItems, oldIndex, newIndex),
            })
          }
          renderList={({ children, props }) => (
            <BallotItemsContainer {...props}>{children}</BallotItemsContainer>
          )}
          renderItem={({ value, props, index }) => (
            <BallotItem
              {...props}
              style={{
                ...props.style,
                margin: '0.5rem',
              }}
            >
              <BallotItemNumber>{`${index! + 1}.`}</BallotItemNumber>
              <BallotItemName>{value.name}</BallotItemName>
              <BallotItemDelete
                onClick={() => useBallot.getState().toggleItem(value)}
              >
                x
              </BallotItemDelete>
            </BallotItem>
          )}
        />
      </BallotContent>
    </BallotContainer>
  );
};

define(Ballot, 'vote-ballot');
