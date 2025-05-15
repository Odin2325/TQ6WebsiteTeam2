const sessionID = sessionStorage.getItem('sessionID'); //wird benötigt um zwischen Admin und User zu unterscheiden
        console.log('Session ID:', sessionID);
        
function filterEvents() {
    //Funktion ruft die Events aus der Datenbank ab, filtert sie nach Typ, Start- und Enddatum
    //und zeigt sie in der Liste an
    
    //Abrufen der Filtereinträge im Kopfbereich der Seite
    const selectedCategory = document.getElementById('event_type').value; //Kategorie
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;

    //Abrufen der Events aus der Datenbank
    fetch('/events/getall')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event_list'); //event_list ist das DIV-Element, in dem die Events angezeigt werden
            eventList.innerHTML = '';

            data.forEach(event => {
                const eventDate = new Date(event.date);
                const from = startDate ? new Date(startDate) : null; //wenn startDate gesetzt ist, nutze es, sonst null
                const to = endDate ? new Date(endDate) : null;

                const matchesType = selectedCategory === 'all' || event.category === selectedCategory;
                const matchesStart = !from || eventDate >= from;
                const matchesEnd = !to || eventDate <= to;

                if (matchesType && matchesStart && matchesEnd) { //wenn das Event den Filterkriterien entspricht, dann zeige es an
                    const eventItem = document.createElement('div');
                    eventItem.className = 'col';
                    eventItem.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title text-center text-white card_title_bg">${event.name}</h5>
                                <p class="card-text"><strong>Datum:</strong> ${event.date}</p>
                                <p class="card-text"><strong>Ort:</strong> ${event.location}</p>
                                <div class="card_centeredContent">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal"
                                        onclick='showEventDetails(${JSON.stringify(event)})'>
                                        Details anzeigen
                                    </button>
                                    <button type="button" class = "btn btn-danger mx-3" id="delete_event_${event.id}" style="display: ${sessionID ? 'block' : 'none'};">
                                        Löschen
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    eventList.appendChild(eventItem);
                }
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Daten:', error);
        });
}
//Ende Filterfunktion

function showEventDetails(event) {
    const modalBody = document.getElementById('modalBodyContent'); //modalBody ist das DIV-Element, in dem die Details angezeigt werden
    const alreadyLiked = sessionStorage.getItem(`liked_${event.id}`);   //Abruf aus der SessionStorage, ob der User das Event schon geliket hat
    modalBody.innerHTML = `
        <p><strong>Name:</strong> ${event.name}</p>
        <p><strong>Datum:</strong> ${event.date}</p>
        <p><strong>Ort:</strong> ${event.location}</p>
        <p><strong>Typ:</strong> ${event.category || 'nicht angegeben'}</p>
        <p><strong>Beschreibung:</strong><br>${event.description || 'Keine Beschreibung vorhanden.'}</p>
        <p><strong>Likes:</strong> <span id="likeCount"></span></p>
        <button type="button" class="btn btn-primary" id="likeButton" data-id="${event.id}" ${alreadyLiked ? 'disabled' : ''}>I like</button>
    `;

    //Likes in das Modal einfügen
    fetch('/events/getlikes')
        .then(res => res.json())
        .then(likesList => {
            const current = likesList.find(e => e.id == event.id); //finde das Event in der Liste mit der passenden ID
            if (current) {
                document.getElementById('likeCount').innerText = current.likes;
            }
        });
    //setze den Like-Button auf disabled, wenn der User das Event schon geliket hat
    const likeButton = document.getElementById('likeButton');
        if (alreadyLiked) {
            likeButton.disabled = true;
        }

    likeButton.addEventListener('click', function () {
        const eventId = this.getAttribute('data-id');   //Data-ID entspricht der ID des Events in der Datenbank

        fetch(`/events/addlike/${eventId}`, {   //rufe die Route zum Liken des Events auf
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Fehler beim Liken");
                return response.text();
            })
            .then(() => {
                // Liken für diese Sitzung merken
                sessionStorage.setItem(`liked_${eventId}`, 'true');
                // Button deaktivieren
                likeButton.disabled = true;
                // Likes aus /getlikes abrufen
                return fetch('/events/getlikes');
            })
            .then(res => res.json())
            .then(likesList => {
                const current = likesList.find(e => e.id == eventId);
                if (current) {
                    document.getElementById('likeCount').innerText = current.likes;
                }
            })
            .catch(error => {
                console.error("Fehler beim Liken:", error);
            });
    });
}

filterEvents(); //Initialer Aufruf der Filterfunktion, um alle Events anzuzeigen

        // // Eventlistener für die Modal-Buttons
        // const modalButtons = document.getElementsByClassName("myModal");
        // for (let btn of modalButtons) {
        //     btn.addEventListener("click", function () {
        //         const eventId = this.id;
        //         showDetails(eventId);
        //     });
        // }

// Event-Listener für die Filter
document.getElementById('event_type').addEventListener('change', filterEvents);
document.getElementById('start_date').addEventListener('change', filterEvents);
document.getElementById('end_date').addEventListener('change', filterEvents);
