import Link from "next/link"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    const navigationLinks = [
        { href: "/", label: "Inicio" },
        { href: "/portafolio", label: "Portafolio" },
        { href: "/servicios", label: "Servicios" },
        { href: "/contacto", label: "Contacto" },
    ]

    const services = [
        { href: "/servicios#desarrollo-web", label: "Desarrollo Web" },
        { href: "/servicios#integracion-ia", label: "Integración de IA" },
        { href: "/servicios#consultoria", label: "Consultoría Técnica" },
        { href: "/servicios#automatizacion", label: "Automatización" },
    ]

    const socialLinks = [
        {
            name: "LinkedIn",
            href: "https://www.linkedin.com/in/gabrielbustosdev/",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
            ),
        },
        {
            name: "GitHub",
            href: "https://github.com/gabrielbustosdev",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
            ),
        },
        /*{
            name: "Twitter",
            href: "#",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
            ),
        },*/
        {
            name: "Instagram",
            href: "https://www.instagram.com/gabrielbustosdev/",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
            ),
        },
    ]

    return (
        <footer className="bg-gradient-to-b from-slate-900 to-black border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <Link href="/">
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent mb-4">
                                Gabriel Bustos
                            </h3>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Desarrollador full stack especializado en crear soluciones web innovadoras con inteligencia artificial
                            integrada.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-300"
                                    aria-label={social.name}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navegación</h4>
                        <ul className="space-y-3">
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Servicios</h4>
                        <ul className="space-y-3">
                            {services.map((service) => (
                                <li key={service.href}>
                                    <Link
                                        href={service.href}
                                        className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                    >
                                        {service.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <div className="space-y-3">
                            <div className="flex items-center text-gray-400">
                                <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <a
                                    href="mailto:gabrielbustosdev@gmail.com"
                                    target="_blank"
                                    className="hover:text-blue-400 transition-colors duration-300"
                                >
                                    gabrielbustosdev@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Remoto / Global</span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                <svg className="w-5 h-5 mr-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <span>Respuesta en 24h</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="py-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                            <h4 className="text-white font-semibold mb-2">¿Quieres recibir tips sobre IA y desarrollo web?</h4>
                            <p className="text-gray-400">Suscríbete a mi newsletter para contenido exclusivo y actualizaciones.</p>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <input
                                type="email"
                                placeholder="Tu email"
                                className="flex-1 md:w-64 px-4 py-3 bg-white/5 border border-white/10 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                            />
                            <button className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-6 py-3 rounded-r-lg hover:from-blue-600 hover:to-slate-700 transition-all duration-300 font-medium">
                                Suscribirse
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
                    <div className="text-gray-400 text-sm mb-4 md:mb-0">
                        © {currentYear} Gabriel Bustos. Todos los derechos reservados.
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <Link href="/privacidad" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                            Política de Privacidad
                        </Link>
                        <Link href="/terminos" className="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                            Términos de Servicio
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
