#!/bin/bash
# Builds dist/doha-fresh-mart-eb.zip, a source bundle for AWS Elastic Beanstalk
# (Node.js platform). Upload it in the Elastic Beanstalk console.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p dist
out=dist/doha-fresh-mart-eb.zip
rm -f "$out"
zip -r -X "$out" package.json package-lock.json Procfile src public .ebextensions .platform >/dev/null
echo "Created $out"
