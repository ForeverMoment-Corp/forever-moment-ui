import React, { useState } from 'react';
import { SearchBar } from '@/components/common/SearchBar';
import { Component } from 'lucide-react';
import { cn } from '@/utils/cn';

interface LocationCategoryTabProps {
    location: any;
    allCategories: any[];
    onAssociate: (locationId: number, categoryId: number, data: any) => void;
    onDisassociate: (locationId: number, categoryId: number) => void;
}

export const LocationCategoryTab: React.FC<LocationCategoryTabProps> = ({
    location,
    allCategories,
    onAssociate,
    onDisassociate
}) => {
    const [search, setSearch] = useState("");

    const filteredCategories = allCategories?.filter((cat: any) => {
        if (!search) return true;
        return cat.name?.toLowerCase().includes(search.toLowerCase());
    }) || [];

    const assignedCategoryIds = location?.categories?.map((c: any) => c.id) || [];

    const handleToggle = (categoryId: number, isAssigned: boolean) => {
        if (isAssigned) {
            onDisassociate(location.id, categoryId);
        } else {
            onAssociate(location.id, categoryId, {
                displayOrder: 0,
                active: true
            });
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <SearchBar
                className="w-full"
                inputClassName="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                placeholder="Search categories..."
                value={search}
                onChange={setSearch}
            />

            <div className="flex-1 overflow-y-auto pr-2 space-y-2 pb-20">
                {filteredCategories.map((cat: any) => {
                    const isAssigned = assignedCategoryIds.includes(cat.id);
                    return (
                        <div
                            key={cat.id}
                            className={cn(
                                "flex items-center justify-between p-3 rounded-xl border transition-all duration-200",
                                isAssigned 
                                    ? "bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800" 
                                    : "bg-white border-slate-100 dark:bg-gray-900 dark:border-gray-800 hover:border-slate-200 dark:hover:border-gray-700"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    isAssigned ? "bg-blue-100 dark:bg-blue-800/50 text-blue-600" : "bg-slate-100 dark:bg-gray-800 text-slate-400"
                                )}>
                                    <Component className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                        {cat.name}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                                        {cat.description || 'No description'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleToggle(cat.id, isAssigned)}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 uppercase tracking-wider",
                                    isAssigned
                                        ? "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30"
                                        : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
                                )}
                            >
                                {isAssigned ? 'Detach' : 'Attach'}
                            </button>
                        </div>
                    );
                })}

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12 text-slate-400 dark:text-gray-500 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl">
                        <Component className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        <p className="text-sm font-medium">No categories found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
