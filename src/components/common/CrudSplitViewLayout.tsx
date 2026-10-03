import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { DataTable } from '@/components/common/DataTable';
import { SearchBar } from '@/components/common/SearchBar';
import { Plus, X, ChevronLeft } from 'lucide-react';
import { Filter } from '@/components/common/Filter';
import type { FilterCategory } from '@/components/common/Filter';
import { Tabs } from '@/components/common/Tabs';
import { UnsavedChangesModal } from '@/components/common/UnsavedChangesModal';
import { useBlocker } from 'react-router-dom';
import { cn } from '@/utils/cn';

export interface CrudSplitViewLayoutProps<T> {
    data: T[];
    loading?: boolean;
    resourceName: string;
    resourceNamePlural?: string;

    // Selection Control
    selectedItem: T | null;
    onSelectItem: (item: T | null) => void;

    // Table Configuration
    columns: any[];
    keyExtractor: (item: T) => string | number;
    onDragReorder?: (newOrder: T[], activeId: any, overId: any) => void;

    // Split List Item Configuration
    renderListItem: (item: T, isSelected: boolean) => React.ReactNode;

    // Split Details Configuration
    tabs?: { id: string; label: string }[];
    renderDetailsPanel: (
        item: T,
        activeTab: string,
        dirtyState: {
            isDirty: boolean;
            handleDirtyChange: (dirty: boolean, changesList: any[]) => void;
        }
    ) => React.ReactNode;

    // Search and Filters
    searchFields?: (keyof T)[];
    filterConfig?: FilterCategory[];
    customFilter?: (item: T, activeFilters: Record<string, string[]>) => boolean;
    customSearch?: (item: T, search: string) => boolean;

    // Actions
    onAdd?: () => void;
    emptyStateIcon?: React.ReactNode;
    renderCustomDetailsHeader?: (item: T) => React.ReactNode;
    detailsPanelClassName?: string;
    renderStatsRow?: () => React.ReactNode;
}

