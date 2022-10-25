import { h, Fragment } from 'preact';
import tw, { styled } from 'twin.macro';
import { useTable, useExpanded, Row } from 'react-table';

const TableContainer = styled('table')([
  tw`border-2 border-black border-solid border-spacing[0]`,
]);

const TrContainer = styled('tr')([tw`last:border-bottom[0]`]);

const ThContainer = styled('th')([
  tw`p-2 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`,
]);

const TdContainer = styled('td')([
  tw`p-2 last:border-right[0] border-right[1px solid black] border-bottom[1px solid black]`,
]);

interface CustomRow extends Row {
  isExpanded?: boolean;
}

// A simple way to support a renderRowSubComponent is to make a render prop
// This is NOT part of the React Table API, it's merely a rendering
// option we are creating for ourselves in our table renderer
export function ExpandableTable({
  columns: userColumns,
  data,
  renderRowSubComponent,
}: any) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    state,
  } = useTable(
    {
      columns: userColumns,
      data,
    },
    useExpanded // We can useExpanded to track the expanded state
    // for sub components too!
  );

  return (
    <div>
      <TableContainer {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <ThContainer {...column.getHeaderProps()}>
                  {column.render('Header')}
                </ThContainer>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row: CustomRow, i) => {
            prepareRow(row);
            return (
              // Use a React.Fragment here so the table markup is still valid
              <Fragment {...row.getRowProps()}>
                <TrContainer>
                  {row.cells.map((cell) => {
                    return (
                      <TdContainer {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </TdContainer>
                    );
                  })}
                </TrContainer>
                {/*
                    If the row is in an expanded state, render a row with a
                    column that fills the entire length of the table.
                  */}
                {row.isExpanded ? (
                  <TrContainer>
                    <TdContainer colSpan={visibleColumns.length}>
                      {/*
                          Inside it, call our renderRowSubComponent function. In reality,
                          you could pass whatever you want as props to
                          a component like this, including the entire
                          table instance. But for this example, we'll just
                          pass the row
                        */}
                      {renderRowSubComponent({ row, data: data[i] })}
                    </TdContainer>
                  </TrContainer>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </TableContainer>
    </div>
  );
}
