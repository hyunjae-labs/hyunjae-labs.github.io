import Link from 'next/link';
import './HeroSection.css';

interface HeroSectionProps {
  category: string;
  title: string;
  breadcrumbPrefix?: string;
  showBackButton?: boolean;
}

export function HeroSection({ 
  category, 
  title, 
  breadcrumbPrefix = 'Blog',
  showBackButton = true 
}: HeroSectionProps) {
  return (
    <div className="hero__section">
      <div className="hero__container">
        <nav className="hero__breadcrumb">
          {showBackButton ? (
            <>
              <Link href="/" className="hero__breadcrumb-link">
                {breadcrumbPrefix}
              </Link>
              <span>/</span>
              <Link href={`/${category.toLowerCase()}`} className="hero__breadcrumb-link">
                {category}
              </Link>
              <span>/</span>
              <span>{title}</span>
            </>
          ) : (
            <span className="hero__breadcrumb-single">{category}</span>
          )}
        </nav>
        <h1 className="hero__title">{title}</h1>
      </div>
    </div>
  );
}
