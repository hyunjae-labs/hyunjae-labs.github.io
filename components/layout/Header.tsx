import Link from 'next/link';
import './Header.css';

export function Header() {
  return (
    <header className="header__main">
      <div className="header__content">
        <Link href="/" className="header__logo">
          Hyunjae's Blog
        </Link>
        <nav className="header__nav">
          <Link href="/" className="header__nav-link">Home</Link>
          <Link href="/posts" className="header__nav-link">Posts</Link>
          <Link href="/projects" className="header__nav-link">Projects</Link>
          <Link href="/resources" className="header__nav-link">Resources</Link>
          <Link href="/about" className="header__nav-link">About</Link>
        </nav>
      </div>
    </header>
  );
}
