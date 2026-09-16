import { useState } from "react";
import  {registerUser}  from "../../api/authApi";
import InputField from "../../components/InputField"
import FileInput from "../../components/FileInput";
import Button from '../../components/Button'

function Register() {

    const [ username, setUsername ] = useState("");
    const [ fullName, setFullName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("")
    const [ avatar, setAvatar ] = useState(null)
    const [ coverImage, setCoverImage ] = useState(null)
    
    const [ loading , setLoading ] = useState(false)
    const [ error, setError ] = useState("")
    const [ success, setSuccess ] = useState("")

    const handleSubmit = async(e) =>{
        e.preventDefault();
        setError("")
        setSuccess("")
    

    if (!avatar) {
      setError("Avatar file is required");
      return;
    }

    if (!fullName.trim() || !email.trim() || !username.trim() || !password.trim()) {
      setError("All field is required");
      return;
    } 

    const formData = new FormData();
    formData.append("fullName",fullName)
    formData.append("username",username)
    formData.append("email",email)
    formData.append("password",password)
    formData.append("avatar",avatar)
    if (coverImage) {
        formData.append("coverImage",coverImage)
    }

    try {
        setLoading(true)

        const data = await registerUser(formData);

        setSuccess(data.message)

         setFullName("");
         setEmail("");
         setUsername("");
         setPassword("");
         setAvatar(null);
         setCoverImage(null);
    } catch (err) {
        setError(err.response?.data?.message || "Registration failed")
    }
    finally {
        setLoading(false)
    }
}


    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label = "FullName :"
                        placeholder = "Enter your Name"
                        type = "text"
                        value={fullName}
                        onChange={ (e) => setFullName(e.target.value) }
                    />
                    <InputField
                        label = "User Name :"
                        placeholder = "Enter your Username"
                        type = "text"
                        value = {username}
                        onChange = { (e) => setUsername(e.target.value) }
                    />
                    <InputField
                        label = "Email : "
                        placeholder = "Enter your email"
                        type = "email"
                        value = {email}
                        onChange = { (e) => setEmail(e.target.value) }
                    />
                    <FileInput
                        label = "Avatar"
                        accept = "image/*"
                        onChange = { (e) => setAvatar(e.target.files[0]) }
                    />
                    <FileInput
                        label = "Cover Image "
                        accept = "image/*"
                        onChange = { (e) => setCoverImage(e.target.files[0]) }
                    />
                    <InputField
                        label = "Password"
                        placeholder = "Enter your  password"
                        type = "password"
                        value = {password}
                        onChange = { (e) => setPassword(e.target.value) }
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled = {loading}
                    >{loading ? "Registering..." : "Register"}</Button>
                </form>

                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm mt-3 text-center">{success}</p>}
            </div>
        </div>
    )
}

export default Register