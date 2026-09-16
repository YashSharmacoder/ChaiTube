import axiosInstance from "./axiosInstance";

export const createPlaylist = (name, description) =>
    axiosInstance.post("/playlists", { name, description }).then((r) => r.data);

export const getUserPlaylists = (userId) =>
    axiosInstance.get(`/playlists/user/${userId}`).then((r) => r.data);

export const getPlaylistById = (playlistId) =>
    axiosInstance.get(`/playlists/${playlistId}`).then((r) => r.data);

export const updatePlaylist = (playlistId, name, description) =>
    axiosInstance
        .patch(`/playlists/${playlistId}`, { name, description })
        .then((r) => r.data);

export const deletePlaylist = (playlistId) =>
    axiosInstance.delete(`/playlists/${playlistId}`).then((r) => r.data);

export const addVideoToPlaylist = (playlistId, videoId) =>
    axiosInstance
        .patch(`/playlists/add/${videoId}/${playlistId}`)
        .then((r) => r.data);

export const removeVideoFromPlaylist = (playlistId, videoId) =>
    axiosInstance
        .patch(`/playlists/remove/${videoId}/${playlistId}`)
        .then((r) => r.data);