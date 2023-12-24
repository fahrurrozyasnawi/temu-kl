import PropTypes from 'prop-types';
import React, { Fragment, useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow
} from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

const CustomTable = ({
  data,
  columns,
  useServerSidePagination = false,
  pagination,
  pageCount = -1,
  onPaginationChange
}) => {
  const tableData = useMemo(() => data, [data]);
  const columnData = useMemo(() => columns, [columns]);

  let options = {
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: tableData.length
  };

  if (useServerSidePagination) {
    options = {
      pageCount: totalPages,
      onPaginationChange,
      manualPagination: true,
      pageCount
    };
  }

  const [sorting, setSorting] = useState([]);
  const {
    getHeaderGroups,
    getRowModel,
    getState,
    setPageIndex,
    setPageSize,
    getPageCount
  } = useReactTable({
    data: tableData,
    columns: columnData,
    state: {
      sorting,
      ...(useServerSidePagination && {
        pagination
      })
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    ...options
  });

  return (
    <Card sx={{ p: 2 }}>
      <TableContainer>
        <PerfectScrollbar style={{ maxHeight: 1200, minHeight: 500 }}>
          <Table>
            <TableHead>
              {getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableCell
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        sx={{
                          cursor: header.column.getCanSort()
                            ? 'pointer'
                            : undefined,
                          width: flexRender(
                            header.column.columnDef.width,
                            header.getContext()
                          ),
                          minWidth: flexRender(
                            header.column.columnDef.minWidth,
                            header.getContext()
                          ),
                          maxWidth: flexRender(
                            header.column.columnDef.maxWidth,
                            header.getContext()
                          ),
                          textAlign:
                            header.column.columnDef.textAlign || 'left',
                          '&:last-of-type': {
                            textAlign: 'right',
                            paddingRight: 4
                          }
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' ↑',
                          desc: ' ↓'
                        }[header.column.getIsSorted()] ?? null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {getRowModel()
                .rows.slice(0, 10)
                .map((row) => {
                  return (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            sx={{
                              '&:last-of-type': {
                                textAlign: 'right'
                                // paddingRight: '24px'
                              }
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </PerfectScrollbar>
      </TableContainer>

      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 15]}
        count={getPageCount()}
        rowsPerPage={getState().pagination.pageSize}
        page={getState().pagination.pageIndex}
        onPageChange={(_, page) => setPageIndex(page)}
        onRowsPerPageChange={(e) => {
          const size = e.target.value ? Number(e.target.value) : 10;
          setPageSize(size);
        }}
      />
    </Card>
  );
};

CustomTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  useServerSidePagination: PropTypes.bool,
  pageCount: PropTypes.number,
  pagination: PropTypes.object,
  onPaginationChange: PropTypes.any
};

export default CustomTable;
