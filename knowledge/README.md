---
title: "Knowledge Graph Juridique Halo Talent"
type: index
---

# Knowledge Graph Juridique — Halo Talent

Ce dossier contient le second cerveau juridique de Halo Talent.

## Structure

```
knowledge/
├── platforms/       ← CGU des plateformes (OF, Fansly, MyM, Insta)
├── laws/            ← Textes de loi (France, EU, US, UK)
├── jurisprudence/   ← Contentieux connus
├── contracts/       ← Clauses abusives + contrat-type
└── industry/        ← Benchmarks, guides, rapports
```

## Relations clés

Les [[wiki-links]] relient :
- Une clause abusive → l'article de loi qui la rend nulle
- Une CGU plateforme → ses implications contractuelles
- Un contentieux → les clauses en cause
- Le contrat-type → les CGU et lois applicables

## Utilisation

Pour interroger ce graph, lance `/graphify` depuis Claude Code.

Exemples :
- "Quelles clauses sont abusives dans un contrat d'agence ?"
- "Est-ce que l'agence peut être propriétaire du compte OF ?"
- "Quels sont les risques RGPD du management de fans ?"
- "Génère une clause de résiliation conforme au droit français"
