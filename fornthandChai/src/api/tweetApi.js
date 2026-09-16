import axiosInstance from "./axiosInstance";

export const createTweet = (content) =>
    axiosInstance.post("/tweets", { content }).then((r) => r.data);

export const getUserTweets = (userId) =>
    axiosInstance.get(`/tweets/user/${userId}`).then((r) => r.data);

export const updateTweet = (tweetId, content) =>
    axiosInstance.patch(`/tweets/${tweetId}`, { content }).then((r) => r.data);

export const deleteTweet = (tweetId) =>
    axiosInstance.delete(`/tweets/${tweetId}`).then((r) => r.data);