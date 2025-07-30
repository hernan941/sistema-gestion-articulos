# 📊 Sistema de Gestión de Artículos

Una aplicación full-stack moderna para la gestión de artículos con tabla virtualizada de alto rendimiento, edición en línea, filtrado avanzado y vista responsiva.

## 🏗️ Arquitectura del Sistema

```
app/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── hooks/         # Custom hooks para gestión de estado
│   │   ├── services/      # API y servicios
│   │   └── __tests__/     # Pruebas de integración con MSW
│   ├── cypress/          # Pruebas E2E con Cypress
│   │   ├── e2e/          # Tests end-to-end
│   │   ├── support/      # Comandos personalizados
│   │   └── fixtures/     # Datos de prueba
│   └── cypress.config.cjs
└── backend/           # Node.js + Express + TypeScript
    ├── src/
    │   ├── controllers/   # Controladores REST
    │   ├── services/      # Lógica de negocio
    │   ├── routes/        # Definición de rutas
    │   ├── types/         # Tipos TypeScript
    │   └── __tests__/     # Pruebas unitarias
    └── data/             # Almacenamiento de datos
```

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **@tanstack/react-virtual** - Virtualización de tabla para 10,000+ elementos
- **date-fns** - Manipulación de fechas
- **Vitest + Testing Library** - Pruebas unitarias e integración
- **MSW (Mock Service Worker)** - Mocking de API para pruebas
- **Cypress** - Pruebas end-to-end

### Backend
- **Node.js + Express** - Servidor REST API
- **TypeScript** - Tipado estático
- **Crypto (AES-256-CBC)** - Encriptación de datos
- **CORS + Helmet** - Seguridad
- **Jest** - Pruebas unitarias

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd app
```

### 2. Instalación del Backend
```bash
cd backend
npm install
```

### 3. Instalación del Frontend
```bash
cd frontend
npm install
```

### 4. Configuración de Cypress (para pruebas E2E)
```bash
cd frontend
# Cypress se instala automáticamente con npm install
# Para abrir la interfaz gráfica:
npm run test:e2e:open
```

## 🏃‍♂️ Ejecución del Proyecto

### Desarrollo
#### 1. Iniciar Backend (Terminal 1)
```bash
cd backend
npm run dev
```
El servidor estará disponible en `http://localhost:3001`

#### 2. Iniciar Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Producción
#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Ejecución de Pruebas

### Pruebas Unitarias (Backend)
```bash
cd backend
npm test                    # Ejecutar una vez
npm run test:watch         # Modo watch
```

**Cobertura de pruebas unitarias:**
- ✅ Validación de lógica de estado (VÁLIDO, INVÁLIDO, PENDIENTE)
- ✅ Filtros de exclusión por criterios de negocio
- ✅ Cálculo de montos en USD con tasas de cambio
- ✅ Procesamiento y desencriptación de datos
- ✅ Manejo de casos edge y errores

### Pruebas de Integración (Frontend)
```bash
cd frontend
npm test                    # Ejecutar una vez
npm run test:ui            # Interfaz visual
```

**Cobertura de pruebas de integración:**
- ✅ Carga y visualización de artículos
- ✅ Filtrado por búsqueda de texto
- ✅ Filtrado por estado
- ✅ Ordenamiento por fecha
- ✅ Edición inline de nombre y monto
- ✅ Persistencia de cambios en backend
- ✅ Texto de ayuda para edición
- ✅ Manejo de errores de API

### Pruebas End-to-End (E2E)
```bash
cd frontend
# Ejecutar pruebas en modo headless
npm run test:e2e

# Abrir interfaz gráfica de Cypress
npm run test:e2e:open
```

**Cobertura de pruebas E2E:**
- ✅ Carga y visualización completa de la aplicación
- ✅ Filtrado por búsqueda de texto
- ✅ Filtrado por estado con dropdown
- ✅ Ordenamiento por fecha y monto
- ✅ Diseño responsivo (mobile/desktop)
- ✅ Estados de carga
- ✅ Manejo de errores de API

### Ejecución de Todas las Pruebas
```bash
# Backend - Pruebas unitarias
cd backend && npm test

# Frontend - Pruebas de integración
cd frontend && npm test

# Frontend - Pruebas E2E (requiere app corriendo)
cd frontend && npm run test:e2e
```

## 📊 Funcionalidades Principales

### 🔍 Gestión de Datos
- **Carga de artículos** desde API REST
- **Encriptación AES-256-CBC** para nombres sensibles
- **Filtros de exclusión** automáticos basados en reglas de negocio
- **Cálculo de estados** dinámico (VÁLIDO, INVÁLIDO, PENDIENTE)
- **Conversión de moneda** automática a USD

