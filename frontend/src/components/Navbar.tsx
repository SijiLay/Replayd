import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
    const [username, setUsername] = useState<string | null>(
        localStorage.getItem("username")
    )

    const navigate = useNavigate()
    const [role, setRole] = useState<string | null>(
        localStorage.getItem("role")
    )


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

        window.dispatchEvent(new Event("auth-changed"))

        navigate("/")
    }

    return (
        <nav className="navbar">

            <Link to="/" className="navbar-brand">
                Replayd
            </Link>

            <div className="navbar-links">

                <Link to="/">Home</Link>

                <Link to="/games">
                    Games
                </Link>

                <Link to="/history">
                    History
                </Link>

                {role === "ADMIN" && (
                    <Link to="/admin">
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
                    >
                        Login
                    </Link>
                )}

            </div>

        </nav>
    )
}

export default Navbar