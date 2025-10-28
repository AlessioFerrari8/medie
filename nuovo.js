// Script per convertire le valutazioni da stringa a JSON

const valutazioniStringa = `Valutazioni giornaliere
ottobre 2025
9 
lun, 27/10
INFORMATICA
pratico
nove
9.25 
lun, 20/10
AREA AUTONOMIA INFORMATICA
pratico
nove+
8.75 
ven, 17/10
LINGUA E LETTERATURA ITALIANA
scritto
otto,75
9 
gio, 16/10
TELECOMUNICAZIONI
scritto
nove
9.5 
ven, 10/10
MATEMATICA E COMPLEMENTI DI MATEMATICA
scritto
nove,50
8.5 
gio, 09/10
INFORMATICA
scritto
otto,50
9.75 
mer, 08/10
SISTEMI E RETI
scritto
nove,75`;

// Mappa dei giorni abbreviati
const giorniMap = {
  'lun': 'lunedì',
  'mar': 'martedì',
  'mer': 'mercoledì',
  'gio': 'giovedì',
  'ven': 'venerdì',
  'sab': 'sabato',
  'dom': 'domenica'
};

// Mappa per convertire voti da testo a numero
const votiMap = {
  'insufficiente': 4,
  'mediocre': 5,
  'sufficiente': 6,
  'discreto': 7,
  'buono': 8,
  'molto buono': 9,
  'eccellente': 10,
  'nove': 9,
  'otto': 8,
  'sette': 7,
  'sei': 6,
  'cinque': 5,
  'quattro': 4,
  'otto,50': 8.5,
  'otto,75': 8.75,
  'nove,50': 9.5,
  'nove,75': 9.75,
  'nove+': 9.25
};

// Pulisci e dividi le linee
const linee = valutazioniStringa
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.length > 0);

// Rimuovi header
linee.splice(0, 2); // Rimuovi "Valutazioni giornaliere" e "ottobre 2025"

// Processa i dati
const valutazioni = [];
let i = 0;

while (i < linee.length) {
  // Estrai voto numerico
  const votoNumerico = parseFloat(linee[i]);
  i++;

  if (isNaN(votoNumerico)) continue;

  // Estrai data e giorno
  const dataLine = linee[i]; // es: "lun, 27/10"
  const [giornoAbbr, data] = dataLine.split(', ');
  const giorno = giorniMap[giornoAbbr.toLowerCase()] || giornoAbbr;
  
  // Converti data al formato ISO (2025-10-27)
  const [giorno_num, mese] = data.split('/');
  const dataISO = `2025-${mese}-${giorno_num}`;
  i++;

  // Estrai materia
  const materia = linee[i];
  i++;

  // Estrai tipo
  const tipo = linee[i];
  i++;

  // Estrai voto testo
  const votoTesto = linee[i];
  i++;

  // Crea oggetto
  valutazioni.push({
    data: dataISO,
    giorno: giorno,
    materia: materia,
    tipo: tipo,
    voto_testo: votoTesto,
    voto_numerico: votoNumerico
  });
}

// Crea JSON finale
const jsonFinale = {
  valutazioni: valutazioni
};

// Stampa il JSON
console.log(JSON.stringify(jsonFinale, null, 2));

// Salva su file (se in Node.js)
const fs = require('fs');
fs.writeFileSync('valutazioni.json', JSON.stringify(jsonFinale, null, 2));
console.log('\n✅ File salvato in valutazioni.json');
