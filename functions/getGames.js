const axios = require('axios')
const { format } = require('date-fns')
const { google } = require('googleapis')
const nodemailer = require('nodemailer')
const OAuth2 = google.auth.OAuth2

exports.handler = async (event, context) => {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env
  const url = 'http://gameday.netlify.com/games.json'
  const today = format(new Date(), 'M/DD/YYYY')
  const refreshToken = '1/mii74FRfifcgKeGVbZUYKBzTZw9ZnvJfk7l-aIhyEKY'

  const oauth2Client = new OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  )

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  })
  const tokens = await oauth2Client.refreshAccessToken()
  const accessToken = tokens.credentials.access_token

  // Setup SMTP details
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'travispamaral@gmail.com',
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken,
      accessToken
    }
  })

  return new Promise((resolve, reject) => {
    axios.get(url)
      .then(res => {
        const game = res.data[0]['4/28/2019'] // Get today's game if exists
        const mailOptions = {
          from: `"Travis Amaral" <travispamaral@gmail.com>`,
          to: 'travispamaral@gmail.com',
          subject: '⚾ Gameday automation - GAME TODAY! ⚾',
          html: `<h4>There is a game today!</h4>
          <p><strong>${game['SUBJECT']} | ${game['START TIME']}</strong></p>
          <p><a href="https://gameday.netlify.com">https://gameday.netlify.com</p>
          `
        }

        if (!game) {
          console.log('no game')
          resolve({
            statusCode: 200,
            body: 'No Game Today'
          })
        }

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log('Error sending email')
            resolve({
              statusCode: 500,
              body: JSON.stringify(error)
            })
          }
          resolve({
            statusCode: 200,
            body: 'Email sent!'
          })
        })
      })
      .catch(error => {
        console.log(error)
        resolve({
          statusCode: 400,
          body: JSON.stringify({ error: error.message })
        })
      })
  })
}
