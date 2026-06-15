# Resumen Ejecutivo - Sesión Actual

## 📌 Estado del Proyecto
La aplicación "Camino al Examen - Clase B" cuenta con perfiles de usuario, mecánica de recuperación de vidas interactiva (Modo Estudio), teoría predictiva basada en los próximos test, y ahora **un Tutorial de Inicio (Onboarding)**.

## 🛠️ Cambios Realizados
1. **🚀 Tutorial de Inicio (Onboarding):** 
   - Se añadió la pantalla `OnboardingView.jsx`.
   - Cuando un usuario crea un perfil por primera vez y escribe su nombre, en lugar de ser tirado al menú principal de golpe, ahora recibe un tutorial ilustrado por Kuromi.
   - El tutorial consta de 4 diapositivas donde se explica de qué trata el juego (preguntas reales del examen), cómo funciona el sistema de 5 vidas, cómo funciona la "Sala de Castigo" para estudiar y recuperar vidas sin esperar, y termina con un mensaje de ánimo.
   - Si el usuario selecciona un perfil que ya existe (inicio de sesión), entra directamente al menú saltándose el tutorial.

## 🚀 Despliegue
- El código se encuentra respaldado en la rama principal de GitHub.
- La versión productiva está desplegada en **Vercel**: [practicatestweb.vercel.app](https://practicatestweb.vercel.app)

## 🎯 Tareas Pendientes / Próximos Pasos
- Validar todo el flujo completo de Onboarding -> Juego -> Pérdida de Vida -> Recuperación con los usuarios finales.
