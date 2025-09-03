# Connect BQ - Plataforma de Movilidad Urbana Inteligente

## 🚌 Descripción

Connect BQ es una plataforma web interactiva que permite a los usuarios explorar y planificar rutas de transporte público en Barranquilla, específicamente las rutas del sistema Transmetro. La aplicación incluye un mapa interactivo, búsqueda de rutas en tiempo real y un sistema de alertas comunitarias.

## ✨ Características Principales

### 🗺️ Mapa Interactivo
- **Visualización de rutas**: Muestra las rutas de Transmetro con trazado preciso siguiendo las calles
- **Marcadores inteligentes**: 
  - 🟢 **Verde (I)**: Punto de inicio de la ruta
  - 🔴 **Rojo (F)**: Punto final de la ruta
  - 🔵 **Azul**: Paradas intermedias
- **Navegación fluida**: Zoom automático y centrado en la ruta seleccionada

### 🔍 Búsqueda de Rutas
- **Selector interactivo**: Lista dinámica de todas las rutas disponibles
- **Información detallada**: 
  - Distancia total
  - Tiempo estimado de viaje
  - Costo del pasaje
  - Puntos de inicio y destino
- **Búsqueda en tiempo real**: Resultados instantáneos al seleccionar una ruta

### ⚠️ Sistema de Alertas
- **Alertas en tiempo real**: Notificaciones sobre tráfico, bloqueos y eventos
- **Clasificación por severidad**: Baja, Media, Alta
- **Información detallada**: Usuario que reportó, fecha y hora
- **Panel dedicado**: Sección especial para visualizar alertas activas

### 📱 Diseño Responsivo
- **Interfaz adaptativa**: Funciona perfectamente en desktop, tablet y móvil
- **Menú hamburguesa**: Navegación optimizada para dispositivos móviles
- **Paneles flotantes**: Información contextual sin obstruir el mapa

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Tailwind CSS y animaciones personalizadas
- **JavaScript ES6+**: Lógica de la aplicación y manejo de eventos
- **Leaflet.js**: Biblioteca de mapas interactivos
- **OpenStreetMap**: Mapas de código abierto

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **MongoDB**: Base de datos NoSQL
- **REST API**: Arquitectura de servicios web

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/connect-bq/bq_connect.git
cd bq_connect
```

2. **Instalar dependencias del Frontend**
```bash
cd Frontend
npm install
```

3. **Instalar dependencias del Backend**
```bash
cd ../Backend
npm install
```

4. **Configurar variables de entorno**
```bash
# En Backend/
cp .env.example .env
# Editar .env con tus configuraciones
```

### Ejecución

1. **Iniciar el Backend**
```bash
cd Backend
npm start
```

2. **Iniciar el Frontend**
```bash
cd Frontend
npm run dev
```

3. **Abrir en el navegador**
```
http://localhost:5173
```

## 📊 Estructura de Datos

### Ruta de Transmetro
```json
{
  "_id": "identificador_unico",
  "name": "Nombre de la ruta",
  "initial_point": {
    "coordinates": {
      "latitude": 10.9073079900703,
      "longitude": -74.8003802439823
    },
    "name": "Nombre del punto inicial"
  },
  "end_point": {
    "coordinates": {
      "latitude": 10.9951673572843,
      "longitude": -74.807519818494
    },
    "name": "Nombre del punto final"
  },
  "path": [
    {
      "coordinates": {
        "latitude": 10.9150750113431,
        "longitude": -74.7991624050026
      },
      "name": "Nombre de la parada"
    }
  ],
  "distance": 19.2,
  "estimated_time": 57,
  "estimated_cost": 3300,
  "alerts": []
}
```

### Alerta
```json
{
  "type": "traffic|block|event",
  "severity": "low|medium|high",
  "username": "usuario_que_reporto",
  "createdAt": "2025-09-03T04:46:56.536Z",
  "updatedAt": "2025-09-03T04:46:56.536Z"
}
```

## 🎯 Funcionalidades de Usuario

### Para Usuarios Regulares
1. **Explorar rutas**: Seleccionar y visualizar rutas en el mapa
2. **Información de viaje**: Ver distancia, tiempo y costo
3. **Navegación**: Usar el mapa para orientarse
4. **Alertas**: Consultar alertas activas en las rutas

### Para Usuarios Autenticados
1. **Reportar alertas**: Crear nuevas alertas para la comunidad
2. **Gestión de perfil**: Acceder a funcionalidades avanzadas
3. **Historial**: Ver alertas reportadas anteriormente

## 🔧 API Endpoints

### Rutas
- `GET /routes` - Obtener todas las rutas
- `GET /routes/:id` - Obtener ruta específica
- `POST /routes` - Crear nueva ruta
- `PUT /routes/:id` - Actualizar ruta
- `DELETE /routes/:id` - Eliminar ruta

### Alertas
- `POST /routes/:id/alerts` - Agregar alerta a una ruta
- `DELETE /routes/:id/alerts/:alertId` - Eliminar alerta

### Usuarios
- `POST /users/register` - Registro de usuario
- `POST /users/login` - Inicio de sesión
- `GET /users/profile` - Obtener perfil del usuario

## 🎨 Personalización

### Colores del Tema
- **Primario**: `#FF6B35` (Naranja)
- **Secundario**: `#28a745` (Verde)
- **Peligro**: `#dc3545` (Rojo)
- **Información**: `#007bff` (Azul)

### Estilos CSS
Los estilos personalizados se encuentran en `Frontend/src/css/styles.css` e incluyen:
- Animaciones suaves
- Efectos hover
- Diseño responsivo
- Personalización de marcadores del mapa

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos**: Desktop, Tablet, Móvil
- **Resoluciones**: 320px - 1920px+

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **StarDev** - Diseño y desarrollo
- **Connect BQ** - Concepto y dirección del proyecto

## 📞 Contacto

- **GitHub**: [@connect-bq](https://github.com/connect-bq)
- **Issues**: [Reportar problemas](https://github.com/connect-bq/bq_connect/issues)

## 🚀 Roadmap

### Versión 1.1
- [ ] Búsqueda por ubicación
- [ ] Filtros avanzados de rutas
- [ ] Notificaciones push

### Versión 1.2
- [ ] Integración con GPS en tiempo real
- [ ] Historial de rutas favoritas
- [ ] Modo offline

### Versión 2.0
- [ ] IA para predicción de tiempos
- [ ] Integración con otros sistemas de transporte
- [ ] API pública para desarrolladores

---

**Connect BQ** - Haciendo la movilidad urbana más inteligente y accesible para todos. 🚌✨