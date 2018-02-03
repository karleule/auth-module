import ClientOAuth2 from 'client-oauth2'
import Auth from './auth.class.js'

export default class GitHub extends Auth {
  constructor (ctx, options) {
    super(ctx, options)
    this.ctx = ctx
    this.app = ctx.app
    this.options = options
    this._provider = this._setProvider()
  }

  _setProvider () {
     const { github:{hostName, clientID, clientSecret, tokenName} } = this.options

    return new ClientOAuth2({
      authorizationUri: `${hostName}/oauth/authorize`,
      accessTokenUri: `${hostName}/oauth/${tokenName}`,
      clientId: clientID,
      clientSecret: clientSecret,
      redirectUri: `http://${this.ctx.req.headers.host}/auth/callback`
    })
  }

  async login (endpoint) {
    const data = await this._provider.code.getToken(this.$req.url)

    if (!data) {
      return
    }

    const { accessToken } = data

    // Extract and set token
    this.setToken(accessToken)

    // TODO: Fetch user on OAuth

    // Set loggedIn to true
    this.setState('loggedIn', true)
  }

  _authorize () {
    let uri = this._provider.getUri();
    return this.redirect({uri})
  }
}
