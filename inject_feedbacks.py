import json
import os

data_path = '/Users/sergiomorales/.gemini/antigravity/scratch/practicatest_web/public/data/questions.json'

with open(data_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

feedback_dict = {
    1: "Si al frenar el vehículo se desvía, suele ser un problema de calibración o falla en los frenos de ese lado, lo cual debe ser inspeccionado por un especialista para evitar accidentes graves por pérdida de control.",
    2: "Los frenos mal ajustados provocan que una rueda frene más que la otra, generando una fuerza desigual que tira la dirección hacia un lado. Es una de las fallas más comunes indicadas en el manual.",
    3: "El fuerte olor a gasolina puede indicar una fuga en el sistema de combustible, lo cual representa un altísimo riesgo de incendio o explosión. La instrucción directa del manual es detenerse inmediatamente e investigar.",
    4: "Para prevenir incendios, el Libro del Nuevo Conductor destaca que la medida más preventiva es estar atento a fugas o anomalías, siendo el olor a gasolina la señal más evidente de que algo anda mal con el estanque o mangueras.",
    5: "El uso de calzado adecuado es fundamental porque garantiza la sensibilidad y el agarre en los pedales (freno, embrague y acelerador), evitando que el pie resbale en una situación de emergencia."
}

for q in questions:
    if q['id'] in feedback_dict:
        q['feedback'] = feedback_dict[q['id']]

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print("Inyectados 5 feedbacks de prueba.")
