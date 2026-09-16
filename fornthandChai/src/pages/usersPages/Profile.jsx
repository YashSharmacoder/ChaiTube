import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext"
import InputField from "../../components/InputField"
import Button from "../../components/Button"
import FileInput from "../../components/FileInput"
import { updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../../api/authApi"
import PageLoader from  "../../components/PageLoader"

function Profile() {
    const { user, setUser } = useAuth();
    const [ fullName, setFullName ] = useState("")
    const [ email ,setEmail ] = useState("")

    const [ avatarFile, setAvatarFile ] = useState(null)
    const [ coverImageFile, setCoverImageFile ] = useState(null)
    const [ avatarPreview,setAvatarPreview ] = useState(null)
    const [ coverImagePreview, setCoverImagePreview ] = useState(null)

    const [loadingDetails, setLoadingDetails] = useState(false);
    const [loadingAvatar, setLoadingAvatar] = useState(false);
    const [loadingCover, setLoadingCover] = useState(false);

    const [errorDetails, setErrorDetails] = useState("");
    const [errorAvatar, setErrorAvatar] = useState("");
    const [errorCover, setErrorCover] = useState("");

    const [successDetails, setSuccessDetails] = useState("");
    const [successAvatar, setSuccessAvatar] = useState("");
    const [successCover, setSuccessCover] = useState("");

    // Load user data ON MOUNT
    useEffect(() => {
    if (user) {
        // eslint-disable-next-line 
        setFullName(user.fullName || "");   
        setEmail(user.email || "");
        setAvatarPreview(user.avatar);
        setCoverImagePreview(user.coverImage);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Empty = run once when component loads
    
    //handle avatar file selection
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file)
            setAvatarPreview(URL.createObjectURL(file))
        }
    }

    // Handle cover Image file selection
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setCoverImageFile(file)
            setCoverImagePreview(URL.createObjectURL(file))
        }
    }

    // Update account details
    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        setErrorDetails("")
        setSuccessDetails("")

        if (!fullName.trim() || !email.trim()) {
            setErrorDetails("All fields are required")
            return
        }

        try {
            setLoadingDetails(true)
            const data = await updateAccountDetails(fullName,email)
            setUser(data.data)
            setSuccessDetails(data.message)
        } catch (err) {
            setErrorDetails(err.response?.data?.message || "Failed to update")
        } finally {
            setLoadingDetails(false)
        }
    }

    // update avatar 
    const handleUpdateAvatar = async (e) => {
        e.preventDefault()
        setErrorAvatar("")
        setSuccessAvatar("")

        if (!avatarFile) {
            setErrorAvatar("Please select an avatar image")
            return
        }

        try {
            setLoadingAvatar(true)
            const data = await updateUserAvatar(avatarFile)
            setUser(data.data)
            setSuccessAvatar(data.message)
            setAvatarFile(null)
        } catch (err) {
            setErrorAvatar(err.response?.data?.message || "Failed to upload avatar")
        } finally {
            setLoadingAvatar(false)
        }
    }

    // update cover Image 
    const handleUpdateCoverImage = async (e) => {
        e.preventDefault()
        setErrorCover("")
        setSuccessCover("")

        if (!coverImageFile) {
            setErrorCover("Please select a cover image")
            return
        }

        try {
            setLoadingCover(true)
            const data = await updateUserCoverImage(coverImageFile)
            setUser(data.data)
            setSuccessCover(data.message)
            setCoverImageFile(null)
        } catch (err) {
            setErrorCover(err.response?.data?.message || "Failed to upload cover image")
        } finally {
            setLoadingCover(false)
        }
    }

    if (!user) {
        return (
            <PageLoader text="Loading your profile..."/>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-600 mt-2">Manage your profile and account preferences </p>
                </div>

                {/* Cover Image Section */}
                <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                        {coverImagePreview  ? (
                            <img
                                src={coverImagePreview}
                                alt="Cover"
                                className="w-full h-full object-cover" 
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-300 to-gray-400">
                                <span className="text-gray-600">No cover image</span>
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/0 hover:bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-all cursor-pointer">
                            <FileInput
                                accept="image/*"
                                onChange={handleCoverImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <span className="text-white font-medium">Change cover image</span>
                        </label>
                    </div>

                    {/* Avatar Section */}
                    <div className="px-8 pb-8">
                        <div className="flex items-end gap-4 -mt-16 mb-6 relative z-10">
                            <div className="relative">
                                <img
                                    src={avatarPreview || "https://via.placeholder.com/120"}
                                    alt="Avatar"
                                    className="w-32 h-32 rounded-full border-4 border-white object-cover bg-gray-200"
                                />
                                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 cursor-pointer transition-colors">
                                    <FileInput
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                    />
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </label>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                                <p className="text-gray-600">@{user.username}</p>
                            </div>
                        </div>

                        {/* Update Avatar Form */}
                        {avatarFile && (
                            <form onSubmit={handleUpdateAvatar} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold mb-2">Update Avatar</h3>
                                {errorAvatar && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
                                        {errorAvatar}
                                    </div>
                                )}
                                {successAvatar && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm mb-3">
                                        {successAvatar}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button 
                                        type="submit" 
                                        disabled={loadingAvatar} 
                                        className="bg-blue-600">
                                            {loadingAvatar ? "Uploading..." : "Save Avatar"}
                                        </Button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAvatarFile(null)
                                            setAvatarPreview(user.avatar)
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Update Cover Image */}
                        {coverImageFile && (
                            <form onSubmit={handleUpdateCoverImage} className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <h3 className="font-semibold mb-2">Update Cover Image</h3>
                                {errorCover && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm mb-3">
                                        {errorCover}
                                    </div>
                                )}
                                {successCover && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded text-sm mb-3">
                                        {successCover}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Button 
                                        type="submit" 
                                        disabled={loadingCover} 
                                        className="bg-blue-600"
                                    >
                                        {loadingCover ? "Uploading..." : "Save Cover Image"}
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={ () => {
                                            setCoverImageFile(null)
                                            setCoverImagePreview(user.coverImage)
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
                {/* Account Details Section */}
                <div className="bg-white rounded-2xl shadow-md p-8">
                    <h3 className="text-2xl font-bold mb-6">Account Information</h3>

                    <form onSubmit={handleUpdateDetails} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Full Name"
                                placeholder="Your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-600 border border-gray-200 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
                            </div>
                        </div>

                        {errorDetails && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {errorDetails}
                            </div>
                        )}

                        {successDetails && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {successDetails}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto" 
                            disabled={loadingDetails}
                        >
                            {loadingDetails ? "Saving..." : "Save Changes"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile