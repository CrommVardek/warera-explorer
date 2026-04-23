import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useCountries } from "../../../services/CountryService";
import { CountryAlliances } from "./CountryAlliances";
import { CountryAlliancesFilters } from "./CountryAlliancesFilters";
import { LoadingSpinner } from "../../common/LoadingSpinner";

export const CountriesAlliancesPage = () => {
  const { countries, loading } = useCountries();

  const minLimitAllies = 0;
  const maxLimitAllies = useMemo(() => {
    return countries.map(c => c.allies.length).reduce((a, b) => Math.max(a, b), 0);
  }, [countries]);

  useEffect(() => {
    setMaxNumberOfAllies(maxLimitAllies);
  }, [maxLimitAllies]);

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [minNumberOfAllies, setMinNumberOfAllies] = useState(minLimitAllies);
  const [maxNumberOfAllies, setMaxNumberOfAllies] = useState(maxLimitAllies);

  const handleMinChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinNumberOfAllies(value);
    if (value > maxNumberOfAllies) {
      setMaxNumberOfAllies(value);
    }
  }, [maxNumberOfAllies]);

  const handleMaxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxNumberOfAllies(value);
    if (value < minNumberOfAllies) {
      setMinNumberOfAllies(value);
    }
  }, [minNumberOfAllies]);

  const filteredCountries = useMemo(() => {
    if (selectedCountryId) {
      const selected = countries.find(c => c._id === selectedCountryId);
      if (!selected) return [];
      const visibleIds = new Set([selectedCountryId, ...selected.allies]);
      return countries.filter(c => visibleIds.has(c._id));
    }
    return countries
      .filter(c => c.allies.length >= minNumberOfAllies)
      .filter(c => c.allies.length <= maxNumberOfAllies);
  }, [countries, selectedCountryId, minNumberOfAllies, maxNumberOfAllies]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Alliance Network</h1>
      <CountryAlliancesFilters
        countries={countries}
        selectedCountryId={selectedCountryId}
        onCountryChange={setSelectedCountryId}
        minAllies={minNumberOfAllies}
        maxAllies={maxNumberOfAllies}
        handleMinChange={handleMinChange}
        handleMaxChange={handleMaxChange}
        minLimitAllies={minLimitAllies}
        maxLimitAllies={maxLimitAllies}
      />
      <CountryAlliances countries={filteredCountries} />
    </div>
  );
}
