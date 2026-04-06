$htmlFiles = Get-ChildItem -Path . -Filter *.html -Recurse | Where-Object { $_.FullName -notmatch "node_modules|\.git" }
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Favicon
    if ($content -notmatch 'rel="icon"') {
        $content = $content -replace '(?i)(<title>.*?</title>)', "`$1`n    <link rel=`"icon`" type=`"image/png`" href=`"img/logo.png`">"
    }
    
    # Href replacements
    $content = $content -replace 'href="index\.html(\?[^"]*)?"', 'href="/$1"'
    $content = $content -replace 'href="([^"]+)\.html(\?[^"]*)?"', 'href="$1$2"'
    
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}

$jsFiles = Get-ChildItem -Path js -Filter *.js -Recurse
foreach ($file in $jsFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $content = $content -replace 'location\.href\s*=\s*[''"]index\.html(\?[^''"]*)?[''"]', "location.href = '/$1'"
    $content = $content -replace 'location\.href\s*=\s*[''"]([^''"]+)\.html(\?[^''"]*)?[''"]', "location.href = '$1$2'"
    $content = $content -replace 'href="index\.html(\?[^"]*)?"', 'href="/$1"'
    $content = $content -replace 'href="([^"]+)\.html(\?[^"]*)?"', 'href="$1$2"'
    Set-Content -Path $file.FullName -Value $content -Encoding UTF8
}
