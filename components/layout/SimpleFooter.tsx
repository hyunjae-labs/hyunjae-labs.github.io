import Link from 'next/link';
import './SimpleFooter.css';

export function SimpleFooter() {
  return (
    <footer className="simple-footer">
      <div className="simple-footer__container">
        {/* Copyright */}
        <div className="simple-footer__copyright">
          © 2025 Hyunjae's Blog
        </div>
        
        {/* Navigation Links */}
        <nav className="simple-footer__nav">
          <Link href="/posts" className="simple-footer__link">Posts</Link>
          <span className="simple-footer__dot">•</span>
          <Link href="/projects" className="simple-footer__link">Projects</Link>
          <span className="simple-footer__dot">•</span>
          <Link href="/resources" className="simple-footer__link">Resources</Link>
          <span className="simple-footer__dot">•</span>
          <Link href="/about" className="simple-footer__link">About</Link>
          <span className="simple-footer__dot">•</span>
          <Link href="/rss.xml" className="simple-footer__link">RSS</Link>
        </nav>
        
        {/* Social Links */}
        <div className="simple-footer__social">
          <a 
            href="https://github.com/hyunjae-labs" 
            className="simple-footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <span className="simple-footer__dot">•</span>
          <a 
            href="https://linkedin.com/in/hyunjae-lim" 
            className="simple-footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <span className="simple-footer__dot">•</span>
          <a 
            href="https://twitter.com/hyunjae_lim" 
            className="simple-footer__social-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            Twitter
          </a>
          <span className="simple-footer__dot">•</span>
          <a 
            href="mailto:thecurrent.lim@gmail.com" 
            className="simple-footer__social-link"
            aria-label="Email"
          >
            Email
          </a>
        </div>
      </div>
    </footer>
  );
}