### 🎨 Interfaz de Usuario
- **Tabla virtualizada** para rendimiento óptimo con 10,000+ elementos
- **Edición inline** con doble clic
- **Filtrado avanzado** por texto y estado
- **Ordenamiento** por fecha y monto
- **Vista responsiva** para móviles
- **Texto de ayuda** contextual

### 🔧 Características Técnicas
- **API REST** completa (GET, PUT endpoints)
- **Validación de datos** en backend
- **Manejo de errores** robusto
- **Persistencia** en sistema de archivos
- **Optimización** para grandes volúmenes de datos

## 🏗️ Estructura de Datos

### Artículo (Backend)
```typescript
interface RawArticle {
  id: string;
  fecha: string;
  nombreEncriptado: string;  // Dato sensible encriptado
  montoOriginal: number;
  pais: string;
  agente: string;
}
```

### Artículo Procesado (Frontend)
```typescript
interface ProcessedArticle {
  id: string;
  fecha: string;
  nombreDesencriptado: string;  // Desencriptado para UI
  montoOriginal: number;
  pais: string;
  agente: string;
  montoUSD: number;            // Calculado con tasa de cambio
  estadoCalculado: ArticleStatus; // VALIDO | INVALIDO | PENDIENTE
}
```

## 🔐 Seguridad

- **Encriptación AES-256-CBC** para datos sensibles
- **Headers de seguridad** con Helmet.js
- **CORS configurado** para desarrollo y producción
- **Validación de entrada** en todos los endpoints
- **Manejo seguro de errores** sin exposición de datos internos

## 🎯 APIs Disponibles

### Backend Endpoints
```
GET  /api/articles         # Obtener todos los artículos procesados
PUT  /api/articles/:id     # Actualizar artículo específico
GET  /api/health          # Health check del servidor
```

### Ejemplo de Request
```bash
# Obtener artículos
curl http://localhost:3001/api/articles

# Actualizar artículo
curl -X PUT http://localhost:3001/api/articles/123 \
  -H "Content-Type: application/json" \
  -d '{"nombreDesencriptado": "Nuevo Nombre", "montoOriginal": 1500}'
```

## 🐛 Solución de Problemas

### Error: "Puerto 3001 ya en uso"
```bash
# Encontrar y terminar proceso
lsof -ti:3001 | xargs kill -9

# O usar puerto diferente
PORT=3002 npm run dev
```

### Error: "Cannot find module"
```bash
# Limpiar e instalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Tests de Cypress fallan
```bash
# Verificar que backend esté corriendo
curl http://localhost:3001/api/health

# Reiniciar servicios
cd backend && npm run dev
cd frontend && npm run dev
```

### Error: MSW no funciona en tests
```bash
# Verificar que MSW esté configurado correctamente
cd frontend && npm test -- --reporter=verbose
```

## 📈 Rendimiento

- **Virtualización de tabla**: Maneja +10,000 filas sin problemas
- **Lazy loading**: Carga datos bajo demanda
- **Memoización**: Optimización de re-renders
- **Debounce**: En filtros de búsqueda (300ms)
- **Bundle optimization**: Vite para builds eficientes

## 🧪 Arquitectura de Testing

### Estrategia de Testing
1. **Pruebas Unitarias (Backend)**: Lógica de negocio y utilidades
2. **Pruebas de Integración (Frontend)**: Hooks + Componentes + MSW
3. **Pruebas E2E (Cypress)**: Flujos completos de usuario

### MSW (Mock Service Worker)
- Intercepta requests HTTP en el navegador
- Simula respuestas del backend para tests
- Permite testing de componentes sin backend real

### Cypress vs Testing Library
- **Testing Library + MSW**: Testing de componentes con datos mock
- **Cypress**: Testing de flujos completos con backend real

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Desarrollo
- Usar TypeScript estrictamente
- Escribir pruebas para nuevas funcionalidades
- Seguir convenciones de ESLint
- Documentar cambios en README

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

Desarrollado con ❤️ usando las mejores prácticas de desarrollo moderno.

---

## 🚀 Quick Start

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev

# Terminal 3: Tests de integración
cd frontend && npm test

# Terminal 4: Tests E2E (opcional)
cd frontend && npm run test:e2e:open
```

¡La aplicación estará lista en `http://localhost:5173`! 🎉

## 🚀 Tecnologías Utilizadas

### Frontend
- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Material-UI (MUI)** - Componentes de UI
- **@tanstack/react-virtual** - Virtualización de tabla para 10,000+ elementos
- **date-fns** - Manipulación de fechas
- **Vitest + Testing Library** - Pruebas unitarias e integración
- **MSW (Mock Service Worker)** - Mocking de API para pruebas
- **Cypress** - Pruebas end-to-end

