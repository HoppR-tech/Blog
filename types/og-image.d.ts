/**
 * Type declarations for nuxt-og-image component names.
 * Augments the virtual module types to include project-specific OG image components.
 */

declare module '#og-image/components' {
  interface OgImageComponents {
    About: Record<string, unknown>
  }
}
