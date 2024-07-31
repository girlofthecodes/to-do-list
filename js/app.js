let tasks = []; 

//Lee el archivo CSV que guardara los elementos que necesito
async function loadTasksCSV(){
    try {
        const response = await fetch('js/tasks.csv');
        const csvText = await response.text();
        const results = Papa.parse(csvText, {
            header: true,
            dynamicTyping: true
        });
        tasks = results.data.map(row => new Task(row._task, row._detail, row._date, row._time));
        console.log('Tasks loaded:', tasks);
    } catch (error) {
        console.error('Error al cargar el archivo CSV:', error);
    }
}; 

//DATE------
date = new Date();
const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']

let year = date.getFullYear()
let month = date.getMonth()
month = months[month]; 

let dayNumber = date.getDay(); 

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasksCSV(); // Espera a que las tareas se carguen
    loadApp(); // Luego llama a loadApp
}); 

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
    let before_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    let b_dayN = before_date.getDay();
    b_dayN = day[b_dayN];
    let b_day = formatDay(before_date.getDate());
    let b_month = months[before_date.getMonth()];

    document.getElementById('dayNameB').innerHTML = b_dayN;
    document.getElementById('dayNumberB').innerHTML = b_day; 
    document.getElementById('monthB').innerHTML = b_month;
}

//Fecha actual 
let nowDate = () => {
    let now_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
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
    let a_dayN = after_date.getDay();
    a_dayN = day[a_dayN];
    let a_day = formatDay(after_date.getDate());
    let a_month = months[after_date.getMonth()];

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
            </div>
        </div>
    `; 
    return taskHTML; 
}

//Crea la lista de tareas que hay registradas
const loadList = () => {
    console.log(tasks);
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
        let current_date = `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`; 
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
    console.log('update: ', update_task); 
};

const completeTask = () => {
    const btn_completed = document.querySelectorAll('.completed_btn'); 
    btn_completed.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const taskContainer = event.target.closest('.all_task');
            const div_btn = taskContainer.querySelector('.btn'); 
            const btn_edit = taskContainer.querySelector('.edit_btn');
            if(div_btn){
                div_btn.classList.toggle('disabled_btns'); 
                if(div_btn.classList.contains('disabled_btns')){
                    btn_edit.classList.add('trash_btn');
                    btn_edit.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'; 
                    deleteTask();
                } else {
                    btn_edit.classList.remove('trash_btn');
                    btn_edit.innerHTML = '<ion-icon name="create-outline"></ion-icon>';
                };
            };
            taskContainer.classList.toggle('completed_task');
        });
    });
};

const editTask = () => {
    const btn_edit = document.querySelectorAll('.edit_btn');
    btn_edit.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const taskContainer = event.target.closest('.all_task');
            if(btn.classList.contains('edit_btn', 'trash_btn')){
                deleteTask();
            } else {
                updateTask(taskContainer.id);
            };
        });
    });
}; 

const deleteTask = () => {
    btn_delete = document.querySelectorAll('.trash_btn');
    btn_delete.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const taskContainer = event.target.closest('.all_task');
            const id_task = parseInt(taskContainer.id); 
            let delete_task = tasks.findIndex(task => task._id === id_task);
            if(delete_task > -1){
                tasks.splice(delete_task, 1); 
                try {
                    await fetch(`/tasks/${id_task}`, {
                        method: 'DELETE'
                    });
                    loadApp(); // Vuelve a cargar la aplicación
                } catch (error) {
                    console.error('Error al eliminar la tarea:', error);
                }
            }
            //loadApp();
        });
    }); 
}; 

const addTask = () => {
    //Redirecciona a sendTask para agregar la tarea 
    document.location.href ='task.html';
}
