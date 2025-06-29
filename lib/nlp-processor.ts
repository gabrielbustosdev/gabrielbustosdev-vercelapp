import { z } from 'zod';

// ============================================================================
// TIPOS Y ESQUEMAS PARA NLP
// ============================================================================

export const EntitySchema = z.object({
  type: z.enum(['name', 'email', 'phone', 'budget', 'project_type', 'timeline', 'company', 'location']),
  value: z.string(),
  confidence: z.number().min(0).max(1),
  startIndex: z.number(),
  endIndex: z.number(),
});

export const IntentSchema = z.object({
  type: z.enum([
    'greeting',
    'project_inquiry',
    'budget_discussion',
    'timeline_discussion',
    'service_inquiry',
    'contact_request',
    'portfolio_request',
    'consultation_request',
    'pricing_inquiry',
    'technical_question',
    'general_question',
    'goodbye',
    'clarification_request',
    'confirmation',
    'objection',
    'urgency_indicator'
  ]),
  confidence: z.number().min(0).max(1),
  entities: z.array(EntitySchema),
});

export const SentimentSchema = z.object({
  score: z.number().min(-1).max(1), // -1 muy negativo, 0 neutral, 1 muy positivo
  label: z.enum(['very_negative', 'negative', 'neutral', 'positive', 'very_positive']),
  emotions: z.object({
    joy: z.number().min(0).max(1),
    sadness: z.number().min(0).max(1),
    anger: z.number().min(0).max(1),
    fear: z.number().min(0).max(1),
    surprise: z.number().min(0).max(1),
  }),
});

export const InformationCompletenessSchema = z.object({
  isComplete: z.boolean(),
  missingFields: z.array(z.enum([
    'name',
    'email',
    'phone',
    'project_description',
    'budget',
    'timeline',
    'company',
    'project_type'
  ])),
  completenessScore: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
});

export const NLPResultSchema = z.object({
  entities: z.array(EntitySchema),
  intent: IntentSchema,
  sentiment: SentimentSchema,
  completeness: InformationCompletenessSchema,
  processedText: z.string(),
  originalText: z.string(),
});

// Tipos TypeScript
export type Entity = z.infer<typeof EntitySchema>;
export type Intent = z.infer<typeof IntentSchema>;
export type Sentiment = z.infer<typeof SentimentSchema>;
export type InformationCompleteness = z.infer<typeof InformationCompletenessSchema>;
export type NLPResult = z.infer<typeof NLPResultSchema>;

// ============================================================================
// PATRONES Y REGLAS PARA EXTRACCIÓN
// ============================================================================

const PATTERNS = {
  // Patrones para emails
  email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi,
  
  // Patrones para teléfonos (múltiples formatos)
  phone: /(\+?[\d\s\-\(\)]{7,})/g,
  
  // Patrones para presupuestos
  budget: /(?:presupuesto|budget|precio|costo|inversión|gasto|valor|monto|dinero|euros?|dólares?|pesos?)\s*:?\s*([€$]?\s*\d+(?:[.,]\d{3})*(?:[.,]\d{2})?)/gi,
  
  // Patrones para fechas y plazos
  timeline: /(?:fecha|deadline|plazo|tiempo|entrega|finalización|completar|terminar)\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\d+\s*(?:días?|semanas?|meses?|años?))/gi,
  
  // Patrones para nombres de empresas
  company: /(?:empresa|compañía|organización|startup|negocio|firma|corporación)\s*:?\s*([A-Z][a-zA-Z\s&]+)/gi,
  
  // Patrones para ubicaciones
  location: /(?:ubicación|localización|ciudad|país|región|zona)\s*:?\s*([A-Z][a-zA-Z\s]+)/gi,
} as const;