### Backend
- **Node.js + Express** - Servidor REST API
- **TypeScript** - Tipado estático
- **Crypto (AES-256-CBC)** - Encriptación de datos
- **CORS + Helmet** - Seguridad
- **Jest** - Pruebas unitarias

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Git

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd app
```

### 2. Instalación del Backend
```bash
cd backend
npm install
```

### 3. Instalación del Frontend
```bash
cd frontend
npm install
```

### 4. Configuración de Cypress (para pruebas E2E)
```bash
cd frontend
# Cypress se instala automáticamente con npm install
# Para abrir la interfaz gráfica:
npm run test:e2e:open
```

## 🏃‍♂️ Ejecución del Proyecto

### Desarrollo
#### 1. Iniciar Backend (Terminal 1)
```bash
cd backend
npm run dev
```
El servidor estará disponible en `http://localhost:3000`

#### 2. Iniciar Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### Producción
#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## 🧪 Ejecución de Pruebas

### Pruebas Unitarias (Backend)
```bash
cd backend
npm test                    # Ejecutar una vez
npm run test:watch         # Modo watch
```

**Cobertura de pruebas unitarias:**
- ✅ Validación de lógica de estado (VÁLIDO, INVÁLIDO, PENDIENTE)
- ✅ Filtros de exclusión por criterios de negocio
- ✅ Cálculo de montos en USD con tasas de cambio
- ✅ Procesamiento y desencriptación de datos
- ✅ Manejo de casos edge y errores

### Pruebas de Integración (Frontend)
```bash
cd frontend
npm test                    # Ejecutar una vez
npm run test:ui            # Interfaz visual
```

**Cobertura de pruebas de integración:**
- ✅ Carga y visualización de artículos
- ✅ Filtrado por búsqueda de texto
- ✅ Filtrado por estado
- ✅ Ordenamiento por fecha
- ✅ Edición inline de nombre y monto
- ✅ Persistencia de cambios en backend
- ✅ Texto de ayuda para edición
- ✅ Manejo de errores de API

### Pruebas End-to-End (E2E)
```bash
cd frontend
# Ejecutar pruebas en modo headless
npm run test:e2e

# Abrir interfaz gráfica de Cypress
npm run test:e2e:open
```

**Cobertura de pruebas E2E:**
- ✅ Carga y visualización completa de la aplicación
- ✅ Filtrado por búsqueda de texto
- ✅ Filtrado por estado con dropdown
- ✅ Ordenamiento por fecha y monto
- ✅ Diseño responsivo (mobile/desktop)
- ✅ Estados de carga
- ✅ Manejo de errores de API

### Ejecución de Todas las Pruebas
```bash
# Backend - Pruebas unitarias
cd backend && npm test

# Frontend - Pruebas de integración
cd frontend && npm test

# Frontend - Pruebas E2E (requiere app corriendo)
cd frontend && npm run test:e2e
```
cd frontend && npm run test:e2e
```

## 📊 Funcionalidades Principales

### 🔍 Gestión de Datos
- **Carga de artículos** desde API REST
- **Encriptación AES-256-CBC** para nombres sensibles
- **Cálculo automático** de montos USD con tasas de cambio
- **Estados calculados**: VÁLIDO, INVÁLIDO, PENDIENTE
- **Filtros de exclusión** por reglas de negocio

### 🎨 Interfaz de Usuario
- **Tabla virtualizada** para rendimiento óptimo
- **Edición inline** con doble clic
- **Filtrado avanzado** por texto y estado
- **Ordenamiento** por fecha
- **Vista responsiva** para móviles
- **Texto de ayuda** contextual

### 🔧 Características Técnicas
- **API REST** completa (GET, PUT endpoints)
- **Validación de datos** en backend
- **Manejo de errores** robusto
- **Persistencia** en sistema de archivos
- **Optimización** para grandes volúmenes de datos

## 🏗️ Estructura de Datos

### Artículo (Backend)
```typescript
interface RawArticle {
  id: string;
  fecha: string;
  nombreEncriptado: string;  // Dato sensible encriptado
  montoOriginal: number;
  pais: string;
  agente: string;
}
```

### Artículo Procesado (Frontend)
```typescript
interface ProcessedArticle {
  id: string;
  fecha: string;
  nombreDesencriptado: string;  // Desencriptado para UI
  montoOriginal: number;
  pais: string;
  agente: string;
  montoUSD: number;            // Calculado con tasa de cambio
  estadoCalculado: ArticleStatus; // VALIDO | INVALIDO | PENDIENTE
}
```

## 🔐 Seguridad

- **Encriptación AES-256-CBC** para datos sensibles
- **Headers de seguridad** con Helmet.js
- **CORS configurado** para desarrollo y producción
- **Validación de entrada** en todos los endpoints
- **Manejo seguro de errores** sin exposición de datos internos

## 🎯 APIs Disponibles

### Backend Endpoints
```
GET  /api/articles         # Obtener todos los artículos procesados
PUT  /api/articles/:id     # Actualizar artículo específico
GET  /api/health          # Health check del servidor
```

### Ejemplo de Request
```bash
# Obtener artículos
curl http://localhost:3000/api/articles

