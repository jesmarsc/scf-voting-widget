import { h } from 'preact';
import define from 'preact-custom-element';
import { useMemo, useEffect, useState, useCallback } from 'preact/hooks';
import { getPanelists } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import { ExpandableTable } from 'src/components/elements/ExpandableTable';

function Panelists() {
  const discordToken = useAuth((state) => state.discordToken);
  const [panelistsData, setpanelistsData] = useState<any>();

  const columns = useMemo(
    () => [
      {
        // Make an expander cell
        Header: () => null, // No header
        id: 'expander', // It needs an ID
        Cell: ({ row }: any) => (
          // Use Cell to render an expander for each row.
          // We can use the getToggleRowExpandedProps prop-getter
          // to build the expander.
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? '👇' : '👉'}
          </span>
        ),
      },
      {
        Header: 'Panelists',
        columns: [
          {
            Header: 'Username',
            accessor: 'username',
          },
          {
            Header: 'Discriminator',
            accessor: 'discriminator',
          },
          {
            Header: 'Email',
            accessor: 'email',
          },
          {
            Header: 'Voted',
            accessor: 'voted',
          },
        ],
      },
    ],
    []
  );

  // Create a function that will render our row sub components
  const renderRowSubComponent = useCallback(
    ({ row, data }: any) => (
      <pre
        style={{
          fontSize: '10px',
        }}
      >
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    ),
    []
  );

  const handleGetpanelists = async () => {
    if (!discordToken) return;
    const { panelists } = await getPanelists(discordToken);
    const stringData = panelists.map((panelist: any) => {
      panelist.voted = panelist.voted.toString();
      return panelist;
    });
    setpanelistsData(stringData);
  };

  useEffect(() => {
    handleGetpanelists();
  }, []);

  return (
    panelistsData && (
      <ExpandableTable
        data={panelistsData}
        columns={columns}
        renderRowSubComponent={renderRowSubComponent}
      />
    )
  );
}

define(Panelists, 'panelists-data');
