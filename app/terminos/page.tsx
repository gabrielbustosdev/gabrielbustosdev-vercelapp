import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Términos de Servicio - Gabriel Bustos",
  description: "Términos y condiciones de servicio de Gabriel Bustos - Desarrollador Full Stack",
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-zinc-900 to-slate-800 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Términos de{" "}
            <span className="bg-gradient-to-r from-blue-400 to-slate-300 bg-clip-text text-transparent">Servicio</span>
          </h1>
          <p className="text-gray-400">Última actualización: Diciembre 2024</p>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Al acceder y utilizar este sitio web y nuestros servicios, usted acepta estar sujeto a estos Términos de
                Servicio y a todas las leyes y regulaciones aplicables.
              </p>
              <p>Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descripción de Servicios</h2>
            <div className="text-gray-300 space-y-4">
              <p>Gabriel Bustos ofrece servicios de desarrollo web y consultoría tecnológica, incluyendo:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Desarrollo de aplicaciones web full stack</li>
                <li>Integración de soluciones de inteligencia artificial</li>
                <li>Consultoría técnica y arquitectura de software</li>
                <li>Automatización de procesos empresariales</li>
                <li>Desarrollo de chatbots y asistentes virtuales</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Proceso de Contratación</h2>
            <div className="text-gray-300 space-y-4">
              <p>El proceso de contratación de servicios incluye:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Consulta inicial para entender los requisitos del proyecto</li>
                <li>Propuesta detallada con alcance, cronograma y presupuesto</li>
                <li>Firma de contrato específico del proyecto</li>
                <li>Desarrollo del proyecto según los términos acordados</li>
                <li>Entrega y soporte post-lanzamiento</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Pagos y Facturación</h2>
            <div className="text-gray-300 space-y-4">
              <p>Los términos de pago se establecerán en cada contrato específico, pero generalmente incluyen:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Pago inicial del 50% antes del inicio del proyecto</li>
                <li>Pagos por hitos según el cronograma acordado</li>
                <li>Pago final del 25% al completar el proyecto</li>
                <li>Los pagos vencen dentro de 15 días de la fecha de factura</li>
                <li>Se pueden aplicar intereses por pagos tardíos</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Una vez completado el pago total del proyecto, el cliente obtiene la propiedad del código y materiales
                desarrollados específicamente para su proyecto.
              </p>
              <p>Sin embargo, nos reservamos el derecho de:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Utilizar conocimientos generales y técnicas aprendidas</li>
                <li>Reutilizar componentes y librerías de código abierto</li>
                <li>Mantener la propiedad de herramientas y frameworks propios</li>
                <li>Mostrar el proyecto en nuestro portafolio (con consentimiento del cliente)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Confidencialidad</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Nos comprometemos a mantener la confidencialidad de toda la información proporcionada por el cliente
                durante el desarrollo del proyecto.
              </p>
              <p>
                Podemos firmar acuerdos de confidencialidad adicionales según sea necesario para proyectos específicos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Garantías y Limitaciones</h2>
            <div className="text-gray-300 space-y-4">
              <p>Proporcionamos:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>30 días de soporte gratuito post-lanzamiento para corrección de errores</li>
                <li>Garantía de que el código entregado funciona según las especificaciones acordadas</li>
                <li>Servicios profesionales de acuerdo con los estándares de la industria</li>
              </ul>
              <p className="mt-4">
                Sin embargo, no garantizamos resultados comerciales específicos ni nos hacemos responsables de pérdidas
                indirectas o consecuenciales.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cancelación y Reembolsos</h2>
            <div className="text-gray-300 space-y-4">
              <p>Políticas de cancelación:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>El cliente puede cancelar el proyecto con 7 días de aviso por escrito</li>
                <li>Se facturará el trabajo completado hasta la fecha de cancelación</li>
                <li>Los pagos iniciales no son reembolsables una vez iniciado el trabajo</li>
                <li>Nos reservamos el derecho de cancelar proyectos por incumplimiento de pago</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Limitación de Responsabilidad</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Nuestra responsabilidad total por cualquier reclamo relacionado con nuestros servicios no excederá el
                monto total pagado por el cliente para el proyecto específico.
              </p>
              <p>
                No seremos responsables por daños indirectos, incidentales, especiales o consecuenciales, incluyendo
                pérdida de beneficios o datos.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Modificaciones</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en
                vigor inmediatamente después de su publicación en este sitio web.
              </p>
              <p>
                Es responsabilidad del cliente revisar periódicamente estos términos para estar al tanto de cualquier
                cambio.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">11. Ley Aplicable</h2>
            <div className="text-gray-300 space-y-4">
              <p>
                Estos términos se regirán e interpretarán de acuerdo con las leyes aplicables, sin tener en cuenta los
                principios de conflicto de leyes.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">12. Contacto</h2>
            <div className="text-gray-300 space-y-4">
              <p>Si tiene preguntas sobre estos Términos de Servicio, puede contactarnos en:</p>
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
