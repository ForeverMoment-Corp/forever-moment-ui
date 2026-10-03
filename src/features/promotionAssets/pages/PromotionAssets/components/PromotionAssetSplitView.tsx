import { useCallback, useMemo } from 'react';
import { CalendarClock, ImageIcon, Megaphone, PauseCircle, Radio } from 'lucide-react';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import type { FilterCategory } from '@/components/common/Filter';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { StatsRow } from '@/components/common/StatsRow';
import { StatusBadge } from '@/components/common/StatusBadge';
import { TABS } from '@/config/constants';
import { cn } from '@/utils/cn';
import type { PromotionAssetPayload, PromotionAssetType } from '@/features/promotionAssets/store/action-types';
import {
    SCHEDULE_BADGE_VARIANT,
    SCHEDULE_LABEL,
    SCHEDULE_STATES,
    describeWindow,
    getScheduleState,
    thumbSrc,
    toPayload,
} from '@/features/promotionAssets/store/utils';
import { PromotionAssetDetails } from './PromotionAssetDetails';
import { PromotionAssetImage } from './PromotionAssetImage';

interface PromotionAssetSplitViewProps {
    assets: PromotionAssetType[];
    loading: boolean;
    selectedAsset: PromotionAssetType | null;
    setSelectedAsset: (asset: PromotionAssetType | null) => void;
    handleOpenModal: (asset?: PromotionAssetType) => void;
    handleDeleteClick: (asset: PromotionAssetType) => void;
    updatePromotionAsset: (id: number, data: PromotionAssetPayload) => Promise<any>;
    availableImages: any[];
    imagesLoading?: boolean;
    getImages: () => void;
}

const labelOf = (a: PromotionAssetType) => a.title || a.fileName || `Asset #${a.id}`;

const renderThumb = (a: PromotionAssetType, sizeClass: string) => {
    const src = thumbSrc(a);
    return (
        <div className={cn(
            sizeClass,
            'rounded-[6px] overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700 bg-[#f4f6f8] dark:bg-slate-800 flex items-center justify-center'
        )}>
            {src
                ? <img src={src} alt={a.altTextOverride || labelOf(a)} loading="lazy" className="h-full w-full object-cover" />
                : <ImageIcon size={14} className="text-slate-400" />}
        </div>
    );
};

const renderScheduleBadge = (a: PromotionAssetType) => {
    const state = getScheduleState(a);
    return <StatusBadge status={SCHEDULE_LABEL[state]} variant={SCHEDULE_BADGE_VARIANT[state]} />;
};

