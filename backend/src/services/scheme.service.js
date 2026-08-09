async function listSchemes(prisma) {
  return prisma.scheme.findMany({ orderBy: { createdAt: 'desc' } });
}

async function recommendSchemes(prisma, userId, _input) {
  const profile = await prisma.citizenProfile.findUnique({ where: { userId } });
  const schemes = await prisma.scheme.findMany();

  if (!profile) {
    return schemes.slice(0, 10).map((scheme) => ({
      name: scheme.name,
      match: '50%',
      reason: 'Update your profile to receive personalized recommendations.',
    }));
  }

  const recommendations = schemes.map((scheme) => {
    const score = calculateMatch(scheme, profile);
    return {
      name: scheme.name,
      match: `${score}%`,
      reason: `Recommended based on your state and eligibility profile.`,
    };
  });

  return recommendations.sort((a, b) => parseInt(b.match) - parseInt(a.match)).slice(0, 10);
}

function calculateMatch(scheme, profile) {
  let score = 50;

  if (scheme.state && profile.state && scheme.state.toLowerCase() === profile.state.toLowerCase()) {
    score += 20;
  }

  if (scheme.eligibility && profile.occupation && scheme.eligibility.toLowerCase().includes(profile.occupation.toLowerCase())) {
    score += 15;
  }

  if (scheme.benefits && profile.income && scheme.benefits.toLowerCase().includes(profile.income.toLowerCase())) {
    score += 10;
  }

  return Math.min(100, score);
}

module.exports = { listSchemes, recommendSchemes };
