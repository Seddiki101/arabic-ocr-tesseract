import os
import tempfile

from PyPDF2 import PdfFileReader
from tqdm import tqdm
from pdf2image import convert_from_path



#-----------------------Global variables
state = 0

#-----------------------Functions


def segmnt():       # 1.Get file names from directory
    global state
    file_list = os.listdir("input")
    file_count = 0
    abs_poppler_path = os.path.abspath("scr/_internal/poppler/bin")
    if not file_list:
        return 0
    else:
        state = 1
        for i in file_list:
            file_count += 1
            abs_pdf_path = os.path.abspath("input/"+i)
            try:
                with open(abs_pdf_path, "rb") as filehandle:
                    pdf = PdfFileReader(filehandle)
                    page_count = pdf.getNumPages()
            except:
                continue
            if not os.path.exists("preprocess/"+i):
                abs_output_path = os.path.abspath("preprocess/page")
            else:
                abs_output_path = os.path.abspath("preprocess/page")
            page_number = 1
            try:
                with tempfile.TemporaryDirectory() as path:
                    pdf_images = convert_from_path(pdf_path=abs_pdf_path, poppler_path=abs_poppler_path, output_folder=path)
                    for page in tqdm(pdf_images):
                        image_name = abs_output_path + str(page_number) + '.jpg'
                        page.save(image_name, 'JPEG')
                        page_number += 1
            except: 
                print("Error in performing the required action")
        
    
    
    
    
    
    

#-----------------------main
segmnt()


