import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NewsTicker from './components/NewsTicker';
import Hero from './components/Hero';
import TrustBar from './components/TrustBar';
import FreeCalculator from './components/FreeCalculator';
import ProductsGrid from './components/ProductsGrid';
import BundleSection from './components/BundleSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import P1View from './components/P1View';
import P2View from './components/P2View';
import P3View from './components/P3View';
import AboutView from './components/AboutView';
import LegalView from './components/LegalView';
import Modals from './components/Modals';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [calcResult, setCalcResult] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [comingSoonProduct, setComingSoonProduct] = useState('');
  const [payId, setPayId] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('info');

  // INTERSECTION OBSERVER - makes .reveal elements visible on scroll
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    const observe = () => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    };

    observe();
    const interval = setInterval(observe, 1000);
    return () => { clearInterval(interval); observer.disconnect(); };
  }, [currentView]);

  const goHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openProduct = (id) => {
    if (id === 'p1' || id === 'p2' || id === 'p3') {
      setCurrentView(id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const showComingSoon = (name) => {
    setComingSoonProduct(name);
    setActiveModal('comingSoon');
  };

  const showToast = (msg, type) => {
    setToastMsg(msg);
    setToastType(type || 'info');
    setTimeout(() => { setToastMsg(''); }, 3500);
  };

  return (
    <div className="App">
      {toastMsg && (
        <div className="toast-container">
          <div className={`toast ${toastType}`}>
            <i className={`fas ${toastType === 'success' ? 'fa-check-circle' : toastType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            {toastMsg}
          </div>
        </div>
      )}

      <Header currentView={currentView} goHome={goHome} />
      <NewsTicker />

      <main>
        {currentView === 'home' && (
          <>
            <Hero />
            <TrustBar />
            <FreeCalculator 
              setCalcResult={setCalcResult} 
              calcResult={calcResult} 
              openProduct={openProduct}
              setActiveModal={setActiveModal}
            />
            <ProductsGrid openProduct={openProduct} showComingSoon={showComingSoon} />
            <BundleSection />
            <HowItWorks />
          </>
        )}
        
        {currentView === 'p1' && (
          <P1View goHome={goHome} calcResult={calcResult} showToast={showToast} />
        )}
        
        {currentView === 'p2' && (
          <P2View goHome={goHome} showToast={showToast} />
        )}

        {currentView === 'p3' && (
          <P3View goHome={goHome} showToast={showToast} />
        )}

        {currentView === 'about' && (
          <AboutView goHome={goHome} />
        )}

        {['privacy','terms','refund','disclaimer'].includes(currentView) && (
          <LegalView page={currentView} goHome={goHome} />
        )}
      </main>

      <Footer
        onNavigateAbout={() => { setCurrentView('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onNavigateLegal={(page) => { setCurrentView(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
      />
      
      <Modals 
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        comingSoonProduct={comingSoonProduct}
        payId={payId}
        openProduct={openProduct}
        goHome={goHome}
        showToast={showToast}
        scrollToCalc={() => {
          const el = document.getElementById('calcSection');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}

export default App;
