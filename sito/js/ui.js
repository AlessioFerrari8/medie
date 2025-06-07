/**
 * UI.js - Gestisce l'interfaccia utente dell'applicazione
 */

// Gestione della navigazione
document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi UI
    const navButtons = document.querySelectorAll('.nav-btn');
    const pages = document.querySelectorAll('.page');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmMessage = document.getElementById('confirm-message');
    const confirmYes = document.getElementById('confirm-yes');
    const confirmNo = document.getElementById('confirm-no');
    
    // Gestione della navigazione principale
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.id.replace('btn-', '');
            
            // Aggiorna i pulsanti di navigazione
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Mostra la pagina corrispondente
            pages.forEach(page => {
                if (page.id === targetId) {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });
    
    // Gestione delle tab
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-tab');
            
            // Aggiorna i pulsanti delle tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Mostra il contenuto della tab corrispondente
            tabContents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
    
    // Funzione per mostrare il modal di conferma
    window.showConfirmModal = (message, onConfirm) => {
        confirmMessage.textContent = message;
        confirmModal.classList.add('active');
        
        // Gestione dei pulsanti di conferma
        const yesHandler = () => {
            onConfirm();
            confirmModal.classList.remove('active');
            cleanup();
        };
        
        const noHandler = () => {
            confirmModal.classList.remove('active');
            cleanup();
        };
        
        const cleanup = () => {
            confirmYes.removeEventListener('click', yesHandler);
            confirmNo.removeEventListener('click', noHandler);
        };
        
        confirmYes.addEventListener('click', yesHandler);
        confirmNo.addEventListener('click', noHandler);
    };
    
    // Chiudi il modal cliccando fuori
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            confirmModal.classList.remove('active');
        }
    });
    
    // Gestione del form per aggiungere un voto
    const votoForm = document.getElementById('voto-form');
    if (votoForm) {
        votoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Raccogli i dati dal form
            const voto = parseFloat(document.getElementById('voto').value);
            const data = document.getElementById('data').value;
            const materia = document.getElementById('materia').value.toUpperCase();
            const tipo = document.getElementById('tipo').value;
            const descrizione = document.getElementById('descrizione').value || '';
            
            // Crea l'oggetto voto
            const nuovoVoto = {
                valore: voto,
                data: data,
                materia: materia,
                tipo: tipo,
                descrizione: descrizione
            };
            
            // Salva il voto
            App.aggiungiVoto(nuovoVoto);
            
            // Reset del form
            votoForm.reset();
            
            // Torna alla dashboard
            document.getElementById('btn-dashboard').click();
        });
    }
    
    // Gestione del form delle impostazioni
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Raccogli i dati dal form
            const fineQ1 = document.getElementById('fine-q1').value;
            
            // Salva le impostazioni
            App.salvaImpostazioni({ fineQ1 });
            
            // Notifica l'utente
            alert('Impostazioni salvate con successo!');
        });
    }
    
    // Gestione dell'esportazione dei dati
    const btnExport = document.getElementById('btn-export');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            App.esportaDati();
        });
    }
    
    // Gestione dell'importazione dei dati
    const btnImport = document.getElementById('btn-import');
    const importFile = document.getElementById('import-file');
    if (btnImport && importFile) {
        btnImport.addEventListener('click', () => {
            importFile.click();
        });
        
        importFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                
                if (file.type === 'application/json') {
                    const reader = new FileReader();
                    
                    reader.onload = (event) => {
                        try {
                            const dati = JSON.parse(event.target.result);
                            window.showConfirmModal(
                                'Importare questi dati sovrascriverà tutti i dati esistenti. Continuare?',
                                () => {
                                    App.importaDati(dati);
                                    alert('Dati importati con successo!');
                                }
                            );
                        } catch (error) {
                            alert('Errore durante l\'importazione dei dati: file non valido.');
                        }
                    };
                    
                    reader.readAsText(file);
                } else {
                    alert('Il file deve essere in formato JSON.');
                }
                
                // Reset dell'input file
                e.target.value = '';
            }
        });
    }
    
    // Gestione della cancellazione dei dati
    const btnClear = document.getElementById('btn-clear');
    if (btnClear) {
        btnClear.addEventListener('click', () => {
            window.showConfirmModal(
                'Sei sicuro di voler cancellare tutti i dati? Questa azione non può essere annullata.',
                () => {
                    App.cancellaDati();
                    alert('Tutti i dati sono stati cancellati.');
                }
            );
        });
    }
});

