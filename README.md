# Lancers'Projet (espace élève, sans paramétrage du barème)
PWA pour le portail Applis EPS Élèves — identifiant d'application : `lancers` (identique à la version professeur).
Déploiement : dépôt `Lancers_EPS_Eleves` → Settings → Pages → `main` / root → https://vinztoc.github.io/Lancers_EPS_Eleves/
Puis ajouter la ligne de `portails/apps_json_a_ajouter.txt` dans `apps.json` de `Applis_EPS_Eleves`.

## Fonctions
- Identification (nom, prénom, classe) via `eleve-core.js` — base locale `EPSEleves`, aucune liste d'élèves.
- Saisie des essais et de la prévision, note /20 en direct avec le barème par défaut (aucun réglage possible), fiche imprimable.
- « Mes résultats » : historique, export `ELEVE.exporter(['lancers'])` (.xlsx à remettre au professeur), effacement.

## Fichiers
index.html · app-eleve.js · lancers-saisie.js · lancers-core.js · bareme-defaut.js · lancers.css · eps-core.js (v2.3) · eleve-core.js (v1.1) · version.js · sw.js · manifest.webmanifest · icons/
