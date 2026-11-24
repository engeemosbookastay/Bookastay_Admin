#!/bin/sh
# Copies the newest build from a GitHub repo's "deploy" branch into a website
# folder on the cPanel server. Does nothing if there is no new build.
#
# Set up once in cPanel → Cron Jobs (every 5 minutes), one line per site:
#   sh $HOME/cpanel-sync.sh https://github.com/engeemosbookastay/Bookastay.git $HOME/public_html
#   sh $HOME/cpanel-sync.sh https://github.com/engeemosbookastay/Bookastay_Admin.git $HOME/<admin folder>
# Each deploy is logged to $HOME/.deploy/deploy.log.
set -e
PATH="$PATH:/usr/local/cpanel/3rdparty/bin"
REPO="$1"
TARGET="$2"
[ -n "$REPO" ] && [ -d "$TARGET" ] || { echo "usage: cpanel-sync.sh <repo url> <existing site folder>" >&2; exit 1; }

WORK="$HOME/.deploy/$(basename "$REPO" .git)"
mkdir -p "$HOME/.deploy"
if [ ! -d "$WORK/.git" ]; then
  git clone -q --depth 1 --branch deploy "$REPO" "$WORK"
  cd "$WORK"
else
  cd "$WORK"
  git fetch -q --depth 1 origin deploy
  [ "$(git rev-parse HEAD)" = "$(git rev-parse FETCH_HEAD)" ] && exit 0
  git reset -q --hard FETCH_HEAD
fi

# Copy the build over the site; files that aren't part of the build are left alone.
tar --exclude=.git -cf - . | (cd "$TARGET" && tar -xf -)
echo "$(date '+%F %T') deployed $(git rev-parse --short HEAD) to $TARGET" >> "$HOME/.deploy/deploy.log"
