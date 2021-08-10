import { h } from 'preact';
import { forwardRef } from 'preact/compat';
import { List, arrayMove } from 'react-movable';

import tw, { styled } from 'twin.macro';

import useBallot from '../stores/useBallot';

const BallotItemsContainer = styled(
  'ul',
  forwardRef
)([tw`flex-1 p-4 overflow-y-auto overflow-x-hidden bg-gray-100`]);

const BallotItem = styled(
  'li',
  forwardRef
)([
  tw`py-2 px-6 rounded-md cursor-pointer text-white font-sans list-none z-index[100] bg-stellar-purple`,
]);

const BallotItemNumber = styled('span')([tw`font-bold mr-4`]);

const BallotVerticalList = () => {
  const ballotItems = useBallot((state) => state.ballotItems);

  return (
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
            margin: '0.5rem 0',
          }}
        >
          <BallotItemNumber>{`${index! + 1}.`}</BallotItemNumber>
          {value.name}
        </BallotItem>
      )}
    />
  );
};

export default BallotVerticalList;
