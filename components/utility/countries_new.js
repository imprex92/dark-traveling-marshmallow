const countriesByContinent = {
    "Europe": [
    { name: "Albania", code: "AL" },
    { name: "Andorra", code: "AD" },
    { name: "Austria", code: "AT" },
    { name: "Belarus", code: "BY" },
    { name: "Belgium", code: "BE" },
    { name: "Bosnia and Herzegovina", code: "BA" },
    { name: "Bulgaria", code: "BG" },
    { name: "Croatia", code: "HR" },
    { name: "Cyprus", code: "CY" },
    { name: "Czech Republic", code: "CZ" },
    { name: "Denmark", code: "DK" },
    { name: "Estonia", code: "EE" },
    { name: "Finland", code: "FI" },
    { name: "France", code: "FR" },
    { name: "Germany", code: "DE" },
    { name: "Greece", code: "GR" },
    { name: "Hungary", code: "HU" },
    { name: "Iceland", code: "IS" },
    { name: "Ireland", code: "IE" },
    { name: "Italy", code: "IT" },
    { name: "Kosovo", code: "XK" },
    { name: "Latvia", code: "LV" },
    { name: "Liechtenstein", code: "LI" },
    { name: "Lithuania", code: "LT" },
    { name: "Luxembourg", code: "LU" },
    { name: "Malta", code: "MT" },
    { name: "Moldova", code: "MD" },
    { name: "Monaco", code: "MC" },
    { name: "Montenegro", code: "ME" },
    { name: "Netherlands", code: "NL" },
    { name: "North Macedonia", code: "MK" },
    { name: "Norway", code: "NO" },
    { name: "Poland", code: "PL" },
    { name: "Portugal", code: "PT" },
    { name: "Romania", code: "RO" },
    { name: "Russia", code: "RU" },
    { name: "San Marino", code: "SM" },
    { name: "Serbia", code: "RS" },
    { name: "Slovakia", code: "SK" },
    { name: "Slovenia", code: "SI" },
    { name: "Spain", code: "ES" },
    { name: "Sweden", code: "SE" },
    { name: "Switzerland", code: "CH" },
    { name: "Ukraine", code: "UA" },
    { name: "United Kingdom", code: "GB" },
    { name: "Vatican City", code: "VA" },
  ],
  "North America": [
    { name: "Antigua and Barbuda", code: "AG" },
    { name: "Bahamas", code: "BS" },
    { name: "Barbados", code: "BB" },
    { name: "Belize", code: "BZ" },
    { name: "Canada", code: "CA" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cuba", code: "CU" },
    { name: "Dominica", code: "DM" },
    { name: "Dominican Republic", code: "DO" },
    { name: "El Salvador", code: "SV" },
    { name: "Grenada", code: "GD" },
    { name: "Guatemala", code: "GT" },
    { name: "Haiti", code: "HT" },
    { name: "Honduras", code: "HN" },
    { name: "Jamaica", code: "JM" },
    { name: "Mexico", code: "MX" },
    { name: "Nicaragua", code: "NI" },
    { name: "Panama", code: "PA" },
    { name: "Saint Kitts and Nevis", code: "KN" },
    { name: "Saint Lucia", code: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "VC" },
    { name: "Trinidad and Tobago", code: "TT" },
    { name: "United States", code: "US" },
  ],
    "South America": [
    { name: "Argentina", code: "AR" },
    { name: "Bolivia", code: "BO" },
    { name: "Brazil", code: "BR" },
    { name: "Chile", code: "CL" },
    { name: "Colombia", code: "CO" },
    { name: "Ecuador", code: "EC" },
    { name: "Guyana", code: "GY" },
    { name: "Paraguay", code: "PY" },
    { name: "Peru", code: "PE" },
    { name: "Suriname", code: "SR" },
    { name: "Uruguay", code: "UY" },
    { name: "Venezuela", code: "VE" },
  ],
    "Africa": [
    { name: "Algeria", code: "DZ" },
    { name: "Angola", code: "AO" },
    { name: "Benin", code: "BJ" },
    { name: "Botswana", code: "BW" },
    { name: "Burkina Faso", code: "BF" },
    { name: "Burundi", code: "BI" },
    { name: "Cabo Verde", code: "CV" },
    { name: "Cameroon", code: "CM" },
    { name: "Central African Republic", code: "CF" },
    { name: "Chad", code: "TD" },
    { name: "Comoros", code: "KM" },
    { name: "Democratic Republic of the Congo", code: "CD" },
    { name: "Djibouti", code: "DJ" },
    { name: "Egypt", code: "EG" },
    { name: "Equatorial Guinea", code: "GQ" },
    { name: "Eritrea", code: "ER" },
    { name: "Eswatini", code: "SZ" },
    { name: "Ethiopia", code: "ET" },
    { name: "Gabon", code: "GA" },
    { name: "Gambia", code: "GM" },
    { name: "Ghana", code: "GH" },
    { name: "Guinea", code: "GN" },
    { name: "Guinea-Bissau", code: "GW" },
    { name: "Ivory Coast", code: "CI" },
    { name: "Kenya", code: "KE" },
    { name: "Lesotho", code: "LS" },
    { name: "Liberia", code: "LR" },
    { name: "Libya", code: "LY" },
    { name: "Madagascar", code: "MG" },
    { name: "Malawi", code: "MW" },
    { name: "Mali", code: "ML" },
    { name: "Mauritania", code: "MR" },
    { name: "Mauritius", code: "MU" },
    { name: "Morocco", code: "MA" },
    { name: "Mozambique", code: "MZ" },
    { name: "Namibia", code: "NA" },
    { name: "Niger", code: "NE" },
    { name: "Nigeria", code: "NG" },
    { name: "Rwanda", code: "RW" },
    { name: "Sao Tome and Principe", code: "ST" },
    { name: "Senegal", code: "SN" },
    { name: "Seychelles", code: "SC" },
    { name: "Sierra Leone", code: "SL" },
    { name: "Somalia", code: "SO" },
    { name: "South Africa", code: "ZA" },
    { name: "South Sudan", code: "SS" },
    { name: "Sudan", code: "SD" },
    { name: "Tanzania", code: "TZ" },
    { name: "Togo", code: "TG" },
    { name: "Tunisia", code: "TN" },
    { name: "Uganda", code: "UG" },
    { name: "Zambia", code: "ZM" },
    { name: "Zimbabwe", code: "ZW" },
  ],
  "Asia": [
    { name: "Afghanistan", code: "AF" },
    { name: "Armenia", code: "AM" },
    { name: "Azerbaijan", code: "AZ" },
    { name: "Bahrain", code: "BH" },
    { name: "Bangladesh", code: "BD" },
    { name: "Bhutan", code: "BT" },
    { name: "Brunei", code: "BN" },
    { name: "Cambodia", code: "KH" },
    { name: "China", code: "CN" },
    { name: "Cyprus", code: "CY" },
    { name: "Georgia", code: "GE" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Iran", code: "IR" },
    { name: "Iraq", code: "IQ" },
    { name: "Israel", code: "IL" },
    { name: "Japan", code: "JP" },
    { name: "Jordan", code: "JO" },
    { name: "Kazakhstan", code: "KZ" },
    { name: "Kuwait", code: "KW" },
    { name: "Kyrgyzstan", code: "KG" },
    { name: "Laos", code: "LA" },
    { name: "Lebanon", code: "LB" },
    { name: "Malaysia", code: "MY" },
    { name: "Maldives", code: "MV" },
    { name: "Mongolia", code: "MN" },
    { name: "Myanmar", code: "MM" },
    { name: "Nepal", code: "NP" },
    { name: "North Korea", code: "KP" },
    { name: "Oman", code: "OM" },
    { name: "Pakistan", code: "PK" },
    { name: "Palestine", code: "PS" },
    { name: "Philippines", code: "PH" },
    { name: "Qatar", code: "QA" },
    { name: "Saudi Arabia", code: "SA" },
    { name: "Singapore", code: "SG" },
    { name: "South Korea", code: "KR" },
    { name: "Sri Lanka", code: "LK" },
    { name: "Syria", code: "SY" },
    { name: "Taiwan", code: "TW" },
    { name: "Tajikistan", code: "TJ" },
    { name: "Thailand", code: "TH" },
    { name: "Timor-Leste", code: "TL" },
    { name: "Turkey", code: "TR" },
    { name: "Turkmenistan", code: "TM" },
    { name: "United Arab Emirates", code: "AE" },
    { name: "Uzbekistan", code: "UZ" },
    { name: "Vietnam", code: "VN" },
    { name: "Yemen", code: "YE" },
  ],
  "Oceania": [
    { name: "Australia", code: "AU" },
    { name: "Fiji", code: "FJ" },
    { name: "Kiribati", code: "KI" },
    { name: "Marshall Islands", code: "MH" },
    { name: "Micronesia", code: "FM" },
    { name: "Nauru", code: "NR" },
    { name: "New Zealand", code: "NZ" },
    { name: "Palau", code: "PW" },
    { name: "Papua New Guinea", code: "PG" },
    { name: "Samoa", code: "WS" },
    { name: "Solomon Islands", code: "SB" },
    { name: "Tonga", code: "TO" },
    { name: "Tuvalu", code: "TV" },
    { name: "Vanuatu", code: "VU" },
  ],
  "Other": [
    { name: "Antarctica", code: "AQ" },
  ],
}

export default countriesByContinent
