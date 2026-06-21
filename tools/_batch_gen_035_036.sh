#!/bin/zsh
# Batch-Bildgenerierung 035 + 036 mit gpt-image-2 (gen_thumb_v2.py), keine Skyline.
set -u
cd ~/Desktop/Claude/Code/podcastworkflow-cz
PY=".venv-tools/bin/python"
GEN="tools/gen_thumb_v2.py"
LOGO="/Users/kiaffairs/Desktop/Claude/Code/Bild Assets/ki_affairs_logo_2048.png"
R1="assets/000_PP-1_1737365716504.jpg"
R2="assets/001_PP-2_1737365716276.jpg"
D12="Staffel 03/03-012_KI-lernt-luegen/bilder"
D11="Staffel 03/03-011_KI-und-die-menschliche-Psyche/bilder"

gen_person() {  # prompt, output
  echo "=== PERSON: $2"
  $PY $GEN --prompt-file "$1" --output "$2" --ref "$R1" --ref "$R2" --logo "$LOGO" --fidelity none 2>&1
}
gen_concept() {  # prompt, output  (refless -> generations)
  echo "=== CONCEPT: $2"
  $PY $GEN --prompt-file "$1" --output "$2" --logo "$LOGO" --fidelity none 2>&1
}

# --- 036 ---
gen_person  "$D12/_api-prompt-linkedin.txt"        "$D12/linkedin.png"
gen_concept "$D12/_api-prompt-blog-hero.txt"       "$D12/hero.png"
gen_concept "$D12/_api-prompt-blog-cost.txt"       "$D12/cost.png"
gen_concept "$D12/_api-prompt-blog-compliance.txt" "$D12/compliance.png"
gen_concept "$D12/_api-prompt-blog-trust.txt"      "$D12/trust.png"

# --- 035 ---
gen_person  "$D11/_api-prompt-thumb-quicky.txt"    "$D11/thumbnail-quicky.png"
gen_person  "$D11/_api-prompt-thumb-deepdive.txt"  "$D11/thumbnail-deepdive.png"
gen_person  "$D11/_api-prompt-linkedin.txt"        "$D11/linkedin.png"

echo "=== BATCH FERTIG ==="
