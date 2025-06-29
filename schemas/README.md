# Esquemas de Datos y Validaciones - Documentación

## Descripción

Esta carpeta contiene todos los esquemas de datos TypeScript y validaciones con Zod para el chatbot y la aplicación completa.

## Estructura de Archivos

```
schemas/
├── client.ts           # Interfaces para información del cliente
├── projects.ts         # Interfaces para proyectos y servicios
├── conversation.ts     # Interfaces para metadatos de conversación
├── validations.ts      # Esquemas de validación con Zod
├── index.ts           # Exportaciones centralizadas
└── README.md          # Esta documentación
```

## Características Principales

### 1. Interfaces TypeScript Completas
- **Tipos fuertemente tipados** para todos los datos
- **Autocompletado** en el IDE
- **Detección temprana de errores** en tiempo de compilación
- **Documentación integrada** en el código

### 2. Validaciones con Zod
- **Validación en tiempo de ejecución** robusta
- **Mensajes de error personalizados** en español
- **Validación de tipos complejos** (emails, URLs, enums)
- **Validación condicional** y transformaciones

### 3. Hooks de Validación
- **Validación en tiempo real** en formularios
- **Debounce automático** para mejor UX
- **Manejo de errores** centralizado
- **Integración con React** sin problemas

## Uso de las Interfaces

### Clientes

```typescript
import { ClientBasicInfo, CompleteClient } from '@/schemas'

// Información básica del cliente
const clientInfo: ClientBasicInfo = {
  name: "Juan Pérez",
  email: "juan@ejemplo.com",
  phone: "+1234567890",
  company: "TechCorp"
}

// Cliente completo con toda la información
const completeClient: CompleteClient = {
  // ... información básica
  location: {
    country: "Argentina",
    city: "Buenos Aires",
    timezone: "America/Argentina/Buenos_Aires"
  },
  company: {
    name: "TechCorp",
    industry: "Technology",
    size: "medium"
  },
  // ... más campos
}
```

### Proyectos

```typescript
import { BaseProject, WebDevelopmentProject } from '@/schemas'

// Proyecto base
const project: BaseProject = {
  id: "proj-123",
  title: "E-commerce Platform",
  description: "Plataforma de comercio electrónico moderna",
  category: "ecommerce",
  serviceType: "web_development",
  complexity: "complex",
  // ... más campos
}

// Proyecto específico de desarrollo web
const webProject: WebDevelopmentProject = {
  // ... campos del proyecto base
  serviceType: "web_development",
  requirements: {
    // ... requerimientos específicos
    ecommerce: {
      products: 1000,
      paymentMethods: ["credit_card", "paypal"],
      inventory: true,
      shipping: true
    }
  }
}
```

### Conversaciones

```typescript
import { CompleteConversation, MessageMetadata } from '@/schemas'

// Metadatos de un mensaje
const message: MessageMetadata = {
  id: "msg-123",
  timestamp: new Date(),
  role: "user",
  content: "Hola, necesito ayuda con mi proyecto",
  sentiment: "positive",
  intent: "service_inquiry"
}

// Conversación completa
const conversation: CompleteConversation = {
  id: "conv-123",
  sessionId: "sess-456",
  type: "inquiry",
  state: "collecting_info",
  messages: [message],
  // ... más campos
}
```

## Uso de las Validaciones

### Backend (API Routes)

```typescript
import { ContactFormSchema, validateData } from '@/schemas/validations'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Validar datos con Zod
  const validation = validateData(ContactFormSchema, body)
  
  if (!validation.success) {
    return NextResponse.json({ 
      error: "Datos inválidos", 
      details: validation.errors 
    }, { status: 400 })
  }

  const { name, email, company, project, message } = validation.data
  // ... procesar datos validados
}
```

### Frontend (Formularios)

```typescript
import { useFormWithValidation } from '@/hooks/use-form-validation'
import { ContactFormSchema } from '@/schemas/validations'

function ContactForm() {
  const {
    formData,
    isSubmitting,
    errors,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    resetForm
  } = useFormWithValidation(ContactFormSchema, initialData)

  const onSubmit = async (data) => {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
    return response.json()
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    const result = await handleSubmit(onSubmit)
    
    if (result.success) {
      alert('¡Enviado exitosamente!')
      resetForm()
    }
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        value={formData.name}
        onChange={(e) => handleInputChange('name', e.target.value)}
        className={fieldErrors.name ? 'border-red-500' : 'border-gray-300'}
      />
      {fieldErrors.name && (
        <p className="text-red-500">{fieldErrors.name}</p>
      )}
      {/* ... más campos */}
    </form>
  )
}
```

## Esquemas de Validación Disponibles

### Clientes
- `ClientBasicInfoSchema` - Información básica del cliente
- `ClientProfileSchema` - Perfil completo del cliente
- `CompanyInfoSchema` - Información de la empresa

