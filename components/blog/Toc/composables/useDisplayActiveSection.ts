import { onMounted, onUnmounted, ref } from 'vue';

export function useDisplayActiveSection() {
  const currentSection = ref<null | string>(null);
  let observer: IntersectionObserver;

  onMounted(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionHref = entry.target.querySelector('a')?.getAttribute('href')
          if (sectionHref) {

            currentSection.value = sectionHref

            // Update the TOC to highlight the corresponding link
            updateToc(sectionHref)
          }
        }
      })
    }, { threshold: 1.0 })

    // Observe the article sections
    document.querySelectorAll('.article-section h2, .article-section h3, .article-section h4').forEach((section) => {
      observer.observe(section)
    })
  })

  onUnmounted(() => {
    observer.disconnect()
  })

  function updateToc(sectionHref: string) {
    const tocLinks = document.querySelectorAll('#toc-content a');
    const currentLinkEndsWithSectionHref = ({ sectionHref, linkHref }: { sectionHref: string, linkHref: string }): boolean => {
      const regex = new RegExp(`^.*${sectionHref}$`);
      return regex.test(linkHref!)

    }
    tocLinks.forEach((link) => {
      link.classList.remove('active')
      const linkHref = link.getAttribute('href')

      if (linkHref && currentLinkEndsWithSectionHref({ linkHref, sectionHref })) {
        link.classList.add('active')
      }
    })
  }
}
