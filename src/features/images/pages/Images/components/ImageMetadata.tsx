import { useState } from 'react';
import { SectionLabel, FieldGrid, Cell, FieldLabel } from '@/components/common/DetailsLayout';
import { format } from 'date-fns';
import { HardDrive, Calendar, Type, Tag, Download, Image as ImageIcon, Edit2, Save, X, Copy, Eye, EyeOff, Film, CheckCircle2, XCircle, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { getMediaAssetUrl } from '@/features/images/store/api';
import toast from 'react-hot-toast';

interface ImageMetadataProps {
    image: any;
    displayMetadata: any;
    onDownload?: (id: string, fileName?: string, sourceUrl?: string) => void;
}

export const ImageMetadata = ({ image, displayMetadata, onDownload }: ImageMetadataProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedMetadata, setEditedMetadata] = useState({
        altText: displayMetadata.altText || '',
        category: displayMetadata.category || '',
        tags: displayMetadata.tags || []
    });
    const [showAdvanced, setShowAdvanced] = useState(false);

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleCopyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const mediaLinks: { label: string; path?: string }[] = [
        { label: 'Original URL', path: image.originalUrl },
        { label: 'Media URL', path: image.mediaUrl || image.url },
        { label: 'Thumbnail URL', path: image.thumbnailUrl },
    ].filter((l) => Boolean(l.path));

    const renderUrlRow = (label: string, path: string) => {
        const absolute = getMediaAssetUrl(path);
        return (
            <Cell full key={label}>
                <FieldLabel>{label}</FieldLabel>
                <div className="flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-800 flex-1 truncate" title={absolute}>
                        {path}
                    </code>
                    <button
                        onClick={() => handleCopyToClipboard(absolute, label)}
                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        title={`Copy ${label.toLowerCase()}`}
                    >
                        <Copy size={12} />
                    </button>
                    <a
                        href={absolute}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        title="Open in new tab"
                    >
                        <ExternalLink size={12} />
                    </a>
                </div>
            </Cell>
        );
    };

    const handleSaveMetadata = () => {
        // Here you would typically call an API to save the metadata
        // updateImageMetadata(image.id, editedMetadata);
        setIsEditing(false);
        toast.success('Metadata updated successfully');
    };

    const handleCancelEdit = () => {
        setEditedMetadata({
            altText: displayMetadata.altText || '',
            category: displayMetadata.category || '',
            tags: displayMetadata.tags || []
        });
        setIsEditing(false);
    };

    return (
        <>
            {/* Metadata Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <SectionLabel>File Information</SectionLabel>
                    <div className="flex items-center gap-2">
                        {onDownload && (
                            <button
                                onClick={() => onDownload(image.id, image.fileName, image.originalUrl)}
                                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline transition-all"
                            >
                                <Download size={12} />
                                Download Original
                            </button>
                        )}
                        <button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 transition-all"
                        >
                            {showAdvanced ? <EyeOff size={12} /> : <Eye size={12} />}
                            {showAdvanced ? 'Simple' : 'Advanced'}
                        </button>
                    </div>
                </div>
                <FieldGrid>
                    <Cell full>
                        <FieldLabel>File Name</FieldLabel>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white break-all">{image.fileName}</span>
                            <button
                                onClick={() => handleCopyToClipboard(image.fileName, 'File name')}
                                className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                title="Copy file name"
                            >
                                <Copy size={12} />
                            </button>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Size</FieldLabel>
                        <div className="flex items-center gap-2">
                            <HardDrive className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">{formatSize(image.fileSizeBytes ?? image.size)}</span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Upload Date</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                                {image.uploadDate ? format(new Date(image.uploadDate), 'MMM dd, yyyy HH:mm') : 'N/A'}
                            </span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Content Type</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-[11px] font-mono">
                                {image.mimeType || image.contentType || 'N/A'}
                            </span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Media Type</FieldLabel>
                        <div className="flex items-center gap-2">
                            <Film className="w-4 h-4 text-slate-400" />
                            <span className="text-[13px] font-semibold text-slate-900 dark:text-white uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-gray-800 text-[11px] font-mono">
                                {image.mediaType || 'IMAGE'}
                            </span>
                        </div>
                    </Cell>
                    <Cell>
                        <FieldLabel>Status</FieldLabel>
                        <div className="flex items-center gap-2">
                            {image.active === false ? (
                                <>
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-[13px] font-semibold text-red-600 dark:text-red-400">Inactive</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span className="text-[13px] font-semibold text-green-600 dark:text-green-400">Active</span>
                                </>
                            )}
                        </div>
                    </Cell>
                    {showAdvanced && (
                        <Cell full>
                            <FieldLabel>Unique ID</FieldLabel>
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-slate-400" />
                                <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-800">
                                    {image.id}
                                </code>
                                <button
                                    onClick={() => handleCopyToClipboard(String(image.id), 'Image ID')}
                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                    title="Copy image ID"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </Cell>
                    )}
                    {showAdvanced && image.filePath && (
                        <Cell full>
                            <FieldLabel>Storage ID</FieldLabel>
                            <div className="flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-slate-400" />
                                <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-800">
                                    {image.filePath}
                                </code>
                                <button
                                    onClick={() => handleCopyToClipboard(image.filePath, 'Storage ID')}
                                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                    title="Copy storage ID"
                                >
                                    <Copy size={12} />
                                </button>
                            </div>
                        </Cell>
                    )}
                    {showAdvanced && mediaLinks.map((l) => renderUrlRow(l.label, l.path as string))}
                </FieldGrid>
            </div>

            {/* Editable Metadata Section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <SectionLabel>Image Metadata</SectionLabel>
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-all"
                        >
                            <Edit2 size={12} />
                            Edit Metadata
                        </button>
                    ) : (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleCancelEdit}
                                className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-700 transition-all"
                            >
                                <X size={12} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveMetadata}
                                className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 transition-all"
                            >
                                <Save size={12} />
                                Save
                            </button>
                        </div>
                    )}
                </div>
                
                <FieldGrid>
                    <Cell full>
                        <FieldLabel>Alt Text</FieldLabel>
                        {!isEditing ? (
                            <div className="text-[13px] font-medium text-slate-600 dark:text-slate-300 italic min-h-[40px] p-2 bg-slate-50 dark:bg-gray-800/50 rounded border border-slate-100 dark:border-gray-800">
                                {displayMetadata.altText || 'No alt text provided'}
                            </div>
                        ) : (
                            <textarea
                                value={editedMetadata.altText}
                                onChange={(e) => setEditedMetadata(prev => ({ ...prev, altText: e.target.value }))}
                                className="w-full text-[13px] font-medium text-slate-900 dark:text-white bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="Describe this image for accessibility..."
                            />
                        )}
                    </Cell>
                    <Cell>
                        <FieldLabel>Category</FieldLabel>
                        {!isEditing ? (
                            <div className="text-[13px] font-semibold text-slate-900 dark:text-white min-h-[40px] p-2 bg-slate-50 dark:bg-gray-800/50 rounded border border-slate-100 dark:border-gray-800">
                                {displayMetadata.category || 'Uncategorized'}
                            </div>
                        ) : (
                            <input
                                type="text"
                                value={editedMetadata.category}
                                onChange={(e) => setEditedMetadata(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full text-[13px] font-semibold text-slate-900 dark:text-white bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Image category..."
                            />
                        )}
                    </Cell>
                    {showAdvanced && (
                        <Cell full>
                            <FieldLabel>Storage File Name</FieldLabel>
                            <div className="flex items-center gap-2">
                                <code className="text-[11px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-gray-800/50 px-2 py-0.5 rounded border border-slate-100 dark:border-gray-800 flex-1">
                                    {image.storageFileName || 'N/A'}
                                </code>
                                {image.storageFileName && (
                                    <button
                                        onClick={() => handleCopyToClipboard(image.storageFileName, 'Storage file name')}
                                        className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                                        title="Copy storage file name"
                                    >
                                        <Copy size={12} />
                                    </button>
                                )}
                            </div>
                        </Cell>
                    )}
                </FieldGrid>
            </div>
        </>
    );
};
