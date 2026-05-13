import React from 'react';
import { Plane, Hotel, Trophy, DollarSign, Trash2, MapPin, Calendar } from 'lucide-react';
import SpadeIcon from '../components/SpadeIcon';

export default function SavedPage({ savedTrips, onRemove }) {
  const formatCurrency = (n) => n ? `$${n.toLocaleString()}` : 'N/A';
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalBudget = savedTrips.reduce((sum, t) => {
    const total = (t.flightPrice ? t.flightPrice * 2 : 0) + (t.hotelCost || 0) + t.buyIn;
    return sum + total;
  }, 0);

  if (savedTrips.length === 0) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        gap: '16px',
      }}>
        <SpadeIcon size={60} glow={true} />
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '18px',
          color: 'var(--text-secondary)',
          letterSpacing: '2px',
          textAlign: 'center',
        }}>
          NO SAVED TRIPS YET
        </div>
        <div style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: '240px',
          lineHeight: '1.5',
        }}>
          Browse tournaments and tap a card to save your best trip options
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Budget summary */}
      <div style={{
        margin: '12px 16px',
        background: 'rgba(255,107,26,0.08)',
        border: '1px solid rgba(255,107,26,0.25)',
        borderRadius: '12px',
        padding: '14px',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>TRIPS SAVED</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--flame-tip)' }}>{savedTrips.length}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>TOTAL BUDGET</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--flame-tip)' }}>{formatCurrency(totalBudget)}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '1px', marginBottom: '4px' }}>AVG TRIP</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--flame-tip)' }}>
              {formatCurrency(Math.round(totalBudget / savedTrips.length))}
            </div>
          </div>
        </div>
      </div>

      {/* Trip list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
        {savedTrips.map((trip, i) => {
          const total = (trip.flightPrice ? trip.flightPrice * 2 : 0) + (trip.hotelCost || 0) + trip.buyIn;
          return (
            <div
              key={trip.savedId}
              className="fade-in"
              style={{
                background: 'rgba(240,230,211,0.04)',
                border: '1px solid rgba(255,107,26,0.25)',
                borderRadius: '12px',
                marginBottom: '12px',
                overflow: 'hidden',
                boxShadow: '0 0 15px rgba(255,69,0,0.08)',
              }}
            >
              {/* Header */}
              <div style={{
                padding: '12px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '13px',
                    color: 'var(--text-bright)',
                    marginBottom: '4px',
                  }}>
                    {trip.name}
                  </div>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={9} /> {trip.city}, {trip.state}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <Calendar size={9} /> {formatDate(trip.startDate)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(trip.savedId)}
                  style={{
                    background: 'rgba(255,69,0,0.1)',
                    border: '1px solid rgba(255,69,0,0.2)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'rgba(255,107,26,0.7)',
                  }}
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Cost grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                gap: '1px',
                background: 'rgba(255,255,255,0.04)',
              }}>
                {[
                  { icon: <Trophy size={12} />, label: 'Buy-in', value: formatCurrency(trip.buyIn) },
                  { icon: <Plane size={12} />, label: 'GoWild R/T', value: trip.flightPrice ? formatCurrency(trip.flightPrice * 2) : 'N/A' },
                  { icon: <Hotel size={12} />, label: `Hotel (${trip.nights}n)`, value: formatCurrency(trip.hotelCost) },
                  { icon: <DollarSign size={12} />, label: 'Total', value: formatCurrency(total), highlight: true },
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '10px 8px',
                    textAlign: 'center',
                    background: item.highlight ? 'rgba(255,107,26,0.08)' : 'rgba(0,0,0,0.2)',
                  }}>
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginBottom: '3px', letterSpacing: '0.5px' }}>
                      {item.label.toUpperCase()}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: '700',
                      color: item.highlight ? 'var(--flame-mid)' : 'var(--text-primary)',
                    }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
