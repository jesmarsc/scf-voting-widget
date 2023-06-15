import { h } from 'preact';
import 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import useBallotState from 'src/stores/useBallotState';
import {
  getDevelopersCsv,
  getPanelistsCsv,
  getProjectsCsv,
} from 'src/utils/api';
import { downloadCsv } from 'src/utils';

import Button from 'src/components/Button';

import PanelistsTable from './PanelistsTable';
import ProjectsTable from './ProjectsTable';

const AdminPanel = () => {
  useBallotState();

  const { user } = useBallot();
  const discordToken = useAuth((state) => state.discordToken);

  if (!discordToken || !user || !user.isAdmin) return null;

  return (
    <div tw="space-y-8">
      <section tw="space-y-4">
        <Button
          onClick={() =>
            getPanelistsCsv(discordToken).then(({ csv }) =>
              downloadCsv(csv, 'panelists.csv')
            )
          }
        >
          Download Panelists
        </Button>

        <PanelistsTable />
      </section>

      <section tw="space-y-4">
        <Button
          onClick={() =>
            getProjectsCsv(discordToken).then(({ csv }) =>
              downloadCsv(csv, 'projects.csv')
            )
          }
        >
          Download Projects
        </Button>

        <ProjectsTable />
      </section>

      <section tw="space-y-4">
        <Button
          onClick={() =>
            getDevelopersCsv(discordToken).then(({ csv }) =>
              downloadCsv(csv, 'developers.csv')
            )
          }
        >
          Download Developers
        </Button>
      </section>
    </div>
  );
};

export default AdminPanel;
