import  axiosInstance  from "./axiosInstance";

export const registerUser = async (formData) => {
    const response = await axiosInstance.post("/users/register", formData, {
        headers : { "Content-Type" : "multipart/form-data"},
    });
    return response.data
}

export const loginUser = async (credential) => {
    const res = await axiosInstance.post("/users/login", credential);
    return res.data
}

export const logoutUser = async () => {
    const res = await axiosInstance.post("/users/logout");
    return res.data
}

export const getCurrentUser = async () => {
    const res= await axiosInstance.get("/users/current-user")
    return res.data
}

export const updatePassword = async (passwordData) => {
    // passwordData should be { oldPassword, newPassword }
    const res = await axiosInstance.post("/users/changePassword", passwordData)
    return res.data
}

export const updateAccountDetails = async (fullName,email) => {
    const res = await axiosInstance.patch("/users/update-account", {
        fullName,
        email
    })
    return res.data
}

export const updateUserAvatar = async (avatarFile) => {
    const fromData = new FormData();
    fromData.append("avatar",avatarFile);
    const res = await axiosInstance.patch("/users/avatar", fromData , {
        headers : { "Content-Type" : "multipart/form-data" },
    })
    return res.data 
}

export const updateUserCoverImage = async (coverImageFile) => {
    const fromData = new FormData();
    fromData.append("coverImage",coverImageFile)
    const res = await axiosInstance.patch("/users/coverImage", fromData, {
        headers : { "Content-Type" : "multipart/form-data" },
    })
    return res.data
}

export const getUserChannelProfile = async (username) => {
    const res = await axiosInstance.get(`/users/c/${username}`)
    return res.data
}

export const getWatchHistory = async () => {
    const res = await axiosInstance.get(`/users/history`)
    return res.data
}

export const getChannelStats = async () => {
    const res = await axiosInstance.get("/dashboard/stats")
    return res.data
}

export const getChannelVideos = async () => {
    const res = await axiosInstance.get("/dashboard/videos")
    return res.data 
}

export const removeFromWatchHistory = async (videoId) => {
    const res = await axiosInstance.delete(`/users/history/${videoId}`)
    return res.data
}

export const clearWatchHistory = async () => {
    const res = await axiosInstance.delete(`/users/history`)
    return res.data
}
