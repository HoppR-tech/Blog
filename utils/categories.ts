export const categoryColors = {
  'craft': { light: '#00853E', dark: '#10B981' },
  'cloud-platform': { light: '#8b5cf6', dark: '#A78BFA' },
  'architecture': { light: '#f43f5e', dark: '#FB7185' },
  'others': { light: '#3b82f6', dark: '#60A5FA' },
}

export const categories = [
  { label: 'Craft', value: 'craft', icon: 'mdi:hammer-wrench', colors: categoryColors.craft },
  { label: 'Cloud & Platform', value: 'cloud-platform', icon: 'mdi:cloud-outline', colors: categoryColors['cloud-platform'] },
  { label: 'Architecture', value: 'architecture', icon: 'mdi:office-building', colors: categoryColors.architecture },
  { label: 'Autres & Événements', value: 'others', icon: 'mdi:dots-horizontal', colors: categoryColors.others },
]
