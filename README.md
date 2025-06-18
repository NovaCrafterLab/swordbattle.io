# Swordbattle.io – NovaCrafterLab Fork (Web3 Edition)

> **Personal fork of the original game by [@codergautam](https://github.com/codergautam/swordbattle.io).** Adds experimental **Web3 / on‑chain assets** while honoring upstream gameplay and licence.

---

## Branch roles (no tables, quick view)

- **`web3-main` – default**
  Web3 gameplay & release line. Free push / typical feature branches.
- **`main` – upstream sync + patches**
  Mirrors `codergautam/main` & holds cherry‑picked security fixes. _No Web3 code._ Protected branch.
- **`upstream-main` – local mirror**
  Fast‑forward copy of upstream. Never pushed.

> **PR guide**
> ‑ New Web3 features → target **`web3-main`**
> ‑ Security / bug fix for upstream → fix on `web3-main`, cherry‑pick to **`main`**, then open PR to upstream.

---

## Quick start (clone & layout in one line)

```bash
# Linux / WSL2 / MSYS2 Bash
bash <(curl -fsSL https://raw.githubusercontent.com/NovaCrafterLab/swordbattle.io/web3-main/scripts/init-web3.sh)
# – or –
wget -qO- https://raw.githubusercontent.com/NovaCrafterLab/swordbattle.io/web3-main/scripts/init-web3.sh | bash
```

> Requires **`curl` or `wget`**.
> On Windows, run inside **WSL2** or **MSYS2 MinGW64** for a POSIX shell.

The script will:

1. Clone `NovaCrafterLab/swordbattle.io`
2. Add `codergautam/swordbattle.io` as `upstream`
3. Create branches `web3-main`, `main`, `upstream-main`
4. Set `gh` default repo to the fork

After it prints _✔ Ready_ you can:

```bash
git checkout -b feat/my-awesome-feature   # start coding on web3-main
```

---

## Daily workflow (maintainers)

1. **Sync upstream** – run `scripts/sync-upstream.sh` (pull → merge into `main` & `web3-main`).
2. **Develop** – branch from `web3-main`, PR back when ready.
3. **Security patch** – fix on `web3-main`, cherry‑pick to `main`, PR to upstream.
4. **Release** – tag on `web3-main` (`vX.Y.Z-web3.N`), CI deploys.

---

## Respecting upstream

- Original code © upstream authors, GPL v3.
- Only clean security fixes are sent upstream; Web3 logic stays here unless requested.

---

_(Original upstream README below for reference)_

<details>
<summary>Original upstream README</summary>

# Welcome!

Swordbattle.io is a multiplayer game where players fight each other with different 2D swords, and try to gain coins. The more coins you have, the bigger and powerful you get! Try to become the biggest of them all.

## Special Thanks

- Guru for helping make it less laggy
- Mistik for networking base
- Cool guy 53 (aka yocto) for maintaining the game late 2024
- All the artists for bringing sb to life

> Note: you are looking at the V2 version of the code. For the old V1 version, go to the [v1 repo](https://github.com/codergautam/swordbattle.io-legacy)

Play now at [swordbattle.io](http://swordbattle.io) and see the [leaderboard](https://www.swordbattle.io/leaderboard).

## Community

- [Discord](https://discord.com/invite/BDG8AfkysZ)

## Run Locally

### Windows Video Tutorial (thanks to @Number1)

[https://www.youtube.com/watch?v=cCBdGGHIX-0\&t=2s](https://www.youtube.com/watch?v=cCBdGGHIX-0&t=2s)

A more detailed guide will be released soon but for now, follow these instructions:

1. Install NodeJS v18 and Yarn (with npm `npm install -g yarn`)
2. Clone this repo
3. Open two Terminals/CMD in the directory with extracted source
4. Run this command on one window to start the server: `cd server && yarn install && yarn start`
5. Run this command on the second terminal to start the client: `cd client && yarn install && yarn start`
6. Go to `localhost:8000` (server hosted at `localhost:3000`)

If you face any issues, you can get help on the [Swordbattle.io Discord Server](https://discord.com/invite/BDG8AfkysZ)!

## License

You can use this code as a base for your IO games, but please change it to a considerable amount to make it a different game. Under libraries and code you used, please add a link to this GitHub repository. Furthermore, under the GPL License, your game **MUST** also be open source. You cannot just take this free code and make it proprietary.

Thanks.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=78c9223db701&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

</details>