### Proyectos
- `BaseProjectSchema` - Proyecto base
- `TechnicalRequirementsSchema` - Requerimientos técnicos
- `ProjectBudgetSchema` - Presupuesto del proyecto
- `ProjectTimelineSchema` - Cronograma del proyecto

### Conversaciones
- `MessageMetadataSchema` - Metadatos de mensajes
- `ConversationAnalysisSchema` - Análisis de conversación
- `CompleteConversationSchema` - Conversación completa

### Formularios
- `ContactFormSchema` - Formulario de contacto
- `ConsultationFormSchema` - Formulario de consulta

## Funciones Helper

### `validateData(schema, data)`
Valida datos completos contra un esquema.

```typescript
const result = validateData(ContactFormSchema, formData)
if (result.success) {
  // Datos válidos
  console.log(result.data)
} else {
  // Errores de validación
  console.log(result.errors)
}
```

### `validatePartialData(schema, data)`
Valida datos parciales contra un esquema.

```typescript
const result = validatePartialData(ClientProfileSchema, { name: "Juan" })
if (result.success) {
  // Datos parciales válidos
  console.log(result.data)
}
```

## Hooks de Validación

### `useFormValidation(schema)`
Hook básico para validación de formularios.

```typescript
const { errors, validateForm, clearErrors } = useFormValidation(ContactFormSchema)
```

### `useRealTimeValidation(schema, debounceMs)`
Hook para validación en tiempo real con debounce.

```typescript
const { fieldErrors, validateFieldRealTime } = useRealTimeValidation(ContactFormSchema, 500)
```

### `useFormWithValidation(schema, initialData)`
Hook completo para manejo de formularios con validación.

```typescript
const {
  formData,
  isSubmitting,
  errors,
  fieldErrors,
  handleInputChange,
  handleSubmit,
  resetForm
} = useFormWithValidation(ContactFormSchema, initialData)
```

## Mejores Prácticas

### 1. Tipos Derivados de Esquemas
```typescript
// ✅ Correcto - Usar inferencia de tipos
type ContactFormData = z.infer<typeof ContactFormSchema>

// ❌ Incorrecto - Definir tipos manualmente
interface ContactFormData {
  name: string
  email: string
  // ...
}
```

### 2. Validación en Ambos Lados
```typescript
// Frontend - Validación inmediata
const result = await handleSubmit(onSubmit)

// Backend - Validación de seguridad
const validation = validateData(ContactFormSchema, body)
```

### 3. Manejo de Errores
```typescript
// Mostrar errores específicos por campo
{fieldErrors.name && (
  <p className="text-red-500">{fieldErrors.name}</p>
)}

// Mostrar errores generales
{submitError && (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    {submitError}
  </div>
)}
```

### 4. Validación en Tiempo Real
```typescript
// Validar campo por campo con debounce
<input
  onChange={(e) => {
    handleInputChange('email', e.target.value)
    validateFieldRealTime('email', e.target.value)
  }}
/>
```

## Extensión de Esquemas

### Agregar Nuevos Campos
```typescript
export const ExtendedContactSchema = ContactFormSchema.extend({
  phone: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email')
})
```

### Validación Condicional
```typescript
export const ConditionalSchema = z.object({
  hasCompany: z.boolean(),
  companyName: z.string().optional().refine(
    (val) => !hasCompany || val,
    { message: "Nombre de empresa requerido si tiene empresa" }
  )
})
```

### Transformaciones
```typescript
export const TransformSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase()),
  name: z.string().transform(val => val.trim())
})
```

## Testing

### Validación de Esquemas
```typescript
import { ContactFormSchema } from '@/schemas/validations'

describe('ContactFormSchema', () => {
  it('should validate correct data', () => {
    const validData = {
      name: "Juan Pérez",
      email: "juan@ejemplo.com",
      message: "Hola, necesito ayuda"
    }
    
    const result = ContactFormSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid email', () => {
    const invalidData = {
      name: "Juan Pérez",
      email: "invalid-email",
      message: "Hola"
    }
    
    const result = ContactFormSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
```

## Migración desde Validaciones Manuales

### Antes (Validación Manual)
```typescript
// ❌ Validación manual propensa a errores
if (!name || name.length < 2) {
  return { error: "Nombre inválido" }
}
if (!email || !email.includes('@')) {
  return { error: "Email inválido" }
}
```

### Después (Validación con Zod)
```typescript
// ✅ Validación robusta con Zod
const validation = validateData(ContactFormSchema, data)
if (!validation.success) {
  return { error: "Datos inválidos", details: validation.errors }
}
```

## Beneficios

1. **Type Safety**: 100% TypeScript coverage
2. **Runtime Validation**: Validación robusta en tiempo de ejecución
3. **Developer Experience**: Autocompletado y detección de errores
4. **Maintainability**: Esquemas centralizados y reutilizables
5. **Performance**: Validación eficiente con debounce
6. **User Experience**: Feedback inmediato en formularios
7. **Security**: Validación en backend para prevenir ataques
8. **Testing**: Fácil testing de esquemas y validaciones 