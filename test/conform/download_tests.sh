#!/usr/bin/env bash

CURRENT_DIR="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)"
BIDICLASS_FILE="${CURRENT_DIR}/bidiclass/BidiTest.txt"
CODEPOINT_FILE="${CURRENT_DIR}/codepoint/BidiCharacterTest.txt"

if [ -f "$BIDICLASS_FILE" ]; then
  echo "$BIDICLASS_FILE found, skipping download ..."
else
  echo "$BIDICLASS_FILE not found, downloading ..."
  wget www.unicode.org/Public/9.0.0/ucd/BidiTest.txt -P $CURRENT_DIR/bidiclass
fi

if [ -f "$CODEPOINT_FILE" ]; then
  echo "$CODEPOINT_FILE found, skipping download ..."
else
  echo "$CODEPOINT_FILE not found, downloading ..."
  wget www.unicode.org/Public/9.0.0/ucd/BidiCharacterTest.txt -P $CURRENT_DIR/codepoint
fi
