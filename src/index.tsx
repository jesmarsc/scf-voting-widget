import { h, render } from 'preact';
import define from 'preact-custom-element';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';
import App from './App';

/* Web Components */
import VoteButton from 'src/components/elements/VoteButton';
import DiscordButton from 'src/components/elements/DiscordButton';
import Ballot from 'src/components/Ballot';
import DiscordCollector from 'src/components/DiscordCollector';
import AdminPanel from 'src/components/admin/AdminPanel';
import ErrorBanner from 'src/components/ErrorBanner';

define(VoteButton, 'vote-button');
define(DiscordButton, 'discord-button');
define(Ballot, 'vote-ballot');
define(DiscordCollector, 'discord-collector');
define(AdminPanel, 'admin-panel');
define(ErrorBanner, 'error-banner');

if (process.env.NODE_ENV === 'development') {
  const container = document.getElementById('container');
  if (container) {
    render(<App />, container);
  }
}
