function VisibilityStep({ visibility, onVisibilityChange }) {
  const options = [
    { value: "private", label: "Private", desc: "Only you and people who you choose can watch your video" },
    { value: "unlisted", label: "Unlisted", desc: "Anyone with the video link can watch your video" },
    { value: "public", label: "Public", desc: "Everyone can watch your video" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-1">Visibility</h3>
        <p className="text-sm text-gray-600">Choose when to publish and who can see your video</p>
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <div>
          <p className="font-semibold">Save or publish</p>
          <p className="text-sm text-gray-600">
            Make your video <b>public</b>, <b>unlisted</b> or <b>private</b>
          </p>
        </div>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="visibility"
              className="mt-1"
              checked={visibility === opt.value}
              onChange={() => onVisibilityChange(opt.value)}
            />
            <div>
              <p className="font-medium">{opt.label}</p>
              <p className="text-sm text-gray-600">{opt.desc}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default VisibilityStep;