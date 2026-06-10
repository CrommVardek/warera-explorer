import { useCallback, useMemo, useState } from "react";
import { useCountries } from "../../../services/CountryService";
import { useAlliances } from "../../../services/AlliancesService";
import { CountryAlliances } from "./CountryAlliances";
import { CountryAlliancesFilters } from "./CountryAlliancesFilters";
import { LoadingSpinner } from "../../common/LoadingSpinner";

export const CountriesAlliancesPage = () => {
  const { countries, loading: loadingCountries } = useCountries();
  const { alliances, loading: loadingAlliances } = useAlliances(countries);

  const [selectedAllianceId, setSelectedAllianceId] = useState<string | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);

  const handleAllianceChange = useCallback((id: string | null) => {
    setSelectedAllianceId(id);
    setSelectedCountryId(null);
  }, []);

  const handleCountryChange = useCallback((id: string | null) => {
    setSelectedCountryId(id);
    setSelectedAllianceId(null);
  }, []);

  const { filteredAlliances, filteredCountries } = useMemo(() => {
    if (selectedAllianceId) {
      const alliance = alliances.find((a) => a._id === selectedAllianceId);
      if (!alliance) return { filteredAlliances: [], filteredCountries: [] };
      const memberIds = new Set(alliance.memberCountries.map((m) => m.country));
      return {
        filteredAlliances: [alliance],
        filteredCountries: countries.filter((c) => memberIds.has(c._id)),
      };
    }

    if (selectedCountryId) {
      const country = countries.find((c) => c._id === selectedCountryId);
      if (!country) return { filteredAlliances: alliances, filteredCountries: countries };

      const countryAlliance = alliances.find((a) =>
        a.memberCountries.some((m) => m.country === selectedCountryId)
      );

      const visibleIds = new Set([selectedCountryId]);
      if (countryAlliance) {
        countryAlliance.memberCountries.forEach((m) => visibleIds.add(m.country));
      }
      if (country.defensivePacts) {
        country.defensivePacts.forEach((id) => visibleIds.add(id));
      }

      return {
        filteredAlliances: countryAlliance ? [countryAlliance] : [],
        filteredCountries: countries.filter((c) => visibleIds.has(c._id)),
      };
    }

    return { filteredAlliances: alliances, filteredCountries: countries };
  }, [alliances, countries, selectedAllianceId, selectedCountryId]);

  if (loadingCountries || loadingAlliances) return <LoadingSpinner />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>Alliance Network</h1>
      <CountryAlliancesFilters
        alliances={alliances}
        countries={countries}
        selectedAllianceId={selectedAllianceId}
        selectedCountryId={selectedCountryId}
        onAllianceChange={handleAllianceChange}
        onCountryChange={handleCountryChange}
      />
      <CountryAlliances alliances={filteredAlliances} countries={filteredCountries} />
    </div>
  );
};
