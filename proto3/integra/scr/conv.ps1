#if pdfs we extracting them and ocring all extracted images
$tab0 = Get-ChildItem -Path "input\*.pdf" -Name
$i=0
foreach ($item in $tab0) {$i++}
if($i -gt 0) {
	scr\appi.py | cmd
}



$tab1 = Get-ChildItem -Path "input\*.png" -Name
$tab2 = @(Get-ChildItem -Path 'input\*.jpg' -Name )
$tab3 = @(Get-ChildItem -Path 'input\*.jpeg' -Name )
#preprocess aka pdfs
$tab4 = Get-ChildItem -Path "preprocess\*.jpg" -Name

#else we ocring direclty-------------------------
	
foreach ($item in $tab1){
	$item2='input\'+$item
	$path='output\'+$item
	tesseract -l ara $item2 $path | cmd
		}

foreach ($item in $tab2){
	$item2='input\'+$item
	$path='output\'+$item
	tesseract -l ara $item2 $path | cmd
		}


foreach ($item in $tab3){
	$item2='input\'+$item
	$path='output\'+$item
	tesseract -l ara $item2 $path | cmd
		}


foreach ($item in $tab4){
	$item2='preprocess\'+$item
	$path='output\'+$item
	tesseract -l ara $item2 $path | cmd
		}
		
		
		
		
#-------------------------------Joining txt files    !may be ordering problem -> more work for future me 
Get-Content output\page*.txt | Set-Content output\result.txt
Remove-Item output\page*