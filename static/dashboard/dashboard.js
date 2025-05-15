console.log('Session ID:', sessionID);
const adminButton = document.getElementById('adminBtn');

//Events filtern entsprechend der Auswahl
function filterEvents() {
    const selectedType = document.getElementById('event_type').value;
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
    const confirmDeleteText = document.getElementById('confirmDeleteText');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    fetch('/events/getall')
        .then(response => response.json())
        .then(data => {
            const eventList = document.getElementById('event_list');
            eventList.innerHTML = '';

            data.forEach(event => {
                const eventDate = new Date(event.date);
                const from = startDate ? new Date(startDate) : null;
                const to = endDate ? new Date(endDate) : null;

                const matchesType = selectedType === 'all' || event.category === selectedType;
                const matchesStart = !from || eventDate >= from;
                const matchesEnd = !to || eventDate <= to;

                if (matchesType && matchesStart && matchesEnd) {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'col';

                    eventItem.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title text-center text-white card_title_bg">${event.name}</h5>
                                <p class="card-text"><strong>Datum:</strong> ${event.date}</p>
                                <p class="card-text"><strong>Ort:</strong> ${event.location}</p>
                                <div class="card_centeredContent" style="gap: 30px">
                                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#eventModal"
                                        onclick='showEventDetails(${JSON.stringify(event)})'>
                                        Details anzeigen
                                    </button>
                                    <span class="delete-btn-container"></span>
                                </div>
                            </div>
                        </div>
                    `;

                    eventList.appendChild(eventItem);

                    if (sessionID) {
                        adminButton.innerText = "Log Out";

                        const deleteButton = document.createElement('img');
                        deleteButton.src = deleteIconURL;
                        deleteButton.alt = "Delete";
                        deleteButton.style.width = "45px";
                        deleteButton.style.height = "45px";
                        deleteButton.style.cursor = "pointer";
                        deleteButton.addEventListener('click', () => {
                            confirmDeleteText.textContent = `Willst du das Event "${event.name}" wirklich löschen?`;

                            // Modal anzeigen
                            confirmDeleteModal.show();

                            const newButton = confirmDeleteBtn.cloneNode(true);
                            confirmDeleteBtn.parentNode.replaceChild(newButton, confirmDeleteBtn);

                            newButton.addEventListener('click', () => {
                                fetch(`/events/delete/${event.id}`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                }).then(res => {
                                    if (res.ok) {
                                        console.log(`Event ${event.id} gelöscht`);
                                        eventItem.remove();
                                        confirmDeleteModal.hide();
                                    }
                                });
                            });
                        });

                        // Füge das <img> Element an vorgesehener Stelle ein
                        eventItem.querySelector('.delete-btn-container').appendChild(deleteButton);
                    } else {
                        adminButton.style.display = "";
                    }
                }
            });
        })
        .catch(error => {
            console.error('Fehler beim Laden der Daten:', error);
        });
}
//Ende Filterfunktion

function showEventDetails(event) {
    const modalBody = document.getElementById('modalBodyContent');
    const alreadyLiked = sessionStorage.getItem(`liked_${event.id}`);   //Button zum liken wird disabled wenn der User schon geliket hat
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
            const current = likesList.find(e => e.id == event.id);
            if (current) {
                document.getElementById('likeCount').innerText = current.likes;
            }
        });

    const likeButton = document.getElementById('likeButton');
    if (alreadyLiked) {
        likeButton.disabled = true;
    }

    likeButton?.addEventListener('click', function () {
        const eventId = this.getAttribute('data-id');

        fetch(`/events/addlike/${eventId}`, {
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

filterEvents();

// Eventlistener für die Modal-Buttons
const modalButtons = document.getElementsByClassName("myModal");
for (let btn of modalButtons) {
    btn.addEventListener("click", function () {
        const eventId = this.id;
        showDetails(eventId);
    });
}


// Event-Listener für die Filter
document.getElementById('event_type').addEventListener('change', filterEvents);
document.getElementById('start_date').addEventListener('change', filterEvents);
document.getElementById('end_date').addEventListener('change', filterEvents);

adminButton.addEventListener('click', () => {
    if (sessionID)
    {
        localStorage.removeItem("Session ID");
        location.reload();
    }
    else {
        window.location.href = '/admin/login';
    }
});