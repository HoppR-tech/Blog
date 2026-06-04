---
title: "React Compiler"
date: 2026-05-18T06:58:42.493Z
description: " > 💡 Depuis que React Compiler est passé en version stable (v1.0, octobre 2025), la question ne se pose plus vraiment : oui, il est prêt pour la production.   > Mais est-ce que ça vaut le coup ? Et e"
image: ./assets/cover-image.webp
alt: "React DevTools affichant les badges Memo sur des composants automatiquement
mémoïsés par React Compiler"
ogImage: ./assets/cover-image.webp
tags: ['front-end', 'performance', 'others']
published: true
authors:
  - id: 320f4462-cd38-8071-8eb7-f90621a068a3
    name: Marjorie Dieusart
    image: /default-author-image.webp
    linkedin: 
    x: 
reviewers:
  - id: 67adfd77-4b84-4496-b55d-3391541f59c5
    name: Michaël Bernasinski
    image: ./assets/reviewer-michael-bernasinski.webp
    linkedin: https://www.linkedin.com/in/michael-bernasinski
    x: 
    bio: "Principal Lead - Software Engineer - HoppR Lyon"
  - id: 188f4462-cd38-80d5-b9e6-ec28a94d11e5
    name: Bastien Dufour
    image: /default-author-image.webp
    linkedin: 
    x: 
  - id: 0bb914a6-f882-4951-bee6-53e8e8abb807
    name: Emmanuelle Gouvart
    image: ./assets/reviewer-emmanuelle-gouvart.webp
    linkedin: https://www.linkedin.com/in/emmanuellegouvart-182b6ab2/
    x: 
  - id: e8163b24-7e01-41c5-adbf-0dc655f929d0
    name: Nicolas Zago 
    image: ./assets/reviewer-nicolas-zago.webp
    linkedin: https://www.linkedin.com/in/nicolaszago/
    x: 
---

<!-- markdownlint-disable-file -->


# React Compiler : Ce que c’est, comment ça marche, et pourquoi j’ai décidé de le mettre en place

> 💡 Depuis que React Compiler est passé en version stable (v1.0, octobre 2025), la question ne se pose plus vraiment : oui, il est prêt pour la production.  
> Mais est-ce que ça vaut le coup ? Et est-ce qu’un compilateur peut vraiment remplacer une optimisation faite à la main ?  
>   
> Voici ce que j’ai compris en le mettant en place sur un projet React.

---

## L’état actuel

Pour comprendre l’intérêt de React Compiler, repartons du fonctionnement classique de React.

Dès qu’un composant parent met à jour son état (par exemple après un `setState`), tous ses enfants se re-rendent aussi — même si leurs props n’ont pas changé.

Pour limiter ça, on s’appuie sur plusieurs outils :

- `React.memo` → éviter le re-render d’un composant si ses props n’ont pas changé

- `useMemo` → éviter de recalculer des valeurs lors de chaque re rendu

- `useCallback` → stabiliser les références des fonctions

### Exemple classique

```javascript
const allProducts = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Produit ${i}`,
      price: (i + 1) * 10,
  }));

  async function fetchProducts(query) {
      await new Promise((r) => setTimeout(r, 200));
      return allProducts.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
      );
  }

  // React.memo sur chaque composant pour éviter les re-renders inutiles
  const Input = React.memo(function Input({ value, onChange, placeholder,
  variant }) {
      return (
          <input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`input input--${variant}`}
          />
      );
  });

  const ProductCard = React.memo(function ProductCard({ product, onAddToCart })
  {
      // Simule un traitement coûteux
      let score = 0;
      for (let i = 0; i < 100_000; i++) score += product.price;

      return (
          <div>
              <h2>{product.name}</h2>
              <p>{product.price} €</p>
              <button onClick={() => onAddToCart(product.id)}>Ajouter</button>
          </div>
      );
  });

  function ProductList() {
      const [query, setQuery] = useState('');
      const [products, setProducts] = useState(allProducts);

      useEffect(() => {
          if (!query) { setProducts(allProducts); return; }
          const timeout = setTimeout(async () => {
              setProducts(await fetchProducts(query));
          }, 300);
          return () => clearTimeout(timeout);
      }, [query]);

 // useCallback obligatoire : sans ça, React.memo sur Input et ProductCard ne sert à rien
// — les fonctions seraient recréées à chaque render et les props changeraient quand même
      const handleQueryChange = useCallback((e) => setQuery(e.target.value),
  []);
      const handleAddToCart = useCallback((id) => {
          console.log('Ajout au panier :', id);
      }, []);

      return (
          <div>
              <Input
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="Rechercher..."
                  variant="primary"
              />
              {products.map((product) => (
                  <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                  />
              ))}
          </div>
      );
  }
