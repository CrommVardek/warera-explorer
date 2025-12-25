import { useCountries } from "../../../services/CountryService";
import { useMilitaryUnits } from "../../../services/MilitaryUnitService";
import { useUsers } from "../../../services/UserService";

export const MilitaryUnitsAndCountryNetworkPage = () => {

    const { countries, loading } = useCountries();

    const { militaryUnits, loading: muLoading } = useMilitaryUnits();

    const { users, loading: usersLoading } = useUsers(militaryUnits.map(mu => mu.members).flat())

    console.log({ countries, militaryUnits, users });

    return (
        (loading || muLoading || usersLoading) ? <p>Loading…</p> :
            <div>
                <h1>MU with Countries Network</h1>
            </div>
    );
}