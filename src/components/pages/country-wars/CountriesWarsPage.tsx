import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useCountries } from "../../../services/CountryService";
import { CountryWars } from "./CountryWars";
import { CountryWarsFilters } from "./CountryWarsFilters";
import { LoadingSpinner } from "../../common/LoadingSpinner";

export const CountriesWarsPage = () => {
  const { countries, loading } = useCountries();

  const minLimitWars = 0;
  const maxLimitWars = useMemo(() => {
    return countries.map(c => c.warsWith.length + (c.enemy ? 1 : 0)).reduce((a, b) => Math.max(a, b), 0);
  }, [countries]);

  useEffect(() => {
    setMaxNumberOfWars(maxLimitWars);
  }, [maxLimitWars]);

  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [minNumberOfWars, setMinNumberOfWars] = useState(minLimitWars);
  const [maxNumberOfWars, setMaxNumberOfWars] = useState(maxLimitWars);

  const handleMinChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMinNumberOfWars(value);
    if (value > maxNumberOfWars) {
      setMaxNumberOfWars(value);
    }
  }, [maxNumberOfWars]);

  const handleMaxChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setMaxNumberOfWars(value);
    if (value < minNumberOfWars) {
      setMinNumberOfWars(value);
    }
  }, [minNumberOfWars]);

  const filteredCountries = useMemo(() => {
    if (selectedCountryId) {
      const selected = countries.find(c => c._id === selectedCountryId);
      if (!selected) return [];
      const visibleIds = new Set([selectedCountryId, ...selected.warsWith, ...(selected.enemy ? [selected.enemy] : [])]);
      return countries.filter(c => visibleIds.has(c._id));
    }
    return countries
      .filter(c => c.warsWith.length + (c.enemy ? 1 : 0) >= minNumberOfWars)
      .filter(c => c.warsWith.length + (c.enemy ? 1 : 0) <= maxNumberOfWars);
  }, [countries, selectedCountryId, minNumberOfWars, maxNumberOfWars]);

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Wars Network</h1>
      <CountryWarsFilters
        countries={countries}
        selectedCountryId={selectedCountryId}
        onCountryChange={setSelectedCountryId}
        minWars={minNumberOfWars}
        maxWars={maxNumberOfWars}
        handleMinChange={handleMinChange}
        handleMaxChange={handleMaxChange}
        minLimitWars={minLimitWars}
        maxLimitWars={maxLimitWars}
      />
      <CountryWars countries={filteredCountries} />
    </div>
  );
}
