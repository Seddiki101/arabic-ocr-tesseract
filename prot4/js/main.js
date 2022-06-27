document.addEventListener('DOMContentLoaded', () => {
  var inputText=document.getElementById('inputText');
  var clearTextBtn=document.getElementById('clearTextBtn');

  clearTextBtn.addEventListener('click', (evt)=> {
    if (confirm('⚠ 𝗡𝗼𝘁𝗶𝗰𝗲\n\n⯈ You are about to permanently remove all content present within the text field.\n')) {
      inputText.value='';
    }
  }, false);

  

  var popoverTargets = document.querySelectorAll('[data-content]');

  Array.from(popoverTargets).map(
    popTarget => new BSN.Popover(popTarget, {
      placement: 'right',
      animation: 'show',
      delay: 100,
      dismissible: true,
      trigger: 'click'
    })
  );

  function getCurrentDatetimeStamp() {
    const d = new Date();
    var datestamp=d.getFullYear()+''+(d.getMonth()+1)+''+d.getDate();
    var timestamp=d.getHours()+''+d.getMinutes()+''+d.getSeconds();

    var datetimeStr=datestamp+'_'+timestamp;
    return datetimeStr;
  }

  var downloadTextContent=document.getElementById('downloadTextContent');

  downloadTextContent.addEventListener('click', (evt) => {
    if (!window.Blob) {
      alert('Your browser does not support HTML5 "Blob" function required to save a file.');
    } else {
      let textblob = new Blob([inputText.value], {
          type: 'application/plaintext'
      });
      let dwnlnk = document.createElement('a');
      dwnlnk.download = 'extractedTextContent_'+getCurrentDatetimeStamp()+'.txt';
      if (window.webkitURL != null) {
          dwnlnk.href = window.webkitURL.createObjectURL(textblob);
      }
      dwnlnk.click();
    }
  }, false);

  const tesseractWorkerPath='js/tesseract/worker.min.js';
  const tesseractLangPath='js/tesseract/lang-data/4.0.0_best';
  const tesseractCorePath='js/tesseract/tesseract-core.wasm.js';

  function readFileAsDataURL(file) {
    return new Promise((resolve,reject) => {
        let fileredr = new FileReader();
        fileredr.onload = () => resolve(fileredr.result);
        fileredr.onerror = () => reject(fileredr);
        fileredr.readAsDataURL(file);
    });
  }

  var pageLoadingSignal=document.getElementById('pageLoadingSignal');
  var pagePreview=document.getElementById('page-preview');
  var ocrPageProgress=document.getElementById('ocrPageProgress');
  var ocrPageProgressStatus=document.getElementById('ocrPageProgressStatus');
  
  var processedPages=document.getElementById('processedPages');
  var currentPageNo=document.getElementById('currentPageNo');
  var totalPages=document.getElementById('totalPages');

  var _PDF_DOC,
      _PAGE,
      _ZOOM_FACTOR = 1,
      currentPage = 1,
      noOfPages,
      _CANVAS=document.createElement('canvas');

  var uploadPDFBtn=document.getElementById('uploadPDFBtn');
  var uploadPDF=document.getElementById('uploadPDF');
  uploadPDFBtn.addEventListener('click', () => {
    uploadPDF.click();
  });

  uploadPDF.addEventListener('change', function(evt) {
      let file = evt.currentTarget.files[0];
      if(!file) return;
      readFileAsDataURL(file).then((b64str) => {
        showPDF(b64str);
      }, false);
  });

  async function showPage(pageNo) {
      currentPage = pageNo;
      currentPageNo.innerHTML = pageNo;
      try {
          _PAGE = await _PDF_DOC.getPage(pageNo);
      } catch(error) {
          console.log(error.message);
      }
      return new Promise((resolve => resolve(_PAGE)));
  }
  
  var pdfWorker;
  async function initPdfTesseractWorker() {
    pdfWorker = Tesseract.createWorker({
        workerPath: tesseractWorkerPath,
        langPath:  tesseractLangPath,
        corePath: tesseractCorePath,
        logger: msg => {
          console.log(msg);
          if(msg.status=='recognizing text') {
            ocrPageProgress['style']['width']=`${parseInt(parseFloat(msg.progress)*100)}%`;
            ocrPageProgressStatus.innerHTML=`<p class='mb-1 mt-1'>⏳ <strong>${parseInt(parseFloat(msg.progress)*100)}%</strong></p>`;
          }
        }
    });
    Tesseract.setLogging(true);

    await pdfWorker.load();
    await pdfWorker.loadLanguage('ara');
    await pdfWorker.initialize('ara');

    return new Promise((resolve) => resolve('worker initialised.'));
  }

  const loadImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
  });

  async function extractPdfText(loadedImg) {
    const result=await pdfWorker.recognize(loadedImg);
    // console.log(result);

    let data=result.data;

    let words=data.words;
    let combinedText='';
    for(let w of words) {
      let str=(w.text);
      let newStr = ( str.length>1 && str.charAt(str.length-1)=='-' ) ? str.substr(0,str.length-1) : (str+' ');
      combinedText+=newStr;
    }
    inputText.insertAdjacentText('beforeend', (' ' + combinedText));
    ocrPageProgress['style']['width']='100%';
    ocrPageProgress.classList.remove('progress-bar-animated');
    ocrPageProgressStatus.innerHTML=`<p class='mb-1 mt-1'>⌛ <strong>Done.</strong></p>`;

    return new Promise((resolve) => resolve('extraction done.'));
  }

  async function showPDF(pdf_url) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/pdf/pdf.worker.min.js';
    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
    } catch(error) {
        console.log(error.message);
    }
    noOfPages = _PDF_DOC.numPages;
    totalPages.innerHTML = noOfPages;

    while(currentPage<=noOfPages) {
      await initPdfTesseractWorker();

      pageLoadingSignal['style']['visibility']='visible';
      currentPageNo.innerHTML=currentPage;

      _PAGE=await showPage(currentPage);
      let b64str=await scalePDFPage();
      pagePreview['style']['background-image']='url("'+b64str+'")';

      let loadedImg = await loadImage(b64str);
      await extractPdfText(loadedImg);
      processedPages.insertAdjacentHTML('beforeend', "<p class='mb-1 mt-1'>🗹 <a href='"+b64str+"' download='"+currentPage+".png'>Page "+currentPage+"</a>— ⌛ <strong>Done.</strong></p>");

      await pdfWorker.terminate();

      currentPage++;
    } // end-while loop

    pageLoadingSignal['style']['visibility']='hidden';
  }
  
  const pixelRatio=window.devicePixelRatio*2;
  async function scalePDFPage() {
      let pdfOriginalWidth = _PAGE.getViewport(_ZOOM_FACTOR).width;
      let viewport = _PAGE.getViewport(_ZOOM_FACTOR);
      let viewpointHeight=viewport.height;

      _CANVAS.width=pdfOriginalWidth*pixelRatio;
      _CANVAS.height=viewpointHeight*pixelRatio;

      _CANVAS['style']['width'] = `${pdfOriginalWidth}px`;
      _CANVAS['style']['height'] = `${viewpointHeight}px`;

      _CANVAS.getContext('2d').scale(pixelRatio, pixelRatio);

      var renderContext = {
          canvasContext: _CANVAS.getContext('2d'),
          viewport: viewport
      };
      try {
          await _PAGE.render(renderContext);
      } catch(error) {
          alert(error.message);
      }
      return new Promise((resolve => resolve(_CANVAS.toDataURL())));
  }

  var imgPreview=document.getElementById('img-preview');
  var ocrImgProgress=document.getElementById('ocrImgProgress');
  var ocrImgProgressStatus=document.getElementById('ocrImgProgressStatus');

  var uploadImgBtn=document.getElementById('uploadImgBtn');
  var uploadImg=document.getElementById('uploadImg');
  uploadImgBtn.addEventListener('click', () => {
    uploadImg.click();
  });

  var imgWorker;
  async function initTesseractImgWorker() {
    imgWorker = Tesseract.createWorker({
        workerPath: tesseractWorkerPath,
        langPath:  tesseractLangPath,
        corePath: tesseractCorePath,
        logger: msg => {
          console.log(msg);
          if(msg.status=='recognizing text') {
            ocrImgProgress['style']['width']=`${parseInt(parseFloat(msg.progress)*100)}%`;
            ocrImgProgressStatus.innerHTML=`<p class='mb-1 mt-1'>⏳ <strong>${parseInt(parseFloat(msg.progress)*100)}%</strong></p>`;
          }
        }
    });
    Tesseract.setLogging(true);

    await imgWorker.load();
    await imgWorker.loadLanguage('ara');
    await imgWorker.initialize('ara');

    return new Promise((resolve) => resolve('worker initialised.'));
  }

  uploadImg.addEventListener('change', (ev) => {
    let file = ev.currentTarget.files[0];
    if(!file) return;

    (async () => {
        await initTesseractImgWorker();

        let b64str=await readFileAsDataURL(file);
        imgPreview['style']['background-image']='url("'+b64str+'")';
        let loadedImg = await loadImage(b64str);

        const result=await imgWorker.recognize(loadedImg);

        let words=result.data.words;
        let combinedText='';
        for(let w of words) {
          let str=(w.text);
          let newStr = ( str.length>1 && str.charAt(str.length-1)=='-' ) ? str.substr(0,str.length-1) : (str+' ');
          combinedText+=newStr;
        }
        inputText.insertAdjacentText('beforeend', (' ' + combinedText));
        await imgWorker.terminate();

        ocrImgProgress['style']['width']='100%';
        ocrImgProgress.classList.remove('progress-bar-animated');
        ocrImgProgressStatus.innerHTML=`<p class='mb-1 mt-1'>⌛ <strong>Done.</strong></p>`;
    })();
  }, false);
});