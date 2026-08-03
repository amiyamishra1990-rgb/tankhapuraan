import React from 'react';

const Modals = ({ activeModal, setActiveModal, comingSoonProduct, scrollToCalc }) => {

  if (!activeModal) return null;

  const close = () => setActiveModal(null);

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) close(); }}>
      {activeModal === 'comingSoon' && (
        <div className="modal-card">
          <button className="modal-close" onClick={close}>&times;</button>
          <div className="modal-icon wait"><i className="fas fa-hourglass-half"></i></div>
          <h3 className="modal-title">{comingSoonProduct} — Coming Soon</h3>
          <p className="modal-desc">{comingSoonProduct} abhi taiyyari mein hai. Jald hi live hoga. Tab tak free tax calculator use karo!</p>
          <button className="btn-primary" onClick={() => { close(); scrollToCalc(); }}>Use Free Calculator</button>
        </div>
      )}
    </div>
  );
};

export default Modals;
