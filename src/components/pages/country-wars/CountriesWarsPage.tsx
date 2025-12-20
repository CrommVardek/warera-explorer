import { useCountries } from "../../../services/CountryService";
import { CountryWars } from "./CountryWars";

export const CountriesWarsPage = () => {
  const { countries, loading } = useCountries();

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Wars Network</h1>
      <CountryWars countries={countries} />
    </div>
  );
}
