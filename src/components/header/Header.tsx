import { useNavigate } from "react-router";
import "./Header.css";
import { alliancePath, muCountriesPath, warsPath } from "../../routes/RoutePath";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <span className="header-title">War Era Explorer</span>
            <nav className="nav-bar">
                <a className="nav-item" onClick={() => navigate(alliancePath)}>Alliances</a>
                <a className="nav-item" onClick={() => navigate(warsPath)}>Wars</a>
                <a className="nav-item" onClick={() => navigate(muCountriesPath)}>MU x Countries</a>
            </nav>
        </header>
    );
}