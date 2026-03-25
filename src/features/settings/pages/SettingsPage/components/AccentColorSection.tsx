import { PresetColorGrid } from './PresetColorGrid';
import { CustomColorPicker } from './CustomColorPicker';

export const AccentColorSection = () => {
    return (
        <div className="bg-white dark:bg-[#0f1117] rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800/60 bg-slate-50/50 dark:bg-gray-900/20 rounded-t-2xl">
                <h2 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Brand Accent</h2>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">Select a core color palette that matches your brand identity perfectly.</p>
            </div>

            <div className="p-6 flex flex-col gap-6">
                <PresetColorGrid />
                <CustomColorPicker />
            </div>
        </div>
    );
};
