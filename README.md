# github-game ✅ ✨

Win the GitHub game with artistic green squares!

<img width="726" alt="Screenshot of GitHub activity" src="https://user-images.githubusercontent.com/137158/87118466-534d1200-c230-11ea-8288-d5723357743b.png">

Works with GitLab, too. Just tell them it's like GitHub with blue squares.

## Why?

Because I saw and shared [this](https://twitter.com/EmilyKager/status/1277983791190085632):

[<img width="500" alt="Tweet from Emily Kager" src="https://user-images.githubusercontent.com/137158/211115198-7d623f02-0110-4611-baa2-77633fe46f8b.png">](https://twitter.com/EmilyKager/status/1277983791190085632)

And [@PeteMarkowsky](https://twitter.com/PeteMarkowsky) was like:

> re: green squares has anyone released a github action that just does a commit to a private repo as you

So I made this.

## How?

- Make a 53x7 image of whatever you want
- Node.js v12 or later or something I don't know
- `yarn install`
- Include private contributions in your [GitHub settings](https://github.com/settings/profile) to up your green square game
- Make a private repo on GitHub to hide your secrets
- Run `node index.js image.png ~/game git@github.com:yourname/yourrepo.git` and git push force origin
- Bask in the glory of your new resume-crushing GitHub profile

## It doesn't work?

- Fiddle with the `MAX_COMMITS` environment variable or something
- Delete, re-create the private repo, and push again
- Wait a few minutes
- 🤷‍♀️

## See Also

- https://github.com/Annihil/github-spray
- https://github.com/gelstudios/gitfiti

I made this before seeing the above projects.

Also, this version uses `git fast-import` to create a git repo, which is 🔥

## License

MIT
