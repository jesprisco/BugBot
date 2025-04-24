require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialize your Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listen to messages in any channel the bot is added to
app.message(async ({ message, client, say }) => {
  if (message.subtype || !message.text) return;

  const bugText = message.text.trim();

  const bugReport = `*Title:* ${bugText.slice(0, 80)}

*Steps to Reproduce:*
1. _What steps caused this?_

*Expected Result:* _What should happen?_

*Actual Result:* ${bugText}

*Environment:* _Browser/OS/Device?_`;

  // DM the user with formatted bug report + Jira button
  await client.chat.postMessage({
    channel: message.user,
    text: "Here's your bug report!",
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: bugReport }
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Create Jira Ticket"
            },
            url: "https://yourteam.atlassian.net/secure/CreateIssue!default.jspa", // ← customize this!
            action_id: "jira_link"
          }
        ]
      }
    ]
  });
});

// Start your app
(async () => {
  const port = process.env.PORT || 3000;
  await app.start(port);
  console.log(`⚡️ BugBot is running on port ${port}`);
})();
