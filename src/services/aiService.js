// WildCard AI Service - Claude API integration

const PREFS_KEY = 'wildcard_user_prefs';

const getPrefs = () => {
  try {
    const saved = localStorage.getItem(PREFS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};

const savePrefs = (newPrefs) => {
  try {
    const existing = getPrefs();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...existing, ...newPrefs }));
  } catch {}
};

const extractPrefs = (userMessage) => {
  const lower = userMessage.toLowerCase();
  const prefs = {};
  const budgetMatch = lower.match(/\$?([\d,]+)\s*(total|budget|max|limit)?/);
  if (budgetMatch) prefs.budget = budgetMatch[0];
  const cities = ['las vegas', 'miami', 'tampa', 'jacksonville', 'chicago', 'new orleans', 'tunica', 'atlantic city', 'phoenix', 'denver'];
  const mentioned = cities.filter(c => lower.includes(c));
  if (mentioned.length) prefs.preferredCities = mentioned;
  if (Object.keys(prefs).length) savePrefs(prefs);
};

export const askWildCardAI = async (userMessage, tournaments, savedTrips, chatHistory = []) => {
  const prefs = getPrefs();
  const prefsText = Object.keys(prefs).length
    ? `\nKNOWN USER PREFERENCES (remembered from past sessions):\n${JSON.stringify(prefs, null, 2)}\n`
    : '';

  const context = `You are WildCard, an AI trip planning assistant specializing in poker tournaments and travel using Frontier Airlines GoWild pass flights.
The user flies from Chicago (ORD or MDW). They have a Frontier GoWild pass which gives deeply discounted flights (typically $19-$109 one-way). GoWild rates are shown where available.

FRONTIER GOWILD BLACKOUT DATES (flights cannot be booked on these dates):
2026: Jan 1, 3-4, 15-16, 19 | Feb 12-13, 16 | Mar 13-15, 20-22, 27-29 | Apr 3-6, 10-12 | May 21-22, 25 | Jun 25-28 | Jul 2-6 | Sep 3-4, 7 | Oct 8-9, 11-12 | Nov 24-25, 28-30 | Dec 19-24, 26-31
2027: Jan 1-3, 14-15, 18 | Feb 11-12, 15 | Mar 12-14, 19-21, 26-29 | Apr 2-4
August 2026 has NO blackout dates.

IMPORTANT: Always check if tournament travel dates overlap with blackout dates. If there is a conflict, warn the user and suggest nearby non-blackout travel dates or alternative tournaments.

You have access to web search. Use it to find current poker tournament schedules at specific casinos and poker rooms when the user asks. Search PokerAtlas, Hendon Mob, tournament series websites, and casino websites directly for up to date schedules including smaller local tournaments.
${prefsText}
Saved trips: ${savedTrips.length} trips saved.
You help users:
- Find poker tournaments that match their budget and schedule
- Search the web for current tournament schedules at any poker room or casino
- Identify the best GoWild flight opportunities
- Calculate total trip costs (flight + hotel + buy-in)
- Compare trip options
- Plan multi-stop poker trips
Keep responses concise and actionable. Format numbers as currency. When recommending trips, always mention the total estimated cost breakdown.`;

  const history = chatHistory.slice(-10).map(m => ({ role: m.role, content: m.content }));

  try {
    extractPrefs(userMessage);
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        system: context,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages: history.length > 0 ? history : [{ role: 'user', content: userMessage }],
      }),
    });
    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text;
    return text || 'Unable to get a response. Please try again.';
  } catch (err) {
    return 'Connection error. Please check your internet and try again.';
  }
};