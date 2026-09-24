<!-- TEMPLATE:START -->
> **Using this template**
> 1. On GitHub: **Use this template → Create a new repository** (make it public, and name it after your tool, e.g. `ai-stylist`).
> 2. `npm run new -- ai-stylist "AI Stylist" 👗` sets the id, name, icon and live URL everywhere, and removes this notice.
> 3. Write the pitch in `stoit.json`, then run `npm run readme`. Build the tool in `index.html` / `app.js`, and run `npm test`.
> 4. Settings → Pages → Source: **GitHub Actions**. Every push to `main` then publishes the app.
>
> See [DAILY.md](DAILY.md) for the one-app-a-day checklist.
<!-- TEMPLATE:END -->

# 🧩 My Tool

**[▶ Try it live](https://jarridxjackson.github.io/my-tool/)** · works on its own · plugs into STOIT

![CI](https://github.com/jarridxjackson/my-tool/actions/workflows/ci.yml/badge.svg)

<!-- Add a screenshot or a short GIF here: it's the first thing people look at. -->

<!-- PITCH:START (generated from stoit.json by `npm run readme`; edit stoit.json instead) -->
## The problem: 👾 TODO: Name the Villain

TODO: set the scene. What does the problem feel like, in a sentence or two?

## Five whys

1. **Why should I use this?** TODO: the direct benefit.
2. **Why does that matter?** TODO: what it changes for them.
3. **Why is it still a problem?** TODO: why the usual fixes fail.
4. **Why can’t I just wing it?** TODO: the cost of doing nothing.
5. **Why now?** TODO: the reason to start today.

## What it saves

About **1 hours** a month. TODO: how you worked the savings out.

## How to use it best

1. TODO: first step
2. TODO: second step
3. TODO: third step

**Best for:** TODO: who it's for

<!-- PITCH:END -->

## Use it with STOIT

This is a [STOIT tool](https://github.com/jarridxjackson/stoit-sdk). Use it on its own, or let STOIT open it for the right task. When a task on your STOIT Track matches (see `helpsWith` in [`stoit.json`](stoit.json)), STOIT suggests it and opens it with the task, its steps and the calendar event it leads up to. When you're done, the result goes back to STOIT and the task is completed.

## Privacy

Everything stays in your browser (local storage). Nothing is uploaded. When STOIT opens this tool, the task arrives in the URL's `#fragment`, which browsers never send to servers.

## Develop

No build step and no dependencies: plain HTML, CSS and JavaScript.

```sh
npm run serve   # http://localhost:8080
npm test        # unit tests + the publish check (Node 18+)
```

## License

MIT
