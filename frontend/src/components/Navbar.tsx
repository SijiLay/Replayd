import { Link } from "react-router-dom"

function Navbar() {
    return (
        <nav>
            <h1>Replayd</h1>

            <Link to="/games">Games</Link>
            <Link to="/history">History</Link>
        </nav>
    )
}

export default Navbar