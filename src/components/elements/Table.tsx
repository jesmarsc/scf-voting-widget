import { h } from 'preact';
import tw, { styled } from 'twin.macro';
import { useTable, useSortBy } from 'react-table';

const TableContainer = styled('table')([
  tw`border-2 border-black border-solid border-spacing[0]`,
]);

const HeaderCell = styled('div')([tw`flex justify-center items-center p-2`]);

const SpanIcon = styled('span')([tw`mr-2`]);

const TrContainer = styled('tr')([tw`last:border-bottom[0]`]);

const ThContainer = styled('th')([
  tw`p-1 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`,
]);

const TdContainer = styled('td')([
  tw`p-2 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`,
]);

export default function TableWrap({ columns, data }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useSortBy
    );

  return (
    <div>
      <TableContainer {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <TrContainer {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <ThContainer
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  <HeaderCell>
                    {i !== 0 && (
                      <SpanIcon>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? '👇 '
                            : '👆 '
                          : '👉 '}
                      </SpanIcon>
                    )}
                    {column.render('Header')}
                  </HeaderCell>
                </ThContainer>
              ))}
            </TrContainer>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TrContainer {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TdContainer {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TdContainer>
                  );
                })}
              </TrContainer>
            );
          })}
        </tbody>
      </TableContainer>
      <br />
    </div>
  );
}
