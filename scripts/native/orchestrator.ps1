# SathiX-OS native Windows service orchestrator (PowerShell 5.1+)
param(
    [ValidateSet('start', 'stop', 'check')]
    [string]$Action = 'start'
)

$ErrorActionPreference = 'Stop'
$Root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path))
Set-Location $Root

$RuntimeDir = Join-Path $Root '.runtime'
$PidDir = Join-Path $RuntimeDir 'pids'
$LogDir = Join-Path $RuntimeDir 'logs'

function Env-Default([string]$Name, [string]$Default) {
    $val = [Environment]::GetEnvironmentVariable($Name)
    if ([string]::IsNullOrWhiteSpace($val)) { return $Default }
    return $val
}

function Ensure-Dirs {
    New-Item -ItemType Directory -Force -Path $PidDir, $LogDir | Out-Null
}

function Test-PortOpen([int]$Port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $client.Connect('127.0.0.1', $Port)
        $client.Close()
        return $true
    } catch {
        return $false
    }
}

function Test-CommandExists([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Load-EnvFile {
    $envFile = Join-Path $Root '.env'
    if (-not (Test-Path $envFile)) {
        Copy-Item (Join-Path $Root '.env.example') $envFile
        Write-Host '[INFO] Created .env from .env.example - review secrets before production.'
    }
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $parts = $_ -split '=', 2
        if ($parts.Count -eq 2) {
            $key = $parts[0].Trim()
            $val = $parts[1].Trim()
            if (-not [string]::IsNullOrWhiteSpace($key)) {
                $existing = [Environment]::GetEnvironmentVariable($key)
                if ([string]::IsNullOrWhiteSpace($existing)) {
                    [Environment]::SetEnvironmentVariable($key, $val, 'Process')
                }
            }
        }
    }
}

function Get-ServiceDefinitions {
    $python = $null
    if (Test-CommandExists 'python') { $python = 'python' }
    elseif (Test-CommandExists 'py') { $python = 'py -3' }

    $modelDir = Env-Default 'VOICE_MODEL_DIR' (Join-Path $Root 'runtime-models')
    $sttModel = Join-Path $modelDir 'faster-whisper-small'
    $ttsModel = Join-Path $modelDir 'piper-en-us-lessac.onnx'
    $hasVoiceModels = (Test-Path $sttModel) -and (Test-Path $ttsModel)

    $ragPort = Env-Default 'RAG_PORT' '3001'
    $langMlPort = Env-Default 'LANGUAGE_ML_PORT' '8001'
    $langPort = Env-Default 'LANGUAGE_PORT' '4001'
    $backendPort = Env-Default 'BACKEND_PORT' '5000'
    $whatsappPort = Env-Default 'WHATSAPP_PORT' '4003'
    $adminPort = Env-Default 'ADMIN_PANEL_PORT' '3100'
    $userPort = Env-Default 'USER_PANEL_PORT' '3000'
    $sttPort = Env-Default 'STT_PORT' '8002'
    $ttsPort = Env-Default 'TTS_PORT' '8003'
    $voicePort = Env-Default 'VOICE_PORT' '4002'
    $backendUrl = Env-Default 'NEXT_PUBLIC_BACKEND_URL' 'http://localhost:5000'
    $viteBackendUrl = Env-Default 'VITE_BACKEND_URL' 'http://localhost:5000'

    $services = @(
        @{ Name = 'rag-service'; Port = [int]$ragPort; HealthPath = '/rag/health'; Cwd = 'rag-service'; Command = 'npm start'; Required = $true },
        @{ Name = 'language-engine-ml'; Port = [int]$langMlPort; HealthPath = '/health'; Cwd = 'language-engine/python'; Command = if ($python) { "$python -m uvicorn main:app --host 0.0.0.0 --port $langMlPort" } else { $null }; Required = $false },
        @{ Name = 'language-engine'; Port = [int]$langPort; HealthPath = '/health'; Cwd = 'language-engine'; Command = 'npm start'; Required = $true },
        @{ Name = 'backend'; Port = [int]$backendPort; HealthPath = '/health'; Cwd = 'backend'; Command = 'npm start'; Required = $true; After = @('rag-service', 'language-engine') },
        @{ Name = 'scraper-worker'; Port = 0; HealthPath = $null; Cwd = 'scraper-engine'; Command = 'npm run worker'; Required = $false },
        @{ Name = 'whatsapp-service'; Port = [int]$whatsappPort; HealthPath = '/health'; Cwd = 'whatsapp-service'; Command = 'npm start'; Required = $false },
        @{ Name = 'admin-panel'; Port = [int]$adminPort; HealthPath = '/'; Cwd = 'admin-panel'; Command = "npx next dev -p $adminPort"; Required = $false; Env = @{ NEXT_PUBLIC_BACKEND_URL = $backendUrl } },
        @{ Name = 'user-panel'; Port = [int]$userPort; HealthPath = '/'; Cwd = 'user-panel'; Command = 'npm run dev'; Required = $false; Env = @{ VITE_BACKEND_URL = $viteBackendUrl } }
    )

    if ($hasVoiceModels) {
        $voiceServices = @(
            @{ Name = 'stt-inference'; Port = [int]$sttPort; HealthPath = '/health'; Cwd = 'voice-service/python/stt'; Command = if ($python) { "$python -m uvicorn main:app --host 0.0.0.0 --port $sttPort" } else { $null }; Required = $false; Env = @{ STT_MODEL_PATH = $sttModel; STT_DEVICE = (Env-Default 'STT_DEVICE' 'cpu'); STT_COMPUTE_TYPE = (Env-Default 'STT_COMPUTE_TYPE' 'int8') } },
            @{ Name = 'tts-inference'; Port = [int]$ttsPort; HealthPath = '/health'; Cwd = 'voice-service/python/tts'; Command = if ($python) { "$python -m uvicorn main:app --host 0.0.0.0 --port $ttsPort" } else { $null }; Required = $false; Env = @{ TTS_MODEL_PATH = $ttsModel; TTS_DEVICE = (Env-Default 'TTS_DEVICE' 'cpu') } },
            @{ Name = 'voice-service'; Port = [int]$voicePort; HealthPath = '/health'; Cwd = 'voice-service'; Command = 'npm start'; Required = $false; After = @('stt-inference', 'tts-inference', 'language-engine', 'backend'); Env = @{ STT_INFERENCE_URL = "http://127.0.0.1:$sttPort"; TTS_INFERENCE_URL = "http://127.0.0.1:$ttsPort"; STT_MODEL_PATH = $sttModel; TTS_MODEL_PATH = $ttsModel } }
        )
        $services = $services[0..2] + $voiceServices + $services[3..($services.Count - 1)]
    } else {
        Write-Host '[INFO] Voice models not found - skipping STT/TTS/Voice services. Run: npm run models:voice'
    }

    return $services
}

function Install-Dependencies {
    $nodeProjects = @('backend', 'rag-service', 'scraper-engine', 'language-engine', 'voice-service', 'whatsapp-service', 'admin-panel', 'user-panel')
    foreach ($proj in $nodeProjects) {
        $dir = Join-Path $Root $proj
        if (-not (Test-Path (Join-Path $dir 'node_modules'))) {
            Write-Host "[INFO] Installing npm dependencies for $proj..."
            Push-Location $dir
            npm install --no-fund --no-audit 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) { throw "npm install failed for $proj" }
            Pop-Location
        }
    }
}

