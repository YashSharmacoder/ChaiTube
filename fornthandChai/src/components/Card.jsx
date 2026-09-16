function Card({
    variant = "block",  // "block" | "row" | "message"
    icon,
    iconBg,
    label,
    value,
    subtext,
    valueColor = "text-gray-900",
    highlightColor,
    borderColor,
    tone,// "error" | "success" | "info" (used when variant="message")
    title,
    children,
    className = " ",
}) {
    // --- Message box variant (errors, success, tips) ---
    if (variant === "message") {
        const toneStyles = {
            error : "bg-red-50 border border-red-200 text-red-700",
            success : "bg-green-50 border border-green-200 text-green-700",
            info: "bg-blue-50 border border-blue-200 text-blue-900",
        }
        return (
            <div className={`px-4 py-4 rounded-lg text-sm ${ toneStyles[tone] || toneStyles.info } ${ className } `}>
                { children }
            </div>
        )
    }

    // --- Row variant (label ... value line) ---
    if (variant === "row") {
        const bgClass = highlightColor
            ? `${highlightColor} border-l-4 ${borderColor}`
            : "bg-gray-50"
            return (
                <div className={`flex items-center justify-between p-4 rounded-lg ${bgClass} ${className}`}>
                    <span className="text-gray-700">{label}</span>
                    <span className={`font-bold ${valueColor} ${highlightColor ? "text-lg" : ""}`}>
                        {value}
                    </span>
                </div>
            )
    }

    // --- Stat card variant (icon + big number) ---
    if (icon || value !== undefined) {
        return (
            <div className={`bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow ${className}`}>
                { (icon || label ) && (
                    <div className="flex items-center justify-between mb-4">
                        { icon && (
                            <div className={`w-12 h-12 ${ iconBg } rounded-lg flex items-center justify-center`}>
                                <span className="text-2xl">{ icon }</span>
                            </div>
                        )}
                        {label && <span className="text-sm text-gray-600">{ label }</span>}
                    </div>
                )}
                { value !== undefined && (
                    <p className="text-4xl font-bold text-gray-900">{ value }</p>
                )}
                { subtext && <p className="text-sm text-gray-600 mt-2">{ subtext }</p>}
                { children }
            </div>
        )
    }

    // --- Default: plain section wrapper card ---
    return (
        <div className={`bg-white rounded-xl shadow-md p-8 ${className}`}>
            { title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{ title }</h2> }
            { children }
        </div>
    )
}

export default Card
