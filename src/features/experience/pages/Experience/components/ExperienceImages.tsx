import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { Trash2, Image as ImageIcon, CheckCircle2, Grid, List, Star, ArrowUpDown, GripVertical } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import { cn } from '@/utils/cn';

// Sortable Image Item Component
const SortableImageItem = ({ em, experienceId, disassociateMedia, viewMode }: { 
    em: any; 
    experienceId: number; 
    disassociateMedia: (expId: number, mediaId: number) => void;
    viewMode: 'grid' | 'list';
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: em.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    if (viewMode === 'grid') {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden aspect-[4/3] flex flex-col transition-all hover:border-blue-300 hover:shadow-md"
            >
                <div className="absolute top-2 left-2 z-10">
                    <div
                        {...attributes}
                        {...listeners}
                        className="p-1.5 bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Drag to reorder"
                    >
                        <GripVertical size={14} className="text-gray-500" />
                    </div>
                </div>

                <div className="flex-1 bg-gray-100 dark:bg-gray-800 w-full flex-center relative overflow-hidden flex items-center justify-center">
                    {em.url ? (
                        <img
                            src={getMediaAssetUrl(em.url)}
                            alt={em.altText || 'Media'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                    ) : (
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex gap-2">
                        {em.isPrimary && (
                            <div className="bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                <Star size={10} />
                                Primary
                            </div>
                        )}
                        <div className="bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                            #{em.displayOrder || 0}
                        </div>
                    </div>

                    {/* Actions overlay */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                            onClick={() => disassociateMedia(experienceId, em.mediaId)}
                            className="p-1.5 bg-white/90 dark:bg-gray-900/90 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg shadow-sm transition-all"
                            title="Remove Image"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
                <div className="p-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                        {em.altText || em.fileName || 'No Alt Text'}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group flex items-center gap-3 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-300 transition-all"
        >
            <div
                {...attributes}
                {...listeners}
                className="p-1 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-all"
                title="Drag to reorder"
            >
                <GripVertical size={16} />
            </div>

            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                {em.url ? (
                    <img
                        src={getMediaAssetUrl(em.url)}
                        alt={em.altText || 'Media'}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                    </div>
                )}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                        {em.altText || em.fileName || 'No Alt Text'}
                    </div>
                    {em.isPrimary && (
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star size={10} />
                            Primary
                        </div>
                    )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                    Order: {em.displayOrder || 0}
                </div>
            </div>

            <button
                onClick={() => disassociateMedia(experienceId, em.mediaId)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                title="Remove Image"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

interface ExperienceImagesProps {
    experienceId: number;
    experienceMedia: any[];
    getExperienceMedia: (experienceId: number) => Promise<any>;
    availableImages: any[];
    getImages: () => void;
    bulkAttachMedia: (experienceId: number, data: { items: any[] }) => Promise<any>;
    disassociateMedia: (experienceId: number, mediaId: number) => Promise<any>;
}

export const ExperienceImages: React.FC<ExperienceImagesProps> = ({
    experienceId,
    experienceMedia,
    getExperienceMedia,
    availableImages,
    getImages,
    bulkAttachMedia,
    disassociateMedia
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'order' | 'name' | 'date'>('order');
    const [orderedMedia, setOrderedMedia] = useState<any[]>([]);

    // Initialize ordered media
    React.useEffect(() => {
        if (experienceMedia) {
            setOrderedMedia(experienceMedia.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
        }
    }, [experienceMedia]);

    React.useEffect(() => {
        if (experienceId) {
            getExperienceMedia(experienceId);
        }
    }, [experienceId, getExperienceMedia]);

    const filteredAssignedMedia = React.useMemo(() => {
        let filtered = orderedMedia?.filter((em: any) => {
            if (!search) return true;
            return em.altText?.toLowerCase().includes(search.toLowerCase()) ||
                em.fileName?.toLowerCase().includes(search.toLowerCase()) ||
                em.mimeType?.toLowerCase().includes(search.toLowerCase());
        }) || [];

        // Sort the filtered results
        filtered.sort((a: any, b: any) => {
            switch (sortBy) {
                case 'order':
                    return (a.displayOrder || 0) - (b.displayOrder || 0);
                case 'name':
                    return (a.fileName || '').localeCompare(b.fileName || '');
                case 'date':
                    return new Date(b.uploadDate || 0).getTime() - new Date(a.uploadDate || 0).getTime();
                default:
                    return 0;
            }
        });

        return filtered;
    }, [orderedMedia, search, sortBy]);

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setOrderedMedia((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                
                if (oldIndex === -1 || newIndex === -1) return items;
                
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Update displayOrder for all items
                const updatedItems = newItems.map((item, index) => ({
                    ...item,
                    displayOrder: index
                }));
                
                // Here you would typically call an API to update the order
                // For now, we'll just update the local state
                // updateImageOrder(experienceId, updatedItems);
                
                return updatedItems;
            });
        }
    };

    const unassignedImages = availableImages.filter((img: any) =>
        !experienceMedia?.some((em: any) => em.mediaId === img.id)
    );

    const handleOpenAssocModal = () => {
        getImages();
        setSelectedImageIds([]);
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setSelectedImageIds([]);
    };

    const toggleImageSelection = (id: number) => {
        setSelectedImageIds(prev =>
            prev.includes(id) ? prev.filter(imgId => imgId !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (selectedImageIds.length === 0 || !experienceId) return;
        setIsSubmitting(true);

        const items = selectedImageIds.map((id, index) => ({
            mediaId: id,
            displayOrder: experienceMedia.length + index,
            isPrimary: experienceMedia.length === 0 && index === 0, // make first chosen primary if list empty
            altText: "",
            isActive: true
        }));

        try {
            await bulkAttachMedia(experienceId, { items });
            handleCloseModal();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header with controls */}
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search attached images..."
                    value={search}
                    onChange={setSearch}
                />
                
                {/* Sort dropdown */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-3 py-2">
                    <ArrowUpDown size={16} className="text-gray-500" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'order' | 'name' | 'date')}
                        className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
                    >
                        <option value="order">Order</option>
                        <option value="name">Name</option>
                        <option value="date">Date</option>
                    </select>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={cn(
                            "p-2 rounded transition-all",
                            viewMode === 'grid' 
                                ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <Grid size={16} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={cn(
                            "p-2 rounded transition-all",
                            viewMode === 'list' 
                                ? "bg-white dark:bg-gray-900 text-blue-600 shadow-sm" 
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        )}
                    >
                        <List size={16} />
                    </button>
                </div>

                <Button onClick={handleOpenAssocModal} className="h-10 px-4 text-sm shrink-0">
                    Add Images
                </Button>
            </div>

            {/* Images display with DnD */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={filteredAssignedMedia.map(item => item.id)}
                    strategy={viewMode === 'list' ? verticalListSortingStrategy : undefined}
                >
                    {viewMode === 'grid' ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-20">
                            {filteredAssignedMedia.map((em: any) => (
                                <SortableImageItem
                                    key={em.id}
                                    em={em}
                                    experienceId={experienceId}
                                    disassociateMedia={disassociateMedia}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2 overflow-y-auto pr-2 pb-20">
                            {filteredAssignedMedia.map((em: any) => (
                                <SortableImageItem
                                    key={em.id}
                                    em={em}
                                    experienceId={experienceId}
                                    disassociateMedia={disassociateMedia}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </SortableContext>
            </DndContext>

            {/* Empty state */}
            {filteredAssignedMedia.length === 0 && (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center py-16 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <ImageIcon className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No images associated.</p>
                        <p className="text-xs mt-1">Click "Add Images" to link photos from the media library.</p>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                title="Select Images to Add"
                className="max-w-5xl w-[95vw]"
            >
                <div className="flex flex-col h-[70vh]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {unassignedImages.length} image{unassignedImages.length !== 1 ? 's' : ''} available
                        </div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            {selectedImageIds.length} image{selectedImageIds.length !== 1 ? 's' : ''} selected
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 dark:border-gray-800 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50">
                        {unassignedImages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <ImageIcon className="w-12 h-12 mb-3 text-slate-300" />
                                <p className="text-lg font-medium">No more images available</p>
                                <p className="text-sm mt-1">All images in your library are already associated with this experience.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                {unassignedImages.map((img: any) => {
                                    const isSelected = selectedImageIds.includes(img.id);
                                    return (
                                        <div
                                            key={img.id}
                                            onClick={() => toggleImageSelection(img.id)}
                                            className={cn(
                                                "relative group cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all",
                                                isSelected 
                                                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg" 
                                                    : "border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md"
                                            )}
                                        >
                                            <img
                                                src={img.thumbnailUrl ? getMediaAssetUrl(img.thumbnailUrl) : (img.url ? getMediaAssetUrl(img.url) : '')}
                                                alt={img.fileName || ''}
                                                className="w-full h-full object-cover bg-gray-200 dark:bg-gray-800 group-hover:scale-105 transition-transform duration-200"
                                            />
                                            
                                            {/* Selection overlay */}
                                            {isSelected && (
                                                <div className="absolute inset-0 bg-blue-500/20 flex items-start justify-end p-2">
                                                    <div className="bg-blue-600 rounded-full p-1 shadow-lg">
                                                        <CheckCircle2 className="text-white" size={16} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="text-white text-xs font-medium text-center px-2">
                                                    {img.fileName ? (
                                                        <div className="truncate max-w-full">{img.fileName}</div>
                                                    ) : (
                                                        'Select Image'
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-gray-800 shrink-0">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    if (selectedImageIds.length === unassignedImages.length) {
                                        setSelectedImageIds([]);
                                    } else {
                                        setSelectedImageIds(unassignedImages.map((img: any) => img.id));
                                    }
                                }}
                            >
                                {selectedImageIds.length === unassignedImages.length ? 'Deselect All' : 'Select All'}
                            </Button>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={selectedImageIds.length === 0 || isSubmitting}
                                isLoading={isSubmitting}
                                className="min-w-[140px]"
                            >
                                {selectedImageIds.length > 0 && (
                                    <span className="mr-2">({selectedImageIds.length})</span>
                                )}
                                Add Selected Images
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