function Invoke-Migrations {
    Write-Host '[INFO] Running database migrations...'
    Push-Location (Join-Path $Root 'backend')
    npx knex migrate:latest 2>&1 | Out-Host
    Pop-Location
}

function Start-ServiceProcess($svc) {
    $pidFile = Join-Path $PidDir "$($svc.Name).pid"
    if (Test-Path $pidFile) {
        $existing = Get-Content $pidFile -ErrorAction SilentlyContinue
        if ($existing -and (Get-Process -Id $existing -ErrorAction SilentlyContinue)) {
            Write-Host "[SKIP] $($svc.Name) already running (PID $existing)"
            return $true
        }
    }

    if (-not $svc.Command) {
        Write-Host "[WARN] $($svc.Name) - no start command (missing prerequisite)"
        return (-not $svc.Required)
    }

    $cwd = Join-Path $Root $svc.Cwd
    $logFile = Join-Path $LogDir "$($svc.Name).log"
    if ($svc.Env) {
        foreach ($k in $svc.Env.Keys) { [Environment]::SetEnvironmentVariable($k, $svc.Env[$k], 'Process') }
    }

    $proc = Start-Process -FilePath 'cmd.exe' -ArgumentList '/c', $svc.Command -WorkingDirectory $cwd -WindowStyle Hidden -RedirectStandardOutput $logFile -RedirectStandardError $logFile -PassThru
    $proc.Id | Out-File -FilePath $pidFile -Encoding ascii
    Write-Host "[START] $($svc.Name) PID $($proc.Id) - log: $logFile"
    return $true
}

