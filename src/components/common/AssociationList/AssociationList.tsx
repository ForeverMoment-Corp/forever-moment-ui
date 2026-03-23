import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import type { LucideIcon } from 'lucide-react';
import styles from './AssociationList.module.css';

type FilterMode = 'all' | 'attached' | 'unattached';

export interface AssociationListProps {
    items: any[];
    assignedIds: number[];
    onToggle: (id: number, isCurrentlyAssigned: boolean) => void;
    icon: LucideIcon;
    renderLabel: (item: any) => { title: string; subtitle: string };
    searchPlaceholder?: string;
    searchFilter?: (item: any, query: string) => boolean;
    emptyLabel?: string;
    entityName?: string;
}

const defaultSearch = (item: any, query: string) =>
    item.name?.toLowerCase().includes(query.toLowerCase());

export const AssociationList: React.FC<AssociationListProps> = ({
    items,
    assignedIds,
    onToggle,
    icon: Icon,
    renderLabel,
    searchPlaceholder = 'Search...',
    searchFilter = defaultSearch,
    emptyLabel = 'No items found.',
    entityName = 'items',
}) => {
    const [search, setSearch] = useState('');
    const [filterMode, setFilterMode] = useState<FilterMode>('all');

    const attachedCount = useMemo(
        () => items?.filter((item) => assignedIds.includes(item.id)).length ?? 0,
        [items, assignedIds]
    );

    const filtered = useMemo(() => {
        let list = items ?? [];

        // search
        if (search) {
            list = list.filter((item) => searchFilter(item, search));
        }

        // filter mode
        if (filterMode === 'attached') {
            list = list.filter((item) => assignedIds.includes(item.id));
        } else if (filterMode === 'unattached') {
            list = list.filter((item) => !assignedIds.includes(item.id));
        }

        // sort: attached items first
        return [...list].sort((a, b) => {
            const aAttached = assignedIds.includes(a.id) ? 0 : 1;
            const bAttached = assignedIds.includes(b.id) ? 0 : 1;
            return aAttached - bAttached;
        });
    }, [items, search, filterMode, assignedIds, searchFilter]);

    const filters: { mode: FilterMode; label: string }[] = [
        { mode: 'all', label: 'All' },
        { mode: 'attached', label: 'Attached' },
        { mode: 'unattached', label: 'Unattached' },
    ];

    return (
        <div className="flex flex-col h-full gap-3">
            {/* Stats + filter pills */}
            <div className={styles.statsBar}>
                <span className={styles.statsText}>
                    <strong>{attachedCount}</strong> attached · <strong>{items?.length ?? 0}</strong> total {entityName}
                </span>
                <div className={styles.filterPills}>
                    {filters.map((f) => (
                        <button
                            key={f.mode}
                            type="button"
                            className={filterMode === f.mode ? styles.filterPillActive : styles.filterPill}
                            onClick={() => setFilterMode(f.mode)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Search */}
            <SearchBar
                className="w-full"
                inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder={searchPlaceholder}
                value={search}
                onChange={setSearch}
            />

            {/* List */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2 pb-20">
                {filtered.map((item) => {
                    const isAssigned = assignedIds.includes(item.id);
                    const { title, subtitle } = renderLabel(item);

                    return (
                        <div
                            key={item.id}
                            className={isAssigned ? styles.itemRowAttached : styles.itemRow}
                        >
                            <div className={styles.itemInfo}>
                                <div className={isAssigned ? styles.itemIconAttached : styles.itemIconDefault}>
                                    <Icon size={16} />
                                </div>
                                <div className="min-w-0">
                                    <p className={styles.itemTitle}>{title}</p>
                                    <p className={styles.itemSubtitle}>{subtitle}</p>
                                </div>
                            </div>

                            <button
                                type="button"
                                className={isAssigned ? styles.toggleOn : styles.toggle}
                                onClick={() => onToggle(item.id, isAssigned)}
                                aria-label={isAssigned ? `Detach ${title}` : `Attach ${title}`}
                            />
                        </div>
                    );
                })}

                {filtered.length === 0 && (
                    <div className={styles.emptyState}>
                        <Icon size={32} className={styles.emptyIcon} />
                        <p className={styles.emptyText}>{emptyLabel}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
