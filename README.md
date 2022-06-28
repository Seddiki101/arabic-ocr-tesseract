# arabic-ocr-tesseract
simple arabic char recognition


prototype1: \
uses light version of tesseract based on vanilla javascript.\
#Doesn t need anything to run (any basic web browser)


prototype2:\
uses the full fledged version on a windows pc posing as a server  \
receives user uploaded images \
has powershell script that detects images and converts them to text files\
after the process is finished the user will get a downloadable file containing the results \
#Needs tesseract and the powershell script needs to be active before commencing


prototype3: \
basically prototype 2 but also works with pdfs \
uses python script "pdfimg"


prototype4 : \ 
Mainly javascript , uses tesseract.js and pdfmin.js \
input files can be images or pdfs\
*pdfs are segmented to pages interpreted as images on a canvas and then same work as image text extraction.

