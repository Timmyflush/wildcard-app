import React, { useState } from 'react';
import { Plane, Hotel, Trophy, MapPin, Calendar, DollarSign, Plus, Check, ExternalLink } from 'lucide-react';

export default function TournamentCard({ tournament, flightPrice, hotelCost, nights, onSave, isSaved, animDelay = 0 }) {
  const [expanded, setExpanded] = useState(false);

  const totalCost = (flightPrice ? flightPrice * 2 : 0) + (hotelCost || 0) + tournament.buyIn;
  const flightAvailable = flightPrice !== null && flightPrice !== undefined;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatCurrency = (n) => n ? `$${n.toLocaleString()}` : 'N/A';

  const nightCount = nights || Math.ceil(
    (new Date(tournament.endDate) - new Date(tournament.startDate)) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div
      className={`fade-in-delay-${animDelay}`}
      style={{
        background: 'rgba(240, 230, 211, 0.04)',
        border: `1px solid ${flightAvailable ? 'rgba(255,107,26,0.35)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '12px',
        marginBottom: '12px',
        overflow: 'hidden',
        transition: 'all 0.2s',
        ...(flightAvailable && {
          boxShadow: '0 0 12px rgba(255,107,26,0.1)',
        }),
      }}
    >
      {/* Main card content - playing card face style */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '14px',
          cursor: 'pointer',
        }}
      >
        {/* Top row: tournament name + source badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <div style={{ flex: 1, paddingRight: '8px' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--text-bright)',
              lineHeight: '1.3',
              marginBottom: '3px',
            }}>
              {tournament.name}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--text-secondary)',
              fontSize: '12px',
            }}>
              <MapPin size={10} />
              <span>{tournament.casino}, {tournament.city}, {tournament.state}</span>
            </div>
          </div>
          <span style={{
            fontSize: '9px',
            color: 'var(--flame-tip)',
            border: '1px solid rgba(255,170,0,0.3)',
            borderRadius: '4px',
            padding: '2px 6px',
            whiteSpace: 'nowrap',
            letterSpacing: '0.5px',
          }}>
            {tournament.source}
          </span>
        </div>

        {/* Date row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: 'var(--text-secondary)',
          fontSize: '12px',
          marginBottom: '12px',
        }}>
          <Calendar size={10} />
          <span>{formatDate(tournament.startDate)} – {formatDate(tournament.endDate)} · {nightCount} nights</span>
        </div>

        {/* Cost breakdown row - the key info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '6px',
        }}>
          {/* Buy-in */}
          <CostPill
            icon={<Trophy size={10} />}
            label="Buy-in"
            value={formatCurrency(tournament.buyIn)}
            color="var(--flame-tip)"
          />
          {/* Flight */}
          <CostPill
            icon={<Plane size={10} />}
            label="GoWild R/T"
            value={flightAvailable ? formatCurrency(flightPrice * 2) : 'Unavail.'}
            color={flightAvailable ? '#4caf7d' : 'var(--text-secondary)'}
            dim={!flightAvailable}
          />
          {/* Hotel */}
          <CostPill
            icon={<Hotel size={10} />}
            label="Hotel Est."
            value={hotelCost ? formatCurrency(hotelCost) : '—'}
            color="var(--text-primary)"
          />
          {/* Total */}
          <CostPill
            icon={<DollarSign size={10} />}
            label="Total Est."
            value={flightAvailable ? formatCurrency(totalCost) : '—'}
            color={flightAvailable ? 'var(--flame-mid)' : 'var(--text-secondary)'}
            highlight={flightAvailable}
          />
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          padding: '12px 14px',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--text-primary)' }}>Guarantee: </span>
              {formatCurrency(tournament.guarantee)}
            </div>
            {flightAvailable && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>Flight (each way): </span>
                {formatCurrency(flightPrice)}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSave(tournament, flightPrice, hotelCost, nightCount); }}
              style={{
                flex: 1,
                padding: '9px',
                background: isSaved
                  ? 'rgba(76,175,125,0.15)'
                  : 'linear-gradient(135deg, rgba(255,107,26,0.2), rgba(255,69,0,0.1))',
                border: isSaved ? '1px solid rgba(76,175,125,0.4)' : '1px solid var(--border-flame)',
                borderRadius: '8px',
                color: isSaved ? '#4caf7d' : 'var(--flame-tip)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {isSaved ? <><Check size={14} /> SAVED</> : <><Plus size={14} /> SAVE TRIP</>}
            </button>
            <a
              href={tournament.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                padding: '9px 12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              <ExternalLink size={12} /> Info
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function CostPill({ icon, label, value, color, dim, highlight }) {
  return (
    <div style={{
      background: highlight ? 'rgba(255,107,26,0.1)' : 'rgba(255,255,255,0.03)',
      border: highlight ? '1px solid rgba(255,107,26,0.3)' : '1px solid rgba(255,255,255,0.06)',
      borderRadius: '8px',
      padding: '7px 6px',
      textAlign: 'center',
      opacity: dim ? 0.5 : 1,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '3px',
        color: 'var(--text-secondary)',
        fontSize: '9px',
        marginBottom: '3px',
        letterSpacing: '0.5px',
      }}>
        {icon}
        {label}
      </div>
      <div style={{
        color,
        fontSize: '13px',
        fontWeight: '700',
        fontFamily: 'var(--font-body)',
      }}>
        {value}
      </div>
    </div>
  );
}
