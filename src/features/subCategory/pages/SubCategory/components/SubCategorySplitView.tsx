import { useCallback, useMemo } from 'react';
import { SubCategoryDetails } from './SubCategoryDetails';
import { SubCategoryLocationTab } from './SubCategoryLocationTab';
import { SubCategoryImages } from './SubCategoryImages';
import { EditableStatusBadge } from '@/components/common/EditableStatusBadge';
import { RowActions } from '@/components/common/RowActions';
import { Image as ImageIcon } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { cn } from '@/utils/cn';
import { CrudSplitViewLayout } from '@/components/common/CrudSplitViewLayout';
import { TABS, ITEM_ID_PREFIX } from '@/config/constants';



export const SubCategorySplitView = ({
    subCategories,
    categories,
    locations,
    handleOpenModal,
    handleDeleteClick,
    selectedSubCategory,
    setSelectedSubCategory,
    loading,
    updateSubCategory,
    associateLocation,
    disassociateLocation,
    subCategoryLocationLinks,
    loadingSubCategoryLinks,
    getSubCategoryLocationLinks,
    getLocationData,
    images,
    getImages,
    subCategoryMedia,
    getSubCategoryMedia,
    attachSubCategoryMedia,
    detachSubCategoryMedia,
    updateSubCategoryMediaAttachment,
    toggleSubCategoryMediaActive,
    setPrimarySubCategoryMedia,
    uploadSubCategoryMedia
}: any) => {

    /**
     * Cover thumbnail from the sub-category list response. The fields are only populated
     * once the backend denormalises the primary image onto the sub-category DTO, so this
     * falls back to a placeholder icon.
     */
    const renderThumb = (sc: any, sizeClass: string) => {
        const src = getMediaAssetUrl(sc.thumbnailUrl || sc.heroUrl || sc.originalUrl);
        return (
            <div className={cn(
                sizeClass,
                "rounded-[6px] overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-700 bg-[#f4f6f8] dark:bg-slate-800 flex items-center justify-center"
            )}>
                {src ? (
                    <img src={src} alt={sc.name || ''} loading="lazy" className="h-full w-full object-cover" />
                ) : (
                    <ImageIcon size={14} className="text-slate-400" />
                )}
            </div>
        );
    };

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
            className: 'w-[25%] min-w-[200px] px-3 text-left font-semibold text-slate-900 dark:text-white whitespace-nowrap',
            render: (sc: any) => (
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "h-7 px-2 min-w-[32px] w-auto rounded-[6px] flex items-center gap-1.5 font-bold text-[11px] shrink-0",
                        "bg-[#f4f6f8] text-slate-500 border border-slate-200/60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                    )}>
                        <span className="text-[12px] leading-none">📝</span>
                        {`${ITEM_ID_PREFIX}-${sc.id}`}
                    </div>
                    {renderThumb(sc, 'h-9 w-9')}
                    <span>{sc.name}</span>
                </div>
            )
        },
        {
            header: 'Category',
            className: 'w-[20%] min-w-[150px] px-3 text-left',
            render: (sc: any) => {
                const category = categories?.find((c: any) => c.id === sc.categoryId);
                return (
                    <span className="text-slate-700 dark:text-slate-300">
                        {category ? category.name : '-'}
                    </span>
                );
            }
        },
        {
            header: 'Description',
            accessorKey: 'description',
            className: 'w-[25%] min-w-[200px] px-3 text-left text-slate-600 dark:text-slate-300',
            render: (sc: any) => (
                <div className="truncate max-w-[250px]" title={sc.description}>
                    {sc.description || '-'}
                </div>
            )
        },
        {
            header: 'Status',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] px-3 text-left',
            render: (sc: any) => (
                <EditableStatusBadge
                    status={sc.isActive ? 'Active' : 'Inactive'}
                    options={['Active', 'Inactive']}
                    onChange={async (val) => {
                        const newStatus = val === 'Active';
                        if (newStatus === sc.isActive) return;
                        try {
                            await updateSubCategory(sc.id, {
                                name: sc.name,
                                description: sc.description || "",
                                categoryId: sc.categoryId,
                                isActive: newStatus
                            });
                        } catch (e) { console.error(e); }
                    }}
                />
            )
        },
        {
            header: 'Actions',
            preventRowClick: true,
            className: 'w-[15%] min-w-[100px] px-3 text-right',
            render: (sc: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <RowActions
                        onEdit={() => handleOpenModal(sc)}
                        onDelete={() => handleDeleteClick(sc.id)}
                    />
                </div>
            )
        }
    ];

    const renderListItem = useCallback((sc: any, isSelected: boolean) => (
        <div
            className={cn(
                "flex items-center gap-3 p-3 mb-1 cursor-pointer transition-all duration-200 rounded-lg group",
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
                {`${ITEM_ID_PREFIX}-${sc.id}`}
            </div>
            {renderThumb(sc, 'h-9 w-9')}
            <div className="flex-1 min-w-0">
                <div className={cn(
                    "font-semibold text-[13.5px] truncate mb-0.5 transition-colors",
                    isSelected ? "text-[var(--accent)]" : "text-slate-900 dark:text-slate-100 group-hover:text-[var(--accent)]"
                )}>{sc.name}</div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate">Events: {sc.count || 0}</div>
            </div>
            <div className={cn(
                "w-2 h-2 rounded-full shrink-0 shadow-sm",
                sc.isActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
            )} />
        </div>
    ), []);

    const renderDetailsPanel = useCallback((sc: any, activeTab: string, dirtyState: any) => {
        if (activeTab === TABS.GENERAL.id) {
            return (
                <SubCategoryDetails
                    subCategory={sc}
                    categories={categories}
                    updateSubCategory={updateSubCategory}
                    onDirtyChange={dirtyState.handleDirtyChange}
                />
            );
        }
        if (activeTab === TABS.LOCATIONS.id) {
            return (
                <SubCategoryLocationTab
                    subCategory={sc}
                    allLocations={locations}
                    onAssociate={associateLocation}
                    onDisassociate={disassociateLocation}
                    subCategoryLocationLinks={subCategoryLocationLinks || []}
                    loadingLinks={loadingSubCategoryLinks}
                    fetchLocations={getLocationData}
                    fetchLinks={getSubCategoryLocationLinks}
                />
            );
        }
        if (activeTab === TABS.IMAGES.id) {
            return (
                <div className="pt-2">
                    <SubCategoryImages
                        subCategoryId={sc.id}
                        subCategoryMedia={subCategoryMedia || []}
                        getSubCategoryMedia={getSubCategoryMedia}
                        availableImages={images || []}
                        getImages={getImages}
                        attachSubCategoryMedia={attachSubCategoryMedia}
                        detachSubCategoryMedia={detachSubCategoryMedia}
                        setPrimarySubCategoryMedia={setPrimarySubCategoryMedia}
                        updateSubCategoryMediaAttachment={updateSubCategoryMediaAttachment}
                        toggleSubCategoryMediaActive={toggleSubCategoryMediaActive}
                        uploadSubCategoryMedia={uploadSubCategoryMedia}
                    />
                </div>
            );
        }
        return null;
    }, [
        updateSubCategory, locations, associateLocation, disassociateLocation,
        subCategoryLocationLinks, loadingSubCategoryLinks, getSubCategoryLocationLinks, getLocationData,
        categories, subCategoryMedia, getSubCategoryMedia, images, getImages,
        attachSubCategoryMedia, detachSubCategoryMedia, setPrimarySubCategoryMedia,
        updateSubCategoryMediaAttachment, toggleSubCategoryMediaActive, uploadSubCategoryMedia
    ]);

    const customFilter = useCallback((sc: any, activeFilters: Record<string, string[]>) => {
        let matchStatus = true;
        if (activeFilters.status && activeFilters.status.length > 0) {
            const isActiveString = sc.isActive ? 'true' : 'false';
            matchStatus = activeFilters.status.includes(isActiveString);
        }

        let matchCategory = true;
        if (activeFilters.categoryId && activeFilters.categoryId.length > 0) {
            matchCategory = sc.categoryId && activeFilters.categoryId.includes(String(sc.categoryId));
        }

        return matchStatus && matchCategory;
    }, []);

    const customSearch = useCallback((sc: any, search: string) => {
        return sc.name && sc.name.toLowerCase().includes(search.toLowerCase());
    }, []);

    const categoryOptions = useMemo(() => {
        return categories?.map((cat: any) => ({
            id: String(cat.id),
            label: cat.name,
            value: String(cat.id)
        })) || [];
    }, [categories]);

    return (
        <CrudSplitViewLayout
            data={subCategories || []}
            loading={loading}
            resourceName="Sub Category"
            resourceNamePlural="Sub Categories"
            selectedItem={selectedSubCategory}
            onSelectItem={setSelectedSubCategory}
            columns={columns}
            keyExtractor={(item: any) => item.id}
            renderListItem={renderListItem}
            tabs={[
                { id: TABS.GENERAL.id, label: TABS.GENERAL.labelShort },
                { id: TABS.LOCATIONS.id, label: TABS.LOCATIONS.label },
                { id: TABS.IMAGES.id, label: TABS.IMAGES.label }
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
                },
                {
                    id: 'categoryId',
                    name: 'Category',
                    options: categoryOptions
                }
            ]}
            customFilter={customFilter}
            customSearch={customSearch}
            onAdd={() => handleOpenModal()}
        />
    );
};
