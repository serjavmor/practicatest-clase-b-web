from rembg import remove
from PIL import Image

images = [
    "public/images/kuromi_celebrate_1781483026283.png",
    "public/images/kuromi_instructor_1781483016419.png",
    "public/images/kuromi_sad_1781483036083.png"
]

for img_path in images:
    print(f"Procesando con rembg {img_path}...")
    try:
        input_image = Image.open(img_path)
        output_image = remove(input_image)
        output_image.save(img_path)
        print(f"Hecho: {img_path}")
    except Exception as e:
        print(f"Error procesando {img_path}: {e}")
