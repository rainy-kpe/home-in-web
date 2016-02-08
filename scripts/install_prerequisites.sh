#!/bin/bash

ROOT_UID=0     # Only users with $UID 0 have root privileges.
E_NOTROOT=67   # Non-root exit error.

if [ "$UID" -ne "$ROOT_UID" ]
then
  echo "Must be root to run this script."
  exit $E_NOTROOT
fi

apt-get install -y curl
curl -sL https://deb.nodesource.com/setup_5.x | bash -
apt-get install -y nodejs

ln -s /usr/bin/nodejs /usr/bin/node

npm install -g gulp bower typings firebase-tools
