import React from 'react';
import { Loader2 } from 'lucide-react';

const AdminTable = ({ 
  columns, 
  data, 
  loading, 
  emptyMessage = "No records found.",
  onRowClick 
}) => {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-military-green animate-spin" />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left font-inter text-sm whitespace-nowrap">
          <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-oswald uppercase tracking-wider text-xs">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`p-4 font-medium ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {!loading && (!data || data.length === 0) ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-gray-500 font-inter">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className={`hover:bg-gray-50/75 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className={`p-4 ${col.cellClassName || ''}`}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
