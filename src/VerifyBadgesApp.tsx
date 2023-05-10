import { h } from 'preact';
import 'twin.macro';

import DiscordCollector from './components/DiscordCollector';
import ErrorBanner from 'src/components/ErrorBanner';
import VerifyBadges from './components/VerifyBadges';

/* Used strictly to test all components locally */

const VerifyBadgesApp = () => {
  return (
    <div tw="space-y-8">
      <div tw="space-y-4">
        <ErrorBanner />
        <DiscordCollector />
      </div>

      <VerifyBadges />
    </div>
  );
};

export default VerifyBadgesApp;
