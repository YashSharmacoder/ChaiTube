import { createContext, useContext, useEffect,useState } from "react";
import { getCurrentUser } from "../api/authApi.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading , setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await getCurrentUser();
                setUser(res.data) 
            } catch (err) {
                console.log("Error : ",err);
                setUser(null)
            }finally{
                setLoading(false)
            }
        }

        checkAuth();
    }, [])

    return (
        <AuthContext.Provider value={ { user, setUser, loading } }>
            { children }
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context
}

export default { AuthContext }