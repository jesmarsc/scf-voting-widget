import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { createColumnHelper } from '@tanstack/react-table';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import { getPanelists } from 'src/utils/api';

import Table from 'src/components/Table';
import useBallotState from 'src/stores/useBallotState';

function PanelistsTable() {
  useBallotState();

  const { user } = useBallot();
  const discordToken = useAuth((state) => state.discordToken);
  const [panelistsData, setPanelistsData] = useState<User[]>([]);

  const handleGetPanelists = async () => {
    if (!discordToken) return;

    const { panelists } = await getPanelists(discordToken);

    setPanelistsData(panelists);
  };

  useEffect(() => {
    handleGetPanelists();
  }, []);

  if (!user || !user.isAdmin) return null;

  return <Table data={panelistsData} columns={columns} />;
}

const columnHelper = createColumnHelper<User>();

const columns = [
  columnHelper.group({
    header: 'Panelists',
    columns: [
      columnHelper.accessor('username', { header: 'Name' }),
      columnHelper.accessor('discriminator', { header: 'Discriminator' }),
      columnHelper.accessor('email', { header: 'Email' }),
      columnHelper.accessor('voted', { header: 'Voted' }),
    ],
  }),
];

export default PanelistsTable;
