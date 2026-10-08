import { useMemo, useCallback } from 'react';
import { Sparkles, CheckCircle2, Star, BarChart2 } from 'lucide-react';
import { getExperienceTabs } from './ExperienceDetails';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { EditableFeatureBadge } from '@/components/common/EditableFeatureBadge';
import { RowActions } from '@/components/common/RowActions';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { StatsRow } from '@/components/common/StatsRow';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';
import type { ExperienceType } from './Experience';

interface ExperienceSplitViewProps {
    experiences: ExperienceType[];
    handleOpenModal: (exp?: ExperienceType | null) => void;
    handleDeleteClick: (id: number) => void;
    selectedExperience: ExperienceType | null;
    setSelectedExperience: (exp: ExperienceType | null) => void;
    loading: boolean;
    experienceDetail: any;
    inclusions: any[];
    cancellationPolicies: any[];
    subCategories: any[];
    toggleCancellationPolicy: (experienceId: number, policyId: number, isAssociate: boolean) => Promise<any>;
    toggleInclusion: (experienceId: number, inclusionId: number, isAssociate: boolean) => Promise<any>;
    updateExperience: (id: number, data: any) => Promise<any>;
    handleDragReorder: (newOrder: ExperienceType[], activeId: string | number, overId: string | number) => void;
    locations: any[];
    onAssociateLocation: (experienceId: number, locationId: number, data: any) => void;
    onUpdateLocation: (experienceId: number, locationId: number, data: any) => void;
    onDisassociateLocation: (experienceId: number, locationId: number) => void;
    onToggleExperienceLocation: (experienceId: number, locationId: number, mapperId: number) => void;
    onAssociateLocationTimeSlot: (experienceId: number, locationId: number, timeSlotId: number, data: any) => void;
    onUpdateLocationTimeSlot: (experienceId: number, locationId: number, timeSlotId: number, data: any) => void;
    onDisassociateLocationTimeSlot: (experienceId: number, locationId: number, timeSlotId: number) => void;
    onBulkAttachLocationTimeSlots: (experienceId: number, locationId: number, data: any) => void;
    onToggleLocationTimeSlot: (experienceId: number, locationId: number, mapperId: number) => void;
    addons: any[];
    toggleAddon: (experienceId: number, addonId: number, isAssociate: boolean, data?: any) => Promise<any>;
    experienceAddons: any[];
    addonsLoading?: boolean;
    getExperienceAddons: (experienceId: number) => Promise<any>;
    slots: any[];
    toggleExperienceActive: (id: number) => Promise<any>;
    toggleExperienceFeatured: (id: number) => Promise<any>;
    images: any[];
    getImages: () => void;
    experienceMedia: any[];
    getExperienceMedia: (experienceId: number) => Promise<any>;
    bulkAttachMedia: (experienceId: number, data: any) => Promise<any>;
    disassociateMedia: (experienceId: number, mediaId: number) => Promise<any>;
    setPrimaryMedia: (experienceId: number, mediaId: number, current?: any) => Promise<any>;
    updateMediaAttachment: (experienceId: number, mediaId: number, data: any) => Promise<any>;
    toggleMediaActive: (experienceId: number, mapperId: number) => Promise<any>;
    uploadExperienceMedia?: (experienceId: number, file: File, attach?: any, metadata?: Record<string, any>, refresh?: boolean) => Promise<any>;
    showStats?: boolean;
    promotions: any[];
    experiencePromotions: any[];
    promotionsLoading: boolean;
    getExperiencePromotions: (experienceId: number) => Promise<any>;
    togglePromotion: (experienceId: number, couponId: number, isAssociate: boolean) => Promise<any>;
}

