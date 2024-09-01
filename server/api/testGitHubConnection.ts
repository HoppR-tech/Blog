import { defineEventHandler } from 'h3'
import { createAppAuth } from "@octokit/auth-app"
import { GITHUB_APP_ID, GITHUB_PRIVATE_KEY } from "@/server/config/githubConfig"
import { Octokit } from "octokit"

export default defineEventHandler(async (event) => {
  testGitHubJWT()
  // try {
  //   const auth = createAppAuth({
  //     appId: GITHUB_APP_ID,
  //     privateKey: GITHUB_PRIVATE_KEY,
  //   });

  //   const { token } = await auth({ type: "app" });
    
  //   return {
  //     status: 'success',
  //     message: 'JWT token généré avec succès',
  //     token: token
  //   }
  // } catch (error) {
  //   console.error('Erreur lors de la génération du JWT token:', error)
  //   return {
  //     status: 'error',
  //     message: 'Erreur lors de la génération du JWT token',
  //     error: error instanceof Error ? error.message : 'Une erreur inconnue s\'est produite'
  //   }
  // }
})

function testGitHubJWT() {

  const octokit = new Octokit({
    auth: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjUxNDA0NDEsImV4cCI6MTcyNTE0MTA0MSwiaXNzIjo5NDk0Mzd9.rjEL3uY6HaV6oOU0oyZ4rhBGaRtZkSjxXetAh-Cyxte4MuIdaTaGH-m7N7h1o1tlmdqzwj54JyL8MLWsybUhHswx1ffDTrAyOBDTKH5sKIWf4Hyr2tvwpuWYvrzwH4V3xSoxW1LCoZONoMu1qV7rYiMc5UG5GLg_5lkn5X-QvZhg_5RVtvclG-ve3_hN9t8yQ-XNchDOCLv3BF9oGyHv4k_DvxpmQ2_eWQhxo9MfQRIqDoJNvlzJkg77bSIK6j3lyE4Jrkkf7dkLfA3TGdRD-fTApS4xMwCKx2M6mrJgR9SeQqvFlsUtTQfkg8cq7xfhV2iqSkO0llXWDfU7E6JvsQ'
  });

  octokit.rest.apps.getAuthenticated()
    .then(({ data }: any) => {
      console.log('Application data:', data);
    })
    .catch((error: any) => {
      console.error('Error:', error.message);
    })
}
