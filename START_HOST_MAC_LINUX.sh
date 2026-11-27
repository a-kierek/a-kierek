#!/bin/sh
cd "$(dirname "$0")"
echo 'THE CATROOMS v1.7 Alpha 1: open http://localhost:8765 in a browser'
exec node server/server.js
