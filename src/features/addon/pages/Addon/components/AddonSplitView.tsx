import { useCallback } from 'react';
import { AddonDetails } from './AddonDetails';
import { AddonImage, thumbSrc } from './AddonImage';
import { EditableTitle } from '@/components/common/EditableTitle';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { ImageIcon } from 'lucide-react';
import type { AddonType } from '@/features/addon/store/action-types';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';

export const AddonSplitView = ({
    addons,
    handleOpenModal,
    handleDeleteClick,
    selectedAddon,
    setSelectedAddon,
    loading,
    updateAddon,
    uploadAddonImage,
    removeAddonImage
}: any) => {

    // Every PUT rewrites the media association from `mediaId`, so inline edits must carry it
    // through or an uploaded image would be silently detached.
    const buildPayload = (a: AddonType, overrides: Partial<AddonType>) => ({
        name: a.name,
        description: a.description,
        basePrice: a.basePrice,
        isActive: a.isActive,
        icon: a.icon,
        mediaId: a.mediaId ?? null,
        ...overrides,
    });

    const renderThumb = (a: AddonType, sizeClass: string) => {
        const src = thumbSrc(a);
        return (
            <div className={cn(
                sizeClass,
                "rounded-[6px] overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700 bg-[#f4f6f8] dark:bg-slate-800 flex items-center justify-center"
            )}>
                {src ? (
                    <img src={src} alt={a.name || ''} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                    <ImageIcon size={14} className="text-slate-400" />
                )}
            </div>
        );
    };

    const columns = [
        {
            header: 'Name',
            className: 'w-[45%] min-w-[200px] px-3 text-left font-semibold text-slate-900 dark:text-white',
            render: (a: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${a.id}`}
                    </div>
                    {renderThumb(a, 'h-9 w-9')}
                    <div>
                        <EditableTitle
                            value={a.name || '-'}
                            onChange={(val) => updateAddon(a.id, buildPayload(a, { name: val }))}
                        />
                        {a.description && <p className="text-xs text-slate-500 font-normal truncate mt-0.5 max-w-[250px]">{a.description}</p>}
                    </div>
                </div>
            )
        },
        {
            header: 'Base Price',
            className: 'w-[20%] min-w-[120px] px-3 text-left',
            render: (a: any) => (
                <span className="font-medium text-slate-700 dark:text-slate-300">₹{a.basePrice || 0}</span>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[120px] px-3 text-left',
            render: (a: any) => (
                <EditableStatusBadge
                    status={a.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={(val) => updateAddon(a.id, buildPayload(a, { isActive: val === 'Active' }))}
                />
            )
        },
        {
            header: '',
            preventRowClick: true,
            className: 'w-[10%] min-w-[80px] px-3 text-right',
            render: (a: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(a)}
                        onDelete={() => handleDeleteClick(a)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((a: AddonType, isSelected: boolean) => {
        return (
            <div
                className={cn(
                    "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative",
                    isSelected
                        ? "bg-[var(--accent-light)]"
                        : "hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent"
                )}
            >
                <div className={cn(
                    "absolute left-0 w-1 h-8 rounded-r-md transition-all duration-300",
                    isSelected ? "bg-[var(--accent)] opacity-100" : "opacity-0"
                )} />
                <div className={cn(
                    "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 ml-1",
                    "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                )}>
                    <span className="text-[12px] leading-none">📝</span>
                    {`${ITEM_ID_PREFIX}-${a.id}`}
                </div>
                {renderThumb(a, 'h-9 w-9')}
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                        isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-slate-100 group-hover:text-[var(--accent)]"
                    )}>
                        {a.name || '-'}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                            ₹{a.basePrice || 0}
                        </p>
                        <div className={cn(
                            "w-2 h-2 rounded-full shrink-0 shadow-sm",
                            a.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                        )} />
                    </div>
                </div>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((addon: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <div className="pt-2">
                    <AddonDetails
                        addon={addon}
                        updateAddon={updateAddon}
                        onDirtyChange={dirtyState.handleDirtyChange}
                    />
                </div>
            );
        }
        if (activeTab === TABS.IMAGES.id) {
            return (
                <div className="pt-2">
                    <AddonImage
                        addon={addon}
                        uploadAddonImage={uploadAddonImage}
                        removeAddonImage={removeAddonImage}
                    />
                </div>
            );
        }
        return null;
    }, [updateAddon, uploadAddonImage, removeAddonImage]);

    const customFilter = useCallback((a: AddonType, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = a.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }
        return matchStatus;
    }, []);

    const customSearch = useCallback((a: AddonType, search: string) => {
        return Boolean(a.name && a.name.toLowerCase().includes(search.toLowerCase()));
    }, []);

    return (
        <CrudSplitViewLayout
            data={addons || []}
            loading={loading}
            resourceName="Addon"
            selectedItem={selectedAddon}
            onSelectItem={setSelectedAddon}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[
                { id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort },
                { id: TABS.IMAGES.id, label: TABS.IMAGES.label },
            ]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={[
                {
                    id: 'status',
                    name: 'Status',
                    options: [
                        { id: '1', label: 'Active', value: 'true' },
                        { id: '2', label: 'Inactive', value: 'false' },
                    ]
                }
            ]}
            customFilter={customFilter as any}
            customSearch={customSearch as any}
            onAdd={() => handleOpenModal()}
        />
    );
};
