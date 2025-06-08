/**
 * Storage.js - Gestisce il salvataggio e il caricamento dei dati
 */

const Storage = {
    // Chiavi per il localStorage
    KEYS: {
        VOTI: 'medie_app_voti',
        IMPOSTAZIONI: 'medie_app_impostazioni'
    },
    
    // Salva i voti nel localStorage
    salvaVoti: (voti) => {
        try {
            localStorage.setItem(Storage.KEYS.VOTI, JSON.stringify(voti));
            return true;
        } catch (error) {
            console.error('Errore durante il salvataggio dei voti:', error);
            return false;
        }
    },
    
    // Carica i voti dal localStorage
    caricaVoti: () => {
        try {
            const voti = localStorage.getItem(Storage.KEYS.VOTI);
            return voti ? JSON.parse(voti) : [];
        } catch (error) {
            console.error('Errore durante il caricamento dei voti:', error);
            return [];
        }
    },
    
    // Salva le impostazioni nel localStorage
    salvaImpostazioni: (impostazioni) => {
        try {
            localStorage.setItem(Storage.KEYS.IMPOSTAZIONI, JSON.stringify(impostazioni));
            return true;
        } catch (error) {
            console.error('Errore durante il salvataggio delle impostazioni:', error);
            return false;
        }
    },
    
    // Carica le impostazioni dal localStorage
    caricaImpostazioni: () => {
        try {
            const impostazioni = localStorage.getItem(Storage.KEYS.IMPOSTAZIONI);
            return impostazioni ? JSON.parse(impostazioni) : Storage.impostazioniPredefinite();
        } catch (error) {
            console.error('Errore durante il caricamento delle impostazioni:', error);
            return Storage.impostazioniPredefinite();
        }
    },
    
    // Impostazioni predefinite
    impostazioniPredefinite: () => {
        // Data predefinita per la fine del primo quadrimestre (31 gennaio dell'anno corrente)
        const oggi = new Date();
        const anno = oggi.getMonth() < 7 ? oggi.getFullYear() : oggi.getFullYear() + 1;
        return {
            fineQ1: `${anno}-01-31`
        };
    },
    
    // Cancella tutti i dati
    cancellaDati: () => {
        try {
            localStorage.removeItem(Storage.KEYS.VOTI);
            localStorage.removeItem(Storage.KEYS.IMPOSTAZIONI);
            return true;
        } catch (error) {
            console.error('Errore durante la cancellazione dei dati:', error);
            return false;
        }
    },
    
    // Esporta i dati in formato JSON
    esportaDati: () => {
        try {
            const dati = {
                voti: Storage.caricaVoti(),
                impostazioni: Storage.caricaImpostazioni(),
                versione: '1.0.0',
                dataEsportazione: new Date().toISOString()
            };
            
            // Crea un blob con i dati
            const blob = new Blob([JSON.stringify(dati, null, 2)], { type: 'application/json' });
            
            // Crea un URL per il download
            const url = URL.createObjectURL(blob);
            
            // Crea un elemento <a> per il download
            const a = document.createElement('a');
            a.href = url;
            a.download = `medie_app_export_${new Date().toISOString().slice(0, 10)}.json`;
            
            // Aggiungi l'elemento al DOM e simula il click
            document.body.appendChild(a);
            a.click();
            
            // Rimuovi l'elemento e revoca l'URL
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            return true;
        } catch (error) {
            console.error('Errore durante l\'esportazione dei dati:', error);
            return false;
        }
    },
    
    // Importa i dati da un oggetto JSON
    importaDati: (dati) => {
        try {
            if (dati.voti && Array.isArray(dati.voti)) {
                Storage.salvaVoti(dati.voti);
            }
            
            if (dati.impostazioni && typeof dati.impostazioni === 'object') {
                Storage.salvaImpostazioni(dati.impostazioni);
            }
            
            return true;
        } catch (error) {
            console.error('Errore durante l\'importazione dei dati:', error);
            return false;
        }
    }
};

