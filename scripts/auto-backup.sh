#!/bin/bash
# Auto-backup script — commit tous les changements avec un timestamp
# Utilisation: ./scripts/auto-backup.sh

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_DIR" || exit 1

# Vérifier s'il y a des changements à commit
if git diff --quiet && git diff --cached --quiet; then
  exit 0 # Rien à commit
fi

# Stage tous les fichiers suivis + nouveaux (sauf .gitignore)
git add -A

# Commit avec timestamp
TIMESTAMP=$(date "+%Y-%m-%d %H:%M")
git commit -m "auto-backup: $TIMESTAMP"

# Push automatique si un remote est configuré
if git remote -v | grep -q "origin.*push"; then
  git push origin main 2>/dev/null || echo "⚠️  Push échoué — pas de remote ou pas de connexion"
fi
