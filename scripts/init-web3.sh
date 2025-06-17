#!/usr/bin/env bash
# init-web3.sh — bootstrap swordbattle.io (Web3)

##############################################################################
# deps
##############################################################################
need() {
  command -v "$1" >/dev/null 2>&1 && return
  echo "❌ $1 missing."
  case "$OSTYPE" in
    linux*) echo "   sudo apt install $1";;
    msys*)  echo "   pacman -S $1";;
  esac
  MISSING=1
}

MISSING=0
need git
need curl
need wget               # for later scripts
command -v gh >/dev/null && GH=1 || GH=0   # gh is optional
[ "$MISSING" -eq 1 ] && { echo "fix deps first."; exit 1; }

##############################################################################
# vars
##############################################################################
set -euo pipefail

FORK="NovaCrafterLab/swordbattle.io"
UP="codergautam/swordbattle.io"
DIR="swordbattle.io"

##############################################################################
# clone
##############################################################################
echo "→ clone repo"
if [ "$GH" -eq 1 ]; then
  gh repo clone "$FORK" "$DIR"
else
  git clone "https://github.com/$FORK.git" "$DIR"
fi
cd "$DIR"

##############################################################################
# remotes
##############################################################################
echo "→ add upstream"
git remote add upstream "https://github.com/$UP.git" 2>/dev/null || true
git fetch upstream -q
[ "$GH" -eq 1 ] && gh repo set-default "$FORK"

##############################################################################
# branches
##############################################################################
echo "→ branch setup"
git checkout -B web3-main
git branch --track main origin/main 2>/dev/null || true
git branch --track upstream-main upstream/main || true

##############################################################################
# first sync
##############################################################################
echo "→ sync upstream"
git checkout main
git merge --ff-only upstream/main && git push -u origin main
git checkout web3-main
git merge --no-edit upstream/main

##############################################################################
# done
##############################################################################
echo "✅ ready. branches:"
git branch -vv
