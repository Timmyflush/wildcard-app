// WildCard AI Service - Claude API integration
export const askWildCardAI = async (userMessage, tournaments, savedTrips) => {
  const context = `You are WildCard, an AI trip planning assistant specializing in poker tournaments and travel using Frontier Airlines GoWild pass flights.
The user flies from Chicago (ORD or MDW). They have a Frontier GoWild pass which gives deeply discounted flights (typically $19-$109 one-way). GoWild rates are shown where available.

FRONTIER GOWILD BLACKOUT DATES (flights cannot be booked on these dates):
2026: Jan 1, 3-4, 15-16, 19 | Feb 12-13, 16 | Mar 13-15, 20-22, 27-29 | Apr 3-6, 10-12 | May 21-22, 25 | Jun 25-28 | Jul 2-6 | Sep 3-4, 7 | Oct 8-9, 11-12 | Nov 24-25, 28-30 | Dec 19-24, 26-31
2027: Jan 1-3, 14-15, 18 | Feb 11-12, 15 | Mar 12-14, 19-21, 26-29 | Apr 2-4
August 2026 has NO blackout dates.

IMPORTANT: Always check if tournament travel dates overlap with blackout dates. If there is a conflict, warn the user and suggest nearby non-blackout travel dates or alternative tournaments.

Current tournament data available:
${JSON.stringify(tournaments.slice(0, 10), null, 2)}
Saved trips: ${savedTrips.length} trips saved.
You help users:
- Find poker tournaments that match their budget and schedule
- Identify the best GoWild flight opportunities
- Calculate total trip costs (flight + hotel + buy-in)
- Compare trip options
- Plan multi-stop poker trips
Keep responses concise and actionable. Format numbers as currency. When recommending trips, always mention the total estimated cost breakdown.`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.REACT_APP_ANTHROPIC_KEY, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: context,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });
    const data = await response.json();
    const text = data.content?.find(b => b.type === 'text')?.text;
    return text || 'Unable to get a response. Please try again.';
  } catch (err) {
    return 'Connection error. Please check your internet and try again.';
  }
};