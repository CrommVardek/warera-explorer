import { useMemo, useState } from "react";
import { useCountries } from "../../../services/CountryService";
import { CountryAlliances } from "./CountryAlliances";

export const CountriesAlliancesPage = () => {
  const { countries, loading } = useCountries();

  const [minNumberOfAllies] = useState(0);
  // const [maxNumberOfAllies] = useState(countries.map(c => c.allies.length).reduce((a, b) => Math.max(a, b), 0));

  const filteredCountries = useMemo(() => {
    return countries
      .filter(c => c.allies.length >= minNumberOfAllies)
      //.filter(c => c.allies.length <= maxNumberOfAllies)
      ;
  }, [countries, minNumberOfAllies]);

  // const onAlliesRangeChange = useCallback((min: number, max: number) => {
  //   setMinNumberOfAllies(min);
  //   setMaxNumberOfAllies(max);
  // }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Alliance Network</h1>
      {/* <CountryAlliancesFilters minAllies={minNumberOfAllies} maxAllies={maxNumberOfAllies} onAlliesRangeChange={onAlliesRangeChange} /> */}
      <CountryAlliances countries={filteredCountries} />
    </div>
  );
}
