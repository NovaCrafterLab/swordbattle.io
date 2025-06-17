#!/usr/bin/env bash
# init-web3.sh — minimal bootstrap (no auto-merge)

##############################################################################
# deps
##############################################################################
need() { command -v "$1" >/dev/null 2>&1 || { echo "❌ $1 missing"; MISS=1; }; }
MISS=0; need git; need curl; need wget; command -v gh >/dev/null && GH=1 || GH=0
[ "$MISS" -eq 1 ] && { echo "install deps first"; exit 1; }

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
echo "→ clone fork"
[ "$GH" -eq 1 ] && gh repo clone "$FORK" "$DIR" || git clone "https://github.com/$FORK.git" "$DIR"
cd "$DIR"

##############################################################################
# remotes
##############################################################################
echo "→ add upstream remote"
git remote add upstream "https://github.com/$UP.git" 2>/dev/null || true
[ "$GH" -eq 1 ] && gh repo set-default "$FORK" || true

##############################################################################
# branches (no merge)
##############################################################################
echo "→ branch setup"
git checkout -B web3-main
git branch --track main origin/main 2>/dev/null || true
git branch --track upstream-main upstream/main 2>/dev/null || true

##############################################################################
# done
##############################################################################
echo "✅ ready. current branches:"
git branch -vv
