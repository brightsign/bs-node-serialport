#!/bin/bash

# Update version in package.json - version control for the repo -
# and update the changelog.

# Usage: In `bs-node-serialport` folder, run the following command:
#  ./scripts/update-version.sh <new_version> [windows_safe]

NEW_VERSION=${1?Error: Pass new version}
PROJECT_CURRENT_VERSION=$(node -p "require('./package.json').version")

if [ ${2} == "windows_safe" ]; then
  sed -i "s/\"version\": \"$PROJECT_CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
else
  sed -i '' "s/\"version\": \"$PROJECT_CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

npm install
npm run changelog