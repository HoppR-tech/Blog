<script setup lang="ts">
import { ref } from 'vue'
import { useRuntimeConfig } from '#app'

const props = defineProps<{
  articleTitle: string
  articleLink: string
  authors: Array<{ name: string; id: string }>
  publishedDate: string
}>()

const config = useRuntimeConfig()

const showModal = ref(false)
const name = ref('')
const email = ref('')
const message = ref('')
const messageStatus = ref<'idle' | 'success' | 'error'>('idle')

function openModal() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function submitForm() {
  messageStatus.value = 'idle'
  const authorNames = props.authors.map(author => author.name).join(', ')
  const formData = {
    articleTitle: props.articleTitle,
    articleLink: `${config.public.baseUrl}${props.articleLink}`,
    authors: authorNames,
    publishedDate: props.publishedDate,
    name: name.value,
    email: email.value,
    message: message.value,
  }

  // console.error('Formulaire soumis:', formData)

  try {
    const slackMessage = '📥🔥 Nous avons reçu un nouveau message du Blog HoppR !\n'
    + `\`pour l'article\`: "${formData.articleTitle}"\n`
    + `\`Ecrit par\`: ${formData.authors}\n`
    + `\`Publié le\`: ${new Date(formData.publishedDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}\n`
    + `\`Lien vers l'article\`: ${formData.articleLink}\n`
    + '\n---\n\n'
    + `\`De\`: 👤 ${formData.name} | ✉️ *<mailto:${formData.email}|${formData.email}>*\n`
    + `\`Message\`: ${formData.message}\n`

    const response = await fetch('/api/sendSlackMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: slackMessage }),
    })

    if (!response.ok)
      throw new Error('Erreur lors de l\'envoi du message à Slack')

    messageStatus.value = 'success'

    // Réinitialiser le formulaire et fermer le modal après un délai
    setTimeout(() => {
      name.value = ''
      email.value = ''
      message.value = ''
      closeModal()
      messageStatus.value = 'idle'
    }, 3000)
  }
  catch (error) {
    console.error('Erreur lors de l\'envoi du message à Slack:', error)
    messageStatus.value = 'error'
  }
}
</script>

<template>
  <div class="mt-8 mb-4 mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
    <div class="lg:col-span-3 px-2">
      <div class="p-6 bg-gray-100 dark:bg-slate-900 rounded-lg border border-gray-300 dark:border-zinc-500">
        <div class="flex items-start mb-4">
          <Icon name="mdi:lightbulb" class="text-hoppr-green text-2xl mr-2 flex-shrink-0 mt-1" />
          <h3 class="text-2xl font-bold text-black dark:text-white">
            Cet article vous a inspiré ?
          </h3>
        </div>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          Vous avez des questions ou des défis techniques suite à cet article ? Nos experts sont là pour vous aider à
          trouver des solutions concrètes à vos problématiques.
        </p>
        <button
          class="w-full bg-hoppr-green text-hoppr-black px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors duration-300 flex items-center justify-center"
          @click="openModal"
        >
          <Icon name="mdi:handshake" class="mr-2" />
          Échangeons sur vos besoins
        </button>
      </div>
    </div>
    <div class="lg:col-span-1 sticky top-28 mt-5 hidden lg:block justify-self-end">
      <!-- Espace réservé pour aligner CTA avec le Sommaire -->
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
        <h4 class="text-xl font-bold mb-4 text-black dark:text-white">
          Contactez-nous
        </h4>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom</label>
            <input
              id="name" v-model="name" type="text" required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              id="email" v-model="email" type="email" required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
            >
          </div>
          <div class="mb-4">
            <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              id="message" v-model="message" rows="4" required
              class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-hoppr-green focus:ring focus:ring-hoppr-green focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div class="flex justify-end space-x-4">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="closeModal"
            >
              Annuler
            </button>
            <button type="submit" class="px-4 py-2 bg-hoppr-green text-white rounded-md hover:bg-opacity-90">
              Envoyer
            </button>
          </div>
          <div
            v-if="messageStatus !== 'idle'"
            class="mt-4 p-2 rounded-md text-center"
            :class="{
              'bg-hoppr-green bg-opacity-20 text-hoppr-black dark:text-white': messageStatus === 'success',
              'bg-hoppr-red bg-opacity-20 text-hoppr-black dark:text-white': messageStatus === 'error',
            }"
          >
            <p v-if="messageStatus === 'success'">
              Votre message a été envoyé avec succès !
            </p>
            <p v-if="messageStatus === 'error'">
              Une erreur s'est produite lors de l'envoi du message. Veuillez réessayer.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
