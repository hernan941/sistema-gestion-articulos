import type { Article, ValidationWarning } from '../types';
import { ArticleStatus } from '../types';

const countries = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 
  'Ecuador', 'Bolivia', 'Paraguay', 'Venezuela', 'España', 'Estados Unidos',
  'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Canadá', 'Australia'
];

const agentTypes = [
  'Comercial', 'Técnico', 'Administrativo', 'Gerencial', 'Financiero',
  'Marketing', 'Ventas', 'Soporte', 'Desarrollo', 'Consultoría'
];

const names = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
  'Carmen Sánchez', 'José González', 'Laura Fernández', 'Miguel Torres', 'Elena Ramírez',
  'David Silva', 'Patricia Morales', 'Fernando Castro', 'Isabel Ortega', 'Roberto Delgado',
  'Mónica Herrera', 'Antonio Jiménez', 'Rosa Mendoza', 'Francisco Ruiz', 'Pilar Vargas'
];

/**
 * Genera datos de prueba para la tabla (solo para fallback)
 */
export function generateMockData(count: number = 100): Article[] {
  const articles: Article[] = [];
  
  for (let i = 0; i < count; i++) {
    const article: Article = {
      id: `article-${i + 1}`,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Último año
      name: names[Math.floor(Math.random() * names.length)],
      originalAmount: Math.round((Math.random() * 10000 - 1000) * 100) / 100, // Puede ser negativo
      country: countries[Math.floor(Math.random() * countries.length)],
      agentType: agentTypes[Math.floor(Math.random() * agentTypes.length)],
      status: Object.values(ArticleStatus)[Math.floor(Math.random() * Object.values(ArticleStatus).length)]
    };
    articles.push(article);
  }
  
  return articles;
}

/**
 * Valida un artículo y retorna las advertencias encontradas
 */
export function validateArticle(article: Article): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];
  
  // Validar monto negativo
  if (article.originalAmount < 0) {
    warnings.push({
      field: 'originalAmount',
      message: 'El monto no puede ser negativo',
      severity: 'warning'
    });
  }
  
  // Validar monto extremadamente alto
  if (article.originalAmount > 50000) {
    warnings.push({
      field: 'originalAmount',
      message: 'Monto inusualmente alto, verificar',
      severity: 'warning'
    });
  }
  
  // Validar fecha futura
  if (article.date > new Date()) {
    warnings.push({
      field: 'date',
      message: 'La fecha no puede ser futura',
      severity: 'error'
    });
  }
  
  // Validar fecha muy antigua (más de 5 años)
  const fiveYearsAgo = new Date();
  fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
  if (article.date < fiveYearsAgo) {
    warnings.push({
      field: 'date',
      message: 'Fecha muy antigua, verificar',
      severity: 'warning'
    });
  }
  
  // Validar nombre vacío
  if (!article.name || article.name.trim().length === 0) {
    warnings.push({
      field: 'name',
      message: 'El nombre es requerido',
      severity: 'error'
    });
  }
  
  // Validar nombre muy corto
  if (article.name && article.name.trim().length < 3) {
    warnings.push({
      field: 'name',
      message: 'El nombre es muy corto',
      severity: 'warning'
    });
  }
  
  return warnings;
}

/**
 * Desencripta el nombre (simulación)
 */
export function decryptName(encryptedName: string): string {
  // Simulación de desencriptación - en realidad solo devuelve el nombre
  return encryptedName;
}

/**
 * Formatea el monto original sin símbolo de moneda
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea el monto USD con símbolo de dólar
 */
export function formatAmountUSD(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Formatea la fecha en formato local
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
