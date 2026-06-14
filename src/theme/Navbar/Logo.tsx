import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {Logo} from '@site/src/brand/Logo';
import {Wordmark} from '@site/src/brand/Wordmark';

/**
 * Swizzled navbar brand: uses the genuine Verificahub mark + wordmark
 * (from src/brand/) instead of a flat image, plus a small "DOCS" tag.
 */
export default function NavbarLogo(): ReactNode {
  return (
    <Link
      to="/"
      className="navbar__brand"
      aria-label="Verificahub Docs"
      style={{display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none'}}>
      <Logo size={24} />
      <Wordmark fontSize={17} />
      <span
        style={{
          fontFamily: 'var(--ifm-font-family-monospace)',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: 'var(--vh-ink)',
          background: 'var(--vh-lime)',
          padding: '2px 6px',
          borderRadius: 6,
        }}>
        DOCS
      </span>
    </Link>
  );
}
