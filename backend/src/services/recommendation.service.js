async function rankSchemeMatches(schemes, profile) {
  return schemes.map((scheme) => ({
    scheme,
    score: scoreScheme(scheme, profile),
  }))
  .sort((a, b) => b.score - a.score)
  .map(({ scheme, score }) => ({
    ...scheme,
    match: `${score}%`,
  }));
}

function scoreScheme(scheme, profile) {
  let score = 0;
  if (scheme.state && profile.state && scheme.state.toLowerCase() === profile.state.toLowerCase()) {
    score += 30;
  }
  if (scheme.category && profile.category && scheme.category.toLowerCase() === profile.category.toLowerCase()) {
    score += 20;
  }
  if (scheme.eligibility && profile.occupation && scheme.eligibility.toLowerCase().includes(profile.occupation.toLowerCase())) {
    score += 20;
  }
  if (scheme.benefits && profile.income && scheme.benefits.toLowerCase().includes(profile.income.toLowerCase())) {
    score += 10;
  }
  return Math.min(100, score);
}

module.exports = { rankSchemeMatches };
