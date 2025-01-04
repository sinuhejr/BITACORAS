// Lista de motivos
const motives = [
    "Abastecer combustible",
    "Traer alimentos para el personal en turno",
    "Realizar tomas con el dron",
    "Realizar entrevista en campo",
    "Comisión",
    "Realizar investigación en campo",
    "Fiscalía General de Aguascalientes a entregar documentación",
    "Revisar carpeta de investigación en el Centro de Justicia de la Mujer",
    "Lavar y abastecer la unidad",
    "Entrevistarse con el Ministerio Público del Centro de Justicia de la Mujer"
];

// Función para mover oficiales a la lista de vacaciones
function moveToVacation() {
    const availableOfficers = document.getElementById("availableOfficers");
    const vacationOfficers = document.getElementById("vacationOfficers");
    Array.from(availableOfficers.selectedOptions).forEach(option => vacationOfficers.appendChild(option));
}

// Función para mover oficiales de vuelta a la lista de disponibles
function moveToAvailable() {
    const vacationOfficers = document.getElementById("vacationOfficers");
    const availableOfficers = document.getElementById("availableOfficers");
    Array.from(vacationOfficers.selectedOptions).forEach(option => availableOfficers.appendChild(option));
}

// Función para generar la hora aleatoria
function generateRandomTime(minHour, maxHour, additionalMinutes = 0) {
    const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
    const minutes = Math.floor(Math.random() * 59);
    return `${hour}:${minutes < 10 ? "0" : ""}${minutes}`;
}

// Función para mezclar un arreglo aleatoriamente
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para formatear fechas en el formato DD/MM/YYYY
function formatDate(day, month, year) {
    const formattedDay = day.toString().padStart(2, '0');
    const formattedMonth = month.toString().padStart(2, '0');
    return `${formattedDay}/${formattedMonth}/${year}`;
}

// Función para generar la tabla con la información
function generateTable() {
    // Obtener el vehículo seleccionado
    const vehicle = document.getElementById("vehicle").value;

    // Actualizar el subtítulo con el vehículo seleccionado
    const subtitleElement = document.getElementById("vehicleSubtitle");
    subtitleElement.textContent = `Vehículo: ${vehicle}`;

    const vacationOfficers = Array.from(document.getElementById("vacationOfficers").options).map(o => o.value);
    const availableOfficers = Array.from(document.getElementById("availableOfficers").options).map(o => o.value);
    const allOfficers = [...availableOfficers];

    // Mezclar aleatoriamente los oficiales antes de generar la tabla
    shuffleArray(allOfficers);

    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;

    const daysInMonth = new Date(year, month, 0).getDate();
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = '';

    const motiveUsage = { "Lavar y abastecer la unidad": [] }; // Track weekly usage
    let doubleDaysCount = 0;
    let officerAssignments = [...allOfficers];
    let officerIndex = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        if (date.getDay() === 0) continue; // Excluir domingos
        let recordsToday = 1;

        // Determinar si hoy debe tener dos registros
        if (doubleDaysCount < 4 && Math.random() < 0.3) { // 30% de probabilidad de tener un doble registro
            recordsToday = 2;
            doubleDaysCount++;
        }

        const usedMotives = new Set();

        for (let record = 0; record < recordsToday; record++) {
            // Mezclar aleatoriamente antes de cada asignación de oficial
            shuffleArray(officerAssignments);
            
            // Asignar oficial
            let officer = officerAssignments[officerIndex];
            if (vacationOfficers.includes(officer)) {
                officerIndex = (officerIndex + 1) % officerAssignments.length;
                continue;
            }
            officerIndex = (officerIndex + 1) % officerAssignments.length;

            // Asignar motivo
            let motive;
            do {
                motive = motives[Math.floor(Math.random() * motives.length)];
            } while (
                usedMotives.has(motive) ||
                (motive === "Lavar y abastecer la unidad" && motiveUsage[motive]?.includes(Math.ceil(day / 7)))
            );
            usedMotives.add(motive);

            // Realizar seguimiento del uso semanal de "Lavar y abastecer la unidad"
            if (motive === "Lavar y abastecer la unidad") {
                if (!motiveUsage[motive]) motiveUsage[motive] = [];
                motiveUsage[motive].push(Math.ceil(day / 7));
            }

            // Generar horas
            const salida = generateRandomTime(8, 12);
            const [horaSalida] = salida.split(':').map(Number);
            let regreso = generateRandomTime(horaSalida, 15, Math.floor(Math.random() * 3) + 2);
            const [horaRegreso] = regreso.split(':').map(Number);

            if (horaRegreso >= 16) {
                regreso = `16:${Math.floor(Math.random() * 59 + 1)}`;
            }

            const row = `<tr>
                <td>${officer}</td>
                <td>${formatDate(day, month, year)}</td>
                <td>${salida}</td>
                <td>${regreso}</td>
                <td style="word-wrap: break-word; max-width: 200px;">${motive}</td>
                <td></td>
            </tr>`;
            tableBody.innerHTML += row;
        }
    }
    document.getElementById("vehicleTable").style.display = "table";
}
function printTable() {
    const tableContent = document.getElementById("vehicleTable").outerHTML; // Obtener la tabla generada
    const vehicle = document.getElementById("vehicle").value; // Obtener el vehículo seleccionado
    const newWindow = window.open("", "", "width=800,height=600"); // Crear una nueva ventana

    newWindow.document.write(`
        <html>
            <head>
                <title>Imprimir Tabla</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 10px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border: 2px solid #ddd;
                    }
                    th {
                        background-color: #f2f2f2;
                        text-align: center;
                    }
                    .header-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 0; /* Eliminamos el margen entre los logos y el título */
                    }
                    .header-container img {
                        width: 70px;
                        height: auto;
                    }
                    .header-container h2, .header-container h3 {
                        margin: 0; /* Eliminar márgenes para que estén alineados perfectamente */
                        text-align: center;
                        font-size: 14px; /* Ajuste de tamaño de los títulos */
                    }
                    .header-container h2 {
                        font-size: 16px; /* Un poco más grande el título principal */
                    }
                </style>
            </head>
            <body>
                <div class="header-container">
                    <div>
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQREKGz3IuIs5agaKx9X5OXFM7KbwN1qdhhzg&s" alt="Logo 1">
                    </div>
                    <div>
                        <h2>REGISTRO DE SALIDA DE PERSONAL</h2>
                        <h3>Vehículo: ${vehicle}</h3>
                    </div>
                    <div>
                        <img src="https://c5i.aguascalientes.gob.mx/sistemas/extorsiones/images/logo_ssp.png" alt="Logo 2">
                    </div>
                </div>
                ${tableContent}
            </body>
        </html>
    `);
    newWindow.document.close(); // Cerrar el documento para renderizarlo
    newWindow.print(); // Abrir el cuadro de diálogo de impresión
}
