import { Popover as PopoverPrimitive } from "radix-ui";
import { Check } from "lucide-react";

type StatusOption = string | { label: string; value: string };

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    Active: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
    Inactive: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
    Draft: { bg: "#fef3c7", text: "#92400e", dot: "#f59b0b" },
    Archived: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
    Pending: { bg: "#e0f2fe", text: "#075985", dot: "#0ea5e9" },
};

export function EditableStatusBadge({
    status,
    onChange,
    options = ["Active", "Inactive"],
}: {
    status: string;
    onChange?: (val: string) => void;
    options?: StatusOption[];
}) {
    // Normalize all options to { label, value }
    const normalized = options.map((opt) =>
        typeof opt === "string" ? { label: opt, value: opt } : opt
    );

    // Find the matching option for current status (match by value first, then label)
    const current =
        normalized.find((o) => o.value === status) ||
        normalized.find((o) => o.label === status) ||
        normalized[0];

    const displayLabel = current?.label ?? status;
    const s = STATUS_STYLES[displayLabel] ?? STATUS_STYLES["Inactive"];

    // Static badge (no onChange)
    if (!onChange) {
        return (
            <div
                style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 10px 5px 8px", borderRadius: 20,
                    background: s.bg, border: `1.5px solid ${s.dot}33`,
                    fontSize: 12.5, fontWeight: 600, color: s.text,
                    userSelect: "none", minWidth: 85, justifyContent: "center",
                }}
            >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                <span>{displayLabel}</span>
            </div>
        );
    }

    // Interactive badge using Radix Popover (same foundation as Dropdown)
    return (
        <PopoverPrimitive.Root>
            <PopoverPrimitive.Trigger asChild>
                <button
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 10px 5px 8px", borderRadius: 20,
                        background: s.bg, border: `1.5px solid ${s.dot}33`,
                        fontSize: 12.5, fontWeight: 600, color: s.text,
                        cursor: "pointer", outline: "none",
                        userSelect: "none", minWidth: 85, justifyContent: "center",
                    }}
                >
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                    <span>{displayLabel}</span>
                    <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 2 }}>▾</span>
                </button>
            </PopoverPrimitive.Trigger>

            <PopoverPrimitive.Portal>
                <PopoverPrimitive.Content
                    align="start"
                    sideOffset={6}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] overflow-hidden min-w-[150px] z-[99999]"
                >
                    {normalized.map((opt) => {
                        const style = STATUS_STYLES[opt.label] ?? STATUS_STYLES["Inactive"];
                        const isSelected = opt.value === status || opt.label === status;

                        return (
                            <PopoverPrimitive.Close key={opt.value} asChild>
                                <div
                                    onClick={(e) => { e.stopPropagation(); onChange(opt.value); }}
                                    className={`flex items-center gap-2 px-3.5 py-2 cursor-pointer text-[13px] transition-colors ${
                                        isSelected ? "font-semibold" : "font-normal text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-gray-800"
                                    }`}
                                    style={isSelected ? { color: style.text, background: style.bg } : {}}
                                >
                                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: style.dot, flexShrink: 0 }} />
                                    {opt.label}
                                    {isSelected && (
                                        <Check size={12} style={{ marginLeft: "auto", color: style.dot }} />
                                    )}
                                </div>
                            </PopoverPrimitive.Close>
                        );
                    })}
                </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>
    );
}
