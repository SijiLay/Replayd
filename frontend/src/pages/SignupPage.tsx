import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { signup } from "../services/authService"

import "./AuthPage.css"

export default function SignupPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const navigate = useNavigate()

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        try {
            setError(null)

            await signup({
                username,
                email,
                password
            })

            navigate("/login")

        } catch {
            setError("Could not create account")
        }
    }

    return (
        <main className="auth-page">

            <section className="auth-card">

                <h1>Create account</h1>

                <p className="auth-subtitle">
                    Join Replayd and start tracking the games you watch.
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
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(event) =>
                            setEmail(event.target.value)
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
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Sign in
                    </Link>
                </p>

            </section>

        </main>
    )
}