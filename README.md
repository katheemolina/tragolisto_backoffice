# Tragolisto Backoffice

Backoffice para la administración de la plataforma Tragolisto. Permite gestionar tragos, ingredientes y juegos.

## Características

- **Dashboard**: Resumen general con estadísticas y datos de la plataforma
- **Gestión de Tragos**: CRUD completo para administrar los tragos disponibles
- **Gestión de Ingredientes**: CRUD completo para administrar ingredientes
- **Gestión de Juegos**: CRUD completo para administrar juegos de bebidas
- **Interfaz Responsiva**: Diseño adaptativo para diferentes dispositivos
- **Componentes Reutilizables**: UI components modulares y escalables

## Tecnologías Utilizadas

- React 18
- React Router DOM
- Axios para llamadas API
- CSS3 con diseño moderno
- Componentes funcionales con Hooks

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd tragolisto_backoffice
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

La aplicación se abrirá en [http://localhost:3000](http://localhost:3000)

## Estructura del Proyecto

```
src/
├── components/
│   ├── Layout/
│   │   ├── Layout.js
│   │   └── Layout.css
│   └── UI/
│       ├── Button.js
│       ├── Button.css
│       ├── Table.js
│       ├── Table.css
│       ├── Modal.js
│       └── Modal.css
├── pages/
│   ├── Dashboard/
│   │   ├── Dashboard.js
│   │   └── Dashboard.css
│   ├── Tragos/
│   │   ├── Tragos.js
│   │   └── Tragos.css
│   ├── Ingredientes/
│   │   ├── Ingredientes.js
│   │   └── Ingredientes.css
│   └── Juegos/
│       ├── Juegos.js
│       └── Juegos.css
├── services/
│   └── api.js
├── App.js
└── index.js
```

## Configuración del Backend

El proyecto está configurado para conectarse a un backend en `http://localhost:8000/api`. 

Para cambiar la URL del backend, modifica la variable `API_BASE_URL` en `src/services/api.js`.

## Funcionalidades por Sección

### Dashboard
- Estadísticas generales (total de tragos, ingredientes, juegos)
- Lista de tragos más populares
- Acciones rápidas

### Tragos
- Listar todos los tragos
- Crear nuevo trago
- Editar trago existente
- Eliminar trago
- Campos: nombre, descripción, instrucciones, ingredientes, tiempo de preparación, dificultad, categoría

### Ingredientes
- Listar todos los ingredientes
- Crear nuevo ingrediente
- Editar ingrediente existente
- Eliminar ingrediente
- Campos: nombre, descripción, categoría, disponibilidad, precio estimado

### Juegos
- Listar todos los juegos
- Crear nuevo juego
- Editar juego existente
- Eliminar juego
- Campos: nombre, descripción, instrucciones, categoría, jugadores mín/máx, duración, dificultad

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm eject`: Expone la configuración de webpack (irreversible)

## Notas de Desarrollo

- Los datos actuales son mock data para demostración
- Para conectar con el backend real, reemplaza las llamadas mock en cada página con las llamadas reales al API
- El proyecto incluye manejo de errores básico y estados de carga
- Los componentes UI son reutilizables y pueden ser extendidos según necesidades

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 