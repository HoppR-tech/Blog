<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useAbsoluteUrl } from '@/composables/useAbsoluteUrl'
import { usePageSeo } from '@/composables/usePageSeo'
import { buildAboutPageJsonLd } from '@/utils/organization'

const baseUrl = useAbsoluteUrl('/')

// SSR-safe : init avec l'année de la build (évite hydration mismatch),
// puis re-synchronise côté client après hydration. Garantit que l'année
// du copyright reste à jour entre deux déploiements (page prerendée).
const currentYear = ref(new Date().getFullYear())
onMounted(() => {
  const real = new Date().getFullYear()
  if (real !== currentYear.value)
    currentYear.value = real
})

usePageSeo({
  title: 'À propos',
  description: 'HoppR — ESN française certifiée B Corp, présente à Paris, Lille et Lyon. Blog technique de retours d\'expérience sur le Software Craftsmanship, le Cloud et l\'Architecture.',
  url: '/a-propos',
  jsonLd: buildAboutPageJsonLd(baseUrl),
})

// Generate OG image
defineOgImageComponent('About', {
  headline: 'À propos',
  mainTitle: 'À propos de HoppR',
  description: 'ESN française certifiée B Corp · Paris · Lille · Lyon',
  imageTop: '/images/og-post.png',
  imageBottom: '/images/og-home.png',
})
</script>

