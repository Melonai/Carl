const fetch = require('node-fetch');

async function getImagesForSubreddit(subreddit) {
    const postResponse = await fetch(`https://reddit.com/r/${subreddit}/hot.json`).then(res => res.json());
    return postResponse.data.children.filter(post => post.data.selftext === "");
}

module.exports = getImagesForSubreddit;