// Palabras clave para clasificación de intenciones
const INTENT_KEYWORDS = {
  greeting: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'saludos', 'hey', 'hi', 'hello'],
  project_inquiry: ['proyecto', 'desarrollo', 'aplicación', 'app', 'web', 'software', 'sistema', 'plataforma'],
  budget_discussion: ['presupuesto', 'budget', 'precio', 'costo', 'inversión', 'gasto', 'valor', 'monto'],
  timeline_discussion: ['fecha', 'deadline', 'plazo', 'tiempo', 'entrega', 'cuándo', 'cuando'],
  service_inquiry: ['servicio', 'servicios', 'qué haces', 'que haces', 'qué ofreces', 'que ofreces'],
  contact_request: ['contacto', 'contactar', 'hablar', 'conversar', 'reunión', 'llamada'],
  portfolio_request: ['portafolio', 'portfolio', 'trabajos', 'proyectos anteriores', 'experiencia'],
  consultation_request: ['consulta', 'asesoría', 'asesoramiento', 'revisión', 'evaluación'],
  pricing_inquiry: ['precio', 'tarifa', 'costo', 'cuánto cuesta', 'cuanto cuesta', 'valor'],
  technical_question: ['tecnología', 'tech', 'framework', 'lenguaje', 'base de datos', 'hosting'],
  general_question: ['cómo', 'como', 'qué', 'que', 'cuál', 'cual', 'dónde', 'donde'],
  goodbye: ['adiós', 'adios', 'hasta luego', 'nos vemos', 'chao', 'bye', 'goodbye'],
  clarification_request: ['no entiendo', 'puedes explicar', 'clarificar', 'especificar'],
  confirmation: ['sí', 'si', 'correcto', 'exacto', 'perfecto', 'ok', 'okay'],
  objection: ['no', 'no estoy seguro', 'no se', 'no sé', 'dudoso', 'caro', 'costoso'],
  urgency_indicator: ['urgente', 'inmediato', 'rápido', 'rapido', 'pronto', 'ya', 'ahora'],
} as const;

// Palabras clave para análisis de sentimiento
const SENTIMENT_KEYWORDS = {
  positive: ['excelente', 'fantástico', 'genial', 'perfecto', 'maravilloso', 'increíble', 'increible', 'bueno', 'bien'],
  negative: ['malo', 'terrible', 'horrible', 'pésimo', 'pesimo', 'mal', 'problema', 'error', 'fallo'],
  urgent: ['urgente', 'inmediato', 'rápido', 'rapido', 'pronto', 'ya', 'ahora', 'emergencia'],
  confused: ['confundido', 'no entiendo', 'no se', 'no sé', 'dudoso', 'incierto'],
  excited: ['emocionado', 'entusiasmado', 'ansioso', 'esperando', 'deseando'],
} as const;

// ============================================================================
// CLASE PRINCIPAL DE PROCESAMIENTO NLP
// ============================================================================

export class NLPProcessor {
  private static instance: NLPProcessor;

  private constructor() {}

  static getInstance(): NLPProcessor {
    if (!NLPProcessor.instance) {
      NLPProcessor.instance = new NLPProcessor();
    }
    return NLPProcessor.instance;
  }

  /**
   * Procesa un texto completo y extrae toda la información relevante
   */
  async processText(text: string): Promise<NLPResult> {
    const normalizedText = this.normalizeText(text);
    
    const [entities, intent, sentiment, completeness] = await Promise.all([
      this.extractEntities(normalizedText),
      this.classifyIntent(normalizedText),
      this.analyzeSentiment(normalizedText),
      this.assessInformationCompleteness(normalizedText, entities),
    ]);

    return {
      entities,
      intent,
      sentiment,
      completeness,
      processedText: normalizedText,
      originalText: text,
    };
  }

