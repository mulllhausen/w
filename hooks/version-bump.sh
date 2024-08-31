#!/bin/bash

bump_version() {
    local FILE="$1"
    local REF_FILE="$2"

    if git diff --cached --name-only | grep -q "$FILE"; then
        echo "$FILE has changed. Updating version in $REF_FILE..."

        # Extract the current version number
        CURRENT_VERSION=$(grep -oP "(?<=$FILE\?v=)\d+" "$REF_FILE")

        if [ -z "$CURRENT_VERSION" ]; then
            echo "Error: Could not find current version in $REF_FILE"
            exit 1
        fi

        NEW_VERSION=$((CURRENT_VERSION + 1))
        sed -i '' -E "s/($FILE\?v}=)$CURRENT_VERSION/\1$NEW_VERSION/" "$REF_FILE"
        echo "Version updated to $NEW_VERSION for $FILE in $REF_FILE"

        # Add the modified reference file to the commit
        git add "$REF_FILE"
    fi
}
