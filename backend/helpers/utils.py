import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

def create_dummy_image():
    image_io = io.BytesIO()
    image = Image.new("RGB", (1, 1), color="white")
    image.save(image_io, format="JPEG")
    image_io.seek(0)

    dummy_image = SimpleUploadedFile("test.jpg", image_io.read(), content_type="image/jpeg")
    return dummy_image