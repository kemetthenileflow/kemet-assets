from pathlib import Path
import fitz
from PIL import Image
app=Path(__file__).resolve().parents[1]
pdf=fitz.open(app/'public/pdfs/story/living_lexicon.pdf')
pix=pdf[212].get_pixmap(matrix=fitz.Matrix(1.5,1.5))
Image.frombytes('RGB',[pix.width,pix.height],pix.samples).save(app/'public/cards/living_lexicon/213.webp',quality=92)
print('Restored page 213 directly from the original PDF. Original PDF bytes unchanged.')
