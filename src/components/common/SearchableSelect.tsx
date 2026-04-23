import { useState, useRef, useEffect } from "react";

export interface SearchableSelectOption {
    id: string;
    name: string;
}

interface SearchableSelectProps {
    options: SearchableSelectOption[];
    selectedId: string | null;
    placeholder: string;
    onChange: (id: string | null) => void;
}

export const SearchableSelect = ({ options, selectedId, placeholder, onChange }: SearchableSelectProps) => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedName = options.find(o => o.id === selectedId)?.name ?? "";

    useEffect(() => {
        if (!open) setSearch("");
    }, [open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

    const handleSelect = (id: string) => {
        onChange(id);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setOpen(false);
    };

    return (
        <div ref={containerRef} style={{ position: "relative", width: "200px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #b0bec5",
                    borderRadius: "6px",
                    background: "#fff",
                    overflow: "hidden",
                }}
                onClick={() => setOpen(true)}
            >
                <input
                    type="text"
                    value={open ? search : selectedName}
                    placeholder={placeholder}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setOpen(true)}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        border: "none",
                        outline: "none",
                        fontSize: "0.95em",
                        color: "#213547",
                        background: "transparent",
                        cursor: "text",
                        minWidth: 0,
                        width: "100%",
                    }}
                />
                {selectedId && !open && (
                    <button
                        onMouseDown={handleClear}
                        style={{
                            padding: "0 8px",
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            color: "#90a4ae",
                            fontSize: "1.1em",
                            lineHeight: 1,
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                )}
            </div>
            {open && (
                <div style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    border: "1px solid #b0bec5",
                    borderRadius: "6px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                    zIndex: 1000,
                    maxHeight: "220px",
                    overflowY: "auto",
                }}>
                    {filtered.length === 0
                        ? <div style={{ padding: "8px 12px", color: "#90a4ae", fontSize: "0.9em" }}>No results</div>
                        : filtered.map(o => (
                            <div
                                key={o.id}
                                onMouseDown={() => handleSelect(o.id)}
                                onMouseEnter={() => setHoveredId(o.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                style={{
                                    padding: "7px 12px",
                                    cursor: "pointer",
                                    fontSize: "0.9em",
                                    color: o.id === selectedId || o.id === hoveredId ? "#fff" : "#213547",
                                    background: o.id === selectedId
                                        ? "rgba(23, 30, 34, 0.85)"
                                        : o.id === hoveredId
                                            ? "rgba(23, 30, 34, 0.55)"
                                            : "transparent",
                                    userSelect: "none",
                                }}
                            >
                                {o.name}
                            </div>
                        ))
                    }
                </div>
            )}
        </div>
    );
};
