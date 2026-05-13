import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import TournamentCard from '../components/TournamentCard';
import { SAMPLE_TOURNAMENTS, getGoWildPrice, getHotelEstimate } from '../services/dataService';

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'buyin_asc', label: 'Buy-in: Low' },
  { value: 'buyin_desc', label: 'Buy-in: High' },
  { value: 'flight', label: 'Flight Price' },
  { value: 'total', label: 'Total Cost' },
];

const STATES = [...new Set(SAMPLE_TOURNAMENTS.map(t => t.state))].sort();

export default function TournamentsPage({ savedTrips, onSave }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [maxBuyin, setMaxBuyin] = useState(5000);
  const [filterState, setFilterState] = useState('');
  const [maxTotal, setMaxTotal] = useState(10000);

  // Enrich tournaments with pricing
  const enriched = useMemo(() => {
    return SAMPLE_TOURNAMENTS.map(t => {
      const nights = Math.ceil(
        (new Date(t.endDate) - new Date(t.startDate)) / (1000 * 60 * 60 * 24)
      ) + 1;
      const flightPrice = getGoWildPrice(t.cityCode);
      const hotelCost = getHotelEstimate(t.cityCode, nights);
      const total = (flightPrice ? flightPrice * 2 : 0) + hotelCost + t.buyIn;
      return { ...t, flightPrice, hotelCost, nights, total };
    });
  }, []);

  const filtered = useMemo(() => {
    let list = enriched.filter(t => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
          !t.city.toLowerCase().includes(search.toLowerCase()) &&
          !t.casino.toLowerCase().includes(search.toLowerCase())) return false;
      if (t.buyIn > maxBuyin) return false;
      if (filterState && t.state !== filterState) return false;
      if (t.flightPrice && t.total > maxTotal) return false;
      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(a.startDate) - new Date(b.startDate);
        case 'buyin_asc': return a.buyIn - b.buyIn;
        case 'buyin_desc': return b.buyIn - a.buyIn;
        case 'flight': {
          if (!a.flightPrice) return 1;
          if (!b.flightPrice) return -1;
          return a.flightPrice - b.flightPrice;
        }
        case 'total': {
          if (!a.flightPrice) return 1;
          if (!b.flightPrice) return -1;
          return a.total - b.total;
        }
        default: return 0;
      }
    });
    return list;
  }, [enriched, search, sortBy, maxBuyin, filterState, maxTotal]);

  const isSaved = (id) => savedTrips.some(t => t.id === id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Search + filter bar */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--bg-mid)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: showFilters ? '12px' : 0 }}>
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '0 10px',
            gap: '8px',
          }}>
            <Search size={14} color="var(--text-secondary)" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tournaments, cities..."
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                padding: '9px 0',
              }}
            />
            {search && <X size={14} color="var(--text-secondary)" onClick={() => setSearch('')} style={{ cursor: 'pointer' }} />}
          </div>

          {/* Sort dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                padding: '9px 28px 9px 10px',
                appearance: 'none',
                cursor: 'pointer',
                minWidth: '110px',
              }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#0f1923' }}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={12} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              background: showFilters ? 'rgba(255,107,26,0.2)' : 'rgba(255,255,255,0.05)',
              border: showFilters ? '1px solid var(--border-flame)' : '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '9px 10px',
              cursor: 'pointer',
              color: showFilters ? 'var(--flame-tip)' : 'var(--text-secondary)',
            }}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            paddingTop: '4px',
            animation: 'fadeInUp 0.2s ease',
          }}>
            <FilterSlider
              label={`Max Buy-in: $${maxBuyin.toLocaleString()}`}
              value={maxBuyin}
              min={200}
              max={10000}
              step={100}
              onChange={setMaxBuyin}
            />
            <FilterSlider
              label={`Max Total: $${maxTotal.toLocaleString()}`}
              value={maxTotal}
              min={500}
              max={20000}
              step={500}
              onChange={setMaxTotal}
            />
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', letterSpacing: '1px' }}>STATE</div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <StateChip label="All" active={!filterState} onClick={() => setFilterState('')} />
                {STATES.map(s => (
                  <StateChip key={s} label={s} active={filterState === s} onClick={() => setFilterState(s === filterState ? '' : s)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results count */}
      <div style={{
        padding: '8px 16px',
        fontSize: '11px',
        color: 'var(--text-secondary)',
        letterSpacing: '1px',
        flexShrink: 0,
        background: 'var(--bg-mid)',
      }}>
        {filtered.length} TOURNAMENT{filtered.length !== 1 ? 'S' : ''} FOUND
        {filtered.filter(t => t.flightPrice).length < filtered.length && (
          <span style={{ marginLeft: '8px', color: 'rgba(255,107,26,0.6)' }}>
            · {filtered.filter(t => t.flightPrice).length} WITH GOWILD FLIGHTS
          </span>
        )}
      </div>

      {/* Tournament list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 16px 20px',
      }}>
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-secondary)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>♠</div>
            <div style={{ fontSize: '16px' }}>No tournaments match your filters</div>
          </div>
        ) : (
          filtered.map((t, i) => (
            <TournamentCard
              key={t.id}
              tournament={t}
              flightPrice={t.flightPrice}
              hotelCost={t.hotelCost}
              nights={t.nights}
              onSave={onSave}
              isSaved={isSaved(t.id)}
              animDelay={Math.min(i, 3)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function FilterSlider({ label, value, min, max, step, onChange }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px', letterSpacing: '1px' }}>{label.toUpperCase()}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--flame-mid)' }}
      />
    </div>
  );
}

function StateChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        borderRadius: '20px',
        border: active ? '1px solid var(--flame-mid)' : '1px solid var(--border-subtle)',
        background: active ? 'rgba(255,107,26,0.15)' : 'transparent',
        color: active ? 'var(--flame-tip)' : 'var(--text-secondary)',
        fontSize: '12px',
        fontFamily: 'var(--font-body)',
        cursor: 'pointer',
        fontWeight: active ? '600' : '400',
      }}
    >
      {label}
    </button>
  );
}
