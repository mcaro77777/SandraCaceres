$ErrorActionPreference = 'Stop'

$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$outputPath = Join-Path $projectRoot 'print\output'
$pdfOutputPath = Join-Path $projectRoot 'output\pdf'
$qaPath = Join-Path $projectRoot '.qa'

if (-not (Test-Path -LiteralPath $chromePath)) {
  throw "No se encontró Google Chrome en $chromePath"
}

New-Item -ItemType Directory -Force -Path $outputPath, $pdfOutputPath, $qaPath | Out-Null

function ConvertTo-FileUrl([string] $path) {
  $resolved = [IO.Path]::GetFullPath($path).Replace('\', '/')
  return 'file:///' + $resolved.Replace(' ', '%20')
}

function Invoke-HeadlessChrome([string[]] $arguments) {
  $process = Start-Process -FilePath $chromePath -ArgumentList $arguments -WindowStyle Hidden -Wait -PassThru
  if ($process.ExitCode -ne 0) {
    throw "Chrome finalizó con código $($process.ExitCode)"
  }
}

$frontUrl = ConvertTo-FileUrl (Join-Path $projectRoot 'print\render-front.html')
$backUrl = ConvertTo-FileUrl (Join-Path $projectRoot 'print\render-back.html')
$previewUrl = ConvertTo-FileUrl (Join-Path $projectRoot 'print\preview.html')
$printUrl = ConvertTo-FileUrl (Join-Path $projectRoot 'print\card-print.html')
$ogUrl = ConvertTo-FileUrl (Join-Path $projectRoot 'print\render-og.html')

Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1134,720', "--screenshot=$(Join-Path $outputPath 'tarjeta-sandra-caceres-frente-300dpi.png')", $frontUrl)
Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1134,720', "--screenshot=$(Join-Path $outputPath 'tarjeta-sandra-caceres-reverso-300dpi.png')", $backUrl)
Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1600,1000', "--screenshot=$(Join-Path $outputPath 'tarjeta-sandra-caceres-preview.png')", $previewUrl)
Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630', "--screenshot=$(Join-Path $projectRoot 'assets\og-sandra-caceres.png')", $ogUrl)
Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--no-pdf-header-footer', "--print-to-pdf=$(Join-Path $pdfOutputPath 'tarjeta-sandra-caceres-imprenta.pdf')", $printUrl)

Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1440,1050', "--screenshot=$(Join-Path $qaPath 'landing-desktop.png')", 'http://127.0.0.1:4173/')
Invoke-HeadlessChrome @('--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=500,920', "--screenshot=$(Join-Path $qaPath 'landing-mobile.png')", 'http://127.0.0.1:4173/.qa/mobile-frame.html')

Get-ChildItem -LiteralPath $outputPath, $pdfOutputPath, $qaPath | Select-Object FullName, Length

