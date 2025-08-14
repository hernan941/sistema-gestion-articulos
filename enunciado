# Prueba Técnica – Fullstack (React + Node.js)

## Objetivo

Desarrollar una aplicación web responsiva y funcional que muestre un listado de artículos, aplicando reglas de negocio, validaciones, transformaciones de datos y consideraciones de UX y rendimiento.

---

## Requisitos Frontend (React + TypeScript)

- **Listado de artículos** con los siguientes campos:
  - ID
  - Fecha (ISO string)
  - Nombre y Apellido (encriptado, desencriptado por backend)
  - Monto original
  - País
  - Agente / Tipo
  - Estado calculado (según lógica de backend)

- **Funcionalidades:**
  - Ordenar por fecha y monto
  - Buscar por país o nombre
  - Filtrar por estado
  - Editar nombre y monto en la tabla
  - Mostrar advertencias si hay inconsistencias (monto negativo, fecha inválida), con ícono y tooltip explicativo

- **Consideraciones técnicas:**
  - Interfaz responsiva
  - Implementar virtualización (soporte 10.000 artículos)
  - Diseño claro y ordenado (no se evalúa diseño gráfico)

---

## Requisitos Backend (Node.js + TypeScript)

- Proveer servicio REST o GraphQL para entregar los artículos procesados
- Fuente de datos: archivo `.json` con 10.000 registros
- El nombre debe venir encriptado y ser desencriptado en el backend
- **Lógica de negocio:**
  - Fecha futura → Estado: Pendiente
  - Fecha pasada + agente "XYZ" + país "Chile" → excluir artículo
  - Monto negativo o nulo → artículo inválido
  - Calcular monto en USD usando tasa fija por país (definida en otro JSON)
  - Agregar campo de estado calculado
- **Seguridad:** No exponer datos sensibles sin desencriptar

---

## Pruebas Automatizadas

- **Requerido:**
  - Al menos 1 prueba unitaria en backend (validar lógica de estado)
  - Al menos 1 prueba de integración en frontend (Testing Library)
- **Opcional (bonus):**
  - Pruebas end-to-end con Cypress o Playwright

---

## Extras (Bonus Track)

- Autenticación básica (login simulado)
- Modo oscuro / claro
- Exportar el listado filtrado a CSV

---
