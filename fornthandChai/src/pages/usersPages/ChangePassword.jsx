import { useState } from "react";
import { updatePassword } from "../../api/authApi";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function ChangePassword() {
    
    const [oldPassword,setOldPassword] = useState("")
    const [newPassword,setNewPassword] = useState("")
    const [confirmPassword,setConfirmPassword] = useState("")

    const [loading,setLoading] = useState(false)
    const [error,setError] = useState("")
    const [success,setSuccess] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        setSuccess("")


        if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            setError("All field is required")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("New Passowrd does not match")
            return
        }

        if (newPassword.length <4 ) {
            setError("Password  must be at least 4 characters")
            return
        }

        try {
            setLoading(true)

            // Assuming updatePassword expects an object with these exact keys
            const data = await updatePassword({oldPassword,newPassword})

            setSuccess(data.message || "Password changed successfully")

            //Clear input fields 
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            setError(err.res?.data?.message || "Failed to change password")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max--w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <InputField
                        label = "Current Password"
                        placeholder = "Enter current password"
                        type = "password"
                        value = {oldPassword}
                        onChange = { (e) => setOldPassword(e.target.value) }
                    />

                    <InputField
                        label = "New Password "
                        placeholder = "Enter new Password"
                        type = "password"
                        value = {newPassword}
                        onChange = { (e) => setNewPassword(e.target.value) }
                    />

                    <InputField
                        label = "Confirm New Password"
                        placeholder = "Confirm new Password"
                        type = "password"
                        value = {confirmPassword}
                        onChange = { (e) => setConfirmPassword(e.target.value) }
                        
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        disabled = {loading}
                    />

                    {loading ? "Updating.." : "Update Password"}
                </form>

                {/* Error and Success Messages mimicking your placement */}
                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm mt-3 text-center">{success}</p>}
            </div>
        </div>
    )
}

export default ChangePassword