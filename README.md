# cwt-echo-bot

## 2018-06-28

Last week, we created a Cisco Webex Teams bot application using the dev portal. (developer.webex.com)

0. You already have NodeJS (for `npm`) as well as `docker` and have used `git` to fork/clone this repo.
1. Copy your `token.json` (file containing only your bot's token as a quoted string) into our `config`.
2. Run `npm install` to populate `node_modules` and try `npm test` to exercise a simple test server.
3. Examine `package.json` to understand the `scripts` available in this bot project scaffold.
4. Try running `npm run docker` to create a container listening (by default) on port 8080.
5. Notice how `npm start` executes the `server` script by default--what `npm test` tested.
6. Examine the contents of the `bot` folder and the provided script. Can you run that?
7. Why isn't your bot responding to messages yet? Try `npm run tunnel` for `ngrok`.
8. Can you modify your bot to echo back the message that caused webhook delivery?
9. What will you make your bot do? Will you add an API, or a React front-end?