function Wait-ForHealth($svc, [int]$TimeoutSec) {
    if (-not $svc.Port -or -not $svc.HealthPath) { return $true }
    $url = "http://127.0.0.1:$($svc.Port)$($svc.HealthPath)"
    for ($i = 0; $i -lt $TimeoutSec; $i++) {
        try {
            $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return $true }
        } catch { Start-Sleep -Seconds 1 }
    }
    return $false
}

function Start-All {
    Ensure-Dirs
    Load-EnvFile

    if (-not (Test-CommandExists 'node')) { throw 'Node.js 18+ is required. Install from https://nodejs.org/' }
    if (-not (Test-CommandExists 'npm')) { throw 'npm is required.' }

    $pgPort = [int](Env-Default 'POSTGRES_PORT' '5432')
    $redisPort = [int](Env-Default 'REDIS_PORT' '6379')
    $qdrantPort = [int](Env-Default 'QDRANT_PORT' '6333')

    Write-Host ''
    Write-Host '=== SathiX-OS Native Local Startup ==='
    Write-Host ''

    $infra = @(
        @{ Name = 'PostgreSQL'; Port = $pgPort; Required = $true },
        @{ Name = 'Redis'; Port = $redisPort; Required = $true },
        @{ Name = 'Qdrant'; Port = $qdrantPort; Required = $true }
    )
    foreach ($item in $infra) {
        if (Test-PortOpen $item.Port) {
            Write-Host "[OK] $($item.Name) reachable on port $($item.Port)"
        } elseif ($item.Required) {
            throw "$($item.Name) not reachable on port $($item.Port). Start PostgreSQL, Redis, and Qdrant before running start-all.bat."
        } else {
            Write-Host "[WARN] $($item.Name) not reachable on port $($item.Port)"
        }
    }

    Install-Dependencies
    Invoke-Migrations

    $services = Get-ServiceDefinitions

    foreach ($svc in $services) {
        if ($svc.After) {
            foreach ($dep in $svc.After) {
                $depSvc = $services | Where-Object { $_.Name -eq $dep } | Select-Object -First 1
                if ($depSvc) { Wait-ForHealth $depSvc 30 | Out-Null }
            }
        }
        Start-ServiceProcess $svc | Out-Null
        if ($svc.Port -gt 0) {
            $ok = Wait-ForHealth $svc 45
            if ($ok) { Write-Host "[READY] $($svc.Name) on port $($svc.Port)" }
            elseif ($svc.Required) { Write-Host "[FAIL] $($svc.Name) did not become healthy - check $(Join-Path $LogDir "$($svc.Name).log")" }
            else { Write-Host "[WARN] $($svc.Name) not yet healthy (optional service)" }
        }
    }

    Write-Host ''
    Write-Host '=== Service URLs ==='
    Write-Host "  Backend:       http://localhost:$(Env-Default 'BACKEND_PORT' '5000')"
    Write-Host "  RAG:           http://localhost:$(Env-Default 'RAG_PORT' '3001')"
    Write-Host "  Language:      http://localhost:$(Env-Default 'LANGUAGE_PORT' '4001')"
    Write-Host "  Voice:         http://localhost:$(Env-Default 'VOICE_PORT' '4002')"
    Write-Host "  WhatsApp:      http://localhost:$(Env-Default 'WHATSAPP_PORT' '4003')"
    Write-Host "  Admin Panel:   http://localhost:$(Env-Default 'ADMIN_PANEL_PORT' '3100')"
    Write-Host "  User Panel:    http://localhost:$(Env-Default 'USER_PANEL_PORT' '3000')"
    Write-Host ''
    Write-Host "Logs: $LogDir"
    Write-Host 'Run check-services.bat to verify health.'
}

