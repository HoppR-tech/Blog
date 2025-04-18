# Utilisation des équations mathématiques

Le blog HoppR supporte l'écriture d'équations mathématiques grâce à KaTeX. Vous pouvez inclure des formules mathématiques dans vos articles en utilisant la syntaxe LaTeX.

## Types d'équations

### 1. Équations en ligne

Pour écrire une équation dans le texte, entourez-la de simples dollars (`$`).

Exemple :
```text
La formule $E = mc^2$ est célèbre.
```

Rendu : La formule $E = mc^2$ est célèbre.

### 2. Équations en bloc

Pour les équations plus complexes ou que vous souhaitez mettre en évidence, utilisez la syntaxe avec doubles dollars (`$$`).

Exemple :
```text
$$
f(x) = \int_{-\infty}^{\infty} \hat{f}(\xi) e^{2\pi i \xi x} d\xi
$$
```

## Syntaxe courante

### Fractions
```text
$\frac{numérateur}{dénominateur}$
```
Exemple : $\frac{1}{2}$

### Indices et exposants
```text
$x_1$ pour un indice
$x^2$ pour un exposant
$x_1^2$ pour les deux
```

### Symboles mathématiques courants
- Somme : `$\sum_{i=1}^n$`
- Produit : `$\prod_{i=1}^n$`
- Intégrale : `$\int_{a}^b$`
- Racine carrée : `$\sqrt{x}$`
- Infini : `$\infty$`
- Appartient : `$\in$`
- Pour tout : `$\forall$`
- Il existe : `$\exists$`

### Matrices
```text
$$
\begin{matrix}
a & b \\
c & d
\end{matrix}
$$
```

## Bonnes pratiques

1. **Espacement** : Laissez toujours un espace avant et après les dollars pour les équations en ligne.

2. **Équations en bloc** : Placez-les sur leur propre ligne avec une ligne vide avant et après.

3. **Échappement** : Pour afficher un caractère spécial littéralement, utilisez un backslash :
   ```text
   $\$$ pour afficher un dollar
   ```

4. **Indices multiples** : Utilisez des accolades pour grouper :
   ```text
   $x_{i,j}$ au lieu de $x_i,j$
   ```

## Dépannage

Si votre équation ne s'affiche pas correctement :

1. Vérifiez qu'il n'y a pas d'espace entre les dollars et l'équation
2. Assurez-vous que tous les accolades sont fermées
3. Vérifiez la syntaxe LaTeX sur [KaTeX Documentation](https://katex.org/docs/supported.html)

## Exemples complets

### Exemple 1 : Équation différentielle
```text
$$
\frac{d^2x}{dt^2} + \omega^2x = 0
$$
```

### Exemple 2 : Matrice avec bordure
```text
$$
\begin{pmatrix}
a_{11} & a_{12} & a_{13} \\
a_{21} & a_{22} & a_{23} \\
a_{31} & a_{32} & a_{33}
\end{pmatrix}
$$
```

### Exemple 3 : Système d'équations
```text
$$
\begin{cases}
x + y = 2 \\
2x - y = 1
\end{cases}
$$
```

## Ressources utiles

- [Documentation KaTeX](https://katex.org/docs/supported.html)
- [Éditeur d'équations en ligne](https://www.latex4technics.com/)
- [Liste des symboles mathématiques](https://oeis.org/wiki/List_of_LaTeX_mathematical_symbols)