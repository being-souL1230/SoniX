import type { CSSProperties } from 'react';
import { BriefcaseBusiness, CircleHelp, Compass, GraduationCap, Heart, HeartHandshake, Scale, Sun, Wallet } from 'lucide-react';
import type { Category } from '../types/social';

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="34" height="34" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true">
      {[0, 90, 180, 270].map((angle) => <path key={angle} transform={`rotate(${angle} 20 20)`} d="M19.9 20C11.7 20 4.6 14.5 5.4 5.4C14.5 4.6 20 11.7 19.9 20Z" />)}
    </svg>
  );
}

export function Brand({ light = false }: { light?: boolean }) {
  return <span className={`brand ${light ? 'brand-light' : ''}`}><BrandMark /><span>SoniX<span className="brand-period">.</span></span></span>;
}

export const orbColors = ['#e0eade', '#eee4d1', '#e9e1ef', '#dce8e5'];

export function Avatar({ index = 0, className = '' }: { index?: number; className?: string }) {
  const colors = [
    ['#d7e4d5', '#ece6d6', '#314c3b'], ['#eee2c9', '#bd8066', '#734f3c'],
    ['#e4d8e8', '#c3a8c4', '#554259'], ['#d8e4df', '#e4d6bb', '#557264'],
    ['#e7dfd1', '#8f6550', '#333b32'], ['#d6ded6', '#d9bca3', '#3e5044'],
    ['#e5ddec', '#e2caba', '#716077'], ['#e9e2ca', '#a67b5e', '#4e5144'],
  ];
  const [background, skin, clothing] = colors[index % colors.length];
  return (
    <span className={`avatar ${className}`} style={{ '--avatar-bg': background } as CSSProperties} aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="none">
        <path d="M10 83C11 59 24 57 40 57C57 57 70 62 72 83" fill={clothing} />
        <path d="M32 49H49V64C42 70 36 66 32 62V49Z" fill={skin} />
        <path d="M23 31C23 16 34 11 44 14C57 15 59 27 57 34L62 41L55 43C54 53 49 58 41 57C29 56 23 44 23 31Z" fill={skin} />
        {index % 4 === 0 && <path d="M22 36C16 16 28 8 44 11C55 10 62 20 58 28C48 24 46 19 43 19C34 29 32 29 28 28L27 39L22 36Z" fill={clothing} />}
        {index % 4 === 1 && <><path d="M21 28C19 9 31 4 42 6C55 7 63 18 58 30Z" fill={clothing} /><path d="M21 25L60 28L58 35L20 31Z" fill={clothing} /><path d="M30 11L29 24M39 9L39 25M47 12L49 27" stroke={skin} strokeOpacity=".35" strokeWidth="2" /></>}
        {index % 4 === 2 && <path d="M23 48C14 32 19 14 35 10C45 4 59 13 61 23C60 29 56 33 53 31C49 28 53 18 46 19C42 19 42 29 33 28C28 27 29 40 30 50L23 48Z" fill={clothing} />}
        {index % 4 === 3 && <g fill={clothing}>{[[25, 22], [34, 15], [44, 15], [53, 20], [25, 33], [35, 24], [46, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="8" />)}</g>}
        <path d="M32 59L40 70L48 59" stroke={background} strokeOpacity=".6" strokeWidth="1.5" />
      </svg>
    </span>
  );
}

const categoryIcons = { Life: Compass, Friendship: HeartHandshake, Career: BriefcaseBusiness, College: GraduationCap, Ethics: Scale, Money: Wallet, Relationships: Heart, Everyday: Sun };

export function CategoryIcon({ category, size = 22 }: { category: Category | 'All'; size?: number }) {
  const Icon = category === 'All' ? CircleHelp : categoryIcons[category];
  return <Icon size={size} strokeWidth={1.5} aria-hidden="true" />;
}