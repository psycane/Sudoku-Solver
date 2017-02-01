import pytesseract
from PIL import Image
print(pytesseract.image_to_string(Image.open('sample_text.png')))
print(pytesseract.image_to_string(Image.open('sample_sudoku.jpg'), lang='eng'))