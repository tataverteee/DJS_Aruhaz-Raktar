# DJS_Aruhaz-Raktar - mindent telepit es elindit (BackEnd + FrontEnd)
# Hasznalat: tedd a projekt gyokerebe (ahol a BackEnd es FrontEnd mappa van), majd futtasd a start-all.bat-ot

$ErrorActionPreference = "Continue"
$root = $PSScriptRoot
$backDir = Join-Path $root "BackEnd"
$frontDir = Join-Path $root "FrontEnd"

function Write-Step($msg) { Write-Host "`n=== $msg ===" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host $msg -ForegroundColor Green }
function Write-Warn($msg) { Write-Host $msg -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host $msg -ForegroundColor Red }

# --- 1. Node / npm ellenorzes ---
Write-Step "Node.js ellenorzese"
if (-not (Get-Command node -ErrorAction SilentlyContinue) -or -not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Err "A Node.js nincs telepitve. Toltsd le: https://nodejs.org (LTS verzio), majd futtasd ujra."
    Read-Host "Nyomj Entert a kilepeshez"
    exit 1
}
Write-Ok ("Node " + (node -v) + " / npm " + (npm -v))

if (-not (Test-Path $backDir))  { Write-Err "Nem talalom a BackEnd mappat: $backDir";  Read-Host "Enter"; exit 1 }
if (-not (Test-Path $frontDir)) { Write-Err "Nem talalom a FrontEnd mappat: $frontDir"; Read-Host "Enter"; exit 1 }

# --- 2. BackEnd telepites ---
Write-Step "BackEnd fuggosegek telepitese"
Push-Location $backDir
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Warn "Az npm install hibat adott. Probalom a better-sqlite3 legujabb verziojaval (elore lefordított binaris)..."
    npm install better-sqlite3@latest
    if ($LASTEXITCODE -ne 0) {
        Write-Err "A BackEnd telepites nem sikerult."
        Write-Warn "Valoszinuleg hianyzik a C++ fordito. Visual Studio Installer -> Modify -> 'Desktop development with C++'."
        Write-Warn "Vagy hasznalj Node 20 LTS-t. A FrontEnd ettol meg elindul."
        $backOk = $false
    } else { $backOk = $true }
} else { $backOk = $true }
Pop-Location
if ($backOk) { Write-Ok "BackEnd kesz." }

# --- 3. FrontEnd telepites ---
Write-Step "FrontEnd fuggosegek telepitese"
Push-Location $frontDir
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Err "A FrontEnd telepites nem sikerult."
    $frontOk = $false
} else {
    $frontOk = $true
    # ha a vite valamiert nincs meg, potoljuk
    if (-not (Test-Path (Join-Path $frontDir "node_modules\.bin\vite.cmd"))) {
        Write-Warn "A vite hianyzik, telepitem..."
        npm install -D vite
    }
    Write-Ok "FrontEnd kesz."
}
Pop-Location

# --- 4. Inditoparancs kivalasztasa a package.json alapjan ---
function Get-StartCommand($dir, $preferred) {
    $pkgPath = Join-Path $dir "package.json"
    if (Test-Path $pkgPath) {
        $pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
        foreach ($name in $preferred) {
            if ($pkg.scripts -and $pkg.scripts.PSObject.Properties.Name -contains $name) {
                return "npm run $name"
            }
        }
        if ($pkg.main -and (Test-Path (Join-Path $dir $pkg.main))) { return "node $($pkg.main)" }
    }
    foreach ($f in @("server.js", "index.js", "app.js", "main.js")) {
        if (Test-Path (Join-Path $dir $f)) { return "node $f" }
    }
    return $null
}

function Start-InNewWindow($title, $dir, $cmd) {
    $full = "`$host.UI.RawUI.WindowTitle = '$title'; Set-Location '$dir'; $cmd"
    Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $full
}

# --- 5. Inditas ---
Write-Step "Inditas"
if ($backOk) {
    $backCmd = Get-StartCommand $backDir @("dev", "start", "serve")
    if ($backCmd) {
        Write-Ok "BackEnd indul: $backCmd"
        Start-InNewWindow "BackEnd" $backDir $backCmd
    } else {
        Write-Warn "Nem talaltam BackEnd inditoparancsot (dev/start script vagy server.js)."
    }
} else {
    Write-Warn "BackEnd kihagyva (telepitesi hiba)."
}

if ($frontOk) {
    $frontCmd = Get-StartCommand $frontDir @("dev", "start", "serve")
    if ($frontCmd) {
        Write-Ok "FrontEnd indul: $frontCmd"
        Start-InNewWindow "FrontEnd" $frontDir $frontCmd
        Start-Sleep -Seconds 5
        Start-Process "http://localhost:5173"
    } else {
        Write-Warn "Nem talaltam FrontEnd inditoparancsot."
    }
} else {
    Write-Warn "FrontEnd kihagyva (telepitesi hiba)."
}

Write-Host ""
Write-Ok "Kesz. A szerverek kulon ablakokban futnak, ezeket zarva leallnak."
Read-Host "Nyomj Entert az ablak bezarasahoz"
