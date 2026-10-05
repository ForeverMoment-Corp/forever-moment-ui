import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Loader2 } from 'lucide-react';
import type { Vendor } from './Vendor';

export interface VendorFormData {
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    category: string;
    status: Vendor['status'];
    password?: string;
}

interface VendorFormProps {
    initialData?: Partial<Vendor>;
    onSubmit: (data: VendorFormData) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const VendorForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: VendorFormProps) => {
    const isEditing = Boolean(initialData?.id);

    const [formData, setFormData] = useState<VendorFormData>({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        category: 'Photography',
        status: 'Active',
        password: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                contactPerson: initialData.contactPerson || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                category: initialData.category || 'Photography',
                status: initialData.status || 'Active',
                password: '',
            });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-3 pt-3 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Input
                        label="Business Name"
                        type='text'
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Input
                        label="Contact Person"
                        type='text'
                        value={formData.contactPerson}
                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Input
                        label="Email"
                        type='email'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Input
                        label="Phone"
                        type='tel'
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Dropdown
                        label="Category"
                        options={[
                            { label: 'Photography', value: 'Photography' },
                            { label: 'Catering', value: 'Catering' },
                            { label: 'Decoration', value: 'Decoration' },
                            { label: 'Venue', value: 'Venue' },
                            { label: 'Music', value: 'Music' }
                        ]}
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        placeholder="Select Category"
                        searchable={false}
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <Dropdown
                        label="Status"
                        options={[
                            { label: 'Active', value: 'Active' },
                            { label: 'Inactive', value: 'Inactive' },
                            { label: 'Pending', value: 'Pending' }
                        ]}
                        value={formData.status}
                        onChange={(value) => setFormData({ ...formData, status: value as Vendor['status'] })}
                        placeholder="Select Status"
                        searchable={false}
                        disabled={isLoading}
                    />
                </div>
                {!isEditing && (
                    <div className="md:col-span-2">
                        <Input
                            label="Password"
                            type='password'
                            value={formData.password ?? ''}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                )}
            </div>
            <div className='flex justify-end gap-3 mt-3'>
                <Button type='button' variant='secondary' onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type='submit' variant='default' disabled={isLoading}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
