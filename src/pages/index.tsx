import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import SearchBar from '@theme/SearchBar';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  GridIcon,
  KeyIcon,
  LayersIcon,
  ShieldCheckIcon,
} from '@site/src/components/icons';

import styles from './index.module.css';

type Section = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  featured?: boolean;
};

// Built inside render so translate() resolves for the active locale.
const getSections = (): Section[] => [
  {
    title: translate({id: 'homepage.section.start.title', message: 'Быстрый старт'}),
    description: translate({
      id: 'homepage.section.start.description',
      message: 'Подключение, API-ключ и первый запрос на подтверждение за несколько минут.',
    }),
    href: '/docs/start/',
    icon: <KeyIcon size={22} />,
    featured: true,
  },
  {
    title: translate({id: 'homepage.section.api.title', message: 'Справочник API'}),
    description: translate({
      id: 'homepage.section.api.description',
      message: 'Эндпоинты, параметры, коды ответов и примеры запросов.',
    }),
    href: '/docs/reference/verificahub-api/',
    icon: <LayersIcon size={22} />,
  },
  {
    title: translate({id: 'homepage.section.overview.title', message: 'Обзор документации'}),
    description: translate({
      id: 'homepage.section.overview.description',
      message: 'Как устроен сервис и где искать нужную информацию.',
    }),
    href: '/docs/',
    icon: <GridIcon size={22} />,
  },
  {
    title: translate({id: 'homepage.section.legal.title', message: 'Юридические документы'}),
    description: translate({
      id: 'homepage.section.legal.description',
      message: 'Публичная оферта, политика конфиденциальности и условия использования.',
    }),
    href: '/docs/legal/public_offer/',
    icon: <ShieldCheckIcon size={22} />,
  },
];

const getPopular = () => [
  {
    label: translate({id: 'homepage.popular.start', message: 'Первый запрос'}),
    href: '/docs/start/',
  },
  {
    label: translate({id: 'homepage.popular.api', message: 'Методы API'}),
    href: '/docs/reference/verificahub-api/',
  },
  {
    label: translate({id: 'homepage.popular.offer', message: 'Оферта'}),
    href: '/docs/legal/public_offer/',
  },
  {
    label: translate({id: 'homepage.popular.privacy', message: 'Конфиденциальность'}),
    href: '/docs/legal/privacy_policy/',
  },
];

function HeroSearch({enabled}: {enabled: boolean}): ReactNode {
  if (!enabled) {
    return (
      <Link className={styles.searchFallback} to="/docs/">
        <Translate id="homepage.search.fallback">Открыть документацию</Translate>
        <ArrowRightIcon size={18} />
      </Link>
    );
  }
  return (
    <div className={styles.heroSearch}>
      <SearchBar />
      {/* Longer hint over DocSearch's short "Поиск" placeholder; clicks pass through. */}
      <span className={styles.heroSearchHint} aria-hidden="true">
        <Translate id="homepage.search.placeholder">Поиск по документации и API</Translate>
      </span>
    </div>
  );
}

export default function Home(): ReactNode {
  const {
    siteConfig: {themeConfig},
  } = useDocusaurusContext();
  const hasDocSearch = Boolean(themeConfig.algolia);

  return (
    <Layout
      title={translate({id: 'homepage.meta.title', message: 'Документация'})}
      description={translate({
        id: 'homepage.meta.description',
        message: 'Документация Verificahub: подключение, методы API и юридические документы.',
      })}>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={clsx('container', styles.heroInner)}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              <Translate id="homepage.eyebrow">Документация Verificahub</Translate>
            </p>
            <Heading as="h1" className={styles.heroTitle}>
              <Translate id="homepage.title">Чем можем помочь?</Translate>
            </Heading>
            <p className={styles.heroLead}>
              <Translate id="homepage.lead">
                Руководства по подключению, справочник API и юридические документы — в одном месте.
              </Translate>
            </p>

            <HeroSearch enabled={hasDocSearch} />

            <nav
              className={styles.popular}
              aria-label={translate({id: 'homepage.popular.label', message: 'Популярное'})}>
              <span className={styles.popularLabel}>
                <Translate id="homepage.popular.label">Популярное</Translate>:
              </span>
              {getPopular().map(item => (
                <Link key={item.href} className={styles.popularLink} to={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        <section className={styles.sections}>
          <div className={clsx('container', styles.sectionsInner)}>
            <Heading as="h2" className={styles.sectionsTitle}>
              <Translate id="homepage.sections.title">Разделы</Translate>
            </Heading>
            <div className={styles.cardGrid}>
              {getSections().map(section => (
                <Link
                  key={section.href}
                  to={section.href}
                  className={clsx(styles.card, section.featured && styles.cardFeatured)}>
                  <span className={styles.cardIcon}>{section.icon}</span>
                  <span className={styles.cardBody}>
                    <Heading as="h3" className={styles.cardTitle}>
                      {section.title}
                    </Heading>
                    <span className={styles.cardDescription}>{section.description}</span>
                  </span>
                  <span className={styles.cardArrow} aria-hidden="true">
                    <ArrowUpRightIcon size={18} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
