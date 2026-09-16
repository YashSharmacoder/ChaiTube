function StepIndicator({ steps, activeStep }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => {
        const isCompleted = i < activeStep;
        const isActive = i === activeStep;

        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <span className={`text-sm mb-2 whitespace-nowrap ${
                isActive || isCompleted ? "font-semibold text-black" : "text-gray-400"
              }`}>
                {step}
              </span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${
                isCompleted
                  ? "border-black bg-black text-white"
                  : isActive
                  ? "border-black bg-white"
                  : "border-gray-300 bg-white"
              }`}>
                {isCompleted && "✓"}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 mb-6 ${i < activeStep ? "bg-black" : "bg-gray-300"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;