<template>
  <main class="container max-w-3xl mx-auto px-4 sm:px-6 py-8 text-zinc-700 dark:text-zinc-300">
    <BlogBreadcrumb
      title="À propos"
      path="/a-propos"
      :custom-items="[{ name: 'À propos', url: '/a-propos' }]"
    />

    <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-hoppr-purple dark:text-zinc-100 mb-8">
      À propos de HoppR
    </h1>

    <article
      class="prose prose-sm sm:prose-base lg:prose-lg max-w-full prose-zinc dark:prose-invert
        prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:font-bold prose-h2:text-hoppr-purple
        dark:prose-h2:text-zinc-100 prose-h2:mt-10 prose-h2:mb-4 prose-h2:pl-4
        prose-h2:border-l-4 prose-h2:border-hoppr-green
        prose-a:text-hoppr-purple dark:prose-a:text-hoppr-green
        prose-a:no-underline prose-a:border-b prose-a:border-hoppr-green prose-a:border-opacity-50
        hover:prose-a:border-opacity-100 hover:prose-a:text-hoppr-green
        prose-li:marker:text-hoppr-green
        prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100"
    >
      <h2>Notre mission</h2>
      <p>
        HoppR construit des logiciels durables en privilégiant le code de qualité.
      </p>
      <p>
        Nous sommes une ESN française <strong>présente à Paris, Lille et Lyon</strong>,
        en pleine croissance, <strong>certifiée B Corp</strong>. Notre conviction&nbsp;:
        un bon logiciel se reconnaît à sa capacité à durer dans le temps, à supporter
        le changement, et à rester maintenable au-delà de sa mise en production.
      </p>

      <h2>Vous avez dit HoppR&nbsp;?</h2>
      <p>
        Le nom vient de
        <a href="https://fr.wikipedia.org/wiki/Grace_Hopper" rel="noopener" target="_blank">Grace Hopper</a>,
        pionnière de l'informatique qui a réalisé le <strong>premier compilateur de l'histoire</strong>.
        C'est un hommage à son travail et à sa passion qui ont profondément impacté l'informatique.
      </p>

      <h2>Pourquoi ce blog&nbsp;?</h2>
      <p>
        Ce blog rassemble les <strong>retours d'expérience</strong> de l'équipe HoppR.
      </p>
      <p>
        Chaque article est écrit par un·e consultant·e à partir d'une mission réelle&nbsp;:
        une architecture mise en place, un problème rencontré en production, une approche
        qui a bien fonctionné, ou au contraire un échec instructif. L'objectif&nbsp;:
        partager ce qu'on aurait aimé lire avant de se lancer.
      </p>

      <h2>Nos domaines d'expertise</h2>
      <ul>
        <li>
          <NuxtLink to="/categories/craft">
            Software Craftsmanship
          </NuxtLink>
          — TDD, refactoring, DDD, clean code, BDD, architecture hexagonale.
        </li>
        <li>
          <NuxtLink to="/categories/cloud-platform">
            Cloud &amp; Platform
          </NuxtLink>
          — AWS, GCP, Kubernetes, Terraform, observabilité Datadog, FinOps, GreenOps,
          plateformes internes.
        </li>
        <li>
          <NuxtLink to="/categories/architecture">
            Architecture logicielle
          </NuxtLink>
          — Domain-Driven Design, événementiel, patterns de résilience, bounded contexts.
        </li>
      </ul>

      <h2>Conférences &amp; événements</h2>
      <p>
        L'équipe HoppR participe et contribue à plusieurs <strong>événements tech francophones</strong>
        — DevFest Lyon, Lyon Craft, Cloud Nord, et d'autres.
      </p>
      <p>
        →&nbsp;<NuxtLink to="/categories/others">
          Retours de conférences et événements
        </NuxtLink>
      </p>

      <h2>Nos valeurs</h2>
      <p>Cinq valeurs qui guident le quotidien chez HoppR&nbsp;:</p>
      <ul>
        <li><strong>Envie</strong> — choix des missions, accompagnement, partage entre consultant·es.</li>
        <li><strong>Sens du collectif</strong> — la cohésion d'équipe avant tout.</li>
        <li><strong>Confiance réciproque</strong> — entre consultant·es, mentor·es et direction.</li>
        <li><strong>Épanouissement</strong> — mentoring bienveillant, droit à l'erreur, montée en compétences.</li>
        <li><strong>Convivialité</strong> — esprit positif, ambiance saine, place à la personnalité de chacun·e.</li>
      </ul>

      <h2>L'équipe</h2>
      <p>
        Une équipe de consultant·es — développeur·euses, architectes cloud,
        software crafter·euses et platform engineer·euses — répartie entre Paris,
        Lille et Lyon, en mission chez des clients de toute taille.
      </p>

      <h2>Engagements</h2>
      <ul>
        <li>
          <strong>🌍 B Corp</strong> — entreprise certifiée.
          <a
            href="https://www.bcorporation.net/en-us/find-a-b-corp/company/hoppr/"
            rel="noopener"
            target="_blank"
          >
            Voir notre note B Corp
          </a>.
        </li>
        <li>
          <strong>💜 Grille de salaires transparente</strong>, marges plafonnées,
          redistribution directe aux consultant·es.
        </li>
        <li>
          <strong>🌱 GreenOps &amp; FinOps</strong> intégrés aux missions plateforme.
        </li>
      </ul>

      <h2>En savoir plus</h2>
      <ul>
        <li><strong>Site</strong>&nbsp;: <a href="https://www.hoppr.tech" rel="noopener" target="_blank">hoppr.tech</a></li>
        <li><strong>Nous rejoindre</strong>&nbsp;: <a href="https://www.hoppr.tech/nos-offres" rel="noopener" target="_blank">hoppr.tech/nos-offres</a></li>
        <li><strong>GitHub</strong>&nbsp;: <a href="https://github.com/HoppR-tech" rel="noopener" target="_blank">github.com/HoppR-tech</a></li>
        <li><strong>LinkedIn</strong>&nbsp;: <a href="https://www.linkedin.com/company/hopprtech" rel="noopener" target="_blank">linkedin.com/company/hopprtech</a></li>
        <li><strong>YouTube</strong>&nbsp;: <a href="https://www.youtube.com/@HoppR-Tech" rel="noopener" target="_blank">@HoppR-Tech</a></li>
        <li><strong>X / Twitter</strong>&nbsp;: <a href="https://twitter.com/HoppR_Tech" rel="noopener" target="_blank">@HoppR_Tech</a></li>
      </ul>

      <h2>Nous écrire</h2>
      <p>
        Une réaction sur un article&nbsp;? Une coquille à signaler&nbsp;? Une mission
        à discuter&nbsp;?
        <strong>
          <a href="mailto:hello@hoppr.tech">hello@hoppr.tech</a>
        </strong>
      </p>

      <h2>Mentions</h2>
      <p>
        <a href="https://hoppr-tech.notion.site/politique-de-confidentialite" rel="noopener" target="_blank">
          Politique de confidentialité
        </a>
        — © HoppR&nbsp;{{ currentYear }}
      </p>
    </article>
  </main>
</template>
