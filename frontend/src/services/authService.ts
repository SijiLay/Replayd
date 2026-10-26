const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const AUTH_URL = `${API_BASE_URL}/auth`

export type SignupRequest = {
    username: string
    email: string
    password: string
}

export type LoginRequest = {
    username: string
    password: string
}

export type UserResponse = {
    id: number
    username: string
    email: string
    role: "USER" | "ADMIN"
}

export type LoginResponse = {
    token: string
    userId: number
    username: string
    role: "USER" | "ADMIN"
}

export async function signup(
    request: SignupRequest
): Promise<UserResponse> {

    const response = await fetch(`${AUTH_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        throw new Error("Signup failed")
    }

    return response.json()
}

export async function login(
    request: LoginRequest
): Promise<LoginResponse> {

    const response = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request)
    })

    if (!response.ok) {
        throw new Error("Login failed")
    }

    return response.json()
}