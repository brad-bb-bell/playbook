const Anthropic = require('@anthropic-ai/sdk')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, CustomAPIError } = require('../errors')
const { NFL_TEAMS, NFL_TEAM_ABBRS } = require('../constants/teams')

// 25s timeout + no retries keeps the response inside Heroku's 30s router limit
const client = new Anthropic({ timeout: 25 * 1000, maxRetries: 0 })

const BET_TYPES = [
  'spread',
  'moneyline',
  'over-under',
  'future',
  'parlay',
  '2-team-teaser',
  '3-team-teaser',
]

const nullable = (type) => ({ anyOf: [{ type }, { type: 'null' }] })

const PARSED_BET_SCHEMA = {
  type: 'object',
  properties: {
    sport: { anyOf: [{ type: 'string', enum: ['NFL', 'NBA'] }, { type: 'null' }] },
    season: nullable('integer'),
    week: nullable('integer'),
    betType: { anyOf: [{ type: 'string', enum: BET_TYPES }, { type: 'null' }] },
    team: { type: 'array', items: { type: 'string' } },
    opponent: { type: 'array', items: { type: 'string' } },
    line: { type: 'array', items: { type: 'string' } },
    odds: nullable('string'),
    betAmount: nullable('number'),
    betPayout: nullable('number'),
    notes: nullable('string'),
  },
  required: [
    'sport',
    'season',
    'week',
    'betType',
    'team',
    'opponent',
    'line',
    'odds',
    'betAmount',
    'betPayout',
    'notes',
  ],
  additionalProperties: false,
}

const PROMPT = `Extract the bet from this sportsbook ticket screenshot.
- team/opponent: use ONLY these NFL abbreviations: ${NFL_TEAM_ABBRS.join(' ')}.
  Mapping: ${Object.entries(NFL_TEAMS)
    .map(([abbr, name]) => `${name}=${abbr}`)
    .join(', ')}.
- team[i] is the side bet on for leg i; opponent[i] is the other team; line[i] is the
  spread or total as printed (e.g. "-3.5", "o47.5"). If the opponent is not shown for a
  leg, use "" for that entry. For a future on a player or award, put the player/subject
  in team and use "" for opponent.
- betType: exactly one of ${BET_TYPES.join(' | ')} (use 2-team-teaser or 3-team-teaser
  by leg count when the ticket is a teaser).
- odds: the American odds for the whole ticket as a string (e.g. "-110", "+150").
- betAmount: dollars risked. betPayout: NET profit if the bet wins — if the ticket shows
  total payout including the stake, subtract the stake.
- season: the NFL season year the game belongs to. week: the NFL week number if it can
  be determined from the ticket, otherwise null.
- notes: anything important that doesn't fit the other fields, otherwise null.
- Use null (or "" inside arrays) for anything you cannot read. Do not guess.`

const parseTicket = async (req, res) => {
  if (!req.file) {
    throw new BadRequestError('No image uploaded')
  }

  let response
  try {
    response = await client.beta.messages.create({
      model: process.env.ANTHROPIC_MODEL || 'claude-opus-5',
      max_tokens: 2048,
      output_config: {
        effort: 'low',
        format: { type: 'json_schema', schema: PARSED_BET_SCHEMA },
      },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: req.file.mimetype,
                data: req.file.buffer.toString('base64'),
              },
            },
            { type: 'text', text: PROMPT },
          ],
        },
      ],
    })
  } catch (error) {
    // covers API errors, timeouts, and missing-credential config problems
    console.error('parse-ticket error:', error.status || '', error.message)
    throw new CustomAPIError(
      'Ticket reading service failed, please try again',
      StatusCodes.BAD_GATEWAY,
    )
  }

  if (response.stop_reason === 'refusal') {
    throw new BadRequestError('Could not read this image, please enter the bet manually')
  }
  if (response.stop_reason === 'max_tokens') {
    throw new CustomAPIError(
      'Ticket reading came back incomplete, please try again',
      StatusCodes.BAD_GATEWAY,
    )
  }

  const text = response.content.find((block) => block.type === 'text')?.text
  // structured outputs guarantee schema-valid JSON outside the refusal case
  const parsed = JSON.parse(text)
  res.status(StatusCodes.OK).json({ parsed })
}

module.exports = parseTicket
