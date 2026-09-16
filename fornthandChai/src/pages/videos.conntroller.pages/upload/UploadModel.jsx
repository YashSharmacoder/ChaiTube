import { useState } from "react";
import StepIndicator from './StepIndicator'
import DetailsStep from './DetailsStep'
import VideoElementsStep from './VideoElementStep'
import ChecksStep from './CheckStep'
import VisibilityStep from './VisibilityStep'
import VideoPreview from './VideoPreview'
import publishVideo from '../../../api/videoApi'

const steps = ["Details", "Video elements", "Checks", "Visibility"];

function UploadModel({ videoFile, onClose, onPublished }) {
    const [activeStep, setActiveStep] = useState(0);
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [thumbnail, setThumbnail] = useState(null)
    const [visibility, setVisibility] = useState("private")

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [uploadResult, setUploadResult] = useState(null) // null | "success" | "error"

    const isLastStep = activeStep === steps.length - 1;

    const handleBack = () => {
        setError("");
        setActiveStep((s) => Math.max(s - 1, 0));
    };

    const handleNext = async () => {
        if (!isLastStep) {
            if (activeStep === 0) {
                if (!title.trim() || !description.trim()) {
                    setError("Title and description are required");
                    return;
                }
                if (!thumbnail) {
                    setError("Thumbnail is required");
                    return;
                }
            }
            setError("");
            setActiveStep((s) => s + 1);
            return;
        }

        const formData = new FormData();
        formData.append("title", title)
        formData.append("description", description)
        formData.append("videoFile", videoFile)
        formData.append("thumbnail", thumbnail)
        // visibility isn't sent yet — publishAVideo currently hardcodes isPublished: true.
        // formData.append("visibility", visibility) once the backend accepts it.

        try {
            setLoading(true)
            setError("")
            const data = await publishVideo(formData)
            setUploadResult("success")
            onPublished?.(data.data)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to publish video")
            setUploadResult("error")
        } finally {
            setLoading(false)
        }
    }

    const handleDialogClose = () => {
        const wasSuccess = uploadResult === "success";
        setUploadResult(null);
        if (wasSuccess) {
            onClose();
        }
    }

    const renderStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <DetailsStep
                        title={title}
                        onTitleChange={setTitle}
                        description={description}
                        onDescriptionChange={setDescription}
                        onThumbnailChange={setThumbnail}
                    />
                );
            case 1: return <VideoElementsStep />;
            case 2: return <ChecksStep />;
            case 3: return <VisibilityStep visibility={visibility} onVisibilityChange={setVisibility} />;
            default: return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl flex flex-col overflow-hidden">

                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold truncate">{title.trim() ? title : videoFile?.name}</h2>
                    <div className="flex items-center gap-3">
                        <span className="text-sm bg-gray-100 px-3 py-1 rounded-full capitalize">Saved as {visibility}</span>
                        <button onClick={onClose} className="text-2xl leading-none hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center">×</button>
                    </div>
                </div>

                <div className="px-6 pt-4">
                    <StepIndicator steps={steps} activeStep={activeStep} />
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8">
                    {renderStep()}
                    <VideoPreview videoFile={videoFile} />
                </div>

                <div className="flex items-center justify-between px-6 py-4 border-t bg-white">
                    <span className="text-sm text-red-500">{error}</span>
                    <div className="flex items-center gap-3">
                        {activeStep > 0 && (
                            <button onClick={handleBack} disabled={loading} className="border px-6 py-2 rounded-full font-medium hover:bg-gray-50 disabled:opacity-50">
                                Back
                            </button>
                        )}
                        <button onClick={handleNext} disabled={loading} className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 disabled:opacity-50">
                            {loading ? "Saving..." : isLastStep ? "Save" : "Next"}
                        </button>
                    </div>
                </div>
            </div>

            {uploadResult && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
                    <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center space-y-4">
                        {uploadResult === "success" ? (
                            <>
                                <div className="text-4xl text-green-600">✓</div>
                                <p className="font-semibold">Video uploaded successfully</p>
                            </>
                        ) : (
                            <>
                                <div className="text-4xl text-red-500">✕</div>
                                <p className="font-semibold">Upload failed</p>
                                <p className="text-sm text-gray-500">{error}</p>
                            </>
                        )}
                        <button
                            onClick={handleDialogClose}
                            className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UploadModel;