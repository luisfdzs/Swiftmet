import Link from 'next/link'

const LINKS = [
  { href: '/lab-3d', label: 'Índice' },
  { href: '/lab-3d/orbit', label: '1 · Escena libre' },
  { href: '/lab-3d/spools', label: '2 · En /spools' },
  { href: '/lab-3d/product', label: '3 · Ficha de producto' },
  { href: '/lab-3d/company', label: '4 · En /company' },
  { href: '/lab-3d/hero', label: '5 · Hero de portada' },
  { href: '/lab-3d/css-tilt', label: '6 · Sin 3D (CSS tilt)' },
]

export function LabNav({ active }: { active: string }) {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center gap-x-4 gap-y-2 bg-inverse/90 px-4 py-3 text-paper backdrop-blur">
      <span className="eyebrow text-paper/50">Lab · interno, no indexado</span>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`link-underline tap text-small ${
              link.href === active ? 'text-paper' : 'text-paper/60'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
