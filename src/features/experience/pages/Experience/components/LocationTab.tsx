import React, { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Button } from '@/components/common/Button';
import { MapPin } from 'lucide-react';
import { LocationCard } from './LocationCard';
import { LocationModal } from './LocationModal';
import { TimeSlotModal } from './TimeSlotModal';
import { BulkTimeSlotModal } from './BulkTimeSlotModal';

interface LocationTabProps {
    availableLocations: any[];
    experienceLocations: any[];
    onAssociateLocation: (locationId: number, data: any) => void;
    onUpdateLocation: (locationId: number, data: any) => void;
    onDisassociateLocation: (locationId: number) => void;
    onToggleExperienceLocation: (locationId: number, mapperId: number) => void;
    onAssociateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => void;
    onUpdateLocationTimeSlot: (locationId: number, timeSlotId: number, data: any) => void;
    onDisassociateLocationTimeSlot: (locationId: number, timeSlotId: number) => void;
    onBulkAttachLocationTimeSlots: (locationId: number, data: any) => void;
    onToggleLocationTimeSlot: (locationId: number, mapperId: number) => void;
    slots: any[];
}

interface LocationFormData {
    priceOverride: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
}

const emptyForm: LocationFormData = {
    priceOverride: 0,
    validFrom: '',
    validTo: '',
    isActive: true
};

