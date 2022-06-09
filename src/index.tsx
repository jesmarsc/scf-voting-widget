import { getProjects } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import define from 'preact-custom-element';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';

/* Web Components */
import VoteButton from './components/elements/VoteButton';
import DiscordButton from 'src/components/elements/DiscordButton';
import Ballot from 'src/components/Ballot';
import DiscordCollector from './components/DiscordCollector';
import Projects from 'src/components/admin/Projects';
import Panelists from 'src/components/admin/Panelists';
import ErrorBanner from 'src/components/ErrorBanner';

define(VoteButton, 'vote-button');
define(DiscordButton, 'discord-button');
define(Ballot, 'vote-ballot');
define(DiscordCollector, 'discord-collector');
define(Projects, 'projects-data');
define(Panelists, 'panelists-data');
define(ErrorBanner, 'error-banner');

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