```

> ⚠️ Ça marche, mais :  
> - c’est verbeux  
>   
> - c’est fragile (oubli de dépendance = bug)  
>   
> - ça oblige à penser en permanence à la performance  
>   
> Et parfois, on découpe des composants uniquement pour limiter les re-renders.

---

## Un compilateur pour optimiser automatiquement

React Compiler arrive avec une idée simple: écrire du code normal et laisser le compilateur optimiser automatiquement

### Contexte

Le projet s'appelait à l'origine React Forget — le nom résumait bien l'ambition. [Annoncé à React Conf 2021](https://www.youtube.com/watch?v=lGEMwh32soc), il a été testé en production chez Meta (Instagram, Quest Store) pendant plusieurs années avant d'être ouvert au public.

---

## Installation

### Avec Vite

> 💡 React Compiler repose sur Babel. Il fonctionne uniquement avec **@vitejs/plugin-react** — pas encore avec **@vitejs/plugin-react-swc**.   
> Si ton projet utilise SWC, tu devras d'abord basculer sur le plugin Babel, ou patienter : le support SWC est en cours de discussion.

```bash
npm install --save-dev --save-exact babel-plugin-react-compiler@latest
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: ['babel-plugin-react-compiler'],
			},
		}),
	],
});
```

### Avec Next.js (v15.3.1+)

```javascript
// next.config.js
module.exports = {
	reactCompiler: true,
};
```

---

> 💡 **--save-exact** est recommandé si ta couverture de tests est partielle : les futures versions peuvent modifier le comportement de mémoïsation  (mettre en cache le résultat d'un calcul pour éviter de le refaire) et affecter tes `useEffect`

## Exemple concret (sans mémoïsation manuelle)

```javascript
function Input({ value, onChange, placeholder, variant }) {
      return (
          <input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className={`input input--${variant}`}
          />
      );
  }

  function ProductCard({ product, onAddToCart }) {
      let score = 0;
      for (let i = 0; i < 100_000; i++) score += product.price;

      console.log('render :', product.name);

      return (
          <div>
              <h2>{product.name}</h2>
              <p>{product.price} € — score : {score}</p>
              <button onClick={() => onAddToCart(product.id)}>Ajouter</button>
          </div>
      );
  }

  function ProductList() {
      const [query, setQuery] = useState('');
      const [products, setProducts] = useState(allProducts);

      useEffect(() => {
          if (!query) { setProducts(allProducts); return; }
          const timeout = setTimeout(async () => {
              setProducts(await fetchProducts(query));
          }, 300);
          return () => clearTimeout(timeout);
      }, [query]);

      const handleAddToCart = (id) => {
          console.log('Ajout au panier :', id);
      };

      return (
          <div>
              <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher..."
                  variant="primary"
              />
              {products.map((product) => (
                  <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                  />
              ))}
          </div>
      );
  }
```

## Comportement

- **Sans compilateur** →  chaque frappe dans le champ re-render ProductList, ce qui re-render tous les ProductCard — et leur boucle de 100 000 itérations. Sur 50
produits, c'est 50 traitements lourds à chaque touche, avant même que l'API
réponde.

- **Avec compilateur** → seul Input se re-render pendant la frappe. Les
ProductCard ne se re-rendent plus tant que leurs propriétés n'ont pas changé. Quand l'appel API revient (200ms plus tard), seuls les produits mis à jour se
re-rendent.

Le compilateur a automatiquement :

- mémoïsé `handleAddToCart` (équivalent `useCallback`)

- stabilisé les props de chaque ProductCard (équivalent React.memo)

- traité Input comme un composant mémoïsé.

---

## Sous le capot (version simple)

Le compilateur analyse ton code au moment du build :

- transforme le code en graphe de contrôle

- identifie les dépendances

- ajoute du cache automatiquement

Le compilateur opère au niveau de l'expression — plus fin qu'un `useMemo` classique. Il peut même mémoïser du code situé après un return conditionnel, ce qui est impossible à faire manuellement (les hooks ne peuvent pas être appelés après un return).

### Résultat (schéma simplifié)

```javascript
if (cache !== valeur) {
	// recalcul
	cache = valeur;
} else {
	// réutilisation
}
```

---

## Ce que ça ne remplace pas

Le compilateur optimise comment ça render, pas ce que ça render.

- Virtualisation (si tu affiches 10 000 lignes, render tous les éléments une seule fois reste trop lent. Un **sliding window** (react-virtual, TanStack Virtual) reste nécessaire.)

- code splitting / lazy loading - le compilateur n'agit pas sur la taille du
bundle ni sur le chargement initial.

---

## Les règles à respecter

Le compilateur ignore silencieusement les composants qu'il ne peut pas
analyser. Deux patterns le font échouer régulièrement :

`try/catch` dans le render — le compilateur ne peut pas suivre le flux d'exécution. Solution : déplacer le `try/catch` dans une fonction utilitaire appelée depuis le composant.

Déstructuration imbriquée dans la signature :

```javascript
// ❌
function Component({ items: [first, ...rest] }) {
  ... 
 }


