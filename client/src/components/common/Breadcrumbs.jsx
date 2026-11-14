// src/components/common/Breadcrumbs.jsx
import { Link } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

/**
 * Clean SEO Breadcrumbs component rendering structured navigation
 * with microdata and accessible links.
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors"
          >
            <FiHome size={13} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              <FiChevronRight size={11} className="text-slate-600" />
              {isLast || !item.to ? (
                <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.to}
                  className="text-slate-400 hover:text-emerald-400 transition-colors truncate max-w-[150px] sm:max-w-xs"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
