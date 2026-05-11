# 🔧 KENAI GARAGE
### Sistema de mantenimiento automotriz — Sergio Castro | Prácticas Profesionales II

---

## ¿Qué es Kenai Garage?

**Kenai Garage** es una aplicación web mobile-first para gestionar el mantenimiento de tu vehículo.  
Nació de una necesidad real: llevar el control del mantenimiento de una **Toyota Hilux 3.0 2015 (1KD-FTV)**.

> Permite registrar servicios, visualizar próximos mantenimientos y consultar herramientas necesarias para distintos trabajos mecánicos.

---

## 🚀 Cómo ejecutarlo en VSCode

### Opción 1 — Live Server (recomendado)

1. Instalá la extensión **Live Server** de Ritwick Dey en VSCode
2. Abrí la carpeta `kenai-garage/` en VSCode
3. Click derecho sobre `index.html` → **"Open with Live Server"**
4. La app se abre automáticamente en tu navegador

### Opción 2 — Abrir directamente

1. Navegá a la carpeta del proyecto en tu explorador de archivos
2. Doble click en `index.html`
3. Se abre en tu navegador (funciona sin servidor para esta versión)

### Ver en tu celular (misma red WiFi)

1. Ejecutá con Live Server (opción 1)
2. Anotá la IP de tu computadora (ej: `192.168.1.100`)
3. En tu celular, abrí: `http://192.168.1.100:5500`

---

## 📁 Estructura del proyecto

```
kenai-garage/
│
├── index.html          ← Estructura HTML de la app
├── css/
│   └── style.css       ← Estilos (dark theme, glassmorphism)
├── js/
│   └── script.js       ← Lógica (vanilla JS, localStorage)
├── assets/
│   ├── images/         ← Imágenes del proyecto
│   ├── icons/          ← Íconos personalizados
│   └── logos/          ← Logos
├── README.md           ← Esta guía
└── .gitignore          ← Archivos ignorados por Git
```

---

## ✅ Funcionalidades actuales

| Funcionalidad                    | Estado |
|----------------------------------|--------|
| Registrar mantenimientos         | ✅ |
| Editar mantenimientos            | ✅ |
| Eliminar registros               | ✅ |
| Filtrar por estado               | ✅ |
| Visualizar historial             | ✅ |
| Alertas de próximos servicios    | ✅ |
| Resumen / estadísticas           | ✅ |
| Trabajos mecánicos + herramientas| ✅ |
| Info técnica del vehículo        | ✅ |
| Ficha técnica guardada           | ✅ |
| Persistencia localStorage        | ✅ |
| Diseño mobile-first              | ✅ |
| Datos predefinidos Hilux 1KD     | ✅ |

---

## 🛠️ Tecnologías utilizadas

- **HTML5** — estructura semántica
- **CSS3** — variables, glassmorphism, animaciones, grid, flexbox
- **JavaScript Vanilla** — sin frameworks, sin dependencias
- **localStorage** — persistencia de datos en el dispositivo
- **Font Awesome 6** — íconos
- **Google Fonts** — Barlow Condensed + Outfit

---

## 🔭 Ideas futuras

### 📱 APK Android
Convertir la app web a una aplicación Android nativa usando:
- **Capacitor** (Ionic) o **Cordova** — empaquetan la web como app
- Publicación en Google Play Store
- Acceso a funciones nativas del teléfono (notificaciones push, cámara para adjuntar fotos de repuestos)

### ☁️ Sincronización en la nube
- **Backend**: Node.js + Express o Firebase
- **Base de datos**: Firestore, MongoDB o PostgreSQL
- **API REST** para sincronizar datos entre dispositivos
- El usuario puede ver su historial desde cualquier teléfono o computadora

### 👤 Sistema de usuarios
- Registro e inicio de sesión (email + contraseña)
- Autenticación con JWT (JSON Web Tokens)
- Cada usuario tiene sus propios vehículos y mantenimientos
- Perfiles con foto y nombre

### 🔔 Notificaciones
- Notificaciones push cuando se acerca un mantenimiento
- Recordatorios por email (ej: "Faltan 500 km para el cambio de aceite")
- Alertas en tiempo real usando WebSockets o Firebase Cloud Messaging

### 🚗 Múltiples vehículos
- Soporte para agregar más de un auto / camioneta / moto
- Cambiar entre vehículos desde la pantalla de inicio
- Historial separado por vehículo
- Comparar mantenimientos entre vehículos

### 🔌 Conexión OBD-II
- Conectar la app a un adaptador OBD-II (por Bluetooth o WiFi)
- Leer datos en tiempo real del motor: RPM, temperatura, fallas
- Registrar mantenimientos automáticamente según los datos del auto
- Limpiar códigos de error (DTC) desde la app

### 📸 Adjuntar fotos
- Fotografiar facturas, repuestos, estado de piezas
- Galería de fotos por mantenimiento
- Reconocimiento de texto (OCR) en facturas

### 📊 Reportes
- Exportar historial a PDF
- Gráficos de gastos por mes / tipo de servicio
- Costo total acumulado del vehículo

---

## 👨‍💻 Autor

**Sergio Castro**  
Prácticas Profesionales II — 2026  

---

## 📄 Licencia

Proyecto educativo de uso personal.
