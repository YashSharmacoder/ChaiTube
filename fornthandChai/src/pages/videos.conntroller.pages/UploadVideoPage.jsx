import { useState, useRef } from "react";
import UploadModel from "./upload/UploadModel";

function UploadVideoPage() {
    const [videoFile, setVideoFile] = useState(null);
    const [showModel, setShowModel] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const openFile = (file) => {
        if (file) {
            setVideoFile(file);
            setShowModel(true);
        }
    };

    const handleSelectVideo = (e) => {
        openFile(e.target.files[0]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        openFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
                className={`w-full max-w-xl rounded-2xl border-2 border-dashed p-16 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ${
                    isDragging
                        ? "border-black bg-gray-100"
                        : "border-gray-300 bg-white hover:border-gray-400"
                }`}
            >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-8 h-8 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                </div>

                <h2 className="text-xl font-semibold mb-2">
                    Drag and drop video files to upload
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                    Your videos will be private until you publish them
                </p>

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                    }}
                    className="bg-black text-white px-6 py-2.5 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Select file
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleSelectVideo}
                    className="hidden"
                />
            </div>

            {showModel && (
                <UploadModel
                    videoFile={videoFile}
                    onClose={() => setShowModel(false)}
                    onPublished={(video) => console.log("Published:", video)}
                />
            )}
        </div>
    );
}

export default UploadVideoPage;