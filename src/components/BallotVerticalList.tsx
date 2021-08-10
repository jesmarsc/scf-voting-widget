import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { List, arrayMove } from 'react-movable';

import tw, { styled } from 'twin.macro';

import useBallot from '../stores/useBallot';

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans overflow-hidden rounded-lg shadow-lg border border-solid border-gray-100 bg-white z-index[1000]`,
  tw`flex flex-col w-72 max-height[min(42rem, calc(100vh - 2rem))]`,
  tw`box-border all:(m-0 p-0 box-sizing[inherit])`,
]);

const BallotTitle = styled('h3')([tw`text-2xl p-4 font-bold tracking-tight`]);

const BallotSubtitle = styled('p')([tw`bg-red-100 py-1 px-4`]);

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
  tw`border-none py-0.5 px-2 cursor-pointer rounded transition-colors text-white bg-black bg-opacity-20 hover:(bg-opacity-40) active:(bg-opacity-60)`,
]);

const BallotVerticalList = () => {
  const ballotItems = useBallot((state) => state.ballotItems);
  const isFull = useBallot((state) => state.isFull);

  return (
    <BallotContainer>
      <BallotTitle>Your Ballot</BallotTitle>
      {isFull && <BallotSubtitle>Your ballot is full.</BallotSubtitle>}
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
    </BallotContainer>
  );
};

export default BallotVerticalList;
