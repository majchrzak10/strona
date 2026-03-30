param(
  [string]$SourceDir = "",
  [string]$Branch = "main",
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host "[sync-asari] $Message"
}

try {
  $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
  Set-Location $repoRoot

  if (-not $SourceDir) {
    if ($env:ASARI_LOCAL_EXPORT_DIR) {
      $SourceDir = $env:ASARI_LOCAL_EXPORT_DIR
    } else {
      throw "Podaj -SourceDir lub ustaw ASARI_LOCAL_EXPORT_DIR."
    }
  }

  $resolvedSource = (Resolve-Path $SourceDir).Path
  $targetDir = (Join-Path $repoRoot "asari-export")

  if (-not (Test-Path $resolvedSource)) {
    throw "Nie istnieje katalog zrodlowy: $resolvedSource"
  }

  $offerXml = Get-ChildItem -Path $resolvedSource -Filter "*_001.xml" -File -ErrorAction SilentlyContinue
  if ($offerXml.Count -eq 0) {
    throw "Brak plikow *_001.xml w: $resolvedSource"
  }

  Write-Step "Zrodlo: $resolvedSource"
  Write-Step "Cel: $targetDir"

  if ($resolvedSource -eq $targetDir) {
    throw "SourceDir nie moze byc tym samym katalogiem co asari-export."
  }

  if ($DryRun) {
    Write-Step "Tryb DRY RUN - pomijam kopiowanie i git push."
    return
  }

  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
  }

  # Mirror katalogu Asari do repo (usuwa stare pliki, kopiuje nowe).
  $robocopyArgs = @(
    "`"$resolvedSource`"",
    "`"$targetDir`"",
    "/MIR",
    "/R:1",
    "/W:1",
    "/NFL",
    "/NDL",
    "/NP"
  )

  Write-Step "Kopiuje eksport Asari (robocopy /MIR)..."
  & robocopy @robocopyArgs | Out-Null
  $rc = $LASTEXITCODE
  if ($rc -ge 8) {
    throw "Robocopy zakonczyl sie bledem (kod $rc)."
  }

  Write-Step "Sprawdzam zmiany git..."
  & git add "asari-export"
  $changes = & git status --porcelain "asari-export"
  if (-not $changes) {
    Write-Step "Brak zmian w asari-export - koncze."
    return
  }

  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
  $commitMessage = @"
chore(asari): automatyczna aktualizacja eksportu

Aktualizacja plikow Asari (XML + foto) z lokalnego zrodla z dnia $timestamp.
"@

  Write-Step "Tworzę commit..."
  & git commit -m $commitMessage | Out-Null

  Write-Step "Push na origin/$Branch..."
  & git push origin $Branch

  Write-Step "Gotowe. GitHub Actions powinien uruchomic deploy automatycznie."
} catch {
  Write-Error "[sync-asari] $($_.Exception.Message)"
  exit 1
}
