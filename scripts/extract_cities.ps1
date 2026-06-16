# Extract all city slugs from CG sitemap
$cgContent = Get-Content 'C:\Users\u\.gemini\antigravity-ide\brain\18121830-0837-43a6-bb1e-8ccb135f1f31\.system_generated\steps\646\content.md' -Raw
$cgFound = [regex]::Matches($cgContent, 'schloka\.com/call-girl/([^<\r\n]+)')
$cgCities = $cgFound | ForEach-Object { $_.Groups[1].Value.Trim() } | Sort-Object -Unique
Write-Host "Total CG sitemap unique cities: $($cgCities.Count)"

# Extract all city slugs from MSG sitemap
$msgContent = Get-Content 'C:\Users\u\.gemini\antigravity-ide\brain\18121830-0837-43a6-bb1e-8ccb135f1f31\.system_generated\steps\652\content.md' -Raw
$msgFound = [regex]::Matches($msgContent, 'schloka\.com/massage/([^<\r\n]+)')
$msgCities = $msgFound | ForEach-Object { $_.Groups[1].Value.Trim() } | Sort-Object -Unique
Write-Host "Total MSG sitemap unique cities: $($msgCities.Count)"

# Read current locations.ts 
$locationsContent = Get-Content 'c:\Users\u\Downloads\my-site\my-site\lib\data\locations.ts' -Raw

# Extract existing city names from locations.ts by finding quoted strings
$existingFound = [regex]::Matches($locationsContent, '"([^"]+)"')
$existingCities = $existingFound | ForEach-Object { $_.Groups[1].Value.Trim() } | Where-Object { $_ -notmatch '^\s*$' -and $_ -notmatch 'Andhra Pradesh|Arunachal Pradesh|Assam|Bihar|Chhattisgarh|Goa|Gujarat|Haryana|Himachal Pradesh|Jharkhand|Karnataka|Kerala|Madhya Pradesh|Maharashtra|Manipur|Meghalaya|Mizoram|Nagaland|Odisha|Punjab|Rajasthan|Sikkim|Tamil Nadu|Telangana|Tripura|Uttar Pradesh|Uttarakhand|West Bengal|Delhi NCR|Chandigarh|Jammu and Kashmir|Ladakh|Puducherry|Andaman and Nicobar Islands|Dadra and Nagar Haveli' }

# Convert existing cities to slugs for comparison
function Get-Slug {
    param($city)
    return $city.ToLower() -replace '\s+', '-' -replace '[^a-z0-9-]', ''
}

$existingSlugs = $existingCities | ForEach-Object { Get-Slug $_ }

Write-Host "Total existing cities in locations.ts: $($existingCities.Count)"

# Find cities in CG sitemap not in locations.ts
$missingSlugs = $cgCities | Where-Object { $_ -notin $existingSlugs }
Write-Host "Missing cities (in CG sitemap, not in locations.ts): $($missingSlugs.Count)"

# Output missing cities
Write-Host "`n=== MISSING CITIES ==="
$missingSlugs | ForEach-Object { Write-Host $_ }

# Save missing cities to file
$missingSlugs | Out-File 'c:\Users\u\Downloads\my-site\my-site\scripts\missing_cities.txt' -Encoding UTF8
Write-Host "`nSaved to missing_cities.txt"
