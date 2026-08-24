// Data audit / one-time migration: convert stored NFL team/opponent names to
// canonical abbreviations. Dry-run by default; pass --apply to write.
//
// The 2026-08-24 dry run showed all real team values are already canonical;
// this script is kept as an audit tool. Policy matches the controller
// validation in controllers/bets.js: opponent placeholders ('', XXX, BYE)
// pass through, and future bets may name players rather than teams.
//
//   MONGO_URI="$(heroku config:get MONGO_URI -a <app>)" node scripts/migrate-team-abbrs.js
//   MONGO_URI="..." node scripts/migrate-team-abbrs.js --apply
require('dotenv').config()
const mongoose = require('mongoose')
const Bet = require('../models/Bet')
const { normalizeNflTeam } = require('../constants/teams')

const APPLY = process.argv.includes('--apply')
const OPPONENT_PLACEHOLDERS = ['', 'xxx', 'bye']

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  const bets = await Bet.find({ sport: 'NFL' }).lean()
  let changed = 0
  let skipped = 0
  const unmatched = []

  for (const bet of bets) {
    const update = {}
    let betUnmatched = false
    for (const field of ['team', 'opponent']) {
      const entries = (bet[field] || []).map((entry) => {
        if (typeof entry !== 'string' || entry.trim() === '') return entry
        if (field === 'opponent' && OPPONENT_PLACEHOLDERS.includes(entry.trim().toLowerCase())) {
          return entry
        }
        const abbr = normalizeNflTeam(entry)
        if (abbr) return abbr
        if (bet.betType === 'future') return entry
        unmatched.push({ _id: bet._id.toString(), betType: bet.betType, field, value: entry })
        betUnmatched = true
        return entry
      })
      if (JSON.stringify(entries) !== JSON.stringify(bet[field])) {
        update[field] = entries
      }
    }
    // never partially convert a doc — report it and move on
    if (betUnmatched) {
      skipped += 1
      continue
    }
    if (Object.keys(update).length === 0) continue
    changed += 1
    if (APPLY) {
      await Bet.updateOne({ _id: bet._id }, { $set: update })
    } else {
      console.log(bet._id.toString(), JSON.stringify(update))
    }
  }

  console.log(
    `\n${APPLY ? 'APPLIED' : 'DRY RUN'}: ${bets.length} NFL bets scanned, ${changed} ${APPLY ? 'changed' : 'to change'}, ${skipped} skipped (unmatched)`,
  )
  if (unmatched.length) console.table(unmatched)
  await mongoose.disconnect()
}

run()
