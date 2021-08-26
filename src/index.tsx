import { getProjects } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';

/* Web Components */
import 'src/components/Ballot';
import 'src/components/elements/VoteButton';
import 'src/components/elements/DiscordButton';
import 'src/components/DiscordCollector';
import 'src/components/Projects';
import 'src/components/Panelists';
import 'src/components/ErrorBanner';

if (process.env.NODE_ENV === 'development') {
  const { discordToken } = useAuth.getState();

  if (discordToken) {
    getProjects(discordToken).then(({ projects }) => {
      const container = document.getElementById('container')!;

      for (const project of projects) {
        const nameElement = document.createElement('p');
        nameElement.innerText = project.name;

        const voteButton = document.createElement('vote-button');
        voteButton.setAttribute('name', project.name);
        voteButton.setAttribute('slug', project.slug);
        voteButton.appendChild(nameElement);
        container.appendChild(voteButton);
      }
    });
  }
}
