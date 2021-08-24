import { projects } from './stores/api';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';

/* Web Components */
import 'src/components/Ballot';
import 'src/components/elements/VoteButton';
import 'src/components/elements/DiscordButton';
import 'src/components/DiscordCollector';

if (process.env.NODE_ENV === 'development') {
  projects().then(({ projects }) => {
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
