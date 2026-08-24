// Canonical NFL team abbreviations. Keep structurally identical to the
// frontend mirror at playbook-frontend/src/lib/teams.js when editing.
const NFL_TEAMS = {
  ARI: 'Arizona Cardinals',
  ATL: 'Atlanta Falcons',
  BAL: 'Baltimore Ravens',
  BUF: 'Buffalo Bills',
  CAR: 'Carolina Panthers',
  CHI: 'Chicago Bears',
  CIN: 'Cincinnati Bengals',
  CLE: 'Cleveland Browns',
  DAL: 'Dallas Cowboys',
  DEN: 'Denver Broncos',
  DET: 'Detroit Lions',
  GB: 'Green Bay Packers',
  HOU: 'Houston Texans',
  IND: 'Indianapolis Colts',
  JAX: 'Jacksonville Jaguars',
  KC: 'Kansas City Chiefs',
  LAC: 'Los Angeles Chargers',
  LAR: 'Los Angeles Rams',
  LV: 'Las Vegas Raiders',
  MIA: 'Miami Dolphins',
  MIN: 'Minnesota Vikings',
  NE: 'New England Patriots',
  NO: 'New Orleans Saints',
  NYG: 'New York Giants',
  NYJ: 'New York Jets',
  PHI: 'Philadelphia Eagles',
  PIT: 'Pittsburgh Steelers',
  SEA: 'Seattle Seahawks',
  SF: 'San Francisco 49ers',
  TB: 'Tampa Bay Buccaneers',
  TEN: 'Tennessee Titans',
  WAS: 'Washington Commanders',
}

const NFL_TEAM_ABBRS = Object.keys(NFL_TEAMS)

// alias (lowercased) -> canonical abbreviation
const NFL_TEAM_ALIASES = {}
Object.entries(NFL_TEAMS).forEach(([abbr, name]) => {
  const words = name.split(' ')
  NFL_TEAM_ALIASES[abbr.toLowerCase()] = abbr
  NFL_TEAM_ALIASES[name.toLowerCase()] = abbr
  NFL_TEAM_ALIASES[words[words.length - 1].toLowerCase()] = abbr // nickname, e.g. 'chiefs'
  NFL_TEAM_ALIASES[words.slice(0, -1).join(' ').toLowerCase()] = abbr // city, e.g. 'kansas city'
})
// Ambiguous city aliases must not resolve — two teams each. normalizeNflTeam
// returns null for these so the caller reports instead of guessing.
delete NFL_TEAM_ALIASES['los angeles']
delete NFL_TEAM_ALIASES['new york']
Object.assign(NFL_TEAM_ALIASES, {
  // unambiguous city + nickname forms
  'la chargers': 'LAC',
  'la rams': 'LAR',
  'ny giants': 'NYG',
  'ny jets': 'NYJ',
  // alternate abbreviations seen in the wild
  arz: 'ARI',
  gnb: 'GB',
  jac: 'JAX',
  kan: 'KC',
  lvr: 'LV',
  nor: 'NO',
  nwe: 'NE',
  sfo: 'SF',
  tam: 'TB',
  wsh: 'WAS',
  'washington football team': 'WAS',
})

// Returns the canonical abbreviation, or null when the input is not
// recognizable as exactly one NFL team (never guesses).
const normalizeNflTeam = (input) => {
  if (typeof input !== 'string') return null
  return NFL_TEAM_ALIASES[input.trim().toLowerCase()] || null
}

module.exports = { NFL_TEAMS, NFL_TEAM_ABBRS, NFL_TEAM_ALIASES, normalizeNflTeam }
