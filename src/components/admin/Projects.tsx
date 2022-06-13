import { h } from 'preact';
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
    user.isAdmin &&
    projectsData && <Table data={projectsData} columns={columns} />
  );
}

export default Projects;
