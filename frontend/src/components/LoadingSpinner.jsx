function LoadingSpinner({ message = 'Processing...' }) {
   return (
      <div className="flex flex-col items-center justify-center py-12">
         <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-700 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-transparent border-t-pear-400 rounded-full animate-spin absolute top-0 left-0"></div>
         </div>
         <p className="mt-4 text-gray-400 animate-pulse">{message}</p>
      </div>
   );
}

export default LoadingSpinner;
