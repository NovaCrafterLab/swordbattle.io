# Swordbattle.io – NovaCrafterLab Fork (Web3 Edition)

> **This repository is a personal fork of the original game by [@codergautam](https://github.com/codergautam/swordbattle.io).**
> It adds experimental **Web3 / on‑chain assets** while **respecting the original gameplay and licence**.
> Please read the notes below before cloning, building or sending pull‑requests.

---

## 🗺️ Repository Map & Branch Policy

| Branch                  | Role                                 | What goes in                                                                                          | Protection                                               |
| ----------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `web3-main` *(default)* | **Web3 Feature Line**                | All new gameplay, wallet & NFT code, CI/CD for web3 build                                             | Free push; PR review optional                            |
| `main`                  | **Upstream Sync + Security Patches** | Clean mirror of upstream plus cherry‑picked vulnerability fixes                                       | Protected, PR review ✔, CI gate blocks any `web3/` paths |
| `upstream-main`         | **Local Tracking Branch**            | *Never pushed*. Fast‑forward mirror of `codergautam/swordbattle.io/main` used for merges & comparison |  —                                                       |

> **TL;DR** If you’re contributing Web3 gameplay, target **`web3-main`**.
> If you’re helping back‑port a security fix, open your PR against **`main`**.

---

## 🤝 Respecting the Upstream Author

* All original code & assets remain © their respective authors under the GPL licence.
* Security or stability fixes developed here will be **cherry‑picked and submitted upstream**.
* Web3‑specific logic **will *not* be sent upstream** unless explicitly requested by the original maintainer.

---

## 🔄 Daily Workflow (maintainers cheat‑sheet)

1. **Sync upstream**
   `scripts/sync-upstream.sh` – pulls `upstream/main`, fast‑forwards `main`, merges into `web3-main`.
2. **Feature work**
   `git checkout -b feat/<name>` from `web3-main` → code → PR → merge.
3. **Security Patch**
   Fix on `web3-main` → cherry‑pick onto `main` → open PR to upstream.
4. **Release**
   Tag on `web3-main` using `vX.Y.Z-web3.N`, CI publishes to Netlify + IPFS.

---

*(The original README continues below for completeness.)*

<details>
<summary>Original upstream README</summary>

# Welcome!

Swordbattle.io is a multiplayer game where players fight each other with different 2D swords, and try to gain coins. The more coins you have, the bigger and powerful you get! Try to become the biggest of them all.

## Special Thanks

* Guru for helping make it less laggy
* Mistik for networking base
* Cool guy 53 (aka yocto) for maintaining the game late 2024
* All the artists for bringing sb to life

> Note: you are looking at the V2 version of the code. For the old V1 version, go to the [v1 repo](https://github.com/codergautam/swordbattle.io-legacy)

Play now at [swordbattle.io](http://swordbattle.io) and see the [leaderboard](https://www.swordbattle.io/leaderboard).

## Community

* [Discord](https://discord.com/invite/BDG8AfkysZ)

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
