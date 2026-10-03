import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Loader2 } from 'lucide-react';
import { Dropdown } from '@/components/common/Dropdown';
import { Input } from '@/components/common/Input';
import { Textarea } from '@/components/common/Textarea';

export interface FaqFormData {
    question: string;
    answer: string;
    isActive: boolean;
}

interface FaqFormProps {
    initialData: FaqFormData;
    onSubmit: (data: FaqFormData) => void;
    onCancel: () => void;
    submitLabel: string;
    isLoading?: boolean;
}

export const FaqForm = ({ initialData, onSubmit, onCancel, submitLabel, isLoading }: FaqFormProps) => {
    const [formData, setFormData] = useState<FaqFormData>(initialData);

    const isValid = formData.question.trim() !== '' && formData.answer.trim() !== '';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;
        onSubmit({ ...formData });
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-3 pt-3 relative'>
            {isLoading && (
                <div className="absolute inset-0 dark:bg-gray-900/50 flex items-center justify-center z-50">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                </div>
            )}
            <div>
                <Input
                    label="Question"
                    type='text'
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="e.g. How far in advance should I book?"
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Textarea
                    label="Answer"
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    className="min-h-[140px]"
                    required
                    disabled={isLoading}
                />
            </div>
            <div>
                <Dropdown
                    label="Status"
                    options={[
                        { label: 'Active', value: 'true' },
                        { label: 'Inactive', value: 'false' }
                    ]}
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(value) => setFormData({ ...formData, isActive: value === 'true' })}
                    placeholder="Select Status"
                    searchable={false}
                    disabled={isLoading}
                />
            </div>
            <div className='flex justify-end gap-3 mt-3'>
                <Button type='button' variant='secondary' onClick={onCancel} disabled={isLoading}>Cancel</Button>
                <Button type='submit' variant='default' disabled={isLoading || !isValid}>
                    {isLoading ? 'Saving...' : submitLabel}
                </Button>
            </div>
        </form>
    );
};
