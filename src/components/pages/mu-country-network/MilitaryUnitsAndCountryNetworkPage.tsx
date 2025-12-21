import { useCountries } from "../../../services/CountryService";
import { useMilitaryUnits } from "../../../services/MilitaryUnitService";

export const MilitaryUnitsAndCountryNetworkPage = () => {

    const { countries, loading } = useCountries();

    const { militaryUnits, loading: muLoading } = useMilitaryUnits();

    console.log({ countries, militaryUnits });

    return (
        (loading || muLoading) ? <p>Loading…</p> :
            <div>
                <h1>MU with Countries Network</h1>
            </div>
    );
}