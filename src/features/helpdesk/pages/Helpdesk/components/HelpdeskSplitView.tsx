import React, { useCallback, useMemo } from 'react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { StatsRow } from '@/components/common/StatsRow';
import { Cell, FieldGrid, FieldLabel, SectionLabel } from '@/components/common/DetailsLayout';
import { CheckCircle, Inbox, LifeBuoy, Mail, MessageSquare, Phone } from 'lucide-react';
import { dateFormatTo } from '@/utils/date';
import { cn } from '@/utils/cn';
import type { SupportQuery } from '../../../store/api';

interface HelpdeskSplitViewProps {
    queries: SupportQuery[];
    loading: boolean;
    selectedQuery: SupportQuery | null;
    setSelectedQuery: (query: SupportQuery | null) => void;
    onResolve: (query: SupportQuery) => void;
}

const formatDateTime = (date?: string | number | null) => (date ? dateFormatTo(date, 'dd MMM yyyy, hh:mm a') : '-');

const QueryStatusBadge = ({ status, className }: { status: SupportQuery['status']; className?: string }) => (
    <StatusBadge
        status={status === 'OPEN' ? 'Open' : 'Resolved'}
        variant={status === 'OPEN' ? 'info' : 'success'}
        className={className}
    />
);

export const HelpdeskSplitView: React.FC<HelpdeskSplitViewProps> = ({
    queries,
    loading,
    selectedQuery,
    setSelectedQuery,
    onResolve
}) => {
    const columns = [
        {
            header: 'Subject',
            accessorKey: 'subject',
            className: 'w-[35%] min-w-[220px] py-1.5 px-4 text-left',
            render: (item: SupportQuery) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-bold text-slate-700 dark:text-slate-200 truncate max-w-[360px]" title={item.subject || item.message}>
                        {item.subject || item.message}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">{item.referenceId}</span>
                </div>
            )
        },
        {
            header: 'Customer',
            accessorKey: 'name',
            className: 'w-[25%] min-w-[180px] py-1.5 px-4 text-left',
            render: (item: SupportQuery) => (
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                        {item.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-300 truncate">{item.name}</span>
                        <span className="text-[11px] text-slate-400 truncate">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Received',
            accessorKey: 'createdOn',
            className: 'w-[20%] min-w-[150px] py-1.5 px-4 text-left text-[12.5px] text-slate-500 dark:text-slate-400',
            render: (item: SupportQuery) => formatDateTime(item.createdOn)
        },
        {
            header: 'Status',
            accessorKey: 'status',
            preventRowClick: true,
            className: 'w-[20%] min-w-[150px] py-1.5 px-4 text-left',
            render: (item: SupportQuery) => (
                <div className="flex items-center gap-2">
                    <QueryStatusBadge status={item.status} />
                    {item.status === 'OPEN' && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onResolve(item); }}
                            className="text-[11.5px] font-semibold text-[var(--accent)] hover:underline"
                        >
                            Resolve
                        </button>
                    )}
                </div>
            )
        }
    ];

    const renderListItem = useCallback((item: SupportQuery, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                isSelected
                    ? "bg-[var(--accent-light)]"
                    : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
            )}
        >
            <div className={cn(
                "absolute left-2 w-1 h-8 rounded-r-md transition-all duration-300",
                isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
            )} />
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 shrink-0">
                <MessageSquare size={20} />
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{item.subject || item.message}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate">
                    {item.name} • {formatDateTime(item.createdOn)}
                </div>
            </div>
            <QueryStatusBadge status={item.status} className="scale-75 origin-right" />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((item: SupportQuery) => {
        if (!item) return null;
        const replySubject = encodeURIComponent(`Re: ${item.subject || 'Your support query'} [${item.referenceId}]`);
        return (
            <div className="space-y-6 pb-20 pt-2">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                            <LifeBuoy size={24} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-1 break-words">
                                {item.subject || 'No subject'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">{item.referenceId}</span>
                                <QueryStatusBadge status={item.status} />
                            </div>
                        </div>
                    </div>
                    {item.status === 'OPEN' && (
                        <button
                            onClick={() => onResolve(item)}
                            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent)] text-white text-[12.5px] font-semibold hover:opacity-90 transition-opacity"
                        >
                            <CheckCircle size={14} />
                            Mark resolved
                        </button>
                    )}
                </div>

                <div>
                    <SectionLabel>Message</SectionLabel>
                    <p className="mt-2 text-[13.5px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words bg-slate-50 dark:bg-gray-900/40 p-4 rounded-xl border border-slate-100 dark:border-gray-800">
                        {item.message}
                    </p>
                </div>

                <div>
                    <SectionLabel>Customer</SectionLabel>
                    <FieldGrid>
                        <Cell>
                            <FieldLabel>Name</FieldLabel>
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                        </Cell>
                        <Cell>
                            <FieldLabel>Email</FieldLabel>
                            <a
                                href={`mailto:${item.email}?subject=${replySubject}`}
                                className="text-[13px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1.5 break-all"
                            >
                                <Mail size={13} className="shrink-0" />
                                {item.email}
                            </a>
                        </Cell>
                        <Cell>
                            <FieldLabel>Phone</FieldLabel>
                            {item.phone ? (
                                <a
                                    href={`tel:${item.phone}`}
                                    className="text-[13px] font-semibold text-[var(--accent)] hover:underline inline-flex items-center gap-1.5"
                                >
                                    <Phone size={13} className="shrink-0" />
                                    {item.phone}
                                </a>
                            ) : (
                                <p className="text-[13px] text-slate-400 italic">Not provided</p>
                            )}
                        </Cell>
                    </FieldGrid>
                </div>

                <div>
                    <SectionLabel>Timeline</SectionLabel>
                    <FieldGrid>
                        <Cell>
                            <FieldLabel>Received</FieldLabel>
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{formatDateTime(item.createdOn)}</p>
                        </Cell>
                        <Cell>
                            <FieldLabel>Resolved</FieldLabel>
                            <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-100">{formatDateTime(item.resolvedOn)}</p>
                        </Cell>
                    </FieldGrid>
                </div>
            </div>
        );
    }, [onResolve]);

    const renderStatsRow = useMemo(() => () => {
        const open = queries.filter(q => q.status === 'OPEN').length;
        return (
            <StatsRow stats={[
                {
                    icon: <Inbox size={18} style={{ color: 'var(--accent)' }} />,
                    iconBg: 'var(--accent-light)',
                    value: queries.length,
                    label: 'Total Queries',
                },
                {
                    icon: <MessageSquare size={18} className="text-indigo-600 dark:text-indigo-400" />,
                    iconBg: 'rgba(99, 102, 241, 0.12)',
                    value: open,
                    label: 'Open',
                },
                {
                    icon: <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />,
                    iconBg: 'rgba(16, 185, 129, 0.12)',
                    value: queries.length - open,
                    label: 'Resolved',
                },
            ]} />
        );
    }, [queries]);

    const customFilter = useCallback((item: SupportQuery, activeFilters: Record<string, string[]>) => {
        if (activeFilters.status && activeFilters.status.length > 0) {
            return activeFilters.status.includes(item.status);
        }
        return true;
    }, []);

    const customSearch = useCallback((item: SupportQuery, search: string) => {
        const s = search.toLowerCase();
        return [item.referenceId, item.subject, item.message, item.name, item.email, item.phone]
            .some(v => v?.toLowerCase().includes(s));
    }, []);

    return (
        <CrudSplitViewLayout
            data={queries}
            loading={loading}
            resourceName="Query"
            resourceNamePlural="Queries"
            selectedItem={selectedQuery}
            onSelectItem={setSelectedQuery}
            columns={columns}
            keyExtractor={(item: SupportQuery) => item.id}
            renderListItem={renderListItem}
            tabs={[{ id: 'details', label: 'Query Details' }]}
            renderDetailsPanel={renderDetailsPanel}
            renderStatsRow={renderStatsRow}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Open', value: 'OPEN' },
                        { id: '2', label: 'Resolved', value: 'RESOLVED' },
                    ]
                }
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            emptyStateIcon="💬"
        />
    );
};
