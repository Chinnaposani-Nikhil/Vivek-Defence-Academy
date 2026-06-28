import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';

const AdminPageHeader = ({ 
  title, 
  subtitle, 
  actionText, 
  onAction,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterOptions,
  activeFilter,
  onFilterChange
}) => {
  return (
    <div className="bg-white p-5 rounded-sm shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="font-bebas text-3xl text-military-green tracking-wider">{title}</h2>
        {subtitle && <p className="text-sm font-inter text-gray-500">{subtitle}</p>}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {onSearchChange && (
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder={searchPlaceholder || "Search..."}
              value={searchValue || ''}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-sm text-sm font-inter focus:outline-none focus:border-military-green focus:ring-1 focus:ring-military-green w-full sm:w-64"
            />
          </div>
        )}

        {filterOptions && onFilterChange && (
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={activeFilter || ''}
              onChange={(e) => onFilterChange(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-200 rounded-sm text-sm font-inter focus:outline-none focus:border-military-green focus:ring-1 focus:ring-military-green appearance-none bg-white min-w-[140px]"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {actionText && onAction && (
          <button 
            onClick={onAction}
            className="flex items-center justify-center gap-2 bg-military-green hover:bg-army-olive text-white px-4 py-2 rounded-sm font-oswald uppercase tracking-wider text-sm transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> {actionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminPageHeader;
