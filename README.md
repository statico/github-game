# github-game ✅ ✨

Win the GitHub game with artistic green squares!

TODO: Screenshot

Works with GitLab, too. Just tell them it's like GitHub with blue squares.

## Why?

Because I saw and shared [this](https://twitter.com/EmilyKager/status/1277983791190085632):

[![](https://user-images.githubusercontent.com/137158/87092363-22e58380-c1f0-11ea-9df0-04974a6abfd9.png)](https://twitter.com/EmilyKager/status/1277983791190085632)

And [@PeteMarkowsky](https://twitter.com/PeteMarkowsky) was like:

> re: green squares has anyone released a github action that just does a commit to a private repo as you

So I made this.

## How?

- Make a 53x7 of whatever you want
- Node.js v12 or later or something I don't know
- `yarn install`
- Include private contributions in your [GitHub settings](https://github.com/settings/profile) to up your green square game
- Make a private repo on GitHub to hide your secrets
- Run `node index.js image.png ~/game git@github.com:yourname/yourrepo.git` and git push force origin
- Bask in the glory of your new resume-crushing GitHub profile

## Huh?

[This.](https://docs.github.com/en/github/setting-up-and-managing-your-github-profile/managing-contribution-graphs-on-your-profile)