let tasks = [
    new Task('Programar0', 'Hoy me toca programar 6 horas0', '2024-06-26', '00:00'), 
    new Task('Programar1', 'Hoy me toca programar 6 horas1', '2024-07-30', '00:10'),
    new Task('Programar2', 'Hoy me toca programar 6 horas2', '2024-07-10', '00:20'),
    new Task('Programar3', 'Hoy me toca programar 6 horas3', '2024-08-01', '00:30'),
    new Task('Programar4', 'Hoy me toca programar 6 horas4', '2024-08-02', '00:40'),
    new Task('Programar5', 'Hoy me toca programar 6 horas5', '2024-08-03', '00:50'),
]; 

//DATE------
date = new Date();
const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']

let year = date.getUTCFullYear()
let month = date.getUTCMonth()
month = months[month]; 

let dayNumber = date.getUTCDay(); 

let loadApp = () => {
    loadList(); 
    loadDate(); 

    timeLeft(); //Calcula si la fecha es actual o pasada

    completeTask(); //Marca la tarea como completa
    editTask(); //Editara la tarea que se le indique
}

let loadDate = () => {
    document.getElementById('year').innerHTML = year;  
    document.getElementById('month').innerHTML = month;
    beforeDate(); 
    nowDate(); 
    afterDate(); 
}

const formatDay = (day)=>{
    if(day < 10){
        return '0'+day; 
    }   
    return day; 
}

//Fecha anterior
let beforeDate = () => {
    let before_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() - 1);
    let b_dayN = before_date.getUTCDay();
    b_dayN = day[b_dayN];
    let b_day = formatDay(before_date.getUTCDate());
    let b_month = months[before_date.getUTCMonth()];

    document.getElementById('dayNameB').innerHTML = b_dayN;
    document.getElementById('dayNumberB').innerHTML = b_day; 
    document.getElementById('monthB').innerHTML = b_month;
}

//Fecha actual 
let nowDate = () => {
    let now_date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    let n_dayN = day[dayNumber];
    let n_day = formatDay(now_date.getDate())
    let n_month = months[now_date.getMonth()]

    document.getElementById('dayName').innerHTML = n_dayN;
    document.getElementById('dayNumber').innerHTML = n_day; 
    document.getElementById('monthN').innerHTML = n_month;
}

//Fecha de mañana
let afterDate = () => {
    let after_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    let a_dayN = after_date.getUTCDay();
    a_dayN = day[a_dayN];
    let a_day = formatDay(after_date.getUTCDate());
    let a_month = months[after_date.getUTCMonth()];

    document.getElementById('dayNameA').innerHTML = a_dayN;
    document.getElementById('dayNumberA').innerHTML = a_day; 
    document.getElementById('monthA').innerHTML = a_month;
}

const createItemList = (task, index) => {
    let taskHTML = `
        <div class="all_task" id="${index}">
            <div class="item_list">
                <h3 class="task_title">${task.task}</h3>
                <p class="task_detail">${task.detail}</p>
                <p class="task_date">${task.date}</p>
                <p class="task_time">${task.time}</p>
            </div>
            <div class="btn">
                <button class="edit_btn"><ion-icon name="create-outline"></ion-icon></button>
                <button class="completed_btn"><ion-icon name="checkmark-circle-outline"></ion-icon></button>
                <button class="delete_btn"><ion-icon name="trash-outline"></ion-icon></button>
            </div>
        </div>
    `; 
    return taskHTML; 
}

//Crea la lista de tareas que hay registradas
const loadList = () => {
    let taskHTML = "";
    for(let task of tasks){
        index = task._id; 
        taskHTML += createItemList(task, index)
    }
    document.getElementById('container_item_task').innerHTML = taskHTML; 
}

//Dia final de la tarea 
const timeLeft = () => {
    task_date = document.querySelectorAll('.task_date');
    for(let td of task_date){
        let due_date = new Date(td.innerHTML).getTime(); 
        let current_date = `${new Date().getUTCFullYear()}-${new Date().getUTCMonth()+1}-${new Date().getUTCDate()}`; 
        current_date = new Date(current_date).getTime(); 
        if(due_date < current_date){
            td.classList.add('due_date');
        }
        due_date = td.innerHTML; 
        due_date = due_date.split('-'); 
        due_date[1] = months[due_date[1]-1];
        due_date = due_date.toString(); 
        due_date = due_date.replaceAll(",", "/");
        td.innerHTML = due_date;
        //date.innerHTML = ``; 
        
        //Calcula cuantos dias restantes faltan de una fecha a otra 
        // let remaining_date = (due_date - current_date)/(1000*60*60*24); 
        // remaining_date = Math.round(remaining_date);
        //console.log(remaining_date)
    }
}

const updateTask = (taskID) => {
    const index = parseInt(taskID);
    const update_task = tasks[index-1];
    console.log(update_task); 
};

const completeTask = () => {
    const btns = document.querySelectorAll('.completed_btn'); 
    btns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const taskContainer = event.target.closest('.all_task');
            const div_btn = taskContainer.querySelector('.btn'); 
            if(div_btn){
                div_btn.classList.add('disabled_btns')
            }
            taskContainer.classList.add('completed_task');
        });
    });
};

const editTask = () => {
    const btns = document.querySelectorAll('.edit_btn');
    btns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const taskContainer = event.target.closest('.all_task');
            if(taskContainer.classList.contains('completed_task')){
                btn.disabled = true;
                console.log("boton deshanilitado");
            } else {
                updateTask(taskContainer.id);
                console.log("boton habilitado");
            }
        });
    });
}; 

//Probar en deploy 
document.querySelectorAll('.all_task').forEach(task => {
    let startX;

    task.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    task.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        if (diffX > 50) { // Ajusta este valor según la sensibilidad deseada
            task.classList.add('swiped');
        } else if (diffX < -50) {
            task.classList.remove('swiped');
        }
    });
});


const addTask = () => {
    //Redirecciona a sendTask para agregar la tarea 
    document.location.href ='task.html';
}
