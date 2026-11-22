# Présentations clients de Crème de Papier

## Reprendre le projet dans un nouveau chat

Lire ce fichier, puis README.md et le couple worker.js / client.js. Le domaine de production est prez.cremedepapier.fr, le Worker est cremedepapier-prez et le bucket R2 privé est cremedepapier-assets. Le dépôt est public. Y versionner le moteur et les instructions. Conserver briefs, devis, photos clients, propositions commerciales et identifiants dans les espaces privés prévus.

## Partir du rendez-vous commercial

Identifier le prospect, le décideur, sa langue, le besoin exprimé, les pièces reçues et la décision attendue à la fin. Reprendre les mots du brief. Garder les tarifs, délais, quantités et périmètres conformes au devis fourni. Demander les informations manquantes quand elles conditionnent une promesse commerciale.

Choisir la forme selon la matière et les conditions de lecture.

- Une proposition courte, destinée à être ouverte sur téléphone ou transmise par email, se prête à une page déroulante. Faire apparaître l’intention dès le premier écran, puis l’approche, une preuve pertinente et la prochaine étape.
- Une direction artistique à présenter en rendez-vous peut se dérouler en tableaux. Donner à chaque tableau une idée principale, une image lisible et une progression claire. Prévoir un sommaire pour revenir directement à un choix.
- Un dossier dense ou des pistes à comparer peuvent justifier des chapitres. Garder les détails contractuels dans le devis consultable et permettre au lecteur de retrouver sa place après fermeture.

Le projet David & Christelle est un exemple fictif de treize tableaux. Le nombre de pages, la palette du projet et ses textes lui sont propres. Adapter le rythme, les compositions et la narration à chaque prospect.

## Direction artistique et contenu

Employer le logo, les polices et les tracés filaires issus des fichiers de l’agence. Le logo partagé est disponible sous /brand/logo.png, la couverture filaire sous /brand/cover.png et les trois fontes sous /brand/1.ttf, /brand/2.ttf et /brand/3.ttf. Préserver les proportions, l’espace autour du logo et le contraste sur les photographies. Le filaire peut ponctuer une entrée, une transition ou une fin.

Donner aux images une fonction précise. Légender les références d’inspiration, les intentions proposées et les réalisations de l’agence de façon à identifier leur origine. Vérifier les droits et crédits des images. Dans un cas client, employer des résultats documentés. Pour chaque piste créative, expliquer en une ou deux phrases ce qu’elle apporte au projet du prospect.

Conclure sur une action adaptée au stade du projet : choisir une piste, fixer un échange ou valider le périmètre. Conserver le pied de page commun avec l’adresse, le téléphone, l’email et Instagram. Localiser aussi les boutons, légendes, sommaires, textes alternatifs et messages de la liseuse en français ou en anglais. Respecter la préférence de mouvement réduit, vérifier le contraste et garder les actions utilisables au clavier.

## Publier un projet

1. Choisir un slug stable. Préparer l’HTML du projet et ses médias. Un HTML one-page peut défiler librement dans le lecteur. Pour un diaporama, prévoir navigation tactile et clavier.
2. Déposer le contenu privé dans R2 sous `prez/<slug>/index.html`, les images sous `prez/<slug>/assets/` et les PDF optionnels sous `prez/<slug>/pdf/<id>.pdf`. Dans l’HTML, utiliser les URL du Worker `/<slug>/assets/<fichier>`. Garder le bucket privé. Réserver `prez/shared/` aux éléments communs. Pour le futur site principal, utiliser un autre préfixe.
3. Créer le secret Worker `CLIENT_<SLUG>` (majuscules et tirets remplacés par des traits de soulignement). Conserver les secrets existants, y compris l’accès agence et la clé de signature. Ne mettre aucun mot de passe dans Git, dans le HTML, dans une URL ou dans un exemple de brief.
4. Publier le manifeste dans Workers KV `cremedepapier-prez-private` à la clé `prez/<slug>/project.json` après les médias. Exemple : `{"lang":"fr","title":"Titre de la proposition","documents":[{"id":"devis","label":"Consulter le devis"}]}`. Pour un cahier des charges, ajouter une entrée distincte. Utiliser un tableau vide lorsque le projet n’a aucune annexe.
5. Vérifier sur le domaine final l’écran privé, le refus d’un mauvais code, l’accès client et l’accès agence. Une URL directe d’image ou de PDF doit demander une session du projet. Préserver les en-têtes de non-indexation et le robots.txt. Tester le premier et le dernier écran, le pied de page et les liens sur mobile et ordinateur. Avec un PDF, tester ouverture, fermeture, retour à la présentation et accès au fichier sur mobile.
6. Remettre à Christelle le lien du projet et le mot de passe client. Signaler les éventuelles vérifications encore ouvertes. L’envoi au prospect s’effectue à sa demande.
