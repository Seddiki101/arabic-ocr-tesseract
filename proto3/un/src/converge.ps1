#if pdfs we extracting them and ocring all extracted images  dow-> input / upp -> output
$tab0 = Get-ChildItem -Path "..\dow\*.pdf" -Name
$i=0
$j=0;
foreach ($item in $tab0) {$i++}
if($i -gt 0) {
	scr\appi.py | cmd
	$j=1;
}



$tab1 = Get-ChildItem -Path "..\dow\*.png" -Name
$tab2 = @(Get-ChildItem -Path '..\dow\*.jpg' -Name )
$tab3 = @(Get-ChildItem -Path '..\dow\*.jpeg' -Name )
#preprocess aka pdfs
$tab4 = Get-ChildItem -Path "..\pre\*.jpg" -Name

#else we ocring direclty-------------------------
	
foreach ($item in $tab1){
	$item2='..\dow\'+$item
	$path='..\upp\'+"result"
	tesseract -l ara $item2 $path | cmd
		}

foreach ($item in $tab2){
	$item2='..\dow\'+$item
	$path='..\upp\'+"result"
	tesseract -l ara $item2 $path | cmd
		}


foreach ($item in $tab3){
	$item2='..\dow\'+$item
	$path='..\upp\'+"result"
	tesseract -l ara $item2 $path | cmd
		}


foreach ($item in $tab4){
	$item2='..\pre\'+$item
	$path='..\upp\'+$item
	tesseract -l ara $item2 $path | cmd
		}
		
		
		
		
#-------------------------------Joining txt files    !may be ordering problem -> more work for future me 
if($j -eq 1) { Get-Content upp\page*.txt | Set-Content ..\upp\result.txt
Remove-Item ..\upp\page* }
$j=0;