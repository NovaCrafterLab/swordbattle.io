#!/usr/bin/env bash
# init-web3.sh — bootstrap NovaCrafterLab/swordbattle.io (Web3 edition)

##############################################################################
# Prerequisites check
##############################################################################

need() {
  command -v "$1" >/dev/null 2>&1 && return
  echo "❌  '$1' not found."
  case "$OSTYPE" in
    linux*)  echo "    sudo apt install $1   # Debian/Ubuntu"
             echo "    sudo dnf install $1   # Fedora"
             ;;
    msys*)   echo "    pacman -S $1          # MSYS2"
             ;;
  esac
  MISSING=1
}

MISSING=0
need git
need gh
need curl
need wget
[ "$MISSING" = 1 ] && { echo "Install missing tools and re-run."; exit 1; }

##############################################################################
# Variables
##############################################################################

set -euo pipefail

FORK="NovaCrafterLab/swordbattle.io"      # our repo
UP="codergautam/swordbattle.io"           # upstream
DIR="swordbattle.io"

##############################################################################
# Clone & setup
##############################################################################

echo "🔄 Clone fork ..."
gh repo clone "$FORK" "$DIR"
cd "$DIR"

echo "🔗 Add upstream remote ..."
git remote add upstream "https://github.com/$UP.git" 2>/dev/null || true
git fetch upstream --quiet

echo "⚙  Set gh default -> fork ..."
gh repo set-default "$FORK"

echo "🌳 Create branch layout ..."
git checkout -B web3-main                                # dev branch
git branch --track main origin/main     2>/dev/null || : # clean line
git branch --track upstream-main upstream/main || :

echo "⬇  Initial upstream sync ..."
git checkout upstream-main && git pull --quiet
git checkout main          && git merge --ff-only upstream-main && git push -u origin main
git checkout web3-main     && git merge upstream-main

echo -e "\n✅ Ready!  Start coding on 'web3-main'. Current branches:"
git branch -vv
