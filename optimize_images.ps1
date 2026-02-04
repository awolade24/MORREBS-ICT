Add-Type -AssemblyName System.Drawing

$extensions = @("*.jpg", "*.jpeg", "*.png", "*.webp")
$quality = 75
$maxWidth = 1920

function Optimize-Image {
    param (
        [string]$Path
    )

    try {
        $image = [System.Drawing.Image]::FromFile($Path)
        
        # Check if resize is needed
        if ($image.Width -gt $maxWidth) {
            $newHeight = [int]($image.Height * ($maxWidth / $image.Width))
            $newImage = new-object System.Drawing.Bitmap $maxWidth, $newHeight
            $graphics = [System.Drawing.Graphics]::FromImage($newImage)
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage($image, 0, 0, $maxWidth, $newHeight)
            $image.Dispose()
            $image = $newImage
        }

        # Encoder parameters for compression
        $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatID -eq $image.RawFormat.Guid }
        if (-not $codec) {
             # Default to JPEG if format not found (e.g. for webp if not supported by System.Drawing directly, though it might fail. 
             # System.Drawing might not support WebP read/write depending on .NET version. we'll see.)
             # Actually System.Drawing often doesn't support WebP. let's skip WebP if it fails.
             $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
        }

        $encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
        $encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $quality)

        # Save to a temporary file first
        $tempPath = "$Path.tmp"
        $image.Save($tempPath, $codec, $encoderParams)
        $image.Dispose()

        # Replace original
        Move-Item $tempPath $Path -Force
        Write-Host "Optimized: $Path"
    }
    catch {
        Write-Warning "Failed to optimize $Path : $_"
        if ($image) { $image.Dispose() }
    }
}

Get-ChildItem -Path "images" -Include $extensions -Recurse | ForEach-Object {
    Optimize-Image -Path $_.FullName
}
