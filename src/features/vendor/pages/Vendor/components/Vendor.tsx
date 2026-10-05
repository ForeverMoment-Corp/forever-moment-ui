import { useState, useEffect } from 'react';
import { Modal } from '@/components/common/Modal';
import { VendorForm, type VendorFormData } from './VendorForm';
import { DeleteModal } from '@/components/common/DeleteModal';
import { VendorSplitView } from './VendorSplitView';
import toast from 'react-hot-toast';
import '../../css/styles.scss';

export interface Vendor {
    id: number;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: string;
    status: 'Active' | 'Inactive' | 'Pending';
    rating?: number;
}

interface VendorProps {
    data: Vendor[] | null;
    loading: boolean;
    error: string | null;
    getVendors: () => void;
    createVendor: (data: any) => Promise<any>;
    updateVendor: (id: number, data: any) => Promise<any>;
    deleteVendor: (id: number) => Promise<any>;
}

const VendorPage = ({ data, loading, error, getVendors, createVendor, updateVendor, deleteVendor }: VendorProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
    const [editingVendorData, setEditingVendorData] = useState<Partial<Vendor> | undefined>(undefined);

    const vendors: Vendor[] = data ?? [];

    useEffect(() => {
        getVendors();
    }, [getVendors]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleOpenModal = (vendor: Vendor | null = null) => {
        if (vendor) {
            setEditingId(vendor.id);
            setEditingVendorData(vendor);
        } else {
            setEditingId(null);
            setEditingVendorData(undefined);
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setEditingVendorData(undefined);
    };

    /** Map UI form fields → API create body */
    const toCreatePayload = (formData: VendorFormData) => ({
        businessName: formData.name,
        category: formData.category,
        contactName: formData.contactPerson,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        password: formData.password,
        status: (formData.status ?? 'Active').toUpperCase(),
    });

    /** Map UI form fields → API update body (all keys, no password) */
    const toUpdatePayload = (payload: { name: string; contactPerson: string; email: string; phone: string; category: string; status: string }) => ({
        businessName: payload.name,
        category: payload.category,
        contactName: payload.contactPerson,
        contactEmail: payload.email,
        contactPhone: payload.phone,
        status: (payload.status ?? 'Active').toUpperCase(),
    });

    const handleFormSubmit = async (formData: VendorFormData) => {
        try {
            if (editingId) {
                await updateVendor(editingId, toUpdatePayload(formData));
                toast.success('Vendor updated successfully');
                if (selectedVendor?.id === editingId) {
                    setSelectedVendor(prev => prev ? { ...prev, ...formData } : null);
                }
            } else {
                await createVendor(toCreatePayload(formData));
                toast.success('Vendor created successfully');
            }
            handleCloseModal();
        } catch {
            // error already surfaced via Redux → error prop → toast in useEffect
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await deleteVendor(deleteId);
                toast.success('Vendor deleted successfully');
                if (selectedVendor?.id === deleteId) {
                    setSelectedVendor(null);
                }
            } catch {
                // error surfaced via Redux state
            } finally {
                setDeleteId(null);
                setIsDeleteModalOpen(false);
            }
        }
    };

    const handleUpdateVendor = async (id: number, payload: { name: string; contactPerson: string; email: string; phone: string; category: string; status: string }) => {
        try {
            await updateVendor(id, toUpdatePayload(payload));
            toast.success('Vendor updated successfully');
            if (selectedVendor?.id === id) {
                setSelectedVendor(prev => prev ? { ...prev, ...payload } as any : null);
            }
        } catch {
            // error surfaced via Redux state
        }
    };

    return (
        <div className="vendor-page-container w-full h-full flex flex-col">
            <VendorSplitView
                vendors={vendors}
                handleOpenModal={handleOpenModal}
                handleDeleteClick={handleDeleteClick}
                selectedVendor={selectedVendor}
                setSelectedVendor={setSelectedVendor}
                loading={loading}
                updateVendor={handleUpdateVendor}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Edit Vendor' : 'Add Vendor'}
            >
                <VendorForm
                    initialData={editingVendorData}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCloseModal}
                    submitLabel={editingId ? 'Save Changes' : 'Add Vendor'}
                    isLoading={loading}
                />
            </Modal>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemType="Vendor"
            />
        </div>
    );
};

export default VendorPage;
