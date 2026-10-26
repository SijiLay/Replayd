const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const AUTH_URL = `${API_BASE_URL}/auth`

async function getErrorMessage(response: Response) {
    const text = await response.text()

    try {
        const data = JSON.parse(text)

        if (typeof data === "object" && data !== null) {
            const messages = Object.values(data)

            if (messages.length > 0) {
                return String(messages[0])
            }
        }
    } catch {
        // Response was not JSON
    }

    return text
}

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
        const message = await getErrorMessage(response)
        throw new Error(message || "Could not create account")
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
        const message = await getErrorMessage(response)
        throw new Error(message || "Login failed")
    }

    return response.json()
}