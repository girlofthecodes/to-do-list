//Calendario dinamico 
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let date = new Date(); 
let currYear = date.getFullYear(); 
let currMonth = date.getMonth(); 

let currentDate = document.querySelector('.current_date');
let dayTag = document.querySelector('.days');
let dayTagName = document.querySelector('.weeks'); 

let prevNextIcon = document.querySelectorAll('.icons span'); 
let prev = document.getElementById('prev'); 

let calendar = document.querySelector('#calendar');

const initializeTask= () => {
    //date picker
    renderCalendar(); //Construye el calendario 
    daySelected(); //Lanza la fecha seleccionada 

    //time picker
    populateTimeLists();
    updateDisplay();

    document.getElementById('task').addEventListener('input', checkInput, false);

    taskTextarea();
    loadItemTask(); // Carga los datos de la tarea si existe un ID en la URL

    document.getElementById('return').addEventListener('click', () => {
        document.location.href = '/to-do-list/index.html';
    });

    document.getElementById('send_task').addEventListener('click', () => {
        sendTask();
        document.location.href = '/to-do-list/index.html';
    });
};

const formatDate = (data)=>{
    if(data < 10){
        return '0'+data; 
    }   
    return data; 
}

//Le da estilo al textarea 
const taskTextarea = () => {
    document.getElementsByTagName("textarea")[0].dispatchEvent(new Event('input', { bubbles: true }));
    const txHeight = 30;
    const tx = document.getElementsByTagName("textarea");
    
    for(let i= 0; i < tx.length; i++){
        if(tx[i].value.trim() == ''){
            tx[i].setAttribute('style', 'height: ' + txHeight + 'px;overflow-y: hidden;');
        } else {
            tx[i].setAttribute('style', 'height: ' + (tx[i].scrollHeight) + 'px;overflow-y: hidden;');
        }
        tx[i].addEventListener('input', OnInput, false); 
    }
};

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
};

//Funcion que llena el calendario con los dias correspondientes
const renderCalendar = () => {
    let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay(); //Dias del mes segun el numero dado de la semana
    let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate(); //Ultimo dia del mes actual 
    let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate(); //Ultimo(s) dias del mes pasado
    let nextDaysOfMonth = new Date(currYear, currMonth,  lastDateOfMonth).getDay(); //Dias del proximo mes     
    let liTag = ""; 
    let liDay = "";
    
    //Recorre los dias de la semana
    for (let d = 0; d < days.length; d++) {
        liDay += `<li>${days[d]}</li>`
    }

    //Dias antes de que empieze el mes actual 
    for (let i = firstDayOfMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`
    }

    //Dias correspondientes a cada mes 
    for (let i = 1; i <= lastDateOfMonth; i++) {
        let isToday; 
        if (i === date.getDate() && currMonth === new Date().getMonth() 
            && currYear === new Date().getFullYear()) {
            isToday = "active";
        } else if(currMonth === new Date().getMonth() && i < date.getDate() && currYear === new Date().getFullYear()){
            isToday = "inactive";
        }
        liTag += `<li class="${isToday}">${i}</li>`;
    }

    for (let i = nextDaysOfMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - nextDaysOfMonth + 1}</li>`
    }

    if(currMonth <= new Date().getMonth() && currYear <= new Date().getFullYear() 
        || currMonth > new Date().getMonth() && currYear < new Date().getFullYear()){
        currentDate.classList.add('inactiveMonth');
    } else {
        currentDate.classList.remove('inactiveMonth'); 
    }

    currentDate.innerText = `${months[currMonth]} ${currYear}`; 
    dayTagName.innerHTML = liDay; 
    dayTag.innerHTML = liTag;
};

//Calcula los meses y años proximos
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", (event) => {
        if(icon.id === 'prev'){
            if(currentDate.classList.contains('inactiveMonth')){
                event.preventDefault(); 
                return; 
            }
            currMonth -= 1;
        } else {
            currMonth += 1; 
        }

        if(currMonth < 0 || currMonth > 11){
            date = new Date(currYear, currMonth);
            currMonth = date.getMonth();
            currYear = date.getFullYear(); 
        } else {
            date = new Date(); 
        }
        renderCalendar();
    }); 
});

function calendarAttachEventListener(){
    const date = document.getElementById('date');
    const container_calendar = document.getElementById('container-calendar'); 

    date.addEventListener('click', () => {
        togglePopupVisibility(container_calendar);
    });
}


// Función para llenar las listas de horas y minutos
function populateTimeLists() {
    const hoursList = document.querySelector('#time-popup .hours');
    const minutesList = document.querySelector('#time-popup .minutes');

    for (let i = 0; i < 24; i++) {
        hoursList.appendChild(createTimeDiv(i));
    }

    for (let i = 0; i < 60; i += 5) {
        minutesList.appendChild(createTimeDiv(i));
    }
}

