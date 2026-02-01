$JavaPath = "C:\Program Files\Android\Android Studio\jbr"
$SdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$PlatformTools = "$SdkPath\platform-tools"

# 1. Set JAVA_HOME
if (Test-Path $JavaPath) {
    Write-Host "Found Java at $JavaPath"
    [System.Environment]::SetEnvironmentVariable("JAVA_HOME", $JavaPath, "User")
    $env:JAVA_HOME = $JavaPath
} else {
    Write-Error "Could not find Java in default Android Studio location. Please install OpenJDK 17."
}

# 2. Add Platform Tools to PATH
$CurrentPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
if ($CurrentPath -notlike "*$PlatformTools*") {
    Write-Host "Adding platform-tools to PATH..."
    $NewPath = "$CurrentPath;$PlatformTools"
    [System.Environment]::SetEnvironmentVariable("Path", $NewPath, "User")
    $env:Path = "$env:Path;$PlatformTools"
} else {
    Write-Host "platform-tools already in PATH."
}

# 3. Check for Emulators
Write-Host "Checking for connected devices..."
& "$PlatformTools\adb" devices

Write-Host "---"
Write-Host "Environment fixed! Please RESTART your terminal/VS Code and try 'npm run android' again."
Write-Host "If no device is listed above, please start the Android Emulator via Android Studio Device Manager."
