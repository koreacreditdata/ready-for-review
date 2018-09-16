const request = require('superagent')
const sample = require('lodash.sample')

const { webhookUrl, slackIds } = require('./config.json')

/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.on(['pull_request.labeled'], async context => {
    const {
      label: { name: label },
      pull_request: {
        html_url: url,
        title,
        number,
        requested_reviewers: reviewers,
      },
      repository: { name: repo },
    } = context.payload

    if (reviewers.length < 1) { return }

    if (label == 'ready for review') {
      const emoji = sample([':mag:', ':microscope:', ':face_with_monocle:', ':speech_balloon:', ':pencil:'])
      const ids = reviewers.map(reviewer => `@${slackIds[reviewer.login]}`)

      await request.post(webhookUrl).send({
        text: `${ids.join(' ')} <${url}|${repo}#${number} ${title}> is ready for your review ${emoji}`,
        link_names: 1,
      })
    }
  })
}
