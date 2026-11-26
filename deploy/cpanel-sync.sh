#!/bin/sh
# Copies the newest build from a GitHub repo's "deploy" branch into a website
# folder on the cPanel server. Needs only curl (or wget) and tar — no git, no
# Terminal. Does nothing if there is no new build.
#
# Set up once in cPanel → Cron Jobs (Once Per Five Minutes), one line per site:
#   sh $HOME/cpanel-sync.sh engeemosbookastay/Bookastay $HOME/public_html
#   sh $HOME/cpanel-sync.sh engeemosbookastay/Bookastay_Admin $HOME/<admin folder>
# Each deploy is logged to $HOME/.deploy/deploy.log.
set -e
REPO="$1"
TARGET="$2"
[ -n "$REPO" ] && [ -d "$TARGET" ] || { echo "usage: cpanel-sync.sh <owner/repo> <existing site folder>" >&2; exit 1; }

STATE="$HOME/.deploy/$(echo "$REPO" | tr / _)"
mkdir -p "$STATE"
fetch() {
  if command -v curl >/dev/null 2>&1; then curl -fsSL "$1" -o "$2"; else wget -q "$1" -O "$2"; fi
}

# index.html changes with every build (it names the new asset files), so it
# tells us cheaply whether there is anything new to copy.
fetch "https://raw.githubusercontent.com/$REPO/deploy/index.html" "$STATE/index.new"
if [ -f "$STATE/index.html" ] && cmp -s "$STATE/index.new" "$STATE/index.html"; then
  rm -f "$STATE/index.new"
  exit 0
fi

fetch "https://codeload.github.com/$REPO/tar.gz/refs/heads/deploy" "$STATE/build.tar.gz"
rm -rf "$STATE/build"
mkdir "$STATE/build"
tar -xzf "$STATE/build.tar.gz" -C "$STATE/build" --strip-components=1

# Copy the build over the site; files that aren't part of the build are left alone.
(cd "$STATE/build" && tar -cf - .) | (cd "$TARGET" && tar -xf -)
mv "$STATE/index.new" "$STATE/index.html"
rm -rf "$STATE/build" "$STATE/build.tar.gz"
echo "$(date '+%F %T') deployed $REPO to $TARGET" >> "$HOME/.deploy/deploy.log"
