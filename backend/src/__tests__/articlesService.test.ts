import { ArticlesService } from '../services/articlesService';
import { EncryptionService } from '../services/encryptionService';
import { RawArticle, ArticleStatus } from '../types';
import fs from 'fs';

// Mock del módulo fs
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

describe('ArticlesService', () => {
  let articlesService: ArticlesService;
  let encryptionService: EncryptionService;
  
  const mockExchangeRates = {
    'Chile': 0.0012,
    'Argentina': 0.0028,
    'Estados Unidos': 1.0
  };

  const createMockArticle = (overrides: Partial<RawArticle> = {}): RawArticle => ({
    id: 'test-1',
    fecha: '2024-01-15T10:00:00.000Z',
    nombreEncriptado: 'Juan Pérez',
    montoOriginal: 1000,
    pais: 'Argentina',
    agente: 'Comercial',
    ...overrides
  });

  beforeEach(() => {
    jest.clearAllMocks();
    articlesService = new ArticlesService();
    encryptionService = new EncryptionService();
    
    // Mock exchange rates file
    (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
      if (path.includes('exchange_rates.json')) {
        return Promise.resolve(JSON.stringify(mockExchangeRates));
      }
      if (path.includes('articles.json')) {
        return Promise.resolve(JSON.stringify([]));
      }
      return Promise.reject(new Error('File not found'));
    });
  });

  describe('Filtros de exclusión', () => {
    it('debe excluir artículos con fecha pasada, agente XYZ y país Chile', async () => {
      const pastDate = new Date('2023-01-01T10:00:00.000Z').toISOString();
      const articlesToExclude = [
        createMockArticle({
          id: 'exclude-1',
          fecha: pastDate,
          pais: 'Chile',
          agente: 'XYZ'
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articlesToExclude));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      expect(result).toHaveLength(0);
    });

    it('NO debe excluir artículos que no cumplan todos los criterios', async () => {
      const pastDate = new Date('2023-01-01T10:00:00.000Z').toISOString();
      const articlesNotToExclude = [
        // Fecha pasada, agente XYZ, pero país diferente
        createMockArticle({
          id: 'keep-1',
          fecha: pastDate,
          pais: 'Argentina',
          agente: 'XYZ'
        }),
        // Fecha pasada, país Chile, pero agente diferente
        createMockArticle({
          id: 'keep-2',
          fecha: pastDate,
          pais: 'Chile',
          agente: 'Comercial'
        }),
        // Agente XYZ, país Chile, pero fecha futura
        createMockArticle({
          id: 'keep-3',
          fecha: new Date('2025-12-01T10:00:00.000Z').toISOString(),
          pais: 'Chile',
          agente: 'XYZ'
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articlesNotToExclude));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      expect(result).toHaveLength(3);
    });
  });

  describe('Cálculo de estados', () => {
    it('debe marcar como INVÁLIDO artículos con monto negativo', async () => {
      const invalidArticles = [
        createMockArticle({ id: 'invalid-1', montoOriginal: -100 }),
        createMockArticle({ id: 'invalid-2', montoOriginal: 0 })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(invalidArticles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(2);
      expect(result[0].estadoCalculado).toBe(ArticleStatus.INVALIDO);
      expect(result[1].estadoCalculado).toBe(ArticleStatus.INVALIDO);
    });

    it('debe marcar como PENDIENTE artículos con fecha futura', async () => {
      const futureDate = new Date('2025-12-01T10:00:00.000Z').toISOString();
      const futureArticles = [
        createMockArticle({ 
          id: 'future-1', 
          fecha: futureDate,
          montoOriginal: 1000
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(futureArticles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(1);
      expect(result[0].estadoCalculado).toBe(ArticleStatus.PENDIENTE);
    });

    it('debe marcar como VÁLIDO artículos con fecha pasada y monto positivo', async () => {
      const pastDate = new Date('2024-01-01T10:00:00.000Z').toISOString();
      const validArticles = [
        createMockArticle({ 
          id: 'valid-1', 
          fecha: pastDate,
          montoOriginal: 1000,
          pais: 'Argentina', // Diferente de Chile
          agente: 'Comercial' // Diferente de XYZ
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(validArticles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(1);
      expect(result[0].estadoCalculado).toBe(ArticleStatus.VALIDO);
    });
  });

  describe('Cálculo de montos USD', () => {
    it('debe calcular correctamente el monto en USD usando tasas de cambio', async () => {
      const articles = [
        createMockArticle({ 
          id: 'usd-1', 
          pais: 'Chile',
          montoOriginal: 1000 // 1000 * 0.0012 = 1.2 USD
        }),
        createMockArticle({ 
          id: 'usd-2', 
          pais: 'Argentina',
          montoOriginal: 2000 // 2000 * 0.0028 = 5.6 USD
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(2);
      expect(result[0].montoUSD).toBe(1.2);
      expect(result[1].montoUSD).toBe(5.6);
    });

    it('debe usar tasa 1.0 por defecto para países no encontrados', async () => {
      const articles = [
        createMockArticle({ 
          id: 'unknown-1', 
          pais: 'País Inexistente',
          montoOriginal: 500
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(1);
      expect(result[0].montoUSD).toBe(500); // 500 * 1.0 = 500
    });
  });

  describe('Procesamiento de datos', () => {
    it('no debe exponer nombres encriptados en la respuesta', async () => {
      const articles = [
        createMockArticle({ 
          id: 'security-1',
          nombreEncriptado: 'nombre_encriptado_secreto'
        })
      ];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('nombreEncriptado');
      expect(result[0]).toHaveProperty('nombreDesencriptado');
      expect(result[0].nombreDesencriptado).toBe('nombre_encriptado_secreto'); // Mock sin encriptación real
    });

    it('debe incluir todos los campos requeridos en la respuesta', async () => {
      const articles = [createMockArticle()];

      (fs.promises.readFile as jest.Mock).mockImplementation((path: string) => {
        if (path.includes('articles.json')) {
          return Promise.resolve(JSON.stringify(articles));
        }
        if (path.includes('exchange_rates.json')) {
          return Promise.resolve(JSON.stringify(mockExchangeRates));
        }
        return Promise.reject(new Error('File not found'));
      });

      const result = await articlesService.getProcessedArticles();
      
      expect(result).toHaveLength(1);
      const article = result[0];
      
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('fecha');
      expect(article).toHaveProperty('nombreDesencriptado');
      expect(article).toHaveProperty('montoOriginal');
      expect(article).toHaveProperty('pais');
      expect(article).toHaveProperty('agente');
      expect(article).toHaveProperty('montoUSD');
      expect(article).toHaveProperty('estadoCalculado');
    });
  });
});
