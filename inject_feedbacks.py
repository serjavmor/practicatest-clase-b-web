import json

data_path = '/Users/sergiomorales/.gemini/antigravity/scratch/practicatest_web/public/data/questions.json'

with open(data_path, 'r', encoding='utf-8') as f:
    questions = json.load(f)

feedback_dict = {
    219: "Esto sucede porque hay una pérdida total de fricción (adherencia) entre los neumáticos y el hielo, lo que hace que el volante no ofrezca resistencia.",
    220: "La distancia de detención es mucho más larga cuando conduces a exceso de velocidad o cuando las condiciones de la calzada son adversas (mojada, con nieve o hielo).",
    221: "Lo primero que debes hacer es presionar el pedal del freno suavemente y en forma repetida para generar fricción, lo que secará los frenos mojados.",
    223: "Esa sensación indica que estás sufriendo 'aquaplaning' (flotando sobre el agua). Debes soltar suavemente el acelerador y NO pisar el freno ni girar el volante bruscamente.",
    224: "En nieve, arrancar o conducir en la marcha más alta posible (ej: segunda en vez de primera) reduce la fuerza o torque en las ruedas, evitando que patinen en el lugar.",
    225: "El agua actúa como un lubricante entre el neumático y el pavimento, reduciendo drásticamente el roce o adherencia, lo que alarga la distancia necesaria para frenar.",
    226: "Además de usar luces bajas, debes aumentar considerablemente tu distancia de seguridad con el vehículo de adelante, ya que tendrás menos tiempo para reaccionar si frena.",
    227: "Debes levantar el pie del acelerador y disminuir tu velocidad para volver a generar y mantener una distancia de seguridad prudente con ese nuevo vehículo.",
    228: "Conduciendo a muy baja velocidad, en la marcha más alta posible para no patinar, y utilizando el freno de motor en lugar de frenar bruscamente con el pedal.",
    229: "En vías interurbanas, los focos delanteros (luces bajas o altas) deben ir siempre encendidos de día y de noche. Solo podrías apagarlos si el vehículo está legalmente estacionado.",
    230: "Debes reducir la velocidad a un mínimo ANTES de entrar a la curva, utilizando el motor para frenar, y evitar tocar el pedal del freno mientras giras el volante.",
    232: "Si vas cerca de otros vehículos (ya sea detrás de ellos o vienen en contra), debes mantener encendidas las luces BAJAS para no encandilar a sus conductores.",
    233: "La neblina reduce drásticamente tu visibilidad frontal. Al ir más lento, reduces tu distancia de detención, dándote tiempo para frenar ante un obstáculo que aparezca de golpe.",
    234: "Lo primero es encender inmediatamente las luces intermitentes de advertencia de peligro (gatos) y, si es posible, mover el vehículo hacia la berma derecha.",
    235: "Al ver la advertencia, debes comenzar a señalizar y cambiarte a la pista que está libre lo antes posible, sin esperar llegar al punto exacto del cierre o 'embudo'.",
    236: "Si tu pista está obstruida, el vehículo que viene en sentido contrario (por su pista libre) tiene la prioridad. Debes detenerte y cederle el paso antes de esquivar el obstáculo.",
    238: "Es obligación legal que la carga esté firmemente estibada y asegurada, y que no sobrepase los límites del vehículo ni obstruya la visión del conductor.",
    239: "Debes soltar suavemente el acelerador para que el conjunto reduzca su velocidad paulatinamente. NO debes frenar de golpe, ya que la casa rodante podría 'tijerear' tu auto.",
    240: "El peso debe distribuirse uniformemente, asegurándose de que los objetos más pesados queden lo más bajo posible y centrados sobre el eje del remolque para mantener la estabilidad.",
    241: "Debes aumentar TU distancia de seguridad con el auto que va delante tuyo. Así, si necesitas frenar, podrás hacerlo de forma suave, dándole tiempo al que te sigue para reaccionar.",
    242: "El Libro del Conductor enseña a diferenciar las señales: Reglamentarias (rojas/blancas), de Advertencia (amarillas) y de Información (azules/verdes).",
    243: "Vas circulando por la pista izquierda. En Chile, las tachas rojas indican el borde izquierdo (que no debe cruzarse) y las blancas separan pistas que van en el mismo sentido.",
    244: "Esa es una señal de Advertencia de Peligro. Su forma de rombo amarillo te alerta de que más adelante hay una condición en la vía que requiere reducir la velocidad.",
    245: "Las señales con borde rojo son Reglamentarias. Si es un 'Ceda el Paso', te indica que debes disminuir la velocidad y ceder la preferencia a los vehículos de la otra vía.",
    246: "Las franjas amarillas diagonales (zona de no bloquear cruce) indican que solo puedes ingresar al cruce si hay espacio suficiente al otro lado para salir de él sin quedar detenido al medio.",
    247: "Es una señal Reglamentaria que indica una obligación o restricción que debes cumplir estrictamente bajo pena de infracción (ej. Pare, Velocidad Máxima, No Virar).",
    248: "La forma y color revelan su propósito. El rojo indica prohibición u obligación, mientras que el amarillo indica advertencia de peligro.",
    249: "Las señales Reglamentarias de Prohibición, que se caracterizan por ser un círculo con borde rojo, fondo blanco y una línea diagonal roja cruzando el símbolo negro.",
    251: "Señal de Advertencia (amarilla) que suele indicar proximidad de peatones, ciclistas, curvas, o animales en la vía.",
    252: "Un semáforo en rojo te obliga a detenerte completamente ANTES de la línea de detención o del paso de cebra, sin invadir la intersección.",
    253: "Las señales amarillas con forma de rombo son Señales de Advertencia de Peligro. Te avisan con antelación sobre riesgos permanentes o temporales en la ruta.",
    254: "El amarillo indica que debes prepararte para detenerte. Solo puedes continuar si estás tan cerca del cruce que detenerte bruscamente podría causar un accidente por alcance.",
    255: "Las señales informativas (generalmente de color azul, verde o café) sirven para orientar al conductor sobre destinos, rutas, servicios o atractivos turísticos.",
    256: "Señal reglamentaria. Ignorar este tipo de señales constituye una falta grave o gravísima a la Ley de Tránsito.",
    258: "Identifica siempre la forma: Rombo amarillo es advertencia; Círculo rojo es prohibición/obligación; Rectángulo azul o verde es información.",
    260: "Señales como 'Curva Peligrosa', 'Pavimento Resbaladizo', o 'Cruce de Escolares' son clásicos rombos amarillos de advertencia.",
    261: "Después del amarillo, la luz que sigue en la secuencia estándar del semáforo es siempre la luz ROJA.",
    262: "Una línea de centro continua significa que está estrictamente prohibido cruzarla para adelantar o virar. Una línea segmentada permite el cruce si es seguro.",
    263: "Es totalmente incorrecto. Una zona achurada (líneas diagonales pintadas en el suelo) es una 'isla de canalización' sobre la cual está prohibido circular o detenerse.",
    264: "Las flechas en el pavimento indican la dirección obligatoria. Si estás en una pista con flecha de viraje exclusivo, debes virar y no puedes seguir derecho.",
    265: "Las señales de velocidad máxima en Chile (círculo rojo con números negros) indican el límite LEGAL máximo absoluto, no una recomendación.",
    266: "La luz verde te autoriza a ingresar al cruce, pero ÚNICAMENTE si tienes espacio libre al otro lado de la intersección para no quedar bloqueando el paso.",
    267: "No deberías detenerte ante luz amarilla solo si te encuentras ya dentro del cruce o tan cerca de él que una frenada repentina provocaría un accidente inminente por detrás.",
    268: "Debes aplicar presión directa y firme sobre la herida con un paño limpio para detener la hemorragia, y si es posible, mantener la pierna en alto.",
    269: "El acompañante debe tener licencia de conducir Clase B vigente por al menos 5 años ininterrumpidos y estar siempre en el asiento delantero junto al menor.",
    270: "Sí, es obligatorio. Todo accidente con lesionados (por muy leves que sean) o fallecidos debe ser denunciado de inmediato a Carabineros de Chile.",
    272: "Si eres el primero, debes detenerte, encender tus luces de emergencia (gatos), instalar los triángulos reflectantes para evitar un segundo accidente y llamar al 131/133.",
    273: "Asegura el área para no provocar más choques y llama inmediatamente al 131 (SAMU). No muevas a los heridos graves a menos que haya un riesgo inminente de incendio o explosión.",
    274: "Debes mantenerte alejado del camión, identificar a distancia si tiene rombos o paneles de seguridad (colores y números), y entregar esa información exacta a Carabineros y Bomberos.",
    275: "Es fundamental asegurarte de que al motociclista NO se le retire el casco bajo ninguna circunstancia, y debes abrigarlo para controlar el estado de shock.",
    276: "Debes buscar un lugar seguro para estacionar (fuera de la pista), encender luces de emergencia e intentar dar aviso a la policía o autopista. No arriesgues tu vida caminando en la vía.",
    277: "El Seguro Obligatorio (SOAP) cubre por lesiones o muerte al conductor, a las personas transportadas en el vehículo asegurado y a cualquier tercero (peatón o ciclista) involucrado.",
    278: "No estás obligado a llevar el Manual del Fabricante. Sin embargo, sí es obligatorio portar Licencia, Permiso de Circulación, Revisión Técnica y Padrón.",
    279: "Pasar un semáforo en rojo, no respetar un signo PARE o conducir bajo efectos del alcohol son infracciones Gravísimas que implican la suspensión inmediata de la licencia.",
    280: "Recuerda que ante accidentes o infracciones, la responsabilidad siempre recaerá sobre el conductor por no estar atento a las condiciones del tránsito."
}

updated_count = 0
for q in questions:
    if q['id'] in feedback_dict:
        q['feedback'] = feedback_dict[q['id']]
        updated_count += 1

with open(data_path, 'w', encoding='utf-8') as f:
    json.dump(questions, f, ensure_ascii=False, indent=2)

print(f"Inyectados {updated_count} feedbacks de prueba del lote 219-280.")
