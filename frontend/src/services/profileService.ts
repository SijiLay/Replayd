export type ProfileResponse = {
    id: number
    username: string
    email: string
    role: "USER" | "ADMIN"
    privateProfile: boolean
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"

const PROFILE_URL = `${API_BASE_URL}/profile`

function getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("token")

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
}

async function ensureSuccess(response: Response, fallbackMessage: string) {
    if (!response.ok) {
        const message = await response.text()
        throw new Error(message || fallbackMessage)
    }
}

export async function getCurrentProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_URL}/me`, {
        headers: getAuthHeaders()
    })

    await ensureSuccess(response, "Could not load profile")
    return response.json()
}

export async function updateProfilePrivacy(
    privateProfile: boolean
): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_URL}/privacy`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ privateProfile })
    })

    await ensureSuccess(response, "Could not update profile privacy")
    return response.json()
}
