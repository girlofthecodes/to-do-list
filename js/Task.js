class Task{
    static taskCounter = 0;
    constructor(task, detail, date, time){
        this._id = ++Task.taskCounter; 
        this._task = task;
        this._detail = detail;
        this._date = date, 
        this._time = time;
    }

    get id(){
        return this._id;
    }

    get task(){
        return this._task; 
    }

    set task(task){
        this._task = task;
    }

    get detail(){
        return this._detail;
    }

    set detail(detail){
        this._detail = detail;
    }

    get date(){
        return this._date;
    }

    set date(date){
        this._date = date;
    }

    get time(){
        return this._time;
    }

    set time(time){
        this._time = time;
    }
}