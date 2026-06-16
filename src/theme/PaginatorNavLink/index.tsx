import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/PaginatorNavLink';
import {ArrowLeftIcon, ArrowRightIcon} from '@site/src/components/icons';

/**
 * Swizzled doc pagination card (mirrors the brand cards): a fancy bordered
 * card with a circular arrow glyph. Previous card → arrow on the left, text on
 * the right; Next card → text on the left, arrow on the right. The directional
 * label is "Назад" / "Вперёд" (replaces "Предыдущая/Следующая страница").
 */
export default function PaginatorNavLink(props: Props): ReactNode {
  const {permalink, title, isNext} = props;
  const subLabel = isNext ? 'Вперёд' : 'Назад';
  const Icon = isNext ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <Link
      className={clsx(
        'pagination-nav__link',
        'vh-pager',
        isNext ? 'pagination-nav__link--next vh-pager--next' : 'pagination-nav__link--prev vh-pager--prev',
      )}
      to={permalink}>
      <span className="vh-pager__icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <span className="vh-pager__text">
        <span className="vh-pager__sub">{subLabel}</span>
        <span className="pagination-nav__label vh-pager__label">{title}</span>
      </span>
    </Link>
  );
}
