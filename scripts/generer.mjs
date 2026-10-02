import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const racine = fileURLToPath(new URL('../', import.meta.url));
const produits = JSON.parse(await readFile(path.join(racine, 'contenus/produits.json'), 'utf8'));
const echapper = texte => String(texte).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const skus = new Set();
for (const produit of produits) {
  if (!/^p\d{5}$/.test(produit.sku) || skus.has(produit.sku)) throw new Error('Chaque produit doit avoir un SKU unique au format p suivi de cinq chiffres.');
  skus.add(produit.sku);
  if (!produit.nom || !produit.description || !Array.isArray(produit.informations)) throw new Error(`Contenu incomplet pour ${produit.sku}.`);
  if (produit.photo && !/^assets\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|svg)$/i.test(produit.photo)) throw new Error('La photo doit être un fichier dans assets/.');
  if (produit.photo && produit.photo.split('/').includes('..')) throw new Error('Chemin de photo invalide.');
}

function page(titre, description, contenu, prefixe) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${echapper(description)}">
  <meta name="theme-color" content="#364028">
  <title>${echapper(titre)} | Green Crushed Avocado</title>
  <link rel="icon" type="image/png" href="${prefixe}assets/logo-gca.png">
  <link rel="preload" href="${prefixe}assets/fonts/montserrat-variable.ttf" as="font" type="font/ttf" crossorigin>
  <link rel="stylesheet" href="${prefixe}assets/style.css">
</head>
<body>
  <a class="skip" href="#contenu">Aller au contenu</a>
  <header class="header"><a class="brand" href="${prefixe}index.html"><img class="brand-logo" src="${prefixe}assets/logo-gca.png" alt="" width="48" height="66"><span>Green Crushed<br>Avocado</span></a><a class="site-link" href="https://greencrushedavocado.fr/">Notre site ↗</a></header>
  <main id="contenu">${contenu}</main>
  <footer><span>Green Crushed Avocado</span><a href="https://greencrushedavocado.fr/">Retrouvez-nous sur notre site ↗</a></footer>
</body>
</html>
`;
}

const cartes = produits.map(p => `<a class="card" href="${p.sku}/index.html"><span class="eyebrow">SKU ${p.sku}</span><h2>${echapper(p.nom)}</h2><p>${echapper(p.description)}</p><span class="card-link">Découvrir le produit <span aria-hidden="true">↗</span></span></a>`).join('\n');
await writeFile(path.join(racine, 'index.html'), page('Nos produits', 'Les fiches produits Green Crushed Avocado.', `<section class="hero"><p class="eyebrow">Green Crushed Avocado · Les fiches produits</p><h1>Un peu plus près<br>de nos produits.</h1><p class="intro">Retrouvez les informations et les conseils d’utilisation de votre produit.</p></section><section class="grid" aria-label="Nos quatre produits">${cartes}</section>`, './'));

for (const p of produits) {
  const sections = p.informations.map((info, i) => `<section class="info"><span class="section-number" aria-hidden="true">0${i + 1}</span><div><h2>${echapper(info.titre)}</h2><p>${echapper(info.texte)}</p></div></section>`).join('\n');
  const photo = p.photo ? `<img class="product-photo" src="../${echapper(p.photo)}" alt="${echapper(p.nom)}">` : '';
  const contenu = `<a class="back" href="../index.html">← Tous les produits</a><section class="hero product-hero"><p class="eyebrow">Votre produit · SKU ${p.sku}</p><h1>${echapper(p.nom)}</h1><p class="intro">${echapper(p.description)}</p>${photo}</section><div class="details">${sections}</div><aside class="help"><h2>Le bon modèle pour votre bocal</h2><p>Consultez les dimensions et les références dans notre guide des tailles.</p><a class="button" href="../assets/guide-des-tailles.pdf">Ouvrir le guide des tailles · PDF ↗</a><p class="contact">Votre bocal ne figure pas dans le guide ? <a href="mailto:greencrushedavocado@gmail.com">Écrivez-nous</a>.</p></aside>`;
  const dossier = path.join(racine, p.sku);
  await mkdir(dossier, { recursive: true });
  await writeFile(path.join(dossier, 'index.html'), page(p.nom, p.description, contenu, '../'));
}
await writeFile(path.join(racine, '.nojekyll'), '');
console.log(`Accueil et ${produits.length} fiches générés.`);
