import { useState } from "react"
import { login } from "../services/authService"
import { Link, useNavigate } from "react-router-dom"

import "./AuthPage.css"

export default function LoginPage() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)


    const navigate = useNavigate()

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault()

        try {
            setLoading(true)
            setError(null)

            const response = await login({
                username,
                password
            })

            localStorage.setItem("token", response.token)
            localStorage.setItem("username", response.username)
            localStorage.setItem("role", response.role)

            window.dispatchEvent(new Event("auth-changed"))

            navigate("/")
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("Login failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="auth-page">

            <section className="auth-card">

                <h1>Welcome back</h1>

                <p className="auth-subtitle">
                    Sign in to your Replayd account.
                </p>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                    />

                    <button
                        className="auth-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Sign up
                    </Link>
                </p>

            </section>

        </main>
    )
}