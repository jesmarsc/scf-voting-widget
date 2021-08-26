import { h } from 'preact';
import define from 'preact-custom-element';
import { useMemo, useEffect, useState } from 'preact/hooks';
import { getProjects } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';
import Table from 'src/components/elements/Table';
import useBallot from 'src/stores/useBallot';

function Projects() {
  const discordToken = useAuth((state) => state.discordToken);
  const [projectsData, setProjectsData] = useState<any>();

  const { user } = useBallot();

  const columns = useMemo(
    () => [
      {
        Header: 'Projects',
        columns: [
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Score',
            accessor: 'score',
          },
          {
            Header: 'Approved',
            accessor: 'approved_count',
          },
          {
            Header: 'Slug',
            accessor: 'slug',
          },
          {
            Header: 'Site',
            accessor: 'site',
          },
        ],
      },
    ],
    []
  );

  const handleGetProjects = async () => {
    if (!discordToken) return;
    const { projects } = await getProjects(discordToken);
    setProjectsData(projects);
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  return (
    user &&
    user.role === 'admin' &&
    projectsData && <Table data={projectsData} columns={columns} />
  );
}

define(Projects, 'projects-data');
