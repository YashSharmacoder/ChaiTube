function VideoPreview({ videoFile }) {
  const previewUrl = videoFile ? URL.createObjectURL(videoFile) : null;

  return (
    <div className="space-y-3">
      <div className="w-full aspect-9/16 bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
        {previewUrl ? (
          <video src={previewUrl} controls className="w-full h-full object-contain" />
        ) : (
          <span className="text-white text-sm">No video selected</span>
        )}
      </div>
      <div>
        <p className="text-xs text-gray-600">Filename</p>
        <p className="text-sm truncate">{videoFile?.name}</p>
      </div>
    </div>
  );
}

export default VideoPreview;