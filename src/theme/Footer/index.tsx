import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {Logo} from '@site/src/brand/Logo';
import {Wordmark} from '@site/src/brand/Wordmark';
import {TelegramIcon, VkIcon, PhoneIcon, EmailIcon} from '@site/src/components/icons';

/**
 * Custom footer mirroring verificahub.ru (brand block + columns + contacts +
 * legal line + cookie notice). Replaces the config-driven Docusaurus footer.
 */
type FLink = {label: string; to?: string; href?: string};

const docLinks: FLink[] = [
  {label: 'Быстрый старт', to: '/docs/start/'},
  {label: 'API', to: '/docs/reference/verificahub-api/'},
  {label: 'Публичная оферта', to: '/docs/legal/public_offer/'},
  {label: 'Политика конфиденциальности', to: '/docs/legal/privacy_policy/'},
  {label: 'Условия использования', to: '/docs/legal/terms_of_use/'},
];

const productLinks: FLink[] = [
  {label: 'Verificahub', href: 'https://verificahub.ru'},
  {label: 'Тарифы', href: 'https://verificahub.ru/pricing'},
  {label: 'О сервисе', href: 'https://verificahub.ru/about'},
  {label: 'Контакты', href: 'https://verificahub.ru/contacts'},
];

const contactItems: {label: string; href: string; external?: boolean; icon: ReactNode}[] = [
  {label: 'hello@verificahub.ru', href: 'mailto:hello@verificahub.ru', icon: <EmailIcon size={17} />},
  {label: '+7 927 938-35-62', href: 'tel:+79279383562', icon: <PhoneIcon size={17} />},
  {label: 'Telegram', href: 'https://t.me/verificahub?direct', external: true, icon: <TelegramIcon size={17} />},
  {label: 'ВКонтакте', href: 'https://vk.ru/im?sel=-239558535', external: true, icon: <VkIcon size={19} />},
];

function FootLink({label, to, href}: FLink) {
  if (to) {
    return (
      <Link className="vh-foot-link" to={to}>
        {label}
      </Link>
    );
  }
  return (
    <a className="vh-foot-link" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
}

export default function Footer(): ReactNode {
  return (
    <footer className="vh-footer">
      <div className="vh-footer__inner">
        <div className="vh-foot-grid">
          {/* brand */}
          <div>
            <Link to="/" style={{display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 16}}>
              <Logo size={28} onDark />
              <Wordmark fontSize={17} onDark />
            </Link>
            <p style={{fontSize: 14.5, lineHeight: 1.6, color: '#8A8470', margin: '0 0 20px', maxWidth: 320}}>
              Единая платформа верификации пользователей: звонки, SMS, голос, соцсети и другие методы.
            </p>
            <div style={{display: 'flex', gap: 10}}>
              <a className="vh-foot-social" href="https://t.me/verificahub" target="_blank" rel="noreferrer" aria-label="Telegram" title="Telegram" style={{background: '#229ED9'}}>
                <TelegramIcon size={22} />
              </a>
              <a className="vh-foot-social" href="https://vk.ru/verificahub" target="_blank" rel="noreferrer" aria-label="ВКонтакте" title="ВКонтакте" style={{background: '#0077FF'}}>
                <VkIcon size={26} />
              </a>
            </div>
          </div>

          {/* documentation */}
          <div>
            <div className="vh-foot-head">Документация</div>
            <div className="vh-foot-col">
              {docLinks.map(l => (
                <FootLink key={l.label} {...l} />
              ))}
            </div>
          </div>

          {/* product */}
          <div>
            <div className="vh-foot-head">Продукт</div>
            <div className="vh-foot-col">
              {productLinks.map(l => (
                <FootLink key={l.label} {...l} />
              ))}
            </div>
          </div>

          {/* contacts */}
          <div>
            <div className="vh-foot-head">Контакты</div>
            <div className="vh-foot-col">
              {contactItems.map(c => (
                <a
                  key={c.label}
                  className="vh-foot-contact"
                  href={c.href}
                  {...(c.external ? {target: '_blank', rel: 'noreferrer'} : {})}>
                  <span className="vh-foot-ico">{c.icon}</span>
                  {c.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="vh-foot-bottom">
          <div className="vh-foot-legal">
            ИП Айгиз Искужин · ИНН 024803896842 · ОГРНИП 326028000044859
            <br />
            ОКВЭД 62.01 Разработка компьютерного программного обеспечения · Оператор ПД в реестре РКН №{' '}
            <a href="https://pd.rkn.gov.ru/operators-registry/operators-list/?id=2-26-056967">2-26-056967</a>
          </div>
          <div className="vh-foot-copy">© {new Date().getFullYear()} verificahub</div>
        </div>

        <div className="vh-foot-cookie">
          Продолжая использовать наш сайт, вы даете согласие на обработку файлов cookies и других
          пользовательских данных, в соответствии с Политикой конфиденциальности.
        </div>
      </div>
    </footer>
  );
}
