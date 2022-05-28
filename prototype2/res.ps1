while(1) {
	
	if(Test-Path image.png -PathType Leaf)
	{
	 Write-Host "The file exists";
	 tesseract -l ara image.png img2 | cmd
	 Start-Sleep -s 10
	Remove-Item image.png
	Remove-Item img2txt.txt
	}

}