#!/bin/bash

bump_version() {
    local DIR="$1"
    local GIT_DIFF_FILE="$2"
    local FILE_TO_UPDATE="$3"

    PWD_=$(pwd)
    cd "$DIR" || exit 1
    if [ ! -f "$FILE_TO_UPDATE" ]; then
        echo "Error: $FILE_TO_UPDATE not found"
        exit 1
    fi

    if git diff --cached --name-only | grep -q "$GIT_DIFF_FILE"; then
        echo "$GIT_DIFF_FILE has changed. Updating version in $FILE_TO_UPDATE..."
        CURRENT_VERSION=$(grep -oP "(?<=$GIT_DIFF_FILE\?v=)\d+" "$FILE_TO_UPDATE")

        if [ -z "$CURRENT_VERSION" ]; then
            echo "Error: Could not find current version in $FILE_TO_UPDATE"
            exit 1
        fi

        NEW_VERSION=$((CURRENT_VERSION + 1))
        sed -i -E "s/(${GIT_DIFF_FILE}\?v=)$CURRENT_VERSION/\1$NEW_VERSION/" "$FILE_TO_UPDATE"
  
        echo "Version updated to $NEW_VERSION for $GIT_DIFF_FILE in $FILE_TO_UPDATE"
        git add "$FILE_TO_UPDATE"
    fi
    cd "$PWD_" || exit 1
}
