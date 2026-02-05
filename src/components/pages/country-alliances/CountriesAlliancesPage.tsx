import { useCallback, useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useCountries } from "../../../services/CountryService";
import { CountryAlliances } from "./CountryAlliances";
import { CountryAlliancesFilters } from "./CountryAlliancesFilters";

export const CountriesAlliancesPage = () => {
  const { countries, loading } = useCountries();

  const minLimitAllies = 0;
  const maxLimitAllies = useMemo(() => {
    return countries.map(c => c.allies.length).reduce((a, b) => Math.max(a, b), 0);
  }, [countries]);

  useEffect(() => {
    setMaxNumberOfAllies(maxLimitAllies);
  }, [maxLimitAllies]);

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
    return countries
      .filter(c => c.allies.length >= minNumberOfAllies)
      .filter(c => c.allies.length <= maxNumberOfAllies)
      ;
  }, [countries, minNumberOfAllies, maxNumberOfAllies]);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Alliance Network</h1>
      <CountryAlliancesFilters
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
