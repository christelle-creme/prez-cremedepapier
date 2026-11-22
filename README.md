# Présentations Crème de Papier

Le Worker sert une présentation à chaque adresse /slug. TanStack Router gère le parcours et la liseuse latérale. Chaque présentation conserve son propre HTML, séquencé ou déroulant. Le dépôt public contient uniquement le moteur.

## Déploiement

Le Worker de production se nomme cremedepapier-prez. Son domaine personnalisé est prez.cremedepapier.fr. Le fichier worker.js est un module ES déployable dans Cloudflare Workers. Conserver les bindings lors des redéploiements.

| Binding | Type | Usage |
| --- | --- | --- |
| FILES | Workers KV | Namespace cremedepapier-prez-private |
| MEDIA | R2, facultatif | Objets privés des présentations, avec repli sur KV |
| LOGIN_LIMIT | Rate limiting | 10 tentatives par IP par 60 secondes |
| SIGNING_KEY | Secret | Clé aléatoire de signature des sessions |
| AGENCY_PASSWORD | Secret | Accès agence |
| CLIENT_NOM_DU_PROJET | Secret | Mot de passe de nom-du-projet |

## Ajouter une présentation

1. Choisir un slug en minuscules, chiffres et tirets. Créer le secret CLIENT_ suivi du slug en majuscules, les tirets remplacés par des caractères de soulignement.
2. Déposer le document HTML sous prez/SLUG/index.html et les images sous prez/SLUG/assets/. Dans le HTML, référencer /SLUG/assets/fichier.jpg. Les formats PNG, JPEG avec extension jpg, WebP et AVIF sont servis. Le logo et les polices communs sont accessibles sous /brand/logo.png et /brand/1.ttf à /brand/3.ttf.
3. Pour chaque PDF, déposer prez/SLUG/pdf/IDENTIFIANT.pdf dans le stockage privé. Lui donner un identifiant simple, sans espace. Les liens apparaissent en pied de page et ouvrent la liseuse.
4. Publier en dernier la configuration JSON dans KV sous prez/SLUG/project.json. Elle active la présentation. Utiliser fr ou en et rédiger le HTML dans la même langue.

Exemple de configuration pour un dossier anglophone :

    {"lang":"en","title":"Creative proposal","documents":[{"id":"brief","label":"Project brief"},{"id":"quote","label":"Estimate"}]}

Le tableau documents peut être vide. Le fichier graphique fourni pour le premier projet sert à l’identité commune.

## Interface commune

client.js peut être publié tel quel dans KV sous prez/shared/app.js, avec les imports versionnés déclarés dans le Worker. Pour compiler un module autonome, exécuter npm install puis npm run build et publier dist/app.js à la même clé. Les clés partagées cover.png et logo.png contiennent les extraits du PDF de marque.

L’accès privé est vérifié avant de servir le contenu, les documents ou les images du projet. Le Worker délivre un cookie signé valable huit heures, des réponses privées et la directive noindex. La racine ne liste pas les dossiers clients.
