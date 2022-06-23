""" BATCH FILE PROCESSING """

# IMPORTS
import os
import tempfile

from PyPDF2 import PdfFileReader
from tqdm import tqdm
from pdf2image import convert_from_path


# LISTING ALL FILES IN THE SOURCE DIRECTORY
file_list = os.listdir("dwn")
file_count = 0

# PROVIDING THE ABSOLUTE PATH FOR POPPLER
abs_poppler_path = os.path.abspath("scr/_internal/poppler/bin")

# ITTERATING THROUGH THE WHOLE LIST
if not file_list:
#    print("\nNo files found")
    exit()
else:
    for i in file_list:
        file_count += 1
        #print("\nFile", file_count, "out of", len(file_list))
        #print("\nProcessing: ", i)
        abs_pdf_path = os.path.abspath("dwn/"+i)

        # CHECKING PDF
        try:
            with open(abs_pdf_path, "rb") as filehandle:
                pdf = PdfFileReader(filehandle)
                page_count = pdf.getNumPages()
        except:
            #print("\nError in reading", i,)
            #print("Skipping . . .")
            continue

        # CREATING FOLDER
        if not os.path.exists("prep/"+i):
            abs_output_path = os.path.abspath("prep/page")
        else:
            abs_output_path = os.path.abspath("prep/page")
                
        # EXTRACTING THE IMAGES
        page_number = 1
        try:
            with tempfile.TemporaryDirectory() as path:
                pdf_images = convert_from_path(pdf_path=abs_pdf_path, poppler_path=abs_poppler_path, output_folder=path)
                #print("\nTotal number of pages =", len(pdf_images),"\n")
                for page in tqdm(pdf_images):
                    image_name = abs_output_path + str(page_number) + '.jpg'
                    page.save(image_name, 'JPEG')
                    page_number += 1
        except: 
            print("Error in performing the required action")
