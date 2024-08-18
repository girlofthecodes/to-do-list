let tasks = []; 

//Carga el archivo JSON, rcupera los datos
async function loadTasksJSON() {
    try {
        const response = await fetch('js/tasks.json');
        const data = await response.json();
        tasks = data.map(task => new Task(task._task, task._detail, task._date, task._time));
    } catch (error) {
        console.error('Error al cargar el archivo JSON:', error);
    }
};

//DATE
date = new Date();
const day = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat']

let year = date.getFullYear()
let month = date.getMonth()
month = months[month]; 

let dayNumber = date.getDay(); 

// Función para manejar la carga inicial de la aplicación
async function initializeApp() {
    await loadTasksJSON(); // Espera a que las tareas se carguen
    loadApp(); // Luego llama a loadApp
}

// Función para cargar la aplicación
function loadApp() {
    loadList();
    loadDate();
    timeLeft();
    completeTask();
    editTask();
    deleteTask(); 

    document.getElementById('add_task').addEventListener('click', () => {
        document.location.href = '/task'; 
    });
}

//Se encarga de las fechas que se muestran
let loadDate = () => {
    document.getElementById('year').innerHTML = year;  
    document.getElementById('month').innerHTML = month;
    beforeDate(); 
    nowDate(); 
    afterDate(); 
}

//Fecha anterior
let beforeDate = () => {
    let before_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    let b_dayN = before_date.getDay();
    b_dayN = day[b_dayN];
    let b_day = formatDate(before_date.getDate());
    let b_month = months[before_date.getMonth()];

    document.getElementById('dayNameB').innerHTML = b_dayN;
    document.getElementById('dayNumberB').innerHTML = b_day; 
    document.getElementById('monthB').innerHTML = b_month;
}

//Fecha actual 
let nowDate = () => {
    let now_date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    let n_dayN = day[dayNumber];
    let n_day = formatDate(now_date.getDate())
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
    let a_day = formatDate(after_date.getDate());
    let a_month = months[after_date.getMonth()];

    document.getElementById('dayNameA').innerHTML = a_dayN;
    document.getElementById('dayNumberA').innerHTML = a_day; 
    document.getElementById('monthA').innerHTML = a_month;
}

const createItemList = (task, index) => {
    return `
        <div class="all_task" id=${parseInt(index)}>
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
    
}

//Crea la lista de tareas que hay registradas
const loadList = () => {
    let taskHTML = "";
    for(let task of tasks){
        index = task._id; 
        taskHTML += createItemList(task, index); 
    }
    document.getElementById('container_item_task').innerHTML = taskHTML; 
}

//Dia final de la tarea 
const timeLeft = () => {
    const tasks = document.querySelectorAll('.all_task'); 
    tasks.forEach((task) => {
        const taskDateElement = task.querySelector('.task_date');
        const taskDateString = taskDateElement.innerHTML.trim(); 

        const [day, month, year] = taskDateString.split('/').map(Number);
        const taskDate = new Date(year, month - 1, day);

        // Obtén la fecha actual
        const currentDate = new Date(); // Fecha y hora actuales
        currentDate.setHours(0, 0, 0, 0); // Establece la hora a medianoche para la comparación

        // Comparar las fechas
        if (taskDate.getTime() === currentDate.getTime()) {
            taskDateElement.classList.add('now_date');
        } else if (taskDate < currentDate) {
            taskDateElement.classList.add('due_date');
        }

        if(taskDateElement.classList.contains('due_date')){
            const btn_completed = task.querySelector('.completed_btn');
            btn_completed.classList.add('trash_btn');
            btn_completed.innerHTML = '<ion-icon name="trash-outline"></ion-icon>'; 
        }
    });
}

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
            if(btn.classList == 'edit_btn'){
                updateTask(taskContainer.id);
            }else if(btn.classList.contains('edit_btn', 'trash_btn')){
                deleteTask();
            };
        });
    });
}; 

const updateTask = (taskID) => {
    const id = parseInt(taskID);
    document.location.href = `/task?id=${id}`; //Redirige la tarea por medio del id que se quiere editar 
};

const deleteTask = () => {
    const btn_delete = document.querySelectorAll('.trash_btn');
    btn_delete.forEach(btn => {
        btn.addEventListener('click', async (event) => {
            const taskContainer = event.target.closest('.all_task');
            const id_task = parseInt(taskContainer.id);  // Extraer el ID del atributo data-id del botón
            
            const response = await fetch(`/task?id=${id_task}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                taskContainer.remove(); // Eliminar el contenedor de la tarea del DOM
            }
            
        });
    });
};


// Llamar a deleteTask después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', initializeApp);


