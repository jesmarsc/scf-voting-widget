import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import 'twin.macro';

import { getProjects } from './utils/api';
import useAuth from './stores/useAuth';

import VoteButton from './components/Button/VoteButton';
import DiscordButton from 'src/components/Button/DiscordButton';
import Ballot from 'src/components/Ballot';
import DiscordCollector from './components/DiscordCollector';
import ErrorBanner from 'src/components/ErrorBanner';
import AdminPanel from './components/AdminPanel';

/* Used strictly to test all components locally */

const App = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const { discordToken } = useAuth();
  useEffect(() => {
    if (discordToken) {
      getProjects(discordToken).then((projects) => setProjects(projects));
    }
  }, [discordToken]);

  return (
    <div tw="space-y-8">
      <div tw="space-y-4">
        <ErrorBanner />
        <DiscordCollector />
        <DiscordButton />
      </div>

      <AdminPanel />

      <div tw="grid gap-2 [grid-template-columns: repeat(auto-fit, minmax(50ch, 1fr))]">
        {projects.map((project, index) => (
          <div key={index}>
            <p>{project.name.substring(0, 20)}</p>
            <VoteButton id={project.id} />
          </div>
        ))}
      </div>

      <Ballot />
    </div>
  );
};

export default App;
