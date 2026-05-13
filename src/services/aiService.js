// WildCard AI Service - Claude API integration

export const askWildCardAI = async (userMessage, tournaments, savedTrips) => {
  const context = `You are WildCard, an AI trip planning assistant specializing in poker tournaments and travel using Frontier Airlines GoWild pass flights.

The user flies from Chicago (ORD or MDW). They have a Frontier GoWild pass which gives deeply discounted flights (typically $19-$109 one-way). GoWild rates are shown where available.

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
        model: 'claude-sonnet-4-20250514',
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
