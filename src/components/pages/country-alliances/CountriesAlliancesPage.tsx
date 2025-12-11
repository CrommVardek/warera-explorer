import { useCountries } from "../../../services/CountryService";
import { CountryAlliances } from "./CountryAlliances";

export const CountriesNetworkPage = () => {
  const { countries, loading } = useCountries();

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Alliance Network</h1>
      <CountryAlliances countries={countries} />
    </div>
  );
}
