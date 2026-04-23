import { useMemo } from "react";
import type { Country } from "../../../models/country/Country";
import { SearchableSelect } from "../../common/SearchableSelect";

interface CountryWarsFiltersProps {
    countries: Country[];
    selectedCountryId: string | null;
    onCountryChange: (id: string | null) => void;
    minWars: number;
    maxWars: number;
    handleMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minLimitWars?: number;
    maxLimitWars?: number;
}

const inputStyle: React.CSSProperties = {
    width: "80px",
    padding: "6px 10px",
    border: "1px solid #b0bec5",
    borderRadius: "6px",
    fontSize: "0.95em",
    color: "#213547",
    background: "#fff",
    outline: "none",
};

const labelStyle: React.CSSProperties = {
    fontSize: "0.75em",
    fontWeight: 600,
    color: "#546e7a",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    marginBottom: "4px",
    display: "block",
};

export const CountryWarsFilters = ({ countries, selectedCountryId, onCountryChange, minWars, maxWars, handleMinChange, handleMaxChange, minLimitWars, maxLimitWars }: CountryWarsFiltersProps) => {
    const sortedCountries = useMemo(
        () => [...countries].sort((a, b) => a.name.localeCompare(b.name)).map(c => ({ id: c._id, name: c.name })),
        [countries]
    );

    return (
        <div style={{
            marginBottom: "24px",
            padding: "14px 20px",
            background: "#f5f7fa",
            border: "1px solid #d0d7de",
            borderLeft: "4px solid rgba(23, 30, 34, 0.85)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "flex-end",
            gap: "20px",
        }}>
            <span style={{
                fontSize: "0.8em",
                fontWeight: 700,
                color: "rgba(23, 30, 34, 0.85)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                alignSelf: "center",
                paddingRight: "8px",
                borderRight: "1px solid #d0d7de",
            }}>
                Filters
            </span>
            <div>
                <label style={labelStyle}>Country</label>
                <SearchableSelect
                    options={sortedCountries}
                    selectedId={selectedCountryId}
                    placeholder="Select a country…"
                    onChange={onCountryChange}
                />
            </div>
            <div>
                <label htmlFor="minWars" style={labelStyle}>Min Wars</label>
                <input
                    type="number"
                    id="minWars"
                    value={minWars}
                    onChange={handleMinChange}
                    min={minLimitWars}
                    max={maxLimitWars}
                    style={inputStyle}
                    disabled={selectedCountryId !== null}
                />
            </div>
            <div>
                <label htmlFor="maxWars" style={labelStyle}>Max Wars</label>
                <input
                    type="number"
                    id="maxWars"
                    value={maxWars}
                    onChange={handleMaxChange}
                    min={minLimitWars}
                    max={maxLimitWars}
                    style={inputStyle}
                    disabled={selectedCountryId !== null}
                />
            </div>
        </div>
    );
}