  /**
   * Normaliza el texto para mejor procesamiento
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remover acentos
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  }

  /**
   * Extrae entidades del texto
   */
  private async extractEntities(text: string): Promise<Entity[]> {
    const entities: Entity[] = [];

    // Extraer emails
    const emailMatches = text.matchAll(PATTERNS.email);
    for (const match of emailMatches) {
      entities.push({
        type: 'email',
        value: match[1],
        confidence: 0.95,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    }

    // Extraer teléfonos
    const phoneMatches = text.matchAll(PATTERNS.phone);
    for (const match of phoneMatches) {
      const phone = match[1].replace(/\s/g, '');
      if (phone.length >= 7) {
        entities.push({
          type: 'phone',
          value: phone,
          confidence: 0.85,
          startIndex: match.index!,
          endIndex: match.index! + match[0].length,
        });
      }
    }

    // Extraer presupuestos
    const budgetMatches = text.matchAll(PATTERNS.budget);
    for (const match of budgetMatches) {
      entities.push({
        type: 'budget',
        value: match[1],
        confidence: 0.9,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    }

    // Extraer plazos
    const timelineMatches = text.matchAll(PATTERNS.timeline);
    for (const match of timelineMatches) {
      entities.push({
        type: 'timeline',
        value: match[1],
        confidence: 0.8,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    }

    // Extraer nombres de empresas
    const companyMatches = text.matchAll(PATTERNS.company);
    for (const match of companyMatches) {
      entities.push({
        type: 'company',
        value: match[1].trim(),
        confidence: 0.75,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    }

    // Extraer ubicaciones
    const locationMatches = text.matchAll(PATTERNS.location);
    for (const match of locationMatches) {
      entities.push({
        type: 'location',
        value: match[1].trim(),
        confidence: 0.7,
        startIndex: match.index!,
        endIndex: match.index! + match[0].length,
      });
    }

    // Extraer nombres (heurística simple)
    const nameEntities = this.extractNames(text);
    entities.push(...nameEntities);

    // Extraer tipos de proyecto
    const projectTypeEntities = this.extractProjectTypes(text);
    entities.push(...projectTypeEntities);

    return entities;
  }

  /**
   * Extrae nombres usando heurísticas
   */
  private extractNames(text: string): Entity[] {
    const entities: Entity[] = [];
    const words = text.split(' ');
    
    // Buscar patrones como "me llamo X", "soy X", "mi nombre es X"
    const namePatterns = [
      /(?:me llamo|soy|mi nombre es)\s+([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)*)/gi,
      /(?:nombre|name)\s*:?\s*([a-záéíóúñ]+(?:\s+[a-záéíóúñ]+)*)/gi,
    ];

    for (const pattern of namePatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const name = match[1].trim();
        if (name.length > 2 && !this.isCommonWord(name)) {
          entities.push({
            type: 'name',
            value: name,
            confidence: 0.8,
            startIndex: match.index!,
            endIndex: match.index! + match[0].length,
          });
        }
      }
    }

    return entities;
  }

  /**
   * Extrae tipos de proyecto
   */
  private extractProjectTypes(text: string): Entity[] {
    const entities: Entity[] = [];
    const projectTypes = [
      'aplicación web', 'app web', 'sitio web', 'website', 'ecommerce', 'tienda online',
      'aplicación móvil', 'app móvil', 'mobile app', 'dashboard', 'panel de control',
      'api', 'backend', 'frontend', 'fullstack', 'sistema de gestión', 'crm',
      'landing page', 'blog', 'red social', 'social media', 'marketplace',
      'aplicación de escritorio', 'desktop app', 'software empresarial'
    ];

    for (const projectType of projectTypes) {
      if (text.includes(projectType)) {
        const index = text.indexOf(projectType);
        entities.push({
          type: 'project_type',
          value: projectType,
          confidence: 0.9,
          startIndex: index,
          endIndex: index + projectType.length,
        });
      }
    }

    return entities;
  }

  /**
   * Clasifica la intención del usuario
   */
  private async classifyIntent(text: string): Promise<Intent> {
    const scores: Record<string, number> = {};

    // Calcular puntuaciones para cada intención
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      scores[intent] = 0;
      
      for (const keyword of keywords) {
        if (text.includes(keyword)) {
          scores[intent] += 1;
        }
        
        // Bonus por coincidencias exactas de palabras
        const words = text.split(' ');
        for (const word of words) {
          if (word === keyword) {
            scores[intent] += 0.5;
          }
        }
      }
    }

    // Encontrar la intención con mayor puntuación
    let bestIntent = 'general_question';
    let bestScore = scores[bestIntent] || 0;

    for (const [intent, score] of Object.entries(scores)) {
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    // Normalizar la confianza
    const confidence = Math.min(bestScore / 3, 1);

    return {
      type: bestIntent as Intent['type'],
      confidence,
      entities: [], // Se llenará después
    };
  }

  /**
   * Analiza el sentimiento del texto
   */
  private async analyzeSentiment(text: string): Promise<Sentiment> {
    let positiveScore = 0;
    let negativeScore = 0;
    let confusedScore = 0;
    let excitedScore = 0;

    const words = text.split(' ');

    // Contar palabras por categoría
    for (const word of words) {
      if (SENTIMENT_KEYWORDS.positive.includes(word as any)) positiveScore += 1;
      if (SENTIMENT_KEYWORDS.negative.includes(word as any)) negativeScore += 1;
      if (SENTIMENT_KEYWORDS.confused.includes(word as any)) confusedScore += 1;
      if (SENTIMENT_KEYWORDS.excited.includes(word as any)) excitedScore += 1;
    }

    // Calcular score general (-1 a 1)
    const totalWords = words.length;
    const positiveRatio = positiveScore / Math.max(totalWords, 1);
    const negativeRatio = negativeScore / Math.max(totalWords, 1);
    const sentimentScore = positiveRatio - negativeRatio;

    // Determinar etiqueta
    let label: Sentiment['label'] = 'neutral';
    if (sentimentScore > 0.1) label = 'positive';
    if (sentimentScore > 0.3) label = 'very_positive';
    if (sentimentScore < -0.1) label = 'negative';
    if (sentimentScore < -0.3) label = 'very_negative';

    return {
      score: Math.max(-1, Math.min(1, sentimentScore)),
      label,
      emotions: {
        joy: Math.min(1, positiveRatio * 2),
        sadness: Math.min(1, negativeRatio * 2),
        anger: Math.min(1, negativeRatio * 1.5),
        fear: Math.min(1, confusedScore / Math.max(totalWords, 1) * 3),
        surprise: Math.min(1, excitedScore / Math.max(totalWords, 1) * 2),
      },
    };
  }

  /**
   * Evalúa la completitud de la información
   */
  private async assessInformationCompleteness(
    text: string, 
    entities: Entity[]
  ): Promise<InformationCompleteness> {
    const requiredFields = [
      'name', 'email', 'project_description', 'budget', 'timeline'
    ];
    
    const missingFields: InformationCompleteness['missingFields'] = [];
    let foundFields = 0;

    // Verificar campos encontrados
    for (const field of requiredFields) {
      const hasField = entities.some(entity => entity.type === field) || 
                      this.hasFieldInText(text, field);
      
      if (!hasField) {
        missingFields.push(field as any);
      } else {
        foundFields++;
      }
    }

    const completenessScore = foundFields / requiredFields.length;
    const isComplete = completenessScore >= 0.8; // 80% de completitud

    return {
      isComplete,
      missingFields,
      completenessScore,
      confidence: 0.85,
    };
  }

  /**
   * Verifica si un campo está presente en el texto
   */
  private hasFieldInText(text: string, field: string): boolean {
    const fieldKeywords = {
      name: ['nombre', 'name', 'me llamo', 'soy'],
      email: ['email', 'correo', 'e-mail'],
      project_description: ['proyecto', 'desarrollo', 'aplicación', 'app', 'sistema'],
      budget: ['presupuesto', 'budget', 'precio', 'costo', 'inversión'],
      timeline: ['fecha', 'deadline', 'plazo', 'tiempo', 'entrega'],
    };

    const keywords = fieldKeywords[field as keyof typeof fieldKeywords] || [];
    return keywords.some(keyword => text.includes(keyword));
  }

  /**
   * Verifica si una palabra es común (no un nombre)
   */
  private isCommonWord(word: string): boolean {
    const commonWords = [
      'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'si',
      'no', 'que', 'cual', 'quien', 'donde', 'cuando', 'como', 'por', 'para', 'con',
      'sin', 'sobre', 'entre', 'detras', 'despues', 'antes', 'durante', 'hasta',
      'desde', 'hacia', 'contra', 'según', 'mediante', 'excepto', 'salvo', 'además',
      'también', 'tampoco', 'solo', 'solamente', 'incluso', 'hasta', 'más', 'menos',
      'muy', 'poco', 'bastante', 'demasiado', 'casi', 'apenas', 'justo', 'exacto',
      'preciso', 'cerca', 'lejos', 'arriba', 'abajo', 'dentro', 'fuera', 'encima',
      'debajo', 'delante', 'detrás', 'izquierda', 'derecha', 'centro', 'medio',
      'mitad', 'tercio', 'cuarto', 'quinto', 'sexto', 'séptimo', 'octavo', 'noveno',
      'décimo', 'primero', 'segundo', 'tercero', 'cuarto', 'quinto', 'sexto',
      'séptimo', 'octavo', 'noveno', 'décimo', 'último', 'penúltimo', 'antepenúltimo'
    ];

    return commonWords.includes(word.toLowerCase());
  }
}

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

/**
 * Procesa un mensaje y retorna el resultado NLP
 */
export async function processMessage(text: string): Promise<NLPResult> {
  const processor = NLPProcessor.getInstance();
  return await processor.processText(text);
}

/**
 * Valida un resultado NLP usando Zod
 */
export function validateNLPResult(result: unknown): NLPResult {
  return NLPResultSchema.parse(result);
}

/**
 * Extrae entidades específicas de un texto
 */
export async function extractEntities(text: string): Promise<Entity[]> {
  const processor = NLPProcessor.getInstance();
  return await processor['extractEntities'](processor['normalizeText'](text));
}

/**
 * Clasifica la intención de un mensaje
 */
export async function classifyIntent(text: string): Promise<Intent> {
  const processor = NLPProcessor.getInstance();
  return await processor['classifyIntent'](processor['normalizeText'](text));
}

/**
 * Analiza el sentimiento de un texto
 */
export async function analyzeSentiment(text: string): Promise<Sentiment> {
  const processor = NLPProcessor.getInstance();
  return await processor['analyzeSentiment'](processor['normalizeText'](text));
}

/**
 * Evalúa la completitud de información en un texto
 */
export async function assessCompleteness(text: string): Promise<InformationCompleteness> {
  const processor = NLPProcessor.getInstance();
  const normalizedText = processor['normalizeText'](text);
  const entities = await processor['extractEntities'](normalizedText);
  return await processor['assessInformationCompleteness'](normalizedText, entities);
} 