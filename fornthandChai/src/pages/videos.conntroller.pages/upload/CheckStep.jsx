function ChecksStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-1">Checks</h3>
        <p className="text-sm text-gray-600">
          We'll check your video for issues that may restrict its visibility and then you will have
          the opportunity to fix issues before publishing your video.{" "}
          <a href="#" className="text-blue-600">Learn more</a>
        </p>
      </div>

      <div className="border-b pb-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Copyright</p>
          <span className="text-green-600 text-lg">✓</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">No issues found</p>
      </div>

      <p className="text-sm text-gray-500">
        Remember: these check results aren't final — issues may come up later that
        affect your video. <a href="#" className="text-blue-600">Learn more</a>
      </p>
    </div>
  );
}

export default ChecksStep;