export function CrudSplitViewLayout<T>({
    data,
    loading,
    resourceName,
    resourceNamePlural,
    selectedItem,
    onSelectItem,
    columns,
    keyExtractor,
    onDragReorder,
    renderListItem,
    tabs = [],
    renderDetailsPanel,
    searchFields = [],
    filterConfig = [],
    customFilter,
    customSearch,
    onAdd,
    emptyStateIcon = "📝",
    renderCustomDetailsHeader,
    detailsPanelClassName,
    renderStatsRow
}: CrudSplitViewLayoutProps<T>) {
    const defaultTab = tabs.length > 0 ? tabs[0].id : "";
    const [tab, setTab] = useState(defaultTab);
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
    const [isDirty, setIsDirty] = useState(false);
    const [pendingChanges, setPendingChanges] = useState<any[]>([]);
    const [pendingAction, setPendingAction] = useState<{ type: 'click' | 'close' | 'tab', data?: any } | null>(null);

    // Keep tab valid if tabs array changes
    useEffect(() => {
        if (tabs.length > 0 && !tabs.some(t => t.id === tab)) {
            setTab(tabs[0].id);
        }
    }, [tabs, tab]);

    // Block navigation via router
    const blocker = useBlocker(
        ({ currentLocation, nextLocation }) =>
            isDirty && currentLocation.pathname !== nextLocation.pathname
    );

    const handleDirtyChange = useCallback((dirty: boolean, changesList: any[]) => {
        setIsDirty(dirty);
        setPendingChanges(changesList || []);
    }, []);

    const filtered = useMemo(() => (data || []).filter((item: T) => {
        let matchSearch = true;
        if (search) {
            if (customSearch) {
                matchSearch = customSearch(item, search);
            } else if (searchFields.length > 0) {
                const s = search.toLowerCase();
                matchSearch = searchFields.some(field => {
                    const val = item[field];
                    return typeof val === 'string' && val.toLowerCase().includes(s);
                });
            }
        }

        let matchStatus = true;
        if (customFilter) {
            matchStatus = customFilter(item, activeFilters);
        }

        return matchSearch && matchStatus;
    }), [data, search, activeFilters, searchFields, customSearch, customFilter]);

    const handleItemClick = (item: T) => {
        if (isDirty) {
            setPendingAction({ type: 'click', data: item });
        } else {
            onSelectItem(item);
            setTab(defaultTab);
        }
    };

    const handleTabChange = (newTab: string) => {
        if (isDirty) {
            setPendingAction({ type: 'tab', data: newTab });
        } else {
            setTab(newTab);
        }
    };

    const handleCloseProcess = () => {
        if (isDirty) {
            setPendingAction({ type: 'close' });
        } else {
            onSelectItem(null);
        }
    };

    const renderFullTable = () => {
        const pluralName = resourceNamePlural || resourceName + 's';
        return (
            <div className="flex flex-col flex-1 h-full overflow-hidden">
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
                    {/* Stats Row */}
                    {renderStatsRow && renderStatsRow()}

                    {/* Toolbar: Search + Filter */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                        <div className="flex-1 relative w-full">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <SearchBar
                                className="w-full"
                                inputClassName="pl-9 py-1.5 rounded-lg bg-white dark:bg-gray-900 border border-[#e8e6e0] dark:border-gray-700 text-[13px] focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-ring)] placeholder-[#b0b4be] shadow-sm"
                                placeholder={`Search ${pluralName.toLowerCase()} by name, category…`}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        {/* Filters button */}
                        {filterConfig.length > 0 && (
                            <button
                                className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border border-slate-200 bg-white text-slate-700 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] dark:hover:border-[var(--accent)] dark:hover:text-[var(--accent)] cursor-pointer"
                            >
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" /></svg>
                                Filters
                            </button>
                        )}
                        {/* Sort button */}
                        <button
                            className="shrink-0 flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border border-slate-200 bg-white text-slate-700 dark:border-gray-700 dark:bg-gray-900 dark:text-slate-300 hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] dark:hover:border-[var(--accent)] dark:hover:text-[var(--accent)] cursor-pointer"
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" /></svg>
                            Sort
                        </button>

                        {/* Action Button */}
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="shrink-0 flex items-center gap-2 text-white text-[13px] font-semibold px-3 py-1.5 rounded-lg transition-all h-8"
                                style={{
                                    background: 'var(--accent)',
                                    boxShadow: '0 2px 6px var(--accent-ring)',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                            >
                                <Plus size={14} strokeWidth={2.5} />
                                Add {resourceName}
                            </button>
                        )}
                    </div>

                    {/* Table Card */}
                    <div
                        className="bg-white dark:bg-gray-900 md:rounded-lg rounded-lg overflow-hidden flex flex-col min-h-0 md:border border-slate-200 dark:border-gray-800 md:shadow-sm"
                    >
                        {/* Desktop Table View */}
                        <div className="hidden md:flex md:flex-col flex-1 min-h-0">
                            <DataTable
                                data={filtered}
                                columns={columns}
                                keyExtractor={keyExtractor}
                                onRowClick={handleItemClick}
                                loading={loading && (!data || data.length === 0)}
                                onReorder={(search === "" && Object.keys(activeFilters).length === 0) ? onDragReorder : undefined}
                                draggable={(search === "" && Object.keys(activeFilters).length === 0) && !!onDragReorder}
                            />
                        </div>

                        {/* Mobile Card View (Option B) */}
                        <div className="block md:hidden p-1.5 space-y-1.5 flex-1 min-h-0 overflow-y-auto">
                            {loading && (!data || data.length === 0) ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={`mob-skeleton-${i}`} className="h-[56px] bg-slate-100 dark:bg-gray-800 animate-pulse rounded-xl w-full" />
                                ))
                            ) : filtered.length > 0 ? (
                                filtered.map((item: T) => (
                                    <div 
                                        key={keyExtractor(item)} 
                                        onClick={() => handleItemClick(item)}
                                        className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm"
                                    >
                                        {renderListItem(item, false)}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 px-5 text-slate-400">
                                    <div className="text-3xl mb-2 opacity-40">{emptyStateIcon}</div>
                                    <div className="text-sm font-medium">No {pluralName.toLowerCase()} found</div>
                                </div>
                            )}
                        </div>

                        {/* Table Footer with Pagination */}
                        {!loading && data && data.length > 0 && (
                            <div
                                className="shrink-0 flex flex-col sm:flex-row items-center justify-between px-3 py-1 text-[12px] gap-2 border-t border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-800/50 text-slate-500 dark:text-slate-400"
                            >
                                <span>
                                    Showing <strong className="font-semibold text-slate-900 dark:text-slate-100">{filtered.length}</strong> of <strong className="font-semibold text-slate-900 dark:text-slate-100">{data.length}</strong> {pluralName.toLowerCase()}
                                </span>
                                <div className="flex items-center gap-1">
                                    {/* Prev */}
                                    <button className="w-7 h-7 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800">‹</button>
                                    {/* Page 1 */}
                                    <button className="w-7 h-7 rounded-md border border-[var(--accent)] bg-[var(--accent)] text-white font-semibold text-xs flex items-center justify-center cursor-pointer">1</button>
                                    {/* Next */}
                                    <button className="w-7 h-7 rounded-md border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-slate-500 dark:text-slate-400 text-xs flex items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-800">›</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderSplitView = () => {
        const pluralName = resourceNamePlural || resourceName + 's';
        const displayCount = filtered.length;

        // Show list on desktop OR on mobile when no item is selected
        const showList = !selectedItem || typeof window !== 'undefined' && window.innerWidth >= 768;
        // Show details on desktop (if selected) OR on mobile when an item IS selected
        const showDetails = !!selectedItem;

        return (
            <div className="flex flex-1 h-full overflow-hidden bg-transparent">

                {/* ── Left Panel (List) ── */}
                <div
                    className={cn(
                        "flex flex-col overflow-hidden transition-all duration-300",
                        showList ? "flex" : "hidden md:flex",
                        "w-full md:w-[260px] md:min-w-[260px] bg-white dark:bg-[#0f1117] border-r border-slate-200 dark:border-gray-800 shadow-[2px_0_8px_rgba(0,0,0,0.04)] dark:shadow-none"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 dark:border-gray-800">
                        <div>
                            <div className="font-bold text-[15px] text-slate-900 tracking-tight">{pluralName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                    style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
                                >
                                    {displayCount}
                                </span>
                                <span className="text-[10.5px] uppercase tracking-wider font-medium text-slate-400">
                                    {displayCount === 1 ? resourceName : pluralName}
                                </span>
                            </div>
                        </div>
                        {onAdd && (
                            <button
                                onClick={() => onAdd()}
                                className="flex items-center gap-1.5 text-white text-[11.5px] font-semibold px-3 py-1.5 rounded-[8px] transition-all"
                                style={{ background: 'var(--accent)', boxShadow: '0 2px 6px var(--accent-ring)' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
                            >
                                <Plus size={12} strokeWidth={2.5} />
                                <span>Add</span>
                            </button>
                        )}
                    </div>

                    {/* Search */}
                    <div className="px-2 py-1.5 border-b border-white dark:border-gray-900 border-b-transparent">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <SearchBar
                                className="w-full"
                                inputClassName="pl-8 py-1.5 text-[13px] rounded-[8px] bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-700 focus:border-[var(--accent)] focus:ring-[2px] focus:ring-[var(--accent-ring)] placeholder-[#b0b4be] shadow-sm"
                                placeholder={`Search ${pluralName.toLowerCase()}...`}
                                value={search}
                                onChange={setSearch}
                            />
                        </div>
                        {filterConfig.length > 0 && (
                            <div className="mt-1.5">
                                <Filter categories={filterConfig} onFilterChange={setActiveFilters} />
                            </div>
                        )}
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-1 px-1.5 scrollbar-thin">
                        {filtered.length === 0 && !loading && (
                            <div className="text-center py-10 px-5 text-slate-400">
                                <div className="text-3xl mb-2 opacity-40">{emptyStateIcon}</div>
                                <div className="text-sm font-medium">No {pluralName.toLowerCase()} found</div>
                            </div>
                        )}
                        {filtered.map((item: T) => {
                            const isSelected = selectedItem ? keyExtractor(selectedItem) === keyExtractor(item) : false;
                            return (
                                <div key={keyExtractor(item)} onClick={() => handleItemClick(item)}>
                                    {renderListItem(item, isSelected)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Detail Panel ── */}
                {showDetails && (
                    <div className={cn(
                        "flex-1 flex flex-col p-0 md:p-2 h-full overflow-hidden",
                        !showList && "w-full" // Take full width on mobile when list is hidden
                    )}>
                        <div
                            className={cn("flex-1 flex flex-col md:flex-row overflow-hidden relative bg-white dark:bg-[#0f1117] md:border md:border-slate-200 dark:md:border-gray-800 md:shadow-sm md:rounded-lg", detailsPanelClassName)}
                        >
                            {/* Mobile Back Button & Header Area */}
                            <div className="md:hidden flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f1117]">
                                <button
                                    onClick={handleCloseProcess}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                                >
                                    <ChevronLeft size={16} />
                                    <span className="text-sm font-medium">Back to {pluralName}</span>
                                </button>
                            </div>

                            {/* Vertical Tab Nav (Desktop) / Horizontal (Mobile) */}
                            {tabs.length > 0 && (
                                <Tabs
                                    tabs={tabs}
                                    activeTab={tab}
                                    onTabChange={handleTabChange}
                                />
                            )}

                            {/* Detail content */}
                            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
                                {/* Close button (Desktop Only) */}
                                <button
                                    onClick={handleCloseProcess}
                                    className="hidden md:flex absolute top-2 right-2 z-[60] p-1.5 rounded-lg transition-all items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-slate-600 dark:hover:text-slate-300"
                                    title="Close"
                                >
                                    <X size={14} />
                                </button>
                                {renderCustomDetailsHeader && selectedItem && renderCustomDetailsHeader(selectedItem)}
                                {/* Tab Content */}
                                <div className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4 pt-3 relative">
                                    <div className="flex flex-col w-full">
                                        {selectedItem && renderDetailsPanel(selectedItem, tab, { isDirty, handleDirtyChange })}
                                    </div>
                                </div>
                                <div id="crud-tab-footer-portal" className="shrink-0 w-full z-[70] pb-safe" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Unsaved Changes Modals */}
                {isDirty && (
                    <>
                        <UnsavedChangesModal
                            isOpen={pendingAction !== null}
                            onClose={() => setPendingAction(null)}
                            itemName={resourceName.toLowerCase()}
                            changeCount={pendingChanges.length}
                            changes={pendingChanges}
                            onConfirm={() => {
                                if (pendingAction?.type === 'click') {
                                    onSelectItem(pendingAction.data);
                                    setTab(defaultTab);
                                } else if (pendingAction?.type === 'close') {
                                    onSelectItem(null);
                                } else if (pendingAction?.type === 'tab') {
                                    setTab(pendingAction.data);
                                }
                                setIsDirty(false);
                                setPendingChanges([]);
                                setPendingAction(null);
                            }}
                        />
                        <UnsavedChangesModal
                            isOpen={blocker.state === "blocked"}
                            onClose={() => blocker.state === "blocked" && blocker.reset()}
                            itemName={resourceName.toLowerCase()}
                            changeCount={pendingChanges.length}
                            changes={pendingChanges}
                            onConfirm={() => {
                                blocker.state === "blocked" && blocker.proceed();
                                setIsDirty(false);
                                setPendingChanges([]);
                            }}
                        />
                    </>
                )}
            </div>
        );
    };

    return selectedItem ? renderSplitView() : renderFullTable();
}
