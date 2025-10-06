import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Features from "./components/Features";
import CaseStudies from "./components/CaseStudies";
import HowWeWork from "./components/HowWeWork";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ProjectRequestModal from "./components/ProjectRequestModal";
import CareersModal from "./components/CareersModal";
import ContactModal from "./components/ContactModal";
import BrandPlatform from "./components/BrandPlatform";
import AllSolutions from "./components/AllSolutions";
import { Toaster } from "./components/ui/sonner";
import { LanguageProvider } from "./components/LanguageContext";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCareersModalOpen, setIsCareersModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [showBrandPlatform, setShowBrandPlatform] = useState(false);
  const [showAllSolutions, setShowAllSolutions] = useState(false);
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const openCareersModal = () => setIsCareersModalOpen(true);
  const closeCareersModal = () => setIsCareersModalOpen(false);
  
  const openContactModal = () => setIsContactModalOpen(true);
  const closeContactModal = () => setIsContactModalOpen(false);
  
  const openBrandPlatform = () => setShowBrandPlatform(true);
  const closeBrandPlatform = () => {
    setIsTransitioning(true);
    setShowBrandPlatform(false);
    setScrollToSection("about");
    setTimeout(() => setIsTransitioning(false), 300);
  };
  
  const openAllSolutions = () => setShowAllSolutions(true);
  const closeAllSolutions = () => {
    setIsTransitioning(true);
    setShowAllSolutions(false);
    setScrollToSection("our-solutions");
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Effect to handle scrolling after returning to main page
  useEffect(() => {
    if (scrollToSection && !showBrandPlatform && !showAllSolutions) {
      const timer = setTimeout(() => {
        try {
          const element = document.getElementById(scrollToSection);
          if (element) {
            // Add highlight effect to the section
            element.classList.add("section-highlight");
            
            // Scroll to element with some offset for better visibility
            const offsetTop = element.offsetTop - 80; // Account for sticky header
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth"
            });

            // Also highlight the corresponding navigation link
            const navLink = document.querySelector(`a[href="#${scrollToSection}"]`);
            if (navLink) {
              navLink.classList.add("text-[#BBFF2C]", "font-semibold");
              setTimeout(() => {
                navLink.classList.remove("text-[#BBFF2C]", "font-semibold");
              }, 2000);
            }

            // Remove section highlight effect after animation completes
            setTimeout(() => {
              element.classList.remove("section-highlight");
            }, 2000);
          }
          setScrollToSection(null);
        } catch (error) {
          console.error('Error in scroll effect:', error);
          setScrollToSection(null);
        }
      }, 150); // Small delay to ensure DOM is ready

      return () => clearTimeout(timer);
    }
  }, [scrollToSection, showBrandPlatform, showAllSolutions]);

  // Global error handling
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      
      // Enhanced error detection for system timeouts
      const isSystemTimeout = reason && (
        // String-based errors
        (typeof reason === 'string' && (
          reason.includes('getPage') ||
          reason.includes('timeout') ||
          reason.includes('response timed out') ||
          reason.includes('Message getPage') ||
          /getPage\s*\(id:\s*\d+\)/.test(reason) ||
          /Message getPage \(id: \d+\) response timed out/.test(reason)
        )) ||
        // Object-based errors
        (typeof reason === 'object' && reason !== null && (
          (reason.message && (
            reason.message.includes('getPage') ||
            reason.message.includes('timeout') ||
            reason.message.includes('response timed out') ||
            reason.message.includes('timed out after') ||
            reason.message.includes('Message getPage') ||
            /getPage\s*\(id:\s*\d+\)/.test(reason.message) ||
            /Message getPage \(id: \d+\) response timed out/.test(reason.message)
          )) ||
          (reason.toString && (
            reason.toString().includes('getPage') ||
            reason.toString().includes('timeout') ||
            reason.toString().includes('response timed out') ||
            reason.toString().includes('Message getPage') ||
            /getPage\s*\(id:\s*\d+\)/.test(reason.toString()) ||
            /Message getPage \(id: \d+\) response timed out/.test(reason.toString())
          ))
        ))
      );

      if (isSystemTimeout) {
        console.log('System timeout detected - continuing execution silently...');
        event.preventDefault();
        return;
      }

      // Log non-system errors for debugging
      console.error('Unhandled rejection:', reason);
    };

    const handleError = (event: ErrorEvent) => {
      const error = event.error;
      
      // Enhanced system error detection
      const isSystemError = error && (
        (error.message && (
          error.message.includes('getPage') ||
          error.message.includes('response timed out') ||
          error.message.includes('timeout after') ||
          error.message.includes('Message getPage') ||
          /getPage\s*\(id:\s*\d+\)/.test(error.message) ||
          /Message getPage \(id: \d+\) response timed out/.test(error.message)
        )) ||
        (error.toString && (
          error.toString().includes('getPage') ||
          error.toString().includes('timeout') ||
          error.toString().includes('Message getPage') ||
          /getPage\s*\(id:\s*\d+\)/.test(error.toString()) ||
          /Message getPage \(id: \d+\) response timed out/.test(error.toString())
        ))
      );

      if (isSystemError) {
        console.log('System error detected - continuing execution silently...');
        event.preventDefault();
        return;
      }

      // Only show critical errors that actually affect user experience
      if (error && error.message && 
          !error.message.includes('ResizeObserver') &&
          !error.message.includes('Non-Error promise rejection')) {
        console.error('Critical error:', error);
        setAppError('An unexpected error occurred. You can try refreshing the page.');
      }
    };

    // Enhanced console error filtering
    const originalConsoleError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('getPage') || 
          message.includes('response timed out') ||
          message.includes('timeout after') ||
          message.includes('Message getPage') ||
          /getPage\s*\(id:\s*\d+\)/.test(message) ||
          /Message getPage \(id: \d+\) response timed out/.test(message)) {
        // Silent handling of system timeouts
        return;
      }
      originalConsoleError.apply(console, args);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      console.error = originalConsoleError;
    };
  }, []);

  // Auto-recovery for system errors
  useEffect(() => {
    if (appError && retryCount < 3) {
      const timer = setTimeout(() => {
        console.log(`Auto-recovery attempt ${retryCount + 1}/3`);
        setAppError(null);
        setRetryCount(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [appError, retryCount]);

  // Show error overlay if there's an app error
  if (appError && retryCount >= 3) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#040725]">
        <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-md mx-4">
          <div className="w-16 h-16 bg-[#FC2D00] rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-white font-mono font-black text-2xl">!</div>
          </div>
          <h1 className="text-2xl font-bold text-[#040725] mb-2">Connection Issue</h1>
          <p className="text-gray-600 mb-4">{appError}</p>
          <div className="space-y-2">
            <button 
              onClick={() => {
                setAppError(null);
                setRetryCount(0);
                window.location.reload();
              }}
              className="w-full bg-[#BBFF2C] text-[#040725] px-6 py-2 rounded-lg hover:bg-[#a3e024] transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => {
                setAppError(null);
                setRetryCount(0);
              }}
              className="w-full bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
      <ErrorBoundary>
        <div className="app-container min-h-screen">
        {/* Loading indicator */}
        {isTransitioning && <div className="loading-bar"></div>}
        {showBrandPlatform ? (
          <BrandPlatform onClose={closeBrandPlatform} onOpenModal={openModal} />
        ) : showAllSolutions ? (
          <AllSolutions onClose={closeAllSolutions} onOpenModal={openModal} />
        ) : (
          <div className="page-transition">
            <Header onOpenModal={openModal} />
            <Hero onOpenModal={openModal} />
            <Services />
            <Features />
            <CaseStudies onOpenModal={openModal} onOpenAllSolutions={openAllSolutions} />
            <HowWeWork onOpenModal={openModal} />
            <About onOpenBrandPlatform={openBrandPlatform} />
            <Contact />
            <Footer 
              onOpenCareersModal={openCareersModal} 
              onOpenAllSolutions={openAllSolutions}
              onOpenBrandPlatform={openBrandPlatform}
            />
          </div>
        )}
        
        <ProjectRequestModal isOpen={isModalOpen} onClose={closeModal} />
        <CareersModal isOpen={isCareersModalOpen} onClose={closeCareersModal} />
        <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
        <Toaster />
        </div>
      </ErrorBoundary>
    </LanguageProvider>
  );
}