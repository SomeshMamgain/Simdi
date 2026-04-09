import styles from './ProductDetailPage.module.css'

interface ProductTabSection {
  id: string
  label: string
}

interface ProductTabsProps {
  sections: ProductTabSection[]
}

export function ProductTabs({ sections }: ProductTabsProps) {
  if (sections.length === 0) {
    return null
  }

  return (
    <nav className={styles.sectionNav} aria-label="Product detail sections">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className={styles.sectionLink}>
          {section.label}
        </a>
      ))}
    </nav>
  )
}
