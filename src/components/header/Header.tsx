import { useNavigate } from "react-router";
import "./Header.css";

export const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <span className="header-title">War Era Explorer</span>
            <nav className="nav-bar">
                <a className="nav-item" onClick={() => navigate("/alliances")}>Alliances</a>
                <a className="nav-item" onClick={() => navigate("/wars")}>Wars</a>
            </nav>
        </header>
    );
}