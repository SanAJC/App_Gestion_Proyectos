import { useState, useEffect } from "react";

const WelcomeHeader = () => {
  // Responsive adjustment
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-white p-6 border-b w-full max-w-[597px] border-slate-200">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <h1 className="text-2xl md:text-[25px] font-medium text-[#0C0B0B] font-poppins" style={{maxWidth: "210px"}}>
            Hola Juanes!
          </h1>
          <p className="text-[#5A5A5A] text-xs md:text-sm font-normal font-poppins leading-6" style={{maxWidth: "213px"}}>
            Me alegro de volver a verte.
          </p>
        </div>
        
        <div className="w-full md:w-auto h-[169px] flex items-center justify-center">
          {/* Geometric pattern */}
          <div className="grid grid-cols-4 grid-rows-2 gap-1 w-full max-w-[300px]">
            {/* Row 1 */}
            <div className="relative h-20">
              <div className="absolute top-0 right-0 w-16 h-16 bg-teal-600 rounded-tl-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute top-0 left-0 w-16 h-16 bg-teal-200 rounded-tr-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gray-600 rounded-bl-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute top-0 left-0 w-16 h-16 bg-teal-200 rounded-br-full"></div>
            </div>
            
            {/* Row 2 */}
            <div className="relative h-20">
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-gray-600 rounded-tl-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-600 rounded-tr-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-teal-200 rounded-bl-full"></div>
            </div>
            <div className="relative h-20">
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gray-600 rounded-br-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;
