import { useMemo } from "react";
import type { Country } from "../../../models/country/Country";
import type { MilitaryUnit } from "../../../models/mu/MilitaryUnit";
import { SearchableSelect } from "../../common/SearchableSelect";

interface MuCountriesFiltersProps {
  countries: Country[];
  militaryUnits: MilitaryUnit[];
  selectedCountryId: string | null;
  selectedMuId: string | null;
  onCountryChange: (id: string | null) => void;
  onMuChange: (id: string | null) => void;
}

const labelStyle: React.CSSProperties = {
  fontSize: "0.75em",
  fontWeight: 600,
  color: "#546e7a",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  marginBottom: "4px",
  display: "block",
};

export const MuCountriesFilters = ({
  countries,
  militaryUnits,
  selectedCountryId,
  selectedMuId,
  onCountryChange,
  onMuChange,
}: MuCountriesFiltersProps) => {
  const sortedCountries = useMemo(
    () =>
      [...countries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ id: c._id, name: c.name })),
    [countries],
  );
  const sortedMUs = useMemo(
    () =>
      [...militaryUnits]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((mu) => ({ id: mu._id, name: mu.name })),
    [militaryUnits],
  );

  const handleCountryChange = (id: string | null) => {
    onCountryChange(id);
    if (id) onMuChange(null);
  };

  const handleMuChange = (id: string | null) => {
    onMuChange(id);
    if (id) onCountryChange(null);
  };

  return (
    <div
      style={{
        marginBottom: "24px",
        padding: "14px 20px",
        background: "#f5f7fa",
        border: "1px solid #d0d7de",
        borderLeft: "4px solid rgba(23, 30, 34, 0.85)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "flex-end",
        gap: "20px",
      }}
    >
      <span
        style={{
          fontSize: "0.8em",
          fontWeight: 700,
          color: "rgba(23, 30, 34, 0.85)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          alignSelf: "center",
          paddingRight: "8px",
          borderRight: "1px solid #d0d7de",
        }}
      >
        Filters
      </span>
      <div>
        <label style={labelStyle}>Country</label>
        <SearchableSelect
          options={sortedCountries}
          selectedId={selectedCountryId}
          placeholder="Select a country…"
          onChange={handleCountryChange}
        />
      </div>
      <div>
        <label style={labelStyle}>Military Unit</label>
        <SearchableSelect
          options={sortedMUs}
          selectedId={selectedMuId}
          placeholder="Select an MU…"
          onChange={handleMuChange}
        />
      </div>
    </div>
  );
};
