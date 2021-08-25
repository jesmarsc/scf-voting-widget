import { h } from 'preact';
import define from 'preact-custom-element';
import tw, { styled } from 'twin.macro';
import { useTable, useSortBy, TableOptions } from 'react-table';
import { useMemo,useEffect, useState } from "preact/hooks";
import { getProjects } from 'src/utils/api';
import useAuth from 'src/stores/useAuth';

const Wrap = styled('div')([tw`p-1`]);

const TableContainer = styled('table')([tw`border-2 border-black border-solid border-spacing[0]`]);

const TrContainer = styled('tr')([tw`last:border-bottom[0]`]);

const ThContainer = styled('th')([tw`p-1 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`]);

const TdContainer = styled('td')([tw`p-1 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`]);

function TableWrap({columns, data}:any) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  )

  return (
    <Wrap>
      <TableContainer {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <TrContainer {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column:any) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <ThContainer {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </ThContainer>
              ))}
            </TrContainer>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(
            (row, i) => {
              prepareRow(row);
              return (
                <TrContainer {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <TdContainer {...cell.getCellProps()}>{cell.render('Cell')}</TdContainer>
                    )
                  })}
                </TrContainer>
              )}
          )}
        </tbody>
      </TableContainer>
      <br />
    </Wrap>
  )
}

function Admin() {
     const data = [ob, ob, ob];
      const discordToken = useAuth((state) => state.discordToken);
    const [projectsData, setProjectsData] = useState<any>();
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
    )

     const handleGetProjects = async() => {
     if (!discordToken) return;
     const {projects} = await getProjects(discordToken);
    setProjectsData(projects);
  }

  useEffect(() => {
     handleGetProjects()
  }, [])

    
    return projectsData && <TableWrap data={projectsData} columns={columns}/>
}


define(Admin, 'admin-panel');
