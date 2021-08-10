import { h, FunctionalComponent, Fragment } from 'preact';
import tw, { styled } from 'twin.macro';

import BallotVerticalList from './BallotVerticalList';

const BallotContainer = styled('div')([
  tw`fixed bottom-4 right-4 font-sans rounded-lg shadow-lg overflow-hidden border-2 border-solid border-gray-100 bg-white z-50`,
  tw`flex flex-col min-width[30ch] max-height[min(42rem, calc(100vh - 2rem))]`,
  tw`all:(m-0 p-0)`,
]);

const BallotTitle = styled('h3')([tw`text-2xl p-4 font-bold tracking-tight`]);

const App: FunctionalComponent = () => {
  return (
    <Fragment>
      <BallotContainer>
        <BallotTitle>Your Ballot</BallotTitle>
        <BallotVerticalList />
      </BallotContainer>
    </Fragment>
  );
};

export default App;
