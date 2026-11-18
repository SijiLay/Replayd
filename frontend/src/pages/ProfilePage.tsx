import { useEffect, useState } from "react"
import {
    getCurrentProfile,
    updateProfilePrivacy,
    type ProfileResponse
} from "../services/profileService"
import "./ProfilePage.css"

function ProfilePage() {
    const [profile, setProfile] = useState<ProfileResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadProfile() {
            try {
                setProfile(await getCurrentProfile())
            } catch {
                setError("Could not load your profile. Please try again.")
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [])

    async function handlePrivacyToggle() {
        if (!profile || updating) {
            return
        }

        setUpdating(true)
        setError(null)

        try {
            const updatedProfile = await updateProfilePrivacy(
                !profile.privateProfile
            )
            setProfile(updatedProfile)
        } catch {
            setError("Could not update your profile privacy. Please try again.")
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <main className="profile-page">
                <p role="status">Loading profile...</p>
            </main>
        )
    }

    if (!profile) {
        return (
            <main className="profile-page">
                <p className="profile-error" role="alert">
                    {error ?? "Could not load your profile."}
                </p>
            </main>
        )
    }

    return (
        <main className="profile-page">
            <header className="profile-page-header">
                <h1>Your Profile</h1>
                <p>Manage your Replayd account and profile privacy.</p>
            </header>

            <section className="profile-card" aria-label="Profile details">
                <dl className="profile-details">
                    <div className="profile-detail">
                        <dt>Username</dt>
                        <dd>{profile.username}</dd>
                    </div>
                    <div className="profile-detail">
                        <dt>Email</dt>
                        <dd>{profile.email}</dd>
                    </div>
                    <div className="profile-detail">
                        <dt>Role</dt>
                        <dd>{profile.role}</dd>
                    </div>
                </dl>

                <div className="profile-privacy">
                    <div>
                        <h2>Profile privacy</h2>
                        <p>
                            Your profile is currently{" "}
                            <strong>
                                {profile.privateProfile ? "private" : "public"}
                            </strong>
                            .
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handlePrivacyToggle}
                        disabled={updating}
                        aria-pressed={profile.privateProfile}
                    >
                        {updating
                            ? "Updating..."
                            : profile.privateProfile
                                ? "Make profile public"
                                : "Make profile private"}
                    </button>
                </div>

                {error && (
                    <p className="profile-error" role="alert">
                        {error}
                    </p>
                )}
            </section>
        </main>
    )
}

export default ProfilePage
