import { useMemo } from "react";
import type { Alliance } from "../../../models/alliance/Alliance";
import type { Country } from "../../../models/country/Country";
import { SearchableSelect } from "../../common/SearchableSelect";

interface CountryAlliancesFiltersProps {
  alliances: Alliance[];
  countries: Country[];
  selectedAllianceId: string | null;
  selectedCountryId: string | null;
  onAllianceChange: (id: string | null) => void;
  onCountryChange: (id: string | null) => void;
}

const inputGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
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

export const CountryAlliancesFilters = ({
  alliances,
  countries,
  selectedAllianceId,
  selectedCountryId,
  onAllianceChange,
  onCountryChange,
}: CountryAlliancesFiltersProps) => {
  const sortedAlliances = useMemo(
    () =>
      [...alliances]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((a) => ({ id: a._id, name: a.name })),
    [alliances]
  );

  const sortedCountries = useMemo(
    () =>
      [...countries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({ id: c._id, name: c.name })),
    [countries]
  );

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
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Alliance</label>
        <SearchableSelect
          options={sortedAlliances}
          selectedId={selectedAllianceId}
          placeholder="Select an alliance…"
          onChange={onAllianceChange}
        />
      </div>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Country</label>
        <SearchableSelect
          options={sortedCountries}
          selectedId={selectedCountryId}
          placeholder="Select a country…"
          onChange={onCountryChange}
        />
      </div>
    </div>
  );
};