// ✅
function Component({ items }) {
  const [first, ...rest] = items;
}
```



Pour le reste, les règles de base de React suffisent : composants purs, pas
d'effets de bord dans le render, state mis à jour uniquement via le setter.

> ⚠️ Activer **eslint-plugin-react-compiler** pour détecter les composants ignorés.

---

## Le piège principal : les échecs silencieux

Si le compilateur ne comprend pas, il n’optimise pas et ne dit rien

Résultat : une fausse impression d’optimisation.

### À faire absolument

- Activer **eslint-plugin-react-hooks** : il vérifie que tu respectes les règles
des hooks (ordre d'appel, tableaux de dépendances corrects, etc.).

- Activer **eslint-plugin-react-compiler** : il signale les composants que le
compilateur ne peut pas optimiser et explique pourquoi.

- vérifier les DevTools → badge “Memo ✨” sur les composants optimisés

Pour aller plus loin, le plugin Babel accepte une option logger qui te permet
de logguer les composants ignorés pendant le build — pratique pour auditer un
projet existant.

---

## Garder le contrôle

Le compilateur peut s'utiliser en opt-in ou en opt-out.

**Opt-out** — désactiver le compilateur pour un composant spécifique :

```javascript
function Component() {
	"use no memo";
}
```

**Opt-in** progressif — activer le compilateur uniquement sur un dossier via la
config Babel (includes / excludes). Utile pour migrer un projet existant sans tout toucher d'un coup.

Ces deux approches permettent d'adopter le compilateur graduellement, sans avoir à tout valider d'un seul coup.

---

## Performances réelles

N sont issus de retours publics de projets ayant adopté le compilateur en production.

| Projet | Métrique | Résultat | source |
| --- | --- | --- | --- |
| Meta Quest Store | Interactions | Jusqu’à  2.5× plus rapide | https://react.dev/blog/2025/10/07/react-compiler-1 |
| Meta Quest Store | Chargement initial | +12% | https://react.dev/blog/2025/10/07/react-compiler-1 |
| Sanity Studio | Render/ latence | -20 à -30% | https://github.com/reactwg/react-compiler/discussions/33 |
| Wakelet | INP | -15% | https://github.com/reactwg/react-compiler/discussions/52 |
| Wakelet | LCP | −10% (2,6s → 2,4s) | https://github.com/reactwg/react-compiler/discussions/52 |


Le plus gros gain se situe sur l'interactivité — les actions utilisateurs (clics, saisie, navigation) qui déclenchaient des chaînes de re-renders.

---

## Mon avis

React Compiler est une évolution, Il présente plusieurs avantages et contributions : 

### Avantages

- Un code plus simple

- moins de bugs liés aux tableaux de dépendances

- optimisation automatique souvent plus fine qu'à la main

### Inconvénients

- échecs silencieux

- moins de contrôle explicite qu'avant — ce qui peut déstabiliser au début

- certaines libs à adapter

---

## Mes Recommandations

Si tu as la chance de démarrer un nouveau projet, active le compilateur dès le début. C'est le cas idéal, tu pars d'une base propre sans comportement existant à préserver.

Dans le cadre d'un projet existant, ce qui est le cas le plus courant, je recommande une adoption progressive, composant par composant. Le compilateur va mémoïser automatiquement du code qui ne l'était pas auparavant : si certains composants avaient des effets de bord reposant implicitement sur les re-renders, leur comportement peut changer de façon silencieuse. Une bascule progressive te permet de valider au fur et à mesure plutôt que de chasser des régressions après une activation globale. 

Le badge "Memo ✨" dans les DevTools confirme que le compilateur a pris en charge un composant, mais ne garantit pas l'absence de re-renders : si une prop vient d'une lib tierce ou d'une fonction que le compilateur n'a pas pu stabiliser, le composant peut quand même se re-render. Utilise react-scan pour visualiser les re-renders réels.

## Conclusion

Avant : “Est-ce que je dois mettre un `useMemo` ici ?”

Maintenant : “Est-ce que mon code respecte les règles pour que le compilateur fasse le travail ?”

Le vrai gain, ce n’est pas seulement la performance. C’est de pouvoir se concentrer sur le produit plutôt que sur les optimisations.

---

