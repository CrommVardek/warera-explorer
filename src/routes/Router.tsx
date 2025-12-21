import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import App from "../App";
import { CountriesAlliancesPage } from "../components/pages/country-alliances/CountriesAlliancesPage";
import { CountriesWarsPage } from "../components/pages/country-wars/CountriesWarsPage";
import { alliancePath, muCountriesPath, warsPath } from "./RoutePath";
import { MilitaryUnitsAndCountryNetworkPage } from "../components/pages/mu-country-network/MilitaryUnitsAndCountryNetworkPage";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route path="/" element={<CountriesAlliancesPage />} />
            <Route path={alliancePath} element={<CountriesAlliancesPage />} />
            <Route path={warsPath} element={<CountriesWarsPage />} />
            <Route path={muCountriesPath} element={<MilitaryUnitsAndCountryNetworkPage />} />
        </Route>
    ),
    { basename: import.meta.env.VITE_ROUTER_BASE }
)