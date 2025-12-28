import { useMemo } from "react";
import { useCountries } from "../../../services/CountryService";
import { useMilitaryUnits } from "../../../services/MilitaryUnitService";
import { useUsers } from "../../../services/UserService";
import { MuCountriesRelationships } from "./MuCountriesRelationships";

export const MilitaryUnitsAndCountryNetworkPage = () => {

    const { countries, loading } = useCountries();

    const { militaryUnits, loading: muLoading } = useMilitaryUnits();

    const muMembersId = useMemo(() => {
        return militaryUnits.map(mu => mu.members).flat();
    }, [militaryUnits]);

    const { users, loading: usersLoading } = useUsers(muMembersId)

    console.log({ countries, militaryUnits, users });

    return (
        (loading || muLoading || usersLoading) ? <p>Loading…</p> :
            <div>
                <h1>MU with Countries Network</h1>
                <MuCountriesRelationships countries={countries} militaryUnits={militaryUnits}  users={users}/>
            </div>
    );
}