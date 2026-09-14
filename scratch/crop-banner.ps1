Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\Admin\.gemini\antigravity-ide\brain\443614fb-9048-43e5-88d5-402f80f43111\india_heritage_banner_1789372118779.jpg"
$outputPath = "c:\Users\Admin\Desktop\cooding 1\SIH\public\Images\header-bg.jpg"

$src = [System.Drawing.Bitmap]::FromFile($inputPath)
Write-Output "Image loaded: $($src.Width) x $($src.Height)"

# The image is 1376 x 768
# Sky is at the top (0 to 180)
# Buildings start around y=190 down to y=560
# Let's crop from y=180 to y=520 (height = 340, width = 1376)
$cropY = 180
$cropHeight = 340
$cropWidth = $src.Width

$rect = New-Object System.Drawing.Rectangle(0, $cropY, $cropWidth, $cropHeight)
$cropped = $src.Clone($rect, $src.PixelFormat)

# Save cropped image with high quality JPEG
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)
$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

$src.Dispose()
$cropped.Save($outputPath, $jpegCodec, $encoderParams)
$cropped.Dispose()

Write-Output "Cropped image successfully saved to $outputPath"
