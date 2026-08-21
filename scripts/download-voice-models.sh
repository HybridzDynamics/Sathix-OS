#!/usr/bin/env bash
# Downloads voice model artifacts into the Docker volume mount directory.
# Run once before: docker compose up --build
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MODEL_DIR="${VOICE_MODEL_DIR:-$ROOT/runtime-models}"
STT_DIR="$MODEL_DIR/faster-whisper-small"
TTS_FILE="$MODEL_DIR/piper-en-us-lessac.onnx"

mkdir -p "$MODEL_DIR"

echo "Voice models directory: $MODEL_DIR"

if [[ ! -d "$STT_DIR" ]]; then
  echo "Downloading Faster-Whisper small model (Systran/faster-whisper-small)..."
  STT_DIR="$STT_DIR" python3 - <<'PY'
import os
from pathlib import Path
from huggingface_hub import snapshot_download

target = Path(os.environ["STT_DIR"])
snapshot_download(
    repo_id="Systran/faster-whisper-small",
    local_dir=str(target),
    local_dir_use_symlinks=False,
)
print("STT model ready at", target)
PY
else
  echo "STT model already present at $STT_DIR"
fi

if [[ ! -f "$TTS_FILE" ]]; then
  echo "Downloading Piper en_US-lessac voice..."
  TTS_FILE="$TTS_FILE" python3 - <<'PY'
import os
import urllib.request
from pathlib import Path

target = Path(os.environ["TTS_FILE"])
url = "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/medium/en_US-lessac-medium.onnx"
target.parent.mkdir(parents=True, exist_ok=True)
urllib.request.urlretrieve(url, target)
print("TTS model ready at", target)
PY
else
  echo "TTS model already present at $TTS_FILE"
fi

echo ""
echo "Set in .env (optional overrides):"
echo "  STT_MODEL_PATH=/models/faster-whisper-small"
echo "  TTS_MODEL_PATH=/models/piper-en-us-lessac.onnx"
echo ""
echo "Mount for Docker: VOICE_MODEL_DIR=$MODEL_DIR"
