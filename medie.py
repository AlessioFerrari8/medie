import re
from datetime import datetime
from collections import defaultdict
#from rich import print  # Per output colorato

# === 📂 Leggi da file ===
nome_file = "voti.txt"  # Cambia questo nome se il file ha un nome diverso

try:
    with open(nome_file, "r", encoding="utf-8") as f:
        testo_voti = f.read()
except FileNotFoundError:
    print(f"[red]❌ Errore: il file '{nome_file}' non è stato trovato.[/red]")
    exit()

# === 🗓️ Configura la fine del primo quadrimestre ===
fine_q1 = datetime.strptime("31/01/2025", "%d/%m/%Y")

# === 📊 Contenitori ===
voti_q1 = defaultdict(list)
voti_q2 = defaultdict(list)

# === 🔍 Parsing a blocchi ===
righe = testo_voti.strip().splitlines()
mese_corrente = ""
anno_corrente = 2024  # Default iniziale

i = 0
while i < len(righe):
    riga = righe[i].strip()

    # Sezione mese e anno
    if re.match(r"^(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre) \d{4}$", riga.lower()):
        mese_corrente, anno_corrente = riga.split()
        anno_corrente = int(anno_corrente)
        i += 1
        continue

    # Parsing blocco di 4 righe
    try:
        voto_str = riga
        data_str = righe[i + 1].split(", ")[1].strip()
        materia = righe[i + 2].strip()
        descrizione = righe[i + 3].strip()

        voto = float(voto_str.replace(',', '.'))
        giorno, mese = map(int, data_str.split("/"))
        data_voto = datetime(anno_corrente, mese, giorno)

        if data_voto <= fine_q1:
            voti_q1[materia].append(voto)
        else:
            voti_q2[materia].append(voto)

        i += 4
    except Exception:
        i += 1  # In caso di errore, passa alla riga successiva

# === 🧮 Calcolo medie ===
def calcola_medie(voti_dict):
    return {
        materia: round(sum(voti) / len(voti), 2)
        for materia, voti in voti_dict.items()
        if voti
    }

def calcola_media_totale(m1, m2):
    if m1 is not None and m2 is not None:
        return round((m1 + m2) / 2, 2)
    elif m1 is not None:
        return m1
    elif m2 is not None:
        return m2
    return None

# === 📘 Risultati ===
medie_q1 = calcola_medie(voti_q1)
medie_q2 = calcola_medie(voti_q2)

print("\n[bold blue]📘 MEDIE PRIMO QUADRIMESTRE:[/bold blue]")
for materia, media in sorted(medie_q1.items()):
    print(f"[cyan]{materia}[/cyan]: {media}")

print("\n[bold green]📗 MEDIE SECONDO QUADRIMESTRE:[/bold green]")
for materia, media in sorted(medie_q2.items()):
    print(f"[green]{materia}[/green]: {media}")

print("\n[bold magenta]📚 MEDIE TOTALI:[/bold magenta]")
for materia in sorted(set(medie_q1.keys()).union(medie_q2.keys())):
    media_totale = calcola_media_totale(medie_q1.get(materia), medie_q2.get(materia))
    print(f"[magenta]{materia}[/magenta]: {media_totale}")

# === 📊 Media generale ===
def media_generale(medie_dict):
    if not medie_dict:
        return None
    return round(sum(medie_dict.values()) / len(medie_dict), 2)

media_gen_q1 = media_generale(medie_q1)
media_gen_q2 = media_generale(medie_q2)

if media_gen_q1 is not None and media_gen_q2 is not None:
    media_totale_annuale = round((media_gen_q1 + media_gen_q2) / 2, 2)
elif media_gen_q1 is not None:
    media_totale_annuale = media_gen_q1
elif media_gen_q2 is not None:
    media_totale_annuale = media_gen_q2
else:
    media_totale_annuale = None

print("\n[bold yellow]📊 MEDIA GENERALE QUADRIMESTRI:[/bold yellow]")
print(f"[blue]🟦 Media Primo Quadrimestre:[/blue] {media_gen_q1}")
print(f"[green]🟩 Media Secondo Quadrimestre:[/green] {media_gen_q2}")
print(f"[magenta]⭐ Media Totale Annuale:[/magenta] {media_totale_annuale}")
