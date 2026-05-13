import React, { useState } from 'react';
import Header from './components/Header';
import TournamentsPage from './pages/TournamentsPage';
import SavedPage from './pages/SavedPage';
import AIPage from './pages/AIPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('tournaments');
  const [savedTrips, setSavedTrips] = useState([]);

  const handleSave = (tournament, flightPrice, hotelCost, nights) => {
    const alreadySaved = savedTrips.find(t => t.id === tournament.id);
    if (alreadySaved) return;
    setSavedTrips(prev => [...prev, {
      ...tournament,
      flightPrice,
      hotelCost,
      nights,
      savedId: `${tournament.id}-${Date.now()}`,
    }]);
  };

  const handleRemove = (savedId) => {
    setSavedTrips(prev => prev.filter(t => t.savedId !== savedId));
  };

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-deep)',
      maxWidth: '480px',
      margin: '0 auto',
      position: 'relative',
    }}>
      {/* Background spade watermark */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '300px',
        height: '300px',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '280px',
        color: 'var(--flame-mid)',
        userSelect: 'none',
      }}>
        ♠
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={savedTrips.length}
        />

        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'tournaments' && (
            <TournamentsPage savedTrips={savedTrips} onSave={handleSave} />
          )}
          {activeTab === 'saved' && (
            <SavedPage savedTrips={savedTrips} onRemove={handleRemove} />
          )}
          {activeTab === 'ai' && (
            <AIPage savedTrips={savedTrips} />
          )}
        </main>
      </div>
    </div>
  );
}
