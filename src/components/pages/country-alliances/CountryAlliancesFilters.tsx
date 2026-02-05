
interface CountryAlliancesFiltersProps {
    minAllies: number;
    maxAllies: number;
    handleMinChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleMaxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minLimitAllies?: number;
    maxLimitAllies?: number;
}

export const CountryAlliancesFilters = ({ minAllies, maxAllies, handleMinChange, handleMaxChange, minLimitAllies, maxLimitAllies }: CountryAlliancesFiltersProps) => {

    return (
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
            <div>
                <label htmlFor="minAllies">Min Allies:</label>
                <input
                    type="number"
                    id="minAllies"
                    value={minAllies}
                    onChange={handleMinChange}
                    min={minLimitAllies}
                    max={maxLimitAllies}
                    style={{ marginLeft: "5px", padding: "5px" }}
                />
            </div>
            <div>
                <label htmlFor="maxAllies">Max Allies:</label>
                <input
                    type="number"
                    id="maxAllies"
                    value={maxAllies}
                    onChange={handleMaxChange}
                    min={minLimitAllies}
                    max={maxLimitAllies}
                    style={{ marginLeft: "5px", padding: "5px" }}
                />
            </div>
        </div>
    );
}