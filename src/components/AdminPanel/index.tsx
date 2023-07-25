import { h } from 'preact';
import 'twin.macro';

import useAuth from 'src/stores/useAuth';
import useBallotState from 'src/stores/useBallotState';
import {
  getDevelopersCsv,
  getPanelistsCsv,
  getProjectsCsv,
} from 'src/utils/api';
import { downloadCsv } from 'src/utils';

import Button from 'src/components/Button';
import { useEffect } from 'preact/hooks';

const AdminPanel = () => {
  const { user, fetchData } = useBallotState();
  const discordToken = useAuth((state) => state.discordToken);

  useEffect(() => {
    fetchData();
  }, [discordToken]);

  if (!discordToken || !user) return null;

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
