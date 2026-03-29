function StepIndicator({ steps, currentStep }) {
   return (
      <div className="flex items-center justify-center mb-8">
         {steps.map((step, index) => (
            <div key={index} className="flex items-center">
               <div className="flex flex-col items-center">
                  <div
                     className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${index < currentStep
                           ? 'bg-pear-500 text-white'
                           : index === currentStep
                              ? 'bg-pear-500/20 text-pear-400 border-2 border-pear-400 animate-pulse-glow'
                              : 'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}
                  >
                     {index < currentStep ? '✓' : index + 1}
                  </div>
                  <span
                     className={`text-xs mt-1 ${index <= currentStep ? 'text-pear-400' : 'text-gray-600'}`}
                  >
                     {step}
                  </span>
               </div>
               {index < steps.length - 1 && (
                  <div
                     className={`w-16 h-0.5 mx-2 mb-5 ${index < currentStep ? 'bg-pear-500' : 'bg-gray-700'}`}
                  />
               )}
            </div>
         ))}
      </div>
   );
}

export default StepIndicator;
