import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";
import App from "../App";
import { CountriesAlliancesPage } from "../components/pages/country-alliances/CountriesAlliancesPage";
import { CountriesWarsPage } from "../components/pages/country-wars/CountriesWarsPage";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />} >
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/alliances" element={<CountriesAlliancesPage />} />
            <Route path="/wars" element={<CountriesWarsPage />} />
        </Route>
    ),
    { basename: import.meta.env.VITE_ROUTER_BASE }
)