export const LocationTab: React.FC<LocationTabProps> = ({
    availableLocations,
    experienceLocations,
    onAssociateLocation,
    onUpdateLocation,
    onDisassociateLocation,
    onToggleExperienceLocation,
    onAssociateLocationTimeSlot,
    onUpdateLocationTimeSlot,
    onDisassociateLocationTimeSlot,
    onBulkAttachLocationTimeSlots,
    onToggleLocationTimeSlot,
    slots
}) => {
    const [search, setSearch] = useState("");
    const [isAssocModalOpen, setIsAssocModalOpen] = useState(false);
    const [isTimeSlotModalOpen, setIsTimeSlotModalOpen] = useState(false);
    const [isBulkTimeSlotModalOpen, setIsBulkTimeSlotModalOpen] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
    const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(null);
    const [formData, setFormData] = useState<LocationFormData>(emptyForm);
    const [timeSlotFormData, setTimeSlotFormData] = useState<any>({
        priceOverride: 0,
        maxCapacity: 0,
        validFrom: '',
        validTo: '',
        isActive: true
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isTsEditing, setIsTsEditing] = useState(false);

    const filteredAssignedLocations = experienceLocations?.filter((el: any) => {
        if (!search) return true;
        const nameMatch = el.locationName?.toLowerCase().includes(search.toLowerCase());
        const cityMatch = el.city?.toLowerCase().includes(search.toLowerCase());
        return nameMatch || cityMatch;
    }) || [];

    const handleOpenAssocModal = (existingData?: any) => {
        if (existingData) {
            setIsEditing(true);
            setSelectedLocationId(existingData.locationId);
            setFormData({
                priceOverride: existingData.priceOverride || 0,
                validFrom: existingData.validFrom ? new Date(existingData.validFrom).toISOString().split('T')[0] : '',
                validTo: existingData.validTo ? new Date(existingData.validTo).toISOString().split('T')[0] : '',
                isActive: existingData.isActive ?? true,
            });
        } else {
            setIsEditing(false);
            setSelectedLocationId(null);
            setFormData(emptyForm);
        }
        setIsAssocModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAssocModalOpen(false);
        setIsTimeSlotModalOpen(false);
        setSelectedLocationId(null);
        setSelectedTimeSlotId(null);
        setFormData(emptyForm);
        setIsTsEditing(false);
        setIsBulkTimeSlotModalOpen(false);
    };

    const handleOpenTimeSlotModal = (locationId: number) => {
        setSelectedLocationId(locationId);
        setSelectedTimeSlotId(null);
        setTimeSlotFormData({
            priceOverride: 0,
            maxCapacity: 0,
            validFrom: '',
            validTo: '',
            isActive: true
        });
        setIsTsEditing(false);
        setIsTimeSlotModalOpen(true);
    };

    const handleOpenTimeSlotEditModal = (locationId: number, ts: any) => {
        setSelectedLocationId(locationId);
        setSelectedTimeSlotId(ts.timeSlotId);
        setTimeSlotFormData({
            priceOverride: ts.priceOverride || 0,
            maxCapacity: ts.maxCapacity || 0,
            validFrom: ts.validFrom ? new Date(ts.validFrom).toISOString().split('T')[0] : '',
            validTo: ts.validTo ? new Date(ts.validTo).toISOString().split('T')[0] : '',
            isActive: ts.isActive ?? true
        });
        setIsTsEditing(true);
        setIsTimeSlotModalOpen(true);
    };

    const handleOpenBulkTimeSlotModal = (locationId: number) => {
        setSelectedLocationId(locationId);
        setIsBulkTimeSlotModalOpen(true);
    };

    const handleSubmit = () => {
        if (!selectedLocationId) return;

        const payload = {
            priceOverride: Number(formData.priceOverride),
            validFrom: formData.validFrom || new Date().toISOString().split('T')[0],
            validTo: formData.validTo || new Date().toISOString().split('T')[0],
            isActive: formData.isActive
        };

        if (isEditing) {
            onUpdateLocation(selectedLocationId, payload);
        } else {
            onAssociateLocation(selectedLocationId, payload);
        }
        handleCloseModal();
    };

    const handleTimeSlotSubmit = () => {
        if (!selectedLocationId || !selectedTimeSlotId) return;

        const payload = {
            priceOverride: Number(timeSlotFormData.priceOverride),
            maxCapacity: Number(timeSlotFormData.maxCapacity),
            validFrom: timeSlotFormData.validFrom || new Date().toISOString().split('T')[0],
            validTo: timeSlotFormData.validTo || new Date().toISOString().split('T')[0],
            isActive: timeSlotFormData.isActive
        };

        if (isTsEditing) {
            onUpdateLocationTimeSlot(selectedLocationId, selectedTimeSlotId, payload);
        } else {
            onAssociateLocationTimeSlot(selectedLocationId, selectedTimeSlotId, payload);
        }
        handleCloseModal();
    };

    const handleBulkTimeSlotSubmit = (data: any) => {
        if (!selectedLocationId) return;
        onBulkAttachLocationTimeSlots(selectedLocationId, data);
        handleCloseModal();
    };

    const unassignedLocations = availableLocations.filter((loc: any) =>
        loc.isActive && !experienceLocations?.some((el: any) => el.locationId === loc.id)
    );

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-4">
                <SearchBar
                    className="flex-1"
                    inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                    placeholder="Search locations..."
                    value={search}
                    onChange={setSearch}
                />
                <Button onClick={() => handleOpenAssocModal()} className="h-10 px-4 text-sm shrink-0">
                    Associate Location
                </Button>
            </div>

            <div className="space-y-3 overflow-y-auto pr-2 pb-20">
                {filteredAssignedLocations.map((el: any) => (
                    <LocationCard
                        key={`${el.locationId}-${el.timeSlotId}`}
                        el={el}
                        slots={slots}
                        onEdit={handleOpenAssocModal}
                        onDisassociate={onDisassociateLocation}
                        onToggleLocation={onToggleExperienceLocation}
                        onAddTimeSlot={handleOpenTimeSlotModal}
                        onBulkAddTimeSlot={handleOpenBulkTimeSlotModal}
                        onEditTimeSlot={handleOpenTimeSlotEditModal}
                        onDeleteTimeSlot={onDisassociateLocationTimeSlot}
                        onToggleTimeSlot={onToggleLocationTimeSlot}
                    />
                ))}

                {filteredAssignedLocations.length === 0 && (
                    <div className="text-center py-12 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <MapPin className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No locations associated.</p>
                        <p className="text-xs mt-1">Click "Associate Location" to link one.</p>
                    </div>
                )}
            </div>

            <LocationModal
                isOpen={isAssocModalOpen}
                onClose={handleCloseModal}
                isEditing={isEditing}
                unassignedLocations={unassignedLocations}
                selectedLocationId={selectedLocationId}
                setSelectedLocationId={setSelectedLocationId}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />

            <TimeSlotModal
                isOpen={isTimeSlotModalOpen}
                onClose={handleCloseModal}
                isTsEditing={isTsEditing}
                slots={slots}
                selectedTimeSlotId={selectedTimeSlotId}
                setSelectedTimeSlotId={setSelectedTimeSlotId}
                timeSlotFormData={timeSlotFormData}
                setTimeSlotFormData={setTimeSlotFormData}
                onSubmit={handleTimeSlotSubmit}
            />

            <BulkTimeSlotModal
                isOpen={isBulkTimeSlotModalOpen}
                onClose={handleCloseModal}
                slots={slots}
                existingTimeSlotIds={
                    experienceLocations.find(el => el.locationId === selectedLocationId)?.timeslots?.map((ts: any) => ts.timeSlotId) || []
                }
                onSubmit={handleBulkTimeSlotSubmit}
            />
        </div>
    );
};