# Actualizar artículo
curl -X PUT http://localhost:3000/api/articles/123 \
  -H "Content-Type: application/json" \
  -d '{"nombreDesencriptado": "Nuevo Nombre", "montoOriginal": 1500}'
```

## 🐛 Solución de Problemas

### Error: "Puerto 3000 ya en uso"
```bash
# Encontrar y terminar proceso
lsof -ti:3000 | xargs kill -9

# O usar puerto diferente
PORT=3001 npm run dev
```

### Error: "Cannot find module"
```bash
# Limpiar e instalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Playwright browsers
```bash
# Instalar dependencias del sistema
sudo npx playwright install-deps
npx playwright install
```

### Error: Tests fallan
```bash
# Verificar que backend esté corriendo
curl http://localhost:3000/api/health

# Reiniciar servicios
cd backend && npm run dev
cd frontend && npm run dev
```

## 📈 Rendimiento

- **Virtualización de tabla**: Maneja +10,000 filas sin problemas
- **Lazy loading**: Carga datos bajo demanda
- **Memoización**: Optimización de re-renders
- **Debounce**: En filtros de búsqueda
- **Bundle optimization**: Vite para builds eficientes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Desarrollo
- Usar TypeScript estrictamente
- Escribir pruebas para nuevas funcionalidades
- Seguir convenciones de ESLint
- Documentar cambios en README

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autor

Desarrollado con ❤️ usando las mejores prácticas de desarrollo moderno.

---

## 🚀 Quick Start

```bash
# Terminal 1: Backend
cd backend && npm install && npm run dev

# Terminal 2: Frontend  
cd frontend && npm install && npm run dev

# Terminal 3: Tests
cd frontend && npm test
```

¡La aplicación estará lista en `http://localhost:5173`! 🎉
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Utilidades
│   │   └── types.ts       # Definiciones de tipos
│   ├── public/
│   └── package.json
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── services/      # Lógica de negocio
│   │   ├── controllers/   # Controladores REST
│   │   ├── routes/        # Definición de rutas
│   │   └── types.ts       # Definiciones de tipos
│   ├── data/
│   │   ├── articles.json     # 10,000 artículos
│   │   └── exchange_rates.json # Tasas de cambio
│   └── package.json
└── README.md
```

## 🚀 Inicio Rápido

### Frontend (Puerto 5173)
```bash
cd frontend
npm install
npm run dev
```

### Backend (Puerto 3001)
```bash
cd backend
npm install
npm run dev
```

## � Características del Frontend

- **Tabla Virtualizada**: Renderiza eficientemente 10,000+ elementos
- **Búsqueda en Tiempo Real**: Por nombre y país
- **Filtrado Avanzado**: Por estado (Activo, Inactivo, Pendiente, Suspendido)
- **Ordenamiento**: Por fecha y monto
- **Edición Inline**: Nombres y montos editables directamente
- **Validaciones Visuales**: Iconos y tooltips para inconsistencias
- **Diseño Responsivo**: Optimizado para móvil y escritorio

## 🔧 Características del Backend

### Endpoints Disponibles

- `GET /api/articles` - Obtiene todos los artículos procesados
- `GET /api/articles/stats` - Obtiene estadísticas de los artículos
- `GET /api/health` - Health check del servidor

### Lógica de Negocio

1. **Desencriptación**: Nombres desencriptados usando AES-256-CBC
2. **Filtros de Exclusión**: Excluye artículos con fecha pasada + agente "XYZ" + país "Chile"
3. **Cálculo de Estados**:
   - `Inválido`: Monto negativo o nulo
   - `Pendiente`: Fecha futura
   - `Válido`: Resto de casos
4. **Conversión de Moneda**: Calcula montos en USD usando tasas por país
5. **Seguridad**: No expone datos sensibles sin procesar

## 🧪 Testing

### Backend
```bash
cd backend
npm test        # Ejecutar todas las pruebas
npm run test:watch  # Modo watch
```

Las pruebas cubren:
- Filtros de exclusión
- Cálculo de estados
- Conversión de monedas
- Seguridad de datos

## 🛠️ Tecnologías

### Frontend
- React 19 + TypeScript
- Material-UI (MUI)
- @tanstack/react-virtual
- Vite (build tool)

### Backend  
- Node.js + Express + TypeScript
- Crypto (AES-256-CBC encryption)
- Jest (testing)
- TSX (development)

## 📊 Datos

- **10,000 artículos** con datos simulados realistas
- **Encriptación real** de nombres usando AES
- **19 países** con tasas de cambio
- **Múltiples estados** y tipos de agentes
- **Validaciones** que generan advertencias automáticas
