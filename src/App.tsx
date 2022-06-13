import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import 'twin.macro';

import { getProjects } from './utils/api';
import useAuth from './stores/useAuth';

import VoteButton from './components/elements/VoteButton';
import DiscordButton from 'src/components/elements/DiscordButton';
import Ballot from 'src/components/Ballot';
import DiscordCollector from './components/DiscordCollector';
import Projects from 'src/components/admin/Projects';
import Panelists from 'src/components/admin/Panelists';
import ErrorBanner from 'src/components/ErrorBanner';

/* Used strictly to test all components locally */

const App = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const { discordToken } = useAuth.getState();

  useEffect(() => {
    if (discordToken) {
      getProjects(discordToken).then(({ projects }) => setProjects(projects));
    }
  }, []);

  return (
    <div tw="space-y-8">
      <div tw="space-y-4">
        <ErrorBanner />
        <DiscordCollector />
        <DiscordButton />
      </div>

      <Panelists />

      <Projects />

      <div tw="grid gap-2 grid-template-columns[repeat(auto-fit, minmax(25ch, 1fr))]">
        {projects.map((project, index) => (
          <div key={index}>
            <p>{project.name.substring(0, 20)}</p>
            <VoteButton name={project.name} slug={project.slug} />
          </div>
        ))}
      </div>

      <Ballot />
    </div>
  );
};

export default App;
