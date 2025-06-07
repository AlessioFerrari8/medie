// Logica principale applicazione --> sostanzialmente si convertono le funzionalità del codice python in /medieCalcuator in js


const App = {
    // Dati dell'applicazione
    voti: [],
    impostazioni: {},
    
    // Inizializza l'applicazione
    init: () => {
        // Carica i dati salvati
        App.voti = Storage.caricaVoti();
        App.impostazioni = Storage.caricaImpostazioni();
        
        // Imposta la data corrente nel form di aggiunta voto
        UI.impostaDataCorrente();
        
        // Imposta i valori del form delle impostazioni
        UI.impostaFormImpostazioni(App.impostazioni);
        
        // Calcola e visualizza le medie
        App.calcolaEVisualizzaMedie();
    },
    
    // Calcola le medie e aggiorna l'interfaccia
    calcolaEVisualizzaMedie: () => {
        // Ottieni la data di fine del primo quadrimestre
        const fineQ1 = new Date(App.impostazioni.fineQ1);
        
        // Dividi i voti per quadrimestre
        const votiQ1 = [];
        const votiQ2 = [];
        
        App.voti.forEach(voto => {
            const dataVoto = new Date(voto.data);
            if (dataVoto <= fineQ1) {
                votiQ1.push(voto);
            } else {
                votiQ2.push(voto);
            }
        });
        
        // Calcola le medie per materia per ogni quadrimestre
        const medieQ1 = App.calcolaMediePerMateria(votiQ1);
        const medieQ2 = App.calcolaMediePerMateria(votiQ2);
        
        // Calcola le medie totali per materia
        const medieTotali = App.calcolaMedieTotali(medieQ1, medieQ2);
        
        // Calcola le medie generali
        const mediaGeneraleQ1 = App.calcolaMediaGenerale(medieQ1);
        const mediaGeneraleQ2 = App.calcolaMediaGenerale(medieQ2);
        
        // Calcola la media totale annuale
        const mediaTotaleAnnuale = App.calcolaMediaTotaleAnnuale(mediaGeneraleQ1, mediaGeneraleQ2);
        
        // Aggiorna l'interfaccia
        UI.aggiornaDashboard({
            voti: App.voti,
            medieQ1,
            medieQ2,
            medieTotali,
            mediaGeneraleQ1,
            mediaGeneraleQ2,
            mediaTotaleAnnuale
        });
    },
    
    // Calcola le medie per materia
    calcolaMediePerMateria: (voti) => {
        // Raggruppa i voti per materia
        const votiPerMateria = {};
        
        voti.forEach(voto => {
            if (!votiPerMateria[voto.materia]) {
                votiPerMateria[voto.materia] = [];
            }
            votiPerMateria[voto.materia].push(voto.valore);
        });
        
        // Calcola la media per ogni materia
        const medie = {};
        
        for (const materia in votiPerMateria) {
            const votiMateria = votiPerMateria[materia];
            const somma = votiMateria.reduce((acc, voto) => acc + voto, 0);
            medie[materia] = somma / votiMateria.length;
        }
        
        return medie;
    },
    
    // Calcola le medie totali per materia
    calcolaMedieTotali: (medieQ1, medieQ2) => {
        const medieTotali = {};
        
        // Unisci le materie di entrambi i quadrimestri
        const materie = new Set([...Object.keys(medieQ1), ...Object.keys(medieQ2)]);
        
        materie.forEach(materia => {
            const mediaQ1 = medieQ1[materia];
            const mediaQ2 = medieQ2[materia];
            
            if (mediaQ1 !== undefined && mediaQ2 !== undefined) {
                medieTotali[materia] = (mediaQ1 + mediaQ2) / 2;
            } else if (mediaQ1 !== undefined) {
                medieTotali[materia] = mediaQ1;
            } else if (mediaQ2 !== undefined) {
                medieTotali[materia] = mediaQ2;
            }
        });
        
        return medieTotali;
    },
    
    // Calcola la media generale di un quadrimestre
    calcolaMediaGenerale: (medie) => {
        const valori = Object.values(medie);
        
        if (valori.length === 0) {
            return null;
        }
        
        const somma = valori.reduce((acc, media) => acc + media, 0);
        return somma / valori.length;
    },
    
    // Calcola la media totale annuale
    calcolaMediaTotaleAnnuale: (mediaQ1, mediaQ2) => {
        if (mediaQ1 !== null && mediaQ2 !== null) {
            return (mediaQ1 + mediaQ2) / 2;
        } else if (mediaQ1 !== null) {
            return mediaQ1;
        } else if (mediaQ2 !== null) {
            return mediaQ2;
        } else {
            return null;
        }
    },
    
    // Aggiungi un nuovo voto
    aggiungiVoto: (nuovoVoto) => {
        App.voti.push(nuovoVoto);
        Storage.salvaVoti(App.voti);
        App.calcolaEVisualizzaMedie();
    },
    
    // Elimina un voto
    eliminaVoto: (index) => {
        App.voti.splice(index, 1);
        Storage.salvaVoti(App.voti);
        App.calcolaEVisualizzaMedie();
    },
    
    // Salva le impostazioni
    salvaImpostazioni: (nuoveImpostazioni) => {
        App.impostazioni = { ...App.impostazioni, ...nuoveImpostazioni };
        Storage.salvaImpostazioni(App.impostazioni);
        App.calcolaEVisualizzaMedie();
    },
    
    // Esporta i dati
    esportaDati: () => {
        return Storage.esportaDati();
    },
    
    // Importa i dati
    importaDati: (dati) => {
        if (Storage.importaDati(dati)) {
            App.voti = Storage.caricaVoti();
            App.impostazioni = Storage.caricaImpostazioni();
            App.calcolaEVisualizzaMedie();
            return true;
        }
        return false;
    },
    
    // Cancella tutti i dati
    cancellaDati: () => {
        if (Storage.cancellaDati()) {
            App.voti = [];
            App.impostazioni = Storage.impostazioniPredefinite();
            App.calcolaEVisualizzaMedie();
            return true;
        }
        return false;
    }
};

// Inizializza l'applicazione quando il DOM è pronto
document.addEventListener('DOMContentLoaded', App.init);

