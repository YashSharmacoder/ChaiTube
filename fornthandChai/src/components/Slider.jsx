import { useState, useRef, useEffect } from "react";

function SliderPremium({ 
    items, 
    itemsToShow = 3, 
    renderItem,
    autoSlide = false,
    autoSlideInterval = 3000
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const sliderRef = useRef(null);
    const autoSlideTimer = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 640);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const getItemsPerView = () => {
        if (isMobile) return 1;
        if (window.innerWidth < 1024) return 2;
        return itemsToShow;
    };

    const itemsPerView = getItemsPerView();
    const maxIndex = Math.max(0, items.length - itemsPerView);

    useEffect(() => {
        if (!autoSlide) return;
        autoSlideTimer.current = setInterval(() => {
            setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
        }, autoSlideInterval);
        return () => {
            if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        };
    }, [autoSlide, autoSlideInterval, maxIndex]);

    const handlePrev = () => {
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        if (autoSlideTimer.current) clearInterval(autoSlideTimer.current);
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [maxIndex]);

    return (
        <div className="w-full">
            {/* Premium Dark Slider Container */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                </div>

                {/* Slider Content */}
                <div className="relative z-10">
                    <div ref={sliderRef} className="overflow-hidden">
                        <div
                            className="flex gap-6 transition-transform duration-700 ease-out"
                            style={{
                                transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
                            }}
                        >
                            {items.map((item, index) => (
                                <div
                                    key={item._id || index}
                                    className="flex-shrink-0 group"
                                    style={{ width: `${100 / itemsPerView}%` }}
                                >
                                    <div className="px-3 h-full transition-transform duration-300 group-hover:scale-105">
                                        <div className="rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/10 backdrop-blur-xl h-full">
                                            {renderItem(item, index)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Navigation Arrows */}
                    {items.length > itemsPerView && (
                        <>
                            <button
                                onClick={handlePrev}
                                disabled={currentIndex === 0}
                                className="group absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40"
                                aria-label="Previous"
                            >
                                <svg
                                    className="w-6 h-6 group-hover:scale-125 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={currentIndex === maxIndex}
                                className="group absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 disabled:opacity-20 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all duration-300 backdrop-blur-md border border-white/20 hover:border-white/40"
                                aria-label="Next"
                            >
                                <svg
                                    className="w-6 h-6 group-hover:scale-125 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Premium Indicators */}
            {items.length > itemsPerView && (
                <div className="flex justify-center items-center gap-3 mt-8">
                    {Array.from({ length: Math.ceil(items.length / itemsPerView) }).map(
                        (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`rounded-full transition-all duration-500 ${
                                    currentIndex === index
                                        ? "bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-3 shadow-lg shadow-blue-500/50"
                                        : "bg-gray-600 w-2 h-2 hover:bg-gray-500 hover:w-3"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        )
                    )}
                </div>
            )}

            {/* Premium Stats */}
            {items.length > itemsPerView && (
                <div className="flex justify-between items-center mt-6 px-2 text-sm">
                    <span className="text-gray-400">
                        {currentIndex + 1} of {Math.ceil(items.length / itemsPerView)}
                    </span>
                    <span className="text-gray-500">
                        {items.length} total items
                    </span>
                </div>
            )}
        </div>
    );
}

export default SliderPremium;