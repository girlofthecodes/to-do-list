//Calendario dinamico 
let currentDate = document.querySelector('.current_date');
let dayTag = document.querySelector('.days');
let dayTagName = document.querySelector('.weeks'); 

let prevNextIcon = document.querySelectorAll('.icons span'); 
let prev = document.getElementById('prev'); 

let calendar = document.querySelector('#calendar');



let date = new Date(); 
let currYear = date.getFullYear(); 
let currMonth = date.getMonth(); 

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let dateTask = []; //Almacena la fecha en la que se realizara la tarea
let finalHour = []; //Almacena la hora en la que se realizara la tarea

let loadTask = () => {
    //renderCalendar(); //Construye el calendario 
    //renderClock(); //Construye el reloj 

    daySelected(); //Lanza la fecha seleccionada 
    //hourSelected(); //Lanza la hora seleccionada
     //
}

//Le da estilo al textarea 
const taskTextarea = () => {
    document.getElementsByTagName("textarea")[0].dispatchEvent(new Event('input', { bubbles: true }));
    const txHeight = 16;
    const tx = document.getElementsByTagName("textarea");
    
    for(let i= 0; i < tx.length; i++){
        if(tx[i].value.trim() == ''){
            tx[i].setAttribute('style', 'height: ' + txHeight + 'px;overflow-y: hidden;');
        } else {
            tx[i].setAttribute('style', 'height: ' + (tx[i].scrollHeight) + 'px;overflow-y: hidden;');
        }
        tx[i].addEventListener('input', OnInput, false); 
    }
}

function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + "px";
}

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
            currMonth = currMonth - 1;
        } else {
            currMonth = currMonth + 1; 
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


/*RELOJ DINAMICO*/
const renderClock = () => {
    /*Mostrara los valores del reloj tanto de horas como minutos*/
    let hoursList = document.querySelector('.hour'); 
    let minutesList = document.querySelector('.minutes');

    for (let countHour = 0; countHour < 24; countHour++){
        const hourItem = document.createElement('li');
        hourItem.innerHTML = countHour.toString().padStart(2, '0'); 
        hoursList.appendChild(hourItem); 
    }

    for (let countMinute = 0; countMinute < 60; countMinute++){
        const minuteItem = document.createElement('li'); 
        minuteItem.innerHTML = countMinute.toString().padStart(2,'0'); 
        minutesList.appendChild(minuteItem);
    }

    //Da el efecto de que la lista de horas y minutos sea infinita
    const hoursItems = document.querySelectorAll('.hour li'); 
    const minutesItems = document.querySelectorAll('.minutes li'); 

    hoursItems.forEach(item => {
        hoursList.appendChild(item.cloneNode(true));
    });

    minutesItems.forEach(item => {
        minutesList.appendChild(item.cloneNode(true));
    }); 
}

const daySelected = () => {
    let daysAll = document.querySelectorAll('.days'); 
    possibleDays = [];

    for(let aDay of daysAll){
        aDay.addEventListener('click', function(evt){
            let day = evt.target; 
            day = day.innerHTML; 

            //Agregba day, month y year a la lista
            possibleDays.push(currYear);
            possibleDays.push(currMonth);
            possibleDays.push(parseInt(day));
            dateTask = possibleDays.splice(possibleDays - 3); 
            console.log(dateTask);
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

const sendTask = () => {
    //let button = document.getElementById('send_task');
    let title = document.getElementById('task'); //Recupera Task
    let detail = document.getElementById('detail'); //Recupera Detail
    let dayNow = document.querySelector(".active").innerHTML; //Dia actual

    //Agrega la fecha actual segun el formato que necesite
    if(isNaN(dateTask[0])){
        dateTask = `${currYear}/${currMonth}/${dayNow}`; 
    } else {
        dateTask = dateTask.toString();
        dateTask = dateTask.replaceAll(",", "/");
        
        if (typeof dateTask === "string" && dateTask.length === 0){
            dateTask = `${currYear}/${currMonth}/${dayNow}`; 
        } 
    };

    tasks.push(new Task(title.value, detail.value, dateTask, '00:00'));
    console.log(tasks)
}

document.addEventListener('DOMContentLoaded', () => {
    //Hace la comprobacion de si se intreso informacion en el elemento task
    let task = document.getElementById('task'); 
    task.addEventListener('input', checkInput, false);

    //Modifica la altura de textarea (task+detail)
    taskTextarea(); 

    renderCalendar(); //Construye el calendario 
    renderClock(); //Construye el reloj 

    //boton que redirecciona a index.html
    let button = document.getElementById('send_task');
    button.addEventListener('click', () => {
        sendTask();
        document.location.href ='index.html';  
    }); 
});