// Función para crear un div con el valor de tiempo
function createTimeDiv(value) {
    const timeDiv = document.createElement('div');
    timeDiv.textContent = value.toString().padStart(2, '0');
    return timeDiv;
}

// Función para adjuntar los eventos necesarios
function attachEventListeners() {
    const timeDisplay = document.getElementById('time-display');
    const timePopup = document.getElementById('time-popup');

    timeDisplay.addEventListener('click', () => {
        togglePopupVisibility(timePopup);
    });

    timePopup.querySelector('.hours').addEventListener('click', (event) => {
        if (event.target.tagName === 'DIV') {
            setTime('hour', event.target.textContent);
        }
    });

    timePopup.querySelector('.minutes').addEventListener('click', (event) => {
        if (event.target.tagName === 'DIV') {
            setTime('minute', event.target.textContent);
        }
    });

    document.addEventListener('click', (event) => {
        if (!timeDisplay.contains(event.target) && !timePopup.contains(event.target)) {
            timePopup.style.display = 'none';
        }
    });
}

// Función para alternar la visibilidad del menú desplegable
function togglePopupVisibility(timePopup) {
    timePopup.style.display = timePopup.style.display === 'block' ? 'none' : 'block';
}

// Función para establecer la hora o minuto seleccionado
function setTime(type, value) {
    const timeDisplay = document.getElementById('time-display');
    timeDisplay.dataset[type] = value;
    updateDisplay();
}

// Función para actualizar la visualización del tiempo
function updateDisplay() {
    const timeDisplay = document.getElementById('time-display');
    const hour = timeDisplay.dataset.hour || '00';
    const minute = timeDisplay.dataset.minute || '00';
    timeDisplay.value = `${hour}:${minute}`;
}

const daySelected = () => {
    let daysAll = document.querySelectorAll('.days'); 
    let dayNow = document.querySelector(".active"); //Dia actual}
    let container_date = document.querySelector('#date'); 
    container_date.value = `${formatDate(dayNow.innerHTML)}/${formatDate(currMonth + 1)}/${currYear}`

    for(let aDay of daysAll){
        aDay.addEventListener('click', function(evt){
            let day = evt.target; 
            if(day.classList.contains('active') || day.classList.contains('undefined')){
                day = formatDate(day.innerHTML); 
                const month = formatDate(currMonth+1); 
                container_date.value = `${day}/${month}/${currYear}`
            }
        });
    };
};

const checkInput = () => {
    let button = document.getElementById('send_task');
    let task = document.getElementById('task')
    if(task.value.trim() !== ''){
        button.disabled = false; 
    } else {
        button.disabled = true;
    }
}

//EDITAR TAREA
//Ajusta textarea para cuando se EDITE este tome el alto del texto ingresado
const textareaElements = document.querySelectorAll('.cont_textarea'); 

function adjustHeight() {
    textareaElements.forEach((textarea) => {
        textarea.style.height = 'auto'; //Recetea la altura para medir el contenido
        textarea.style.height = `${textarea.scrollHeight}px`; //Ajusta la altura del contenido
    })
}
// Función para obtener parámetros de la URL
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

async function loadItemTask (){
    const id = parseInt(getQueryParam('id'), 10); 
    if(id){
        const response = await fetch('js/tasks.json');
        const data = await response.json(); 
        const task = data.find(t => t._id === id);
        if(task){
            //Si se esta editando, se habilita el boton para enviar la tarea
            let button = document.getElementById('send_task');
            button.disabled = false;

            //Rellena los campos del formulario 
            document.getElementById('task').value = task._task;
            document.getElementById('detail').value = task._detail; 
            document.getElementById('date').value = task._date;
            document.getElementById('time-display').value = task._time;

            adjustHeight()
        }
    }
}

//Agrega la tarea
async function sendTask(){
    //Obtiene los valores del formulario 
    const id = parseInt(getQueryParam('id'), 10); 
    const title = document.getElementById('task').value; //Recupera Task
    const detail = document.getElementById('detail').value; //Recupera Detail
    const date = document.querySelector("#date").value; //Fecha seleccionada
    const time = document.getElementById("time-display").value; //Hora seleccionada

    //const task = new Task(title, detail, date, '00:00');
    const task = new Task(title, detail, date, time, id || null);
    const method = id ? 'PATCH' : 'POST'; // Determinar el método HTTP
    const url = id ? `/task?id=${id}` : '/task'; // Determinar la URL

    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initializeTask(); 
    attachEventListeners(); //Eventos del time picker
    calendarAttachEventListener();
});