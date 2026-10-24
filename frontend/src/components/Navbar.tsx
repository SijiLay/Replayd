import { Link } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                Replayd
            </Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/games">Games</Link>
                <Link to="/history">History</Link>
            </div>
        </nav>
    )
}

export default Navbar