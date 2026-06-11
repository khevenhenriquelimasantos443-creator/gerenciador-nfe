#!/bin/bash
# Uso: bash ponto/bump.sh "Descrição da atualização"
# Incrementa versão em sw.js e version.json automaticamente

NOTES="${1:-Nova atualização}"
DIR="$(cd "$(dirname "$0")" && pwd)"

# Lê versão atual
CURRENT=$(grep -o '"version": "[^"]*"' "$DIR/version.json" | grep -o '[0-9][0-9.]*')
MAJOR=$(echo "$CURRENT" | cut -d. -f1)
MINOR=$(echo "$CURRENT" | cut -d. -f2)
NEW="${MAJOR}.$((MINOR + 1))"

# Atualiza version.json
cat > "$DIR/version.json" <<EOF
{
  "version": "${NEW}",
  "notes": "${NOTES}"
}
EOF

# Atualiza sw.js
sed -i "s/const VERSION = '[^']*'/const VERSION = '${NEW}'/" "$DIR/sw.js"

echo "✓ Versão: ${CURRENT} → ${NEW}"
echo "✓ Notes: ${NOTES}"
