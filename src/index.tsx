import { getProjects } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import define from 'preact-custom-element';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';

/* Web Components */
import Ballot from 'src/components/Ballot';
import 'src/components/elements/VoteButton';
import DiscordButton from 'src/components/elements/DiscordButton';
import 'src/components/DiscordCollector';
import 'src/components/Projects';
import 'src/components/Panelists';
import 'src/components/ErrorBanner';

define(DiscordButton, 'discord-button');
define(Ballot, 'vote-ballot');

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
