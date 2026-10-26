import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import "./Navbar.css"


function Navbar() {
    const location = useLocation()

    const [username, setUsername] = useState<string | null>(
        localStorage.getItem("username")
    )

    const [role, setRole] = useState<string | null>(
        localStorage.getItem("role")
    )

    const [menuOpen, setMenuOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setMenuOpen(false)
    }, [location.pathname])


    useEffect(() => {
        function updateAuth() {
            setUsername(localStorage.getItem("username"))
            setRole(localStorage.getItem("role"))
        }

        window.addEventListener("auth-changed", updateAuth)

        return () => {
            window.removeEventListener("auth-changed", updateAuth)
        }
    }, [])

    function handleLogout() {
        localStorage.removeItem("token")
        localStorage.removeItem("username")
        localStorage.removeItem("role")

        setUsername(null)
        setRole(null)
        setMenuOpen(false)

        window.dispatchEvent(new Event("auth-changed"))

        navigate("/")
    }

    function closeMenu() {
        setMenuOpen(false)
    }

    return (
        <nav className="navbar">
            <Link
                to="/"
                className="navbar-brand"
                onClick={closeMenu}
            >
                Replayd
            </Link>

            <button
                type="button"
                className="navbar-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={menuOpen}
            >
                ☰
            </button>

            <div
                className={`navbar-links ${
                    menuOpen ? "navbar-links-open" : ""
                }`}
            >
                <Link to="/" onClick={closeMenu}>
                    Home
                </Link>

                <Link to="/games" onClick={closeMenu}>
                    Games
                </Link>

                <Link to="/history" onClick={closeMenu}>
                    History
                </Link>

                {role === "ADMIN" && (
                    <Link to="/admin" onClick={closeMenu}>
                        Admin
                    </Link>
                )}

                {username ? (
                    <>
                        <span className="navbar-username">
                            {username}
                        </span>

                        <button
                            type="button"
                            className="navbar-logout"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        className="navbar-login"
                        onClick={closeMenu}
                    >
                        Login
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar