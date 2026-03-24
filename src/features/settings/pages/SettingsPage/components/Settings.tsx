import { AppearanceSection } from './AppearanceSection';
import { AccentColorSection } from './AccentColorSection';
import { PreviewSection } from './PreviewSection';

const Settings = () => {
    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden relative">
            <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-6 w-full">
                <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 mt-2">
                    <div>
                        <h1 className="text-[22px] font-bold tracking-tight text-slate-900 dark:text-white mb-1">Theme Settings</h1>
                        <p className="text-[13.5px] text-slate-500 dark:text-slate-400">
                            Customize the appearance and layout of your dashboard to match your preferences.
                        </p>
                    </div>

                    <AppearanceSection />
                    <AccentColorSection />
                    <PreviewSection />
                </div>
            </div>
        </div>
    );
};

export default Settings;
