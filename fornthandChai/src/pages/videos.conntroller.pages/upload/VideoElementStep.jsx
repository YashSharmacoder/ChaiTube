function VideoElementsStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-1">Video elements</h3>
        <p className="text-sm text-gray-600">
          Use cards and an end screen to show viewers related videos, websites and calls to action.{" "}
          <a href="#" className="text-blue-600">Learn more</a>
        </p>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">▷</span>
          <div>
            <p className="font-medium">Related video</p>
            <p className="text-sm text-gray-600">Connect another of your videos to your video</p>
          </div>
        </div>
        <button type="button" className="bg-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-300">
          Add
        </button>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">▤</span>
          <div>
            <p className="font-medium">Subtitles</p>
            <p className="text-sm text-gray-600">Reach a broader audience by adding subtitles to your video</p>
          </div>
        </div>
        <button type="button" className="bg-gray-200 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-300">
          Add
        </button>
      </div>
    </div>
  );
}

export default VideoElementsStep;