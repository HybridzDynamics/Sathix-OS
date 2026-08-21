const db = require('../db');

async function listSchemes() {
  return db.findAllActiveSchemes();
}

async function recommend(userId) {
  const profile = await db.findProfileByUserId(userId);
  const schemes = await db.findAllActiveSchemes();
  const scored = schemes.map((scheme) => {
    let score = 50;
    if (profile?.state && scheme.state && scheme.state.toLowerCase() === profile.state.toLowerCase()) score += 20;
    if (profile?.category && scheme.category && scheme.category.toLowerCase().includes(String(profile.category).toLowerCase())) score += 15;
    if (profile?.occupation && scheme.eligibility && scheme.eligibility.toLowerCase().includes(String(profile.occupation).toLowerCase())) score += 10;
    return { ...scheme, matchScore: Math.min(100, score) };
  });
  return scored.sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { listSchemes, recommend };
