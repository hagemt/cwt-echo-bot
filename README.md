# cwt-echo-bot

You: resourceful business collaboration dev/enabler; if you like this, you might also like [cisco-webex-tools](https://www.npmjs.com/package/cisco-webex-tools).

This bot is a template--it posts back when messaged. (ignores non-humans, and can only respond in groups when @mentioned)

When triggered (by webhook delivery = POST to target URL) an `event` action is fired, passing along relevant JSON `data`.

Events are handled without blocking other HTTP traffic (actions are processed asynchronously) to enable initial scale-up.

## Getting Started

Upfront: we expect you have installed a modern [NodeJS](https://nodejs.org) as well as a functional `docker` and `git`.

To get started, create your bot here: https://developer.webex.com/add-app.html (other application types: out of scope)

Copy the (double quoted) token string to file named `token.json` e.g. `"$SECRET_BOT_ACCESS_TOKEN_FROM_DEV_PORTAL"`

Clone this repository with `git` and drop `token.json` into the `config` directory, then follow the instructions below.

## Basic Walkthrough

Last week, we created a Cisco Webex Teams bot (application) using the dev portal. (developer.webex.com)

0. You already have NodeJS (for `npm`) as well as `docker` and have used `git` to fork/clone this repo.
1. Copy `token.json` (file containing only the bot's token as a quoted string) into the `config` folder.
2. Run `npm install` to populate the `node_modules` folder and `npm test` to exercise a simple test server.
3. Examine `package.json` to understand the `scripts` you can run via `npm`. Feel free to add stuff here.
4. Next, try running `npm run docker` to build and spawn a container using the included `Dockerfile`.

By default, `docker` will create a lightweight container running the `start` script. See Tooling Primer, below.

5. Notice how `npm start` executes the `server` script by default? (a simple test server, not the bot)
6. Examine the contents of the `bot` folder and the provided script. Can you figure out ho?
7. Why isn't your bot responding to messages yet? Try `npm run tunnel` in another terminal.
8. Can you modify your bot to reply with a different message, or do something else?
9. What will you make your bot do? Will you add an API, or a React front-end?

File issues (we also accept PRs) if you run into any problems. Feedback is much appreciated!

## Tooling Primer

Note: use [Kinematic](https://kitematic.com) and/or [Github Desktop](https://desktop.github.com/) if you prefer GUIs.

You might prefer an IDE, but NodeJS makes it simple enough to write JavaScript with any editor, even ones like `vim`.

To send HTTP requests, use your web browser (for simple GETs) or Postman or e.g. `curl -s http://localhost:8080/ -v`.

### Basic Docker

From the command line, use `docker ps -a` to list all your local containers, then `docker stop ...` and `docker rm ...`.

The included `Dockerfile` is simple enough for beginners, but robust enough for a (basic) production NodeJS application.

If you find yourself adding a database or multiple services, you might want to explore e.g. `docker-compose`, Swarm, etc.