export const ExperienceSplitView = ({
    experiences,
    handleOpenModal,
    handleDeleteClick,
    selectedExperience,
    setSelectedExperience,
    loading,
    experienceDetail,
    inclusions,
    cancellationPolicies,
    subCategories,
    toggleCancellationPolicy,
    toggleInclusion,
    updateExperience,
    handleDragReorder,
    locations,
    onAssociateLocation,
    onUpdateLocation,
    onDisassociateLocation,
    onToggleExperienceLocation,
    onAssociateLocationTimeSlot,
    onUpdateLocationTimeSlot,
    onDisassociateLocationTimeSlot,
    onBulkAttachLocationTimeSlots,
    onToggleLocationTimeSlot,
    addons,
    toggleAddon,
    experienceAddons,
    addonsLoading,
    getExperienceAddons,
    slots,
    toggleExperienceActive,
    toggleExperienceFeatured,
    images,
    getImages,
    experienceMedia,
    getExperienceMedia,
    bulkAttachMedia,
    disassociateMedia,
    setPrimaryMedia,
    updateMediaAttachment,
    toggleMediaActive,
    uploadExperienceMedia,
    showStats = true,
    promotions,
    experiencePromotions,
    promotionsLoading,
    getExperiencePromotions,
    togglePromotion,
}: ExperienceSplitViewProps) => {

    const columns = [
        {
            accessorKey: 'name',
            className: 'px-3 text-left font-semibold text-slate-900 dark:text-white',
            render: (exp: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${exp.id}`}
                    </div>
                    <div>
                        <div className="font-semibold text-[13.5px] text-slate-800 dark:text-slate-100 leading-tight">{exp.name}</div>
                        {exp.subCategoryName && (
                            <div className="text-[11.5px] text-slate-400 dark:text-slate-500 mt-0.5">{exp.subCategoryName}</div>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: 'Price',
            accessorKey: 'basePrice',
            className: 'px-3 text-right',
            render: (exp: any) => (
                <div className="text-right">
                    <span className="font-semibold text-[14px] text-slate-800 dark:text-slate-100">₹{(exp.basePrice || 0).toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-slate-400 ml-1">/ event</span>
                </div>
            )
        },
        {
            header: 'Featured',
            accessorKey: 'isFeatured',
            preventRowClick: true,
            className: 'px-3 text-center',
            render: (exp: any) => (
                <EditableFeatureBadge
                    isFeatured={exp.isFeatured}
                    onChange={async (val) => {
                        if (val === exp.isFeatured) return;
                        try { await toggleExperienceFeatured(exp.id); }
                        catch (e) { console.error('Failed to update featured status', e); }
                    }}
                />
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'px-3 text-center',
            render: (exp: any) => (
                <EditableStatusBadge
                    status={exp.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === exp.isActive) return;
                        try { await toggleExperienceActive(exp.id); }
                        catch (e) { console.error(e); }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'px-3 text-right',
            render: (exp: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(exp)}
                        onDelete={() => handleDeleteClick(exp.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((exp: any, isSelected: boolean) => (
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
            <div className={cn(
                "h-7 px-2 min-w-[40px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0 ml-1",
                "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
            )}>
                <span className="text-[12px] leading-none">📝</span>
                {`${ITEM_ID_PREFIX}-${exp.id}`}
            </div>
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors leading-tight",
                    isSelected ? "text-[var(--accent)]" : "text-slate-800 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{exp.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    ₹{(exp.basePrice || 0).toLocaleString('en-IN')}
                </div>
            </div>
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0 shadow-sm",
                exp.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            )} />
        </div>
    ), []);

    const tabsData = useMemo(() => [
        { id: TABS.GENERAL.id, label: TABS.GENERAL.label },
        { id: TABS.INCLUSIONS.id, label: TABS.INCLUSIONS.label },
        { id: TABS.LOCATIONS.id, label: TABS.LOCATIONS.label },
        { id: TABS.POLICIES.id, label: TABS.POLICIES.label },
        { id: TABS.ADDONS.id, label: TABS.ADDONS.label },
        { id: TABS.IMAGES.id, label: TABS.IMAGES.label },
        { id: TABS.PROMOTIONS.id, label: TABS.PROMOTIONS.label }
    ], []);

    const renderDetailsPanel = useCallback((_exp: any, activeTab: string, dirtyState: any) => {
        if (!_exp) return null;

        const tabs = getExperienceTabs({
            experience: {
                ..._exp,
                title: _exp.name,
                price: `₹${_exp.basePrice || 0}`,
                status: _exp.isActive ? 'Active' : 'Inactive'
            },
            experienceDetail,
            inclusions,
            cancellationPolicies,
            subCategories,
            onToggleCancellationPolicy: (policyId: number, isAssociate: boolean) => {
                return toggleCancellationPolicy(_exp.id, policyId, isAssociate);
            },
            onToggleInclusion: (inclusionId: number, isAssociate: boolean) => {
                return toggleInclusion(_exp.id, inclusionId, isAssociate);
            },
            onAssociateLocation: (locationId: number, data: any) => {
                onAssociateLocation(_exp.id, locationId, data);
            },
            onUpdateLocation: (locationId: number, data: any) => {
                onUpdateLocation(_exp.id, locationId, data);
            },
            onDisassociateLocation: (locationId: number) => {
                onDisassociateLocation(_exp.id, locationId);
            },
            onToggleExperienceLocation: (locationId: number, mapperId: number) => {
                onToggleExperienceLocation(_exp.id, locationId, mapperId);
            },
            onAssociateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => {
                onAssociateLocationTimeSlot(_exp.id, locationId, timeSlotId, data);
            },
            onUpdateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => {
                onUpdateLocationTimeSlot(_exp.id, locationId, timeSlotId, data);
            },
            onDisassociateLocationTimeSlot: (locationId: number, timeSlotId: number) => {
                onDisassociateLocationTimeSlot(_exp.id, locationId, timeSlotId);
            },
            onBulkAttachLocationTimeSlots: (locationId: number, data: any) => {
                onBulkAttachLocationTimeSlots(_exp.id, locationId, data);
            },
            onToggleLocationTimeSlot: (locationId: number, mapperId: number) => {
                onToggleLocationTimeSlot(_exp.id, locationId, mapperId);
            },
            updateExperience,
            onToggleAddon: (addonId: number, isAssociate: boolean, data?: any) => {
                return toggleAddon(_exp.id, addonId, isAssociate, data);
            },
            experienceAddons,
            addonsLoading,
            getExperienceAddons,
            getExperienceMedia,
            bulkAttachMedia,
            disassociateMedia,
            setPrimaryMedia,
            updateMediaAttachment,
            toggleMediaActive,
            uploadExperienceMedia,
            locations,
            addons,
            slots,
            images,
            getImages,
            experienceMedia,
            promotions,
            experiencePromotions,
            promotionsLoading,
            getExperiencePromotions,
            onTogglePromotion: (couponId: number, isAssociate: boolean) => {
                return togglePromotion(_exp.id, couponId, isAssociate);
            },
            onDirtyChange: dirtyState.handleDirtyChange
        });
        return tabs.find(t => t.id === activeTab)?.content || null;
    }, [
        experienceDetail, inclusions, cancellationPolicies, subCategories, locations, addons, slots, images, experienceMedia,
        promotions, experiencePromotions, promotionsLoading,
        toggleCancellationPolicy, toggleInclusion, updateExperience, onAssociateLocation, onUpdateLocation, onDisassociateLocation,
        onToggleExperienceLocation, onAssociateLocationTimeSlot, onUpdateLocationTimeSlot, onDisassociateLocationTimeSlot,
        onBulkAttachLocationTimeSlots, onToggleLocationTimeSlot, toggleAddon, experienceAddons, addonsLoading, getExperienceAddons, getExperienceMedia, bulkAttachMedia, disassociateMedia,
        setPrimaryMedia, updateMediaAttachment, toggleMediaActive, uploadExperienceMedia, getImages, getExperiencePromotions, togglePromotion
    ]);

    const customFilter = useCallback((exp: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = exp.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        return matchStatus;
    }, []);

    const customSearch = useCallback((exp: any, search: string) => {
        return exp.name && exp.name.toLowerCase().includes(search.toLowerCase());
    }, []);

    const renderStatsRow = useMemo(() => () => {
        const exps = experiences || [];
        const total = exps.length;
        const active = exps.filter((e: any) => e.isActive).length;
        const featured = exps.filter((e: any) => e.isFeatured).length;
        const totalValue = exps.reduce((sum: number, e: any) => sum + (Number(e.basePrice) || 0), 0);

        const cards = [
            {
                icon: <Sparkles size={18} style={{ color: 'var(--accent)' }} />,
                iconBg: 'var(--accent-light)',
                value: total,
                label: 'Total Experiences',
            },
            {
                icon: <CheckCircle2 size={18} color="#12b76a" />,
                iconBg: '#ecfdf3',
                value: active,
                label: 'Active',
            },
            {
                icon: <Star size={18} color="#f5a623" />,
                iconBg: '#fff8ec',
                value: featured,
                label: 'Featured',
            },
            {
                icon: <BarChart2 size={18} color="#f04438" />,
                iconBg: '#fef3f2',
                value: `₹${totalValue.toLocaleString('en-IN')}`,
                label: 'Total Value',
            },
        ];

        return <StatsRow stats={cards} />;
    }, [experiences]);

    return (
        <CrudSplitViewLayout
            data={experiences || []}
            loading={loading}
            resourceName="Experience"
            resourceNamePlural="Experiences"
            selectedItem={selectedExperience}
            onSelectItem={setSelectedExperience}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            onDragReorder={handleDragReorder}
            renderListItem={renderListItem}
            tabs={tabsData.map(t => ({ id: t.id, label: t.label }))}
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
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
            renderStatsRow={showStats ? renderStatsRow : undefined}
        />
    );
};
