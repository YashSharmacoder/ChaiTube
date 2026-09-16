function PageLoader({ text = "Loading..." }) {
    <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"/>
            <p className="text-gray-500 text-sm">{ text }</p>
        </div>
    </div>
}

export default PageLoader