// Funzioni per aggiornare l'interfaccia utente
const UI = {
    // Aggiorna la dashboard con i dati delle medie
    aggiornaDashboard: (medie) => {
        // Aggiorna le medie generali
        document.getElementById('media-q1').textContent = 
            medie.mediaGeneraleQ1 !== null ? medie.mediaGeneraleQ1.toFixed(2) : '--';
        document.getElementById('media-q2').textContent = 
            medie.mediaGeneraleQ2 !== null ? medie.mediaGeneraleQ2.toFixed(2) : '--';
        document.getElementById('media-totale').textContent = 
            medie.mediaTotaleAnnuale !== null ? medie.mediaTotaleAnnuale.toFixed(2) : '--';
        
        // Aggiorna le tabelle delle medie per materia
        UI.aggiornaTabellaMedie('medie-q1-table', medie.medieQ1);
        UI.aggiornaTabellaMedie('medie-q2-table', medie.medieQ2);
        UI.aggiornaTabellaMedie('medie-totale-table', medie.medieTotali);
        
        // Aggiorna la lista dei voti
        UI.aggiornaListaVoti(medie.voti);
        
        // Aggiorna la lista delle materie nel datalist
        UI.aggiornaListaMaterie([...Object.keys(medie.medieQ1), ...Object.keys(medie.medieQ2)]);
    },
    
    // Aggiorna una tabella di medie
    aggiornaTabellaMedie: (tableId, medie) => {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        // Svuota la tabella
        table.innerHTML = '';
        
        // Aggiungi le righe per ogni materia
        Object.entries(medie).sort((a, b) => a[0].localeCompare(b[0])).forEach(([materia, media]) => {
            const row = document.createElement('tr');
            
            const materiaCell = document.createElement('td');
            materiaCell.textContent = materia;
            
            const mediaCell = document.createElement('td');
            mediaCell.textContent = media.toFixed(2);
            
            // Aggiungi classe in base al valore della media
            if (media >= 9) {
                mediaCell.classList.add('ottimo');
            } else if (media >= 7) {
                mediaCell.classList.add('buono');
            } else if (media >= 6) {
                mediaCell.classList.add('sufficiente');
            } else {
                mediaCell.classList.add('insufficiente');
            }
            
            row.appendChild(materiaCell);
            row.appendChild(mediaCell);
            
            table.appendChild(row);
        });
        
        // Se non ci sono materie, mostra un messaggio
        if (Object.keys(medie).length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;
            cell.textContent = 'Nessun voto registrato';
            cell.style.textAlign = 'center';
            cell.style.fontStyle = 'italic';
            row.appendChild(cell);
            table.appendChild(row);
        }
    },
    
    // Aggiorna la lista dei voti
    aggiornaListaVoti: (voti) => {
        const votiList = document.getElementById('voti-list');
        if (!votiList) return;
        
        // Svuota la lista
        votiList.innerHTML = '';
        
        // Ordina i voti per data (più recenti prima)
        const votiOrdinati = [...voti].sort((a, b) => new Date(b.data) - new Date(a.data));
        
        // Aggiungi gli elementi per ogni voto
        votiOrdinati.forEach((voto, index) => {
            const votoItem = document.createElement('div');
            votoItem.className = 'voto-item';
            votoItem.dataset.id = index;
            
            // Informazioni sul voto
            const votoInfo = document.createElement('div');
            votoInfo.className = 'voto-info';
            
            const votoMateria = document.createElement('div');
            votoMateria.className = 'voto-materia';
            votoMateria.textContent = voto.materia;
            
            const votoDetails = document.createElement('div');
            votoDetails.className = 'voto-details';
            
            // Formatta la data
            const data = new Date(voto.data);
            const dataFormattata = data.toLocaleDateString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            votoDetails.textContent = `${dataFormattata} - ${voto.tipo}`;
            
            votoInfo.appendChild(votoMateria);
            votoInfo.appendChild(votoDetails);
            
            // Valore del voto
            const votoValue = document.createElement('div');
            votoValue.className = 'voto-value';
            
            // Aggiungi classe in base al valore del voto
            if (voto.valore >= 9) {
                votoValue.classList.add('ottimo');
            } else if (voto.valore >= 7) {
                votoValue.classList.add('buono');
            } else if (voto.valore >= 6) {
                votoValue.classList.add('sufficiente');
            } else {
                votoValue.classList.add('insufficiente');
            }
            
            votoValue.textContent = voto.valore.toFixed(2);
            
            // Azioni sul voto
            const votoActions = document.createElement('div');
            votoActions.className = 'voto-actions';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Elimina voto';
            
            // Evento per eliminare il voto
            deleteBtn.addEventListener('click', () => {
                window.showConfirmModal(
                    `Sei sicuro di voler eliminare questo voto in ${voto.materia}?`,
                    () => {
                        App.eliminaVoto(index);
                    }
                );
            });
            
            votoActions.appendChild(deleteBtn);
            
            // Assembla l'elemento del voto
            votoItem.appendChild(votoInfo);
            votoItem.appendChild(votoValue);
            votoItem.appendChild(votoActions);
            
            votiList.appendChild(votoItem);
        });
        
        // Se non ci sono voti, mostra un messaggio
        if (voti.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = 'Nessun voto registrato';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.fontStyle = 'italic';
            emptyMessage.style.padding = '1rem';
            votiList.appendChild(emptyMessage);
        }
    },
    
    // Aggiorna la lista delle materie nel datalist
    aggiornaListaMaterie: (materie) => {
        const materieList = document.getElementById('materie-list');
        if (!materieList) return;
        
        // Svuota la lista
        materieList.innerHTML = '';
        
        // Crea un Set per rimuovere i duplicati
        const materieUniche = [...new Set(materie)];
        
        // Aggiungi le opzioni per ogni materia
        materieUniche.sort().forEach(materia => {
            const option = document.createElement('option');
            option.value = materia;
            materieList.appendChild(option);
        });
    },
    
    // Imposta i valori del form delle impostazioni
    impostaFormImpostazioni: (impostazioni) => {
        const fineQ1Input = document.getElementById('fine-q1');
        if (fineQ1Input && impostazioni.fineQ1) {
            fineQ1Input.value = impostazioni.fineQ1;
        }
    },
    
    // Imposta la data corrente nel form di aggiunta voto
    impostaDataCorrente: () => {
        const dataInput = document.getElementById('data');
        if (dataInput) {
            const oggi = new Date();
            const anno = oggi.getFullYear();
            const mese = String(oggi.getMonth() + 1).padStart(2, '0');
            const giorno = String(oggi.getDate()).padStart(2, '0');
            dataInput.value = `${anno}-${mese}-${giorno}`;
        }
    }
};

