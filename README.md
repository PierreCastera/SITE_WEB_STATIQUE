# Green Crushed Avocado — fiches produits

Première version des fiches GROWER, HANGROWER, CLINGROWER et MAGROWER, rédigée à partir des pages produit et de la FAQ de votre site existant le 1er octobre 2026. Les textes sont reformulés pour des fiches d’information accessibles par QR code. Le guide des tailles est conservé localement dans `assets/guide-des-tailles.pdf`.

Les sources produit sont indiquées dans le champ `source` de chaque fiche. Les informations communes de fabrication et de compatibilité viennent de [votre FAQ](https://www.greencrushedavocado.fr/faq). Les photos et un mode d’emploi détaillé restent à ajouter : les pages consultées ne fournissaient pas de consignes précises d’installation, d’entretien ou de germination. Les prix et la disponibilité restent sur votre boutique.

## Modifier les fiches

Les textes sont regroupés dans `contenus/produits.json`. Chaque fiche possède un SKU permanent au format `p` suivi de cinq chiffres (`p00001`, `p00002`, `p00003`, `p00004`). Le champ `sku` détermine le dossier et l’adresse de la fiche. Garder ce SKU même si le nom du produit change : les QR codes conserveront leur destination. Ne jamais réaffecter une ancienne adresse à un autre produit encore en circulation.

Pour une photo, placer le fichier dans `assets/` et renseigner, par exemple, `"photo": "assets/produit-01.webp"`. Les champs `titre` et `texte` des rubriques sont libres. Ajouter les informations applicables à chaque produit à partir de vos textes validés.

Après modification, exécuter depuis ce dossier avec Node.js :

```powershell
node scripts/generer.mjs
```

Cela produit de véritables pages HTML. Le visiteur n’a pas besoin de JavaScript. Les fichiers générés doivent également être envoyés à GitHub.

## Voir la maquette

Ouvrir `index.html` dans un navigateur : les liens et les styles fonctionnent aussi directement depuis le dossier. Les fiches sont dans `p00001/index.html` à `p00004/index.html`.

## Publier sur GitHub Pages

1. Créer un dépôt GitHub public, par exemple `gca-fiches-produits`. GitHub Free permet Pages pour les dépôts publics.
2. Envoyer le contenu de ce dossier à la racine du dépôt, y compris les pages générées, `assets/`, les dossiers `p00001/` à `p00004/`, `.nojekyll` et `CNAME`.
3. Dans **Settings → Pages**, choisir **Deploy from a branch**, puis **main** et **/(root)**. Enregistrer.
4. Attendre la publication. Le fichier `CNAME` fourni définit déjà le domaine personnalisé ; terminer son raccordement ci-dessous pour rendre `https://qr.greencrushedavocado.fr/` accessible. Pour tester d’abord à l’adresse GitHub `https://VOTRE-COMPTE.github.io/gca-fiches-produits/`, publier provisoirement sans fichier `CNAME` et sans domaine personnalisé configuré, puis rétablir le domaine au moment du raccordement.

## Raccorder IONOS en gardant Wix

Adresse choisie : **qr.greencrushedavocado.fr**. Les domaines principaux `.fr` et `.com` peuvent continuer de pointer vers Wix.

1. Vérifier de préférence la propriété du domaine dans les paramètres GitHub Pages du compte, avec l’enregistrement TXT donné par GitHub.
2. Dans **Settings → Pages → Custom domain** du dépôt, vérifier que `qr.greencrushedavocado.fr` est bien configuré et enregistrer si nécessaire **avant** de configurer le CNAME chez IONOS. Le fichier `CNAME` correspondant est déjà fourni dans ce dossier.
3. Dans IONOS, ouvrir les réglages DNS du domaine `.fr`, créer si nécessaire le sous-domaine `qr`, puis ajouter ou modifier uniquement son enregistrement :

   | Champ | Valeur |
   | --- | --- |
   | Type | CNAME |
   | Nom / hôte | `qr` |
   | Cible | `VOTRE-COMPTE.github.io` |

   Remplacer `VOTRE-COMPTE` par le véritable nom du compte ou de l’organisation GitHub. La cible ne contient ni `https://`, ni nom de dépôt, ni chemin. Conserver les réglages du domaine principal, de `www` et des e-mails. Si IONOS signale un conflit, examiner les réglages du seul sous-domaine `qr` avant de les modifier.
4. Attendre la validation DNS et la création du certificat, puis activer **Enforce HTTPS** sur GitHub Pages lorsqu’il est disponible. La propagation DNS et la disponibilité de cette option peuvent demander jusqu’à 24 heures.
5. Tester chacune des quatre adresses ci-dessous sur un téléphone.

## Adresses des QR codes

Une fois le sous-domaine fonctionnel :

| Fiche | Adresse à encoder |
| --- | --- |
| GROWER · p00001 | `https://qr.greencrushedavocado.fr/p00001/` |
| HANGROWER · p00002 | `https://qr.greencrushedavocado.fr/p00002/` |
| CLINGROWER · p00003 | `https://qr.greencrushedavocado.fr/p00003/` |
| MAGROWER · p00004 | `https://qr.greencrushedavocado.fr/p00004/` |

Utiliser des QR codes statiques contenant directement ces adresses. Les informations pourront évoluer sur les pages sans réimprimer les codes. Si l’hébergeur change, conserver le même sous-domaine et les mêmes chemins chez le nouvel hébergeur.

Les adresses sont choisies ; les QR codes restent à générer. Avant de lancer les étiquettes, vérifier les quatre liens en HTTPS et scanner un exemplaire imprimé à sa taille réelle.

### Un autre domaine est-il nécessaire ?

Non. `qr.greencrushedavocado.fr` est un sous-domaine de votre domaine actuel, pas un nouveau domaine à acheter. On peut aussi utiliser directement l’adresse gratuite GitHub Pages ; les QR codes dépendraient alors de cette adresse GitHub. Utiliser le domaine principal avec GitHub Pages est également possible, mais nécessiterait de remplacer sa destination Wix. Un chemin tel que `greencrushedavocado.fr/produits/` ne peut pas être envoyé vers GitHub uniquement par un réglage DNS : le DNS gère les noms d’hôtes, pas les chemins. Cela demanderait une redirection sur le site actuel ou une infrastructure intermédiaire.

## Documentation officielle

- [GitHub : configurer un domaine personnalisé](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub : vérifier son domaine](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [IONOS : configurer un CNAME pour un sous-domaine](https://www.ionos.fr/assistance/domaines/configurer-des-enregistrements-cname-pour-des-sous-domaines/configurer-un-enregistrement-cname-pour-un-sous-domaine-existant/)