export const PromotionAssetSplitView = ({
    assets,
    loading,
    selectedAsset,
    setSelectedAsset,
    handleOpenModal,
    handleDeleteClick,
    updatePromotionAsset,
    availableImages,
    imagesLoading,
    getImages,
}: PromotionAssetSplitViewProps) => {

    const columns = [
        {
            header: 'Asset',
            className: 'w-[34%] min-w-[220px] px-3 text-left font-semibold text-slate-900 dark:text-white',
            render: (a: PromotionAssetType) => (
                <div className="flex items-center gap-3">
                    {renderThumb(a, 'h-10 w-16')}
                    <div className="min-w-0">
                        <div className="text-[13.5px] font-semibold truncate">{labelOf(a)}</div>
                        <div className="text-[11.5px] text-slate-500 font-mono truncate mt-0.5">{a.promoKey}</div>
                    </div>
                </div>
            ),
        },
        {
            header: 'Placement',
            className: 'w-[14%] min-w-[120px] px-3 text-left',
            render: (a: PromotionAssetType) => (
                <span className="inline-flex px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-300 text-[12px] font-medium">
                    {a.placement}
                </span>
            ),
        },
        {
            header: 'Window',
            className: 'w-[24%] min-w-[200px] px-3 text-left',
            render: (a: PromotionAssetType) => (
                <div className="flex items-center gap-2 text-[12.5px] text-slate-600 dark:text-slate-300">
                    {renderScheduleBadge(a)}
                    <span className="truncate">{describeWindow(a)}</span>
                </div>
            ),
        },
        {
            header: 'Priority',
            className: 'w-[8%] min-w-[80px] px-3 text-left',
            render: (a: PromotionAssetType) => (
                <span className="font-medium text-slate-700 dark:text-slate-300">{a.priority ?? 100}</span>
            ),
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[12%] min-w-[120px] px-3 text-left',
            render: (a: PromotionAssetType) => (
                <EditableStatusBadge
                    status={a.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={(val) => updatePromotionAsset(a.id, toPayload(a, { isActive: val === 'Active' }))}
                />
            ),
        },
        {
            header: '',
            preventRowClick: true,
            className: 'w-[8%] min-w-[80px] px-3 text-right',
            render: (a: PromotionAssetType) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(a)}
                        onDelete={() => handleDeleteClick(a)}
                    />
                </div>
            ),
        },
    ];

    const renderListItem = useCallback((a: PromotionAssetType, isSelected: boolean) => {
        const state = getScheduleState(a);
        return (
            <div
                className={cn(
                    'flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group relative',
                    isSelected ? 'bg-[var(--accent-light)]' : 'hover:bg-slate-50 dark:hover:bg-gray-800/50 transparent'
                )}
            >
                <div className={cn(
                    'absolute left-0 w-1 h-8 rounded-r-md transition-all duration-300',
                    isSelected ? 'bg-[var(--accent)] opacity-100' : 'opacity-0'
                )} />
                <div className="ml-1">{renderThumb(a, 'h-9 w-14')}</div>
                <div className="flex-1 min-w-0">
                    <div className={cn(
                        'font-semibold text-[13.5px] truncate mb-0.5 transition-colors',
                        isSelected ? 'text-[var(--accent)]' : 'text-slate-900 dark:text-slate-100 group-hover:text-[var(--accent)]'
                    )}>
                        {labelOf(a)}
                    </div>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate font-mono">{a.promoKey} · {a.placement}</p>
                        <div className={cn(
                            'w-2 h-2 rounded-full shrink-0 shadow-sm',
                            state === 'live' ? 'bg-emerald-500'
                                : state === 'scheduled' ? 'bg-indigo-500'
                                : state === 'expired' ? 'bg-orange-400'
                                : 'bg-slate-300 dark:bg-slate-600'
                        )} />
                    </div>
                </div>
            </div>
        );
    }, []);

    const renderDetailsPanel = useCallback((asset: PromotionAssetType, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <div className="pt-2">
                    <PromotionAssetDetails
                        asset={asset}
                        updatePromotionAsset={updatePromotionAsset}
                        onDirtyChange={dirtyState.handleDirtyChange}
                    />
                </div>
            );
        }
        if (activeTab === TABS.IMAGES.id) {
            return (
                <div className="pt-2">
                    <PromotionAssetImage
                        asset={asset}
                        availableImages={availableImages}
                        imagesLoading={imagesLoading}
                        getImages={getImages}
                        updatePromotionAsset={updatePromotionAsset}
                    />
                </div>
            );
        }
        return null;
    }, [updatePromotionAsset, availableImages, imagesLoading, getImages]);

    const placementOptions = useMemo(() => {
        const unique = Array.from(new Set((assets || []).map((a) => a.placement).filter(Boolean))).sort();
        return unique.map((p, i) => ({ id: String(i + 1), label: p, value: p }));
    }, [assets]);

    const filterConfig = useMemo<FilterCategory[]>(() => {
        const config: FilterCategory[] = [
            {
                id: 'state',
                name: 'Schedule',
                options: SCHEDULE_STATES.map((s, i) => ({ id: String(i + 1), label: SCHEDULE_LABEL[s], value: s })),
            },
        ];
        if (placementOptions.length > 1) {
            config.push({ id: 'placement', name: 'Placement', options: placementOptions });
        }
        return config;
    }, [placementOptions]);

    const customFilter = useCallback((a: PromotionAssetType, activeFilters: Record<string, string[]>) => {
        if (activeFilters.state?.length && !activeFilters.state.includes(getScheduleState(a))) return false;
        if (activeFilters.placement?.length && !activeFilters.placement.includes(a.placement)) return false;
        return true;
    }, []);

    const customSearch = useCallback((a: PromotionAssetType, search: string) => {
        const s = search.toLowerCase();
        return [a.title, a.promoKey, a.placement, a.fileName]
            .some((v) => Boolean(v && v.toLowerCase().includes(s)));
    }, []);

    const renderStatsRow = useCallback(() => {
        const list = assets || [];
        const count = (state: string) => list.filter((a) => getScheduleState(a) === state).length;
        return (
            <StatsRow
                stats={[
                    { icon: <Megaphone size={18} className="text-violet-600" />, iconBg: '#ede9fe', value: list.length, label: 'Total assets' },
                    { icon: <Radio size={18} className="text-emerald-600" />, iconBg: '#d1fae5', value: count('live'), label: 'Live now' },
                    { icon: <CalendarClock size={18} className="text-indigo-600" />, iconBg: '#e0e7ff', value: count('scheduled'), label: 'Scheduled' },
                    { icon: <PauseCircle size={18} className="text-slate-500" />, iconBg: '#f1f5f9', value: count('expired') + count('inactive'), label: 'Expired or inactive' },
                ]}
            />
        );
    }, [assets]);

    return (
        <CrudSplitViewLayout<PromotionAssetType>
            data={assets || []}
            loading={loading}
            resourceName="Promotion Asset"
            resourceNamePlural="Promotion Assets"
            selectedItem={selectedAsset}
            onSelectItem={setSelectedAsset}
            columns={columns}
            keyExtractor={(item) => item.id}
            renderListItem={renderListItem}
            tabs={[
                { id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort },
                { id: TABS.IMAGES.id, label: 'Image' },
            ]}
            renderDetailsPanel={renderDetailsPanel}
            filterConfig={filterConfig}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
            emptyStateIcon="📣"
            renderStatsRow={renderStatsRow}
        />
    );
};
