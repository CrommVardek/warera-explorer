import { useMemo, useState } from "react";
import { useCountries } from "../../../services/CountryService";
import { useMilitaryUnits } from "../../../services/MilitaryUnitService";
import { useUsers } from "../../../services/UserService";
import { MuCountriesRelationships } from "./MuCountriesRelationships";
import { MuCountriesFilters } from "./MuCountriesFilters";

export const MilitaryUnitsAndCountryNetworkPage = () => {

    const { countries, loading } = useCountries();
    const { militaryUnits, loading: muLoading } = useMilitaryUnits();

    const muMembersId = useMemo(() => {
        return militaryUnits.map(mu => mu.members).flat();
    }, [militaryUnits]);

    const { users, loading: usersLoading } = useUsers(muMembersId);

    const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
    const [selectedMuId, setSelectedMuId] = useState<string | null>(null);

    const muCountryLinks = useMemo(() => {
        const map = new Map<string, Set<string>>();
        for (const mu of militaryUnits) {
            const linked = new Set(
                mu.members
                    .map(m => users.find(u => u._id === m)?.country)
                    .filter((c): c is string => c !== undefined)
            );
            map.set(mu._id, linked);
        }
        return map;
    }, [militaryUnits, users]);

    const filteredCountries = useMemo(() => {
        if (selectedCountryId) return countries.filter(c => c._id === selectedCountryId);
        if (selectedMuId) {
            const linked = muCountryLinks.get(selectedMuId) ?? new Set<string>();
            return countries.filter(c => linked.has(c._id));
        }
        return countries;
    }, [countries, selectedCountryId, selectedMuId, muCountryLinks]);

    const filteredMUs = useMemo(() => {
        if (selectedMuId) return militaryUnits.filter(mu => mu._id === selectedMuId);
        if (selectedCountryId) {
            return militaryUnits.filter(mu => (muCountryLinks.get(mu._id) ?? new Set<string>()).has(selectedCountryId));
        }
        return militaryUnits;
    }, [militaryUnits, selectedCountryId, selectedMuId, muCountryLinks]);

    return (
        (loading || muLoading || usersLoading) ? <p>Loading…</p> :
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h1>MU with Countries Network</h1>
                <MuCountriesFilters
                    countries={countries}
                    militaryUnits={militaryUnits}
                    selectedCountryId={selectedCountryId}
                    selectedMuId={selectedMuId}
                    onCountryChange={setSelectedCountryId}
                    onMuChange={setSelectedMuId}
                />
                <MuCountriesRelationships countries={filteredCountries} militaryUnits={filteredMUs} users={users} />
            </div>
    );
}