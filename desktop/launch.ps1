$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$exePath = Join-Path $root 'HakemUygulamasi.exe'
if (-not (Test-Path -LiteralPath $exePath)) {
  Add-Type -AssemblyName System.Windows.Forms
  [System.Windows.Forms.MessageBox]::Show('HakemUygulamasi.exe bulunamadı. Uygulama klasörünü kontrol edin.', 'Hakem Ücret Takibi', 'OK', 'Error') | Out-Null
  exit 1
}
Start-Process -FilePath $exePath -WorkingDirectory $root