function Stop-All {
    Ensure-Dirs
    if (-not (Test-Path $PidDir)) {
        Write-Host 'No PID directory found - nothing to stop.'
        return
    }
    $stopped = 0
    Get-ChildItem $PidDir -Filter '*.pid' | ForEach-Object {
        $name = $_.BaseName
        $procId = Get-Content $_.FullName -ErrorAction SilentlyContinue
        if ($procId -match '^\d+$') {
            $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
            if ($proc) {
                Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
                Write-Host "[STOP] $name (PID $procId)"
                $stopped++
            }
        }
        Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
    }
    Write-Host "Stopped $stopped SathiX-OS process(es)."
}

function Check-All {
    Load-EnvFile
    $checks = @(
        @{ Name = 'Backend'; Port = [int](Env-Default 'BACKEND_PORT' '5000'); Path = '/health' },
        @{ Name = 'Backend Ready'; Port = [int](Env-Default 'BACKEND_PORT' '5000'); Path = '/api/ready' },
        @{ Name = 'RAG'; Port = [int](Env-Default 'RAG_PORT' '3001'); Path = '/rag/health' },
        @{ Name = 'Language Engine'; Port = [int](Env-Default 'LANGUAGE_PORT' '4001'); Path = '/health' },
        @{ Name = 'Language ML'; Port = [int](Env-Default 'LANGUAGE_ML_PORT' '8001'); Path = '/health' },
        @{ Name = 'Voice'; Port = [int](Env-Default 'VOICE_PORT' '4002'); Path = '/health' },
        @{ Name = 'STT Inference'; Port = [int](Env-Default 'STT_PORT' '8002'); Path = '/health' },
        @{ Name = 'TTS Inference'; Port = [int](Env-Default 'TTS_PORT' '8003'); Path = '/health' },
        @{ Name = 'WhatsApp'; Port = [int](Env-Default 'WHATSAPP_PORT' '4003'); Path = '/health' },
        @{ Name = 'Admin Panel'; Port = [int](Env-Default 'ADMIN_PANEL_PORT' '3100'); Path = '/' },
        @{ Name = 'User Panel'; Port = [int](Env-Default 'USER_PANEL_PORT' '3000'); Path = '/' },
        @{ Name = 'PostgreSQL'; Port = [int](Env-Default 'POSTGRES_PORT' '5432'); Path = $null },
        @{ Name = 'Redis'; Port = [int](Env-Default 'REDIS_PORT' '6379'); Path = $null },
        @{ Name = 'Qdrant'; Port = [int](Env-Default 'QDRANT_PORT' '6333'); Path = $null }
    )

    Write-Host ''
    Write-Host 'SERVICE                  STATUS   PORT   URL'
    Write-Host '----------------------------------------------------------------'

    foreach ($c in $checks) {
        $url = if ($c.Path) { "http://localhost:$($c.Port)$($c.Path)" } else { "localhost:$($c.Port)" }
        $err = ''
        if ($c.Path) {
            try {
                $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 3
                $status = if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { 'UP' } else { 'DOWN' }
            } catch {
                $status = 'DOWN'
                $err = $_.Exception.Message
            }
        } else {
            $status = if (Test-PortOpen $c.Port) { 'UP' } else { 'DOWN' }
            if ($status -eq 'DOWN') { $err = 'port closed' }
        }
        $line = '{0,-24} {1,-8} {2,-6} {3}' -f $c.Name, $status, $c.Port, $url
        if ($err) { $line += "  ($err)" }
        Write-Host $line
    }
    Write-Host ''
}

switch ($Action) {
    'start' { Start-All }
    'stop'  { Stop-All }
    'check' { Check-All }
}
