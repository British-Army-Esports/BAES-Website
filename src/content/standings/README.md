# Standings

Add one `.yaml` file per discipline per season once real results exist, e.g. `2026-league-of-legends.yaml`:

```yaml
discipline: "league-of-legends"
season: "2026"
rows:
  - corps: "re"
    played: 6
    won: 5
    lost: 1
    gd: 11
    pts: 15
  - corps: "rs"
    played: 6
    won: 4
    lost: 2
    gd: 6
    pts: 12
```

Corps are the teams. Leave this directory empty (bar this file) until there's a real result to
publish — the site shows an honest "not yet published" state rather than placeholder rows.
