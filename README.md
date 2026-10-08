# DemandOne v2 — dating app outside, stock market inside

A second prototype built on the same base as `DemandOne/` (Expo SDK 57, Expo Router, React 19,
TypeScript), reworking the product around three ideas:

1. **Everyone is both buyer and seller.** One profile, two symmetric lists — what you need, what
   you offer. No "buyer persona."
2. **The feed is a small personalized deck, not a directory.** Discover only ever shows cards in
   the categories you picked — never every category mixed together.
3. **"Fit" is a transparent standard, not a mystery percentage.** At onboarding you rank five
   criteria — Budget, Expertise, Timing, Geography, Trust — and every fit score on every card is
   scored against that ranking and explainable in one tap. The market-clearing, dynamic pricing,
   and multi-party negotiation logic still run underneath (`src/data/matching.ts`), but the user
   only ever sees narrated outcomes, never raw deltas, tickers, or symbols.

See `src/data/matching.ts` for the scoring engine and `src/data/types.ts` for the data model.

## Run it

```
npm install
npm start
```

Scan the QR code with Expo Go, or press `w` for web / `i` / `a` for a simulator.

First launch drops you into onboarding (category picks + the Standard of Value ranking quiz)
before landing on the **Today** tab.
