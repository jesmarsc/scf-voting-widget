import define from 'preact-custom-element';

/* REQUIRED: Goober Setup for Styles */
import 'src/styles/goober';

import VoteButton from 'src/components/Button/VoteButton';
import DiscordButton from 'src/components/Button/DiscordButton';
import Ballot from 'src/components/Ballot';
import DiscordCollector from 'src/components/DiscordCollector';
import AdminPanel from 'src/components/AdminPanel';
import ErrorBanner from 'src/components/ErrorBanner';

define(VoteButton, 'vote-button');
define(DiscordButton, 'discord-button');
define(Ballot, 'vote-ballot');
define(DiscordCollector, 'discord-collector');
define(AdminPanel, 'admin-panel');
define(ErrorBanner, 'error-banner');
