import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Política de Privacidad - Gabriel Bustos",
  description: "Política de privacidad y protección de datos de Gabriel Bustos - Desarrollador Full Stack",
}

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Política de{" "}
            <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">
              Privacidad
            </span>
          </h1>
          <p className="text-gray-400">Última actualización: Diciembre 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Recopilamos información que usted nos proporciona directamente cuando se pone en contacto con nosotros a
                través de nuestros formularios de contacto, newsletter o comunicaciones por email.
              </p>
              <p>Esta información puede incluir:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Nombre completo</li>
                <li>Dirección de correo electrónico</li>
                <li>Nombre de la empresa (opcional)</li>
                <li>Información sobre su proyecto o consulta</li>
                <li>Cualquier otra información que decida compartir con nosotros</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Cómo Utilizamos su Información</h2>
            <div className="text-gray-300 space-y-4">
              <p>Utilizamos la información recopilada para:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Responder a sus consultas y solicitudes de información</li>
                <li>Proporcionar cotizaciones y propuestas de servicios</li>
                <li>Enviar actualizaciones sobre nuestros servicios (si se suscribe a nuestro newsletter)</li>
                <li>Mejorar nuestros servicios y experiencia del usuario</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Compartir Información</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                No vendemos, intercambiamos ni transferimos su información personal a terceros sin su consentimiento,
                excepto en los siguientes casos:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Cuando sea requerido por ley</li>
                <li>Para proteger nuestros derechos, propiedad o seguridad</li>
                <li>
                  Con proveedores de servicios que nos ayudan a operar nuestro sitio web (bajo acuerdos de
                  confidencialidad)
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Cookies y Tecnologías Similares</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Nuestro sitio web puede utilizar cookies y tecnologías similares para mejorar su experiencia de
                navegación. Las cookies son pequeños archivos de texto que se almacenan en su dispositivo.
              </p>
              <p>Utilizamos cookies para:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Recordar sus preferencias</li>
                <li>Analizar el tráfico del sitio web</li>
                <li>Mejorar la funcionalidad del sitio</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Seguridad de los Datos</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger su información
                personal contra acceso no autorizado, alteración, divulgación o destrucción.
              </p>
              <p>
                Sin embargo, ningún método de transmisión por Internet o almacenamiento electrónico es 100% seguro, por
                lo que no podemos garantizar la seguridad absoluta.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Sus Derechos</h2>
            <div className="text-gray-300 space-y-4">
              <p>Usted tiene derecho a:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Acceder a la información personal que tenemos sobre usted</li>
                <li>Solicitar la corrección de información inexacta</li>
                <li>Solicitar la eliminación de su información personal</li>
                <li>Oponerse al procesamiento de su información personal</li>
                <li>Retirar su consentimiento en cualquier momento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Retención de Datos</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Conservamos su información personal solo durante el tiempo necesario para cumplir con los propósitos
                para los cuales fue recopilada, incluyendo cualquier requisito legal, contable o de informes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cambios a esta Política</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Le notificaremos sobre cualquier cambio
                publicando la nueva política en esta página y actualizando la fecha de "última actualización".
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contacto</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Si tiene preguntas sobre esta Política de Privacidad o sobre cómo manejamos su información personal,
                puede contactarnos en:
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                <p className="text-blue-400 font-medium">Email: gabrielbustosdev@gmail.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
