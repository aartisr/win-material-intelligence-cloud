import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { useId, useMemo, useState } from "react";

export function DataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search",
}: {
  data: TData[];
  columns: ColumnDef<TData, unknown>[];
  searchPlaceholder?: string;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const searchId = useId();
  const memoizedColumns = useMemo(() => columns, [columns]);
  const table = useReactTable({
    data,
    columns: memoizedColumns,
    state: { globalFilter, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <section className="data-panel">
      <div className="table-toolbar">
        <label className="search-field" htmlFor={searchId}>
          <span aria-hidden="true">Find</span>
          <input
            id={searchId}
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </label>
        <div className="table-actions">
          <span className="table-meta-pill">{table.getFilteredRowModel().rows.length} records</span>
          <select
            aria-label="Rows per page"
            value={table.getState().pagination.pageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
          >
            {[8, 16, 32].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize} rows
              </option>
            ))}
          </select>
          <details className="column-menu">
            <summary>Columns</summary>
            <div>
              {table.getAllLeafColumns().map((column) => (
                <label key={column.id}>
                  <input
                    type="checkbox"
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                  />
                  {column.id}
                </label>
              ))}
            </div>
          </details>
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === "asc" ? " ↑" : header.column.getIsSorted() === "desc" ? " ↓" : ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.getRowModel().rows.length === 0 ? (
        <div className="table-empty">No matching records. Adjust the search or selected columns.</div>
      ) : null}
      <div className="pagination">
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </section>
  );
}
