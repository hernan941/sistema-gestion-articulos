import fs from 'fs';
import path from 'path';
import { RawArticle } from '../src/types';
import { encryptionService } from '../src/services/encryptionService';

const countries = [
  'Argentina', 'Brasil', 'Chile', 'Colombia', 'México', 'Perú', 'Uruguay', 
  'Ecuador', 'Bolivia', 'Paraguay', 'Venezuela', 'España', 'Estados Unidos',
  'Francia', 'Alemania', 'Italia', 'Reino Unido', 'Canadá', 'Australia'
];

const agents = [
  'Comercial', 'Técnico', 'Administrativo', 'Gerencial', 'Financiero',
  'Marketing', 'Ventas', 'Soporte', 'Desarrollo', 'Consultoría', 'XYZ'
];

const names = [
  'Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Luis Rodríguez',
  'Carmen Sánchez', 'José González', 'Laura Fernández', 'Miguel Torres', 'Elena Ramírez',
  'David Silva', 'Patricia Morales', 'Fernando Castro', 'Isabel Ortega', 'Roberto Delgado',
  'Mónica Herrera', 'Antonio Jiménez', 'Rosa Mendoza', 'Francisco Ruiz', 'Pilar Vargas',
  'Santiago Díaz', 'Valentina Rojas', 'Sebastián Vargas', 'Camila Moreno', 'Matías Herrera',
  'Sofía Castillo', 'Nicolás Guerrero', 'Gabriela Soto', 'Diego Mendez', 'Andrea Vega'
];

/**
 * Genera datos de prueba para los artículos
 */
function generateMockArticles(count: number = 10000): RawArticle[] {
  const articles: RawArticle[] = [];
  
  for (let i = 0; i < count; i++) {
    const now = new Date();
    const randomDate = new Date(now.getTime() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000); // Últimos 2 años
    
    // Añadir algunas fechas futuras para probar el estado "Pendiente"
    if (Math.random() < 0.1) {
      randomDate.setTime(now.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Próximos 30 días
    }

    const country = countries[Math.floor(Math.random() * countries.length)];
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    // Crear algunos artículos que deben ser excluidos (fecha pasada + agente XYZ + país Chile)
    let finalCountry = country;
    let finalAgent = agent;
    let finalDate = randomDate;
    
    if (Math.random() < 0.05) { // 5% de artículos para exclusión
      finalCountry = 'Chile';
      finalAgent = 'XYZ';
      finalDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000); // Fecha pasada
    }

    // Generar algunos montos negativos o cero para probar validaciones
    let amount = Math.round((Math.random() * 10000 + 100) * 100) / 100;
    if (Math.random() < 0.05) { // 5% con montos inválidos
      amount = Math.random() < 0.5 ? -Math.abs(amount) : 0;
    }

    const article: RawArticle = {
      id: `article-${String(i + 1).padStart(5, '0')}`,
      fecha: finalDate.toISOString(),
      nombreEncriptado: encryptionService.encrypt(name),
      montoOriginal: amount,
      pais: finalCountry,
      agente: finalAgent
    };
    
    articles.push(article);
  }
  
  return articles;
}

/**
 * Genera el archivo articles.json
 */
async function generateArticlesFile(): Promise<void> {
  try {
    console.log('Generando artículos de prueba...');
    
    const articles = generateMockArticles(10000);
    const outputPath = path.join(__dirname, 'articles.json');
    
    await fs.promises.writeFile(outputPath, JSON.stringify(articles, null, 2));
    
    console.log(`✅ Se generaron ${articles.length} artículos en ${outputPath}`);
    console.log(`📊 Estadísticas:`);
    
    const stats = {
      total: articles.length,
      conAgentesXYZ: articles.filter(a => a.agente === 'XYZ').length,
      enChile: articles.filter(a => a.pais === 'Chile').length,
      montosNegativos: articles.filter(a => a.montoOriginal <= 0).length,
      fechasFuturas: articles.filter(a => new Date(a.fecha) > new Date()).length
    };
    
    console.log(`   - Total: ${stats.total}`);
    console.log(`   - Agentes XYZ: ${stats.conAgentesXYZ}`);
    console.log(`   - En Chile: ${stats.enChile}`);
    console.log(`   - Montos inválidos: ${stats.montosNegativos}`);
    console.log(`   - Fechas futuras: ${stats.fechasFuturas}`);
    
  } catch (error) {
    console.error('Error generando artículos:', error);
    process.exit(1);
  }
}

// Ejecutar si este archivo es llamado directamente
if (require.main === module) {
  generateArticlesFile();
}

export { generateMockArticles };
