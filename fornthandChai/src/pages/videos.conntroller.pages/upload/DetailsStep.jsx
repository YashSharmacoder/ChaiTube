import InputField from '../../../components/InputField'
import FileInput from '../../../components/FileInput'

function DetailsStep({ title, onTitleChange, description, onDescriptionChange, onThumbnailChange }) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h3 className='text-2xl font-bold'>Details</h3>
        <button type="button" className='border rounded-full px-4 py-2 text-sm font-medium hover:bg-gray-50'>
          Reuse details
        </button>
      </div>

      <div className='border rounded-lg p-3 focus-within:border-black'>
        <label className='text-xs text-gray-600'>Title (required)</label>
        <InputField value={title} onChange={(e) => onTitleChange(e.target.value)} className="w-full outline-none text-sm mt-1" />
      </div>

      <div className='border rounded-lg p-3 focus-within:border-black'>
        <label className='text-xs text-gray-600'>Description</label>
        <textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder='Tell viewers about your video' rows={4} className='w-full outline-none text-sm mt-1 resize-none' />
      </div>

      <div>
        <h4 className="font-semibold mb-1">Thumbnail</h4>
        <p className="text-sm text-gray-600 mb-3">
          Set a thumbnail that stands out and draws viewers' attention.{" "}
          <a href="#" className="text-blue-600">Learn more</a>
        </p>
        <div className="flex gap-3">
          <label className="relative w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden">
            <FileInput
              accept="image/*"
              onChange={(e) => onThumbnailChange(e.target.files[0])}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <span className="text-2xl text-gray-400 pointer-events-none">+</span>
          </label>
          <div className="w-28 h-28 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-400 text-xs text-center px-2">
            Select from video
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold mb-2">Audience</h4>
        <p className="text-sm mb-3">Is this video Made for Kids? (required)</p>
        <label className="flex items-center gap-2 mb-2">
          <input type="radio" name="madeForKids" />
          <span className="text-sm">Yes, it's Made for Kids</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" name="madeForKids" />
          <span className="text-sm">No, it's not Made for Kids</span>
        </label>
      </div>
    </div>
  );
}

export default DetailsStep