import axiosInstance from "./axiosInstance";

const publishVideo = async (formdata) => {
    const response = await axiosInstance.post("/videos/uploadvideo", formdata, {
        headers : { "Content-Type" : "multipart/form-data" },
    })
    return response.data;
} 

export const fetchVideos = async ({ page, limit, query, sortBy, sortType, userId }) => {
    const { data } = await axiosInstance.get("/videos/getAllVideos", {
        params : { page, limit, query, sortBy, sortType, userId },
    })

    const items = data.data || []
    return {
        data : items,
        hasMore : items.length === limit,
        page,
        limit
    }
}

export const getVideoById = async (videoId) => {
    const res = await axiosInstance.get(`/videos/${videoId}`)
    return res.data
}

export const updateVideo = async (videoId, { title, description, thumbnail }) => {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (description) formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const response = await axiosInstance.patch(`/videos/${videoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

export const deleteVideo = async (videoId) => {
    const response = await axiosInstance.delete(`/videos/${videoId}`);
    return response.data;
};

export const togglePublishStatus = async (videoId) => {
    const response = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
    return response.data;
};

export default publishVideo