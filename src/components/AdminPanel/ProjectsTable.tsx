import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { createColumnHelper } from '@tanstack/react-table';

import useAuth from 'src/stores/useAuth';
import useBallot from 'src/stores/useBallot';
import { getProjects } from 'src/utils/api';

import Table from 'src/components/Table';

function ProjectsTable() {
  const { user } = useBallot();
  const discordToken = useAuth((state) => state.discordToken);
  const [projectsData, setProjectsData] = useState<DetailedProject[]>([]);

  const handleGetProjects = async () => {
    if (!discordToken) return;

    const { projects } = await getProjects(discordToken);

    setProjectsData(projects);
  };

  useEffect(() => {
    handleGetProjects();
  }, []);

  if (!user || !user.isAdmin) return null;

  return <Table data={projectsData} columns={columns} />;
}

const columnHelper = createColumnHelper<DetailedProject>();

const columns = [
  columnHelper.group({
    header: 'Projects',
    columns: [
      columnHelper.accessor('name', { header: 'Name' }),
      columnHelper.accessor('score', { header: 'Score' }),
      columnHelper.accessor('approved_count', { header: 'Approved' }),
      columnHelper.accessor('slug', { header: 'Slug' }),
    ],
  }),
];

export default ProjectsTable;
