# cwt-echo-bot

This is demo-ware: make a bot that posts back when you send it a DM. (but does not reply to its own message ad infinitum)

To get started, create your bot here: https://developer.webex.com/add-app.html (other application types are out of scope)

Copy the (double quoted) token string to file named `token.json` e.g. `"BOT_ACCESS_TOKEN_FROM_DEV_PORTAL_RANDOM_SECRET"`

Clone this repository with `git` and drop `token.json` into the `config` directory, then follow the instructions below:

## 2018-06-28

Last week, we created a Cisco Webex Teams bot application using the dev portal. (developer.webex.com)

0. You already have NodeJS (for `npm`) as well as `docker` and have used `git` to fork/clone this repo.
1. Copy `token.json` (file containing only the bot's token as a quoted string) into the `config` folder.
2. Run `npm install` to populate `node_modules` and try `npm test` to exercise a simple test server.
3. Examine `package.json` to understand the `scripts` available in this bot project scaffold.
4. Next, try running `npm run docker` to create a container using the included `Dockerfile`.
5. Notice how `npm start` executes the `server` script by default? (simple test server)
6. Examine the contents of the `bot` folder and the provided script. Can you run that?
7. Why isn't your bot responding to messages yet? Try `npm run tunnel` for `ngrok`.
8. Can you modify your bot to echo back the message that caused webhook delivery?
9. What will you make your bot do? Will you add an API, or a React front-end?
