import React from 'react';

interface TableColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200">
        {/* Inner padding */}
        <div className="px-8 py-6 overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            {/* Header */}
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 pb-4 text-sm font-semibold uppercase tracking-wide text-gray-500
                      ${
                        column.align === 'right'
                          ? 'text-right'
                          : column.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }
                    `}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="bg-gray-50 hover:bg-white transition-all duration-150 shadow-sm rounded-xl"
                  >
                    {columns.map((column, index) => (
                      <td
                        key={column.key}
                        className={`px-6 py-6 text-base text-gray-900
                          ${index === 0 ? 'rounded-l-xl' : ''}
                          ${index === columns.length - 1 ? 'rounded-r-xl' : ''}
                          ${
                            column.align === 'right'
                              ? 'text-right'
                              : column.align === 'center'
                              ? 'text-center'
                              : 'text-left'
                          }
                        `}
                      >
                        {column.render
                          ? column.render(item)
                          : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="py-24 text-center text-lg text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
