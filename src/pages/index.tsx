import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import SearchBar from '@theme/SearchBar';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './index.module.css';

type DocCard = {
  title: string;
  description: string;
  href: string;
  badge: string;
};

type DocGroup = {
  label: string;
  title: string;
  description: string;
  cards: DocCard[];
};

const DOC_GROUPS: DocGroup[] = [
  {
    label: 'Начать здесь',
    title: 'Основная документация',
    description: 'Главные точки входа для подключения и первого запроса.',
    cards: [
      {
        title: 'Главная документации',
        description: 'Краткий обзор пространства документации Verificahub.',
        href: '/docs/',
        badge: 'Корень',
      },
      {
        title: 'Быстрый старт',
        description: 'Подключение, API-ключ и первый запрос на подтверждение.',
        href: '/docs/start/',
        badge: 'Старт',
      },
    ],
  },
  {
    label: 'Справка',
    title: 'API и право',
    description: 'Методы верификации и юридические документы.',
    cards: [
      {
        title: 'API',
        description: 'Справочник методов: эндпоинты, параметры и примеры запросов.',
        href: '/docs/reference/verificahub-api/',
        badge: 'API',
      },
      {
        title: 'Юридические документы',
        description: 'Публичная оферта, политика конфиденциальности, условия.',
        href: '/docs/legal/public_offer/',
        badge: 'Юр.',
      },
    ],
  },
];

export default function Home(): ReactNode {
  const {
    siteConfig: {themeConfig},
  } = useDocusaurusContext();
  const hasDocSearch = Boolean(themeConfig.algolia);

  return (
    <Layout
      title="Документация"
      description="Документация Verificahub: подключение, методы API и юридические документы.">
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <p className={styles.eyebrow}>Документация Verificahub</p>
              <Heading as="h1" className={styles.heroTitle}>
                Чем можем помочь?
              </Heading>
              <p className={styles.heroLead}>Начните с поиска или раздела ниже.</p>

              <div className={styles.searchPanel}>
                {hasDocSearch ? (
                  <SearchBar />
                ) : (
                  <Link className={styles.searchFallback} to="/docs/">
                    Открыть документацию
                  </Link>
                )}
              </div>

              <div className={styles.quickFilters} aria-label="Быстрые ссылки">
                <Link className={styles.quickFilter} to="/docs/">
                  документация
                </Link>
                <Link className={styles.quickFilter} to="/docs/start/">
                  быстрый старт
                </Link>
                <Link className={styles.quickFilter} to="/docs/reference/verificahub-api/">
                  api
                </Link>
                <Link className={styles.quickFilter} to="/docs/legal/public_offer/">
                  юридические
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.sections}>
          <div className="container">
            <div className={styles.groupList}>
              {DOC_GROUPS.map(group => (
                <section key={group.title} className={styles.groupBlock}>
                  <div className={styles.groupHeader}>
                    <p className={styles.groupLabel}>{group.label}</p>
                    <div>
                      <Heading as="h3" className={styles.groupTitle}>
                        {group.title}
                      </Heading>
                      <p className={styles.groupDescription}>{group.description}</p>
                    </div>
                  </div>

                  <div className={styles.cardGrid}>
                    {group.cards.map(card => (
                      <Link key={card.href} className={styles.docCard} to={card.href}>
                        <div className={styles.docCardTop}>
                          <span className={styles.docCardBadge}>{card.badge}</span>
                          <span className={styles.docCardArrow} aria-hidden="true">
                            ↗
                          </span>
                        </div>
                        <Heading as="h4" className={styles.docCardTitle}>
                          {card.title}
                        </Heading>
                        <p className={styles.docCardDescription}>{card.description}</p>
                        <span className={styles.docCardFooter}>Открыть раздел</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
