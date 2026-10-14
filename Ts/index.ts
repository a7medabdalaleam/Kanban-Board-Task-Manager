interface Tasks {
  title: string;
  Priority: string;
  date: string;
  description: string;
  createAt: number;
}
declare const bootstrap: any;
const modalEl = document.getElementById("taskModal") as HTMLElement;
const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
let taskTitle = document.getElementById("taskTitle") as HTMLInputElement;
let taskPriority = document.getElementById("taskPriority") as HTMLSelectElement;
let taskDate = document.getElementById("taskDate") as HTMLInputElement;
let taskDesc = document.getElementById("taskDesc") as HTMLInputElement;
let addbtn = document.getElementById("addbtn") as HTMLButtonElement;
let taskList: Tasks[] = [];
let taskList1: Tasks[] = [];
let taskList2: Tasks[] = [];
let cur = 0;
let cur1 = 0;
let cur2 = 0;
let updateIndex = -1;
let updateSource: "todo" | "progress" | "complete" = "todo";

taskList = JSON.parse(localStorage.getItem("containerTasks") ?? "[]");
taskList1 = JSON.parse(localStorage.getItem("containerTasks1") ?? "[]");
taskList2 = JSON.parse(localStorage.getItem("containerTasks2") ?? "[]");
function renderAll(){
displayTasks();
increaceToDo();
isTodoIsEmpty();

displayTasksProgress();
increacePrograss();
isProgressIsEmpty();


displayTasksComplete();
increaceComplete();
isCompleteIsEmpty();
}
renderAll()

function isTodoIsEmpty() {
  if (taskList.length === 0) {
    (document.getElementById("rowDataToDo") as HTMLElement).innerHTML = `
   <div class="text-center mt-5 " >
            <span class="fs-1" >
              <i class="fa-regular fa-folder-open" style="color: #C5CEDB;"></i>
            </span>
            <span class="d-block " style="color: #C5CEDB;" >
              No tasks yet
            </span>
            <span style="color: #C5CEDB;">
              Click + to add one
            </span>
          </div>
  `;
  }
}
function isCompleteIsEmpty() {
  if (taskList2.length === 0) {
    (document.getElementById("completelist") as HTMLElement).innerHTML = `
   <div class="text-center mt-5 " >
            <span class="fs-1" >
              <i class="fa-regular fa-folder-open" style="color: #C5CEDB;"></i>
            </span>
            <span class="d-block " style="color: #C5CEDB;" >
              No tasks yet
            </span>
            <span style="color: #C5CEDB;">
              Click + to add one
            </span>
          </div>
  `;
  }
}
function isProgressIsEmpty() {
  if (taskList1.length === 0) {
    (document.getElementById("rowDataProgress") as HTMLElement).innerHTML = `
   <div class="text-center mt-5 " >
            <span class="fs-1" >
              <i class="fa-regular fa-folder-open" style="color: #C5CEDB;"></i>
            </span>
            <span class="d-block " style="color: #C5CEDB;" >
              No tasks yet
            </span>
            <span style="color: #C5CEDB;">
              Click + to add one
            </span>
          </div>
  `;
  }
}
function addTask(): any {
  if (validTitle() && validDate()) {
    let tasks: Tasks = {
      title: taskTitle.value,
      Priority: taskPriority.value,
      date: taskDate.value,
      description: taskDesc.value,
      createAt: Date.now(),
    };
    taskList.push(tasks);
    localStorage.setItem("containerTasks", JSON.stringify(taskList));

    displayTasks();
    increaceToDo();
    clearData();
  }
}
function increaceToDo() {
  cur = taskList.length;
  (document.getElementById("addtakstodo") as HTMLElement).innerHTML =
    ` ${cur} ${cur === 1 ? `task` : "tasks"}`;
}
function increacePrograss() {
  cur1 = taskList1.length;
  (document.getElementById("pprogress") as HTMLElement).innerHTML =
    ` ${cur1} ${cur1 === 1 ? `task` : "tasks"}`;
}
function increaceComplete() {
  cur2 = taskList2.length;
  (document.getElementById("pcomplete") as HTMLElement).innerHTML =
    ` ${cur2} ${cur2 === 1 ? `task` : "tasks"}`;
}
function timeAgo(timestamp: number) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
function formatDate(dateStr: string) {
  if (!dateStr) return "";
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
function deleteItem(index: number) {
  taskList.splice(index, 1);
  localStorage.setItem("containerTasks", JSON.stringify(taskList));
  displayTasks();
  increaceToDo();
  isTodoIsEmpty();
}
function deleteItem2(index: number) {
  taskList1.splice(index, 1);
  localStorage.setItem("containerTasks1", JSON.stringify(taskList1));
  displayTasksProgress();
  increacePrograss();
  isProgressIsEmpty();
}
function deleteItem3(index: number) {
  taskList2.splice(index, 1);
  localStorage.setItem("containerTasks2", JSON.stringify(taskList2));
  displayTasksComplete();
  isCompleteIsEmpty();
  increaceComplete();
}
function displayTasks() {
  let cartona = ``;
  for (let i = 0; i < taskList.length; i++) {
    cartona += `
        <article class="task is-overdue">
            <div class="task-id d-flex justify-content-between" >
               <div>
                 <span class="dot dot-gray me-2"></span>#00${i + 1}
               </div>
                <div class="hover-show" >
                    <span class="mx-2 ">
                        <i
                        data-action="setupdate" data-index="${i}"
                        class="fa-solid fa-pen i-pen" style="color: rgb(97, 104, 116);"></i>
                    </span>
                    <span>
                        <i 
                        data-action="delete" data-index="${i}"
                         class="fa-solid fa-trash i-trash" style="color: rgb(97, 104, 116);"></i>
                    </span>
                </div>
            </div>
            <h3 class="task-title">${taskList[i]?.title}</h3>
            <p class="task-desc">${taskList[i]?.description}</p>

            <div class="tags">
              <span class="tag tag-${taskList[i]?.Priority}"><span class="dot"></span>${taskList[i]?.Priority}</span>
            </div>

            <div class="dates">
              <span class="due"><i class="fa-regular fa-calendar"></i> ${formatDate(String(taskList[i]?.date))} </span>
              <span><i class="fa-regular fa-clock"></i>${timeAgo(Number(taskList[i]?.createAt))}</span>
            </div>

            <div class="actions">
              <button
              id='startbtn'
              data-action='setstart' data-index='${i}'
              type="button" class="btn-act btn-start"><i class="fa-solid fa-play"></i>Start</button>
              <button
              data-action='setcomplete' data-index='${i}'
              type="button" class="btn-act btn-complete"><i class="fa-solid fa-check"></i>Complete</button>
            </div>
          </article>
        `;
  }
  (document.getElementById("rowDataToDo") as HTMLElement).innerHTML = cartona;
}
(document.getElementById("rowDataToDo") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="delete"]',
    );

    if (!btn) return;

    deleteItem(Number(btn.dataset.index));
  },
);
(document.getElementById("rowDataToDo") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnupdate = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setupdate"]',
    );

    if (!btnupdate) return;

    setUpdate(Number(btnupdate.dataset.index), "todo");
  },
);

(document.getElementById("rowDataProgress") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="delete"]',
    );

    if (!btn) return;

    deleteItem2(Number(btn.dataset.index));
  },
);
(document.getElementById("completelist") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="delete"]',
    );

    if (!btn) return;

    deleteItem3(Number(btn.dataset.index));
  },
);

(document.getElementById("rowDataProgress") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnupdate = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setupdate"]',
    );

    if (!btnupdate) return;

    setUpdate(Number(btnupdate.dataset.index), "progress");
  },
);
(document.getElementById("completelist") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnupdate = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setupdate"]',
    );

    if (!btnupdate) return;

    setUpdate(Number(btnupdate.dataset.index), "complete");
  },
);

(document.getElementById("rowDataToDo") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnstart = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setstart"]',
    );
    if (!btnstart) return;
    setstart(Number(btnstart.dataset.index),'todo');
  },
);
(document.getElementById("completelist") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnstart = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setstart"]',
    );
    if (!btnstart) return;
    setstart(Number(btnstart.dataset.index),'complete');
  },
);

function setstart(index: number,source:'todo'|'complete') {
  const form=source==='todo'?taskList:taskList2
  const task: any = form[index];
  if (!task) return;
  taskList1.push(task);
  form.splice(index, 1);
  localStorage.setItem("containerTasks", JSON.stringify(taskList));
  localStorage.setItem("containerTasks1", JSON.stringify(taskList1));
  localStorage.setItem("containerTasks2", JSON.stringify(taskList2));
  renderAll()
}
(document.getElementById("rowDataToDo") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnscomplete = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setcomplete"]',
    );
    if (!btnscomplete) return;
    setcomplete(Number(btnscomplete.dataset.index),'todo');
  },
);
function setcomplete(index: number,source:'todo'|'progress') {
  const form=source==='todo'?taskList:taskList1
  const task: any = form[index];
  if (!task) return;
  taskList2.push(task);
  form.splice(index, 1);
  localStorage.setItem("containerTasks", JSON.stringify(taskList));
  localStorage.setItem("containerTasks1", JSON.stringify(taskList1));
  localStorage.setItem("containerTasks2", JSON.stringify(taskList2));
  displayTasks();
  increaceToDo();
  isTodoIsEmpty();
  isCompleteIsEmpty();
  displayTasksComplete();
  increaceComplete();
  displayTasksProgress();
  increacePrograss();
  isProgressIsEmpty();
}
function setToDO(index: number,source:'progress'|'complete') {
  const from = source === "progress" ? taskList1 : taskList2;
  const task = from[index];
  if (!task) return;

  taskList.push(task);
  from.splice(index, 1);

  localStorage.setItem("containerTasks", JSON.stringify(taskList));
  localStorage.setItem("containerTasks1", JSON.stringify(taskList1));
  localStorage.setItem("containerTasks2", JSON.stringify(taskList2));

  renderAll(); 
}
(document.getElementById("rowDataProgress") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnscomplete = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setToDO"]',
    );
    if (!btnscomplete) return;
    setToDO(Number(btnscomplete.dataset.index),'progress');
  },
);
(document.getElementById("completelist") as HTMLElement).addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-action="setToDO"]');
  if (!btn) return;
  setToDO(Number(btn.dataset.index), "complete");
});
function displayTasksComplete() {
  let cartona = ``;
  for (let i = 0; i < taskList2.length; i++) {
    cartona += `
        <article class="task is-overdue">
            <div class="task-id d-flex justify-content-between" >
               <div>
                 <span class="dot dot-green me-2"></span>#00${i + 1}
               </div>
                <div class="hover-show" >
                    <span class="mx-2 ">
                        <i
                        data-action="setupdate" data-index="${i}"
                        class="fa-solid fa-pen i-pen" style="color: rgb(97, 104, 116);"></i>
                    </span>
                    <span>
                        <i 
                        data-action="delete" data-index="${i}"
                         class="fa-solid fa-trash i-trash" style="color: rgb(97, 104, 116);"></i>
                    </span>
                </div>
            </div>
            <h3 class="task-title">${taskList2[i]?.title}</h3>
            <p class="task-desc">${taskList2[i]?.description}</p>

            <div class="tags">
              <span class="tag tag-${taskList2[i]?.Priority}"><span class="dot"></span>${taskList2[i]?.Priority}</span>
            <span class="tag tag-done"><i class="fa-solid fa-check"></i>Done</span>
              </div>

            <div class="dates">
              <span class="due"><i class="fa-regular fa-calendar"></i> ${formatDate(String(taskList2[i]?.date))} </span>
              <span><i class="fa-regular fa-clock"></i>${timeAgo(Number(taskList2[i]?.createAt))}</span>
            </div>

           <div class="actions">
              <button
              data-action='setToDO' data-index='${i}'
              type="button" class="btn-act btn-todo"><i class="fa-solid fa-rotate-left"></i>To Do</button>
              <button
              data-action='setstart' data-index='${i}'
              type="button" class="btn-act btn-start"><i class="fa-solid fa-play"></i>Start</button>
            </div>
          </article>
        `;
  }
  (document.getElementById("completelist") as HTMLElement).innerHTML = cartona;
}
(document.getElementById("rowDataProgress") as HTMLElement).addEventListener(
  "click",
  (e) => {
    const btnscomplete = (e.target as HTMLElement).closest<HTMLElement>(
      '[data-action="setcomplete"]',
    );
    if (!btnscomplete) return;
    setcomplete(Number(btnscomplete.dataset.index),'progress');
  },
);

function displayTasksProgress() {
  let cartona = ``;
  for (let i = 0; i < taskList1.length; i++) {
    cartona += `
        <article class="task is-overdue">
            <div class="task-id d-flex justify-content-between" >
               <div>
                 <span class="dot dot-amber me-2"></span>#00${i + 1}
               </div>
                <div class="hover-show" >
                    <span class="mx-2 ">
                        <i
                        data-action="setupdate" data-index="${i}"
                        class="fa-solid fa-pen i-pen" style="color: rgb(97, 104, 116);"></i>
                    </span>
                    <span>
                        <i 
                        data-action="delete" data-index="${i}"
                         class="fa-solid fa-trash i-trash" style="color: rgb(97, 104, 116);"></i>
                    </span>
                </div>
            </div>
            <h3 class="task-title">${taskList1[i]?.title}</h3>
            <p class="task-desc">${taskList1[i]?.description}</p>

            <div class="tags">
              <span class="tag tag-${taskList1[i]?.Priority}"><span class="dot"></span>${taskList1[i]?.Priority}</span>
            </div>

            <div class="dates">
              <span class="due"><i class="fa-regular fa-calendar"></i> ${formatDate(String(taskList1[i]?.date))} </span>
              <span><i class="fa-regular fa-clock"></i>${timeAgo(Number(taskList1[i]?.createAt))}</span>
            </div>

            <div class="actions">
              <button
              data-action='setToDO' data-index='${i}'
              type="button" class="btn-act btn-todo"><i class="fa-solid fa-rotate-left"></i>To Do</button>
              <button
              data-action='setcomplete' data-index='${i}'
              type="button" class="btn-act btn-complete"><i class="fa-solid fa-check"></i>Complete</button>
            </div>
          </article>
        `;
  }
  (document.getElementById("rowDataProgress") as HTMLElement).innerHTML =
    cartona;
}

function clearData() {
  taskTitle.value = "";
  taskPriority.value = "medium";
  taskDate.value = "";
  taskDesc.value = "";
}
function setUpdate(index: number, source: "todo" | "progress" | "complete") {
  const list =
    source === "todo"
      ? taskList
      : source === "progress"
        ? taskList1
        : taskList2;
  const task = list[index];
  if (!task) return;
  updateIndex = index;
  updateSource = source;
  taskTitle.value = task.title;
  taskPriority.value = task.Priority;
  taskDate.value = task.date;
  taskDesc.value = task.description;
  modal.show();
  document.getElementById("savebtn")?.classList.remove("d-none");
  addbtn.classList.add("d-none");
}

function udateItem() {
  if (validTitle() && validDate()) {
    const list =
      updateSource === "todo"
        ? taskList
        : updateSource === "progress"
          ? taskList1
          : taskList2;
    const old = list[updateIndex];
    if (!old) return;
    list[updateIndex] = {
      title: taskTitle.value,
      Priority: taskPriority.value,
      date: taskDate.value,
      description: taskDesc.value,
      createAt: old.createAt,
    };
    if (updateSource === "todo") {
      localStorage.setItem("containerTasks", JSON.stringify(taskList));
      displayTasks();
    } else if (updateSource === "progress") {
      localStorage.setItem("containerTasks1", JSON.stringify(taskList1));
      displayTasksProgress();
    } else {
      localStorage.setItem("containerTasks2", JSON.stringify(taskList2));
      displayTasksComplete();
    }
    clearData();
    updateIndex = -1;
    document.getElementById("savebtn")?.classList.add("d-none");
    addbtn.classList.remove("d-none");
  }
}

function validTitle(): boolean {
  const TITLE_REGEX =
    /^(?=.*[\p{L}\p{N}])[\p{L}\p{M}\p{N} .,:;!?'"()\-_#&/+]{3,60}$/u;
  const term = taskTitle.value;
  if (TITLE_REGEX.test(term)) {
    taskTitle.classList.add("is-valid");
    taskTitle.classList.remove("is-invalid");
    document.getElementById("msgTitle")!.classList.add("d-none");
    return true;
  } else {
    taskTitle.classList.remove("is-valid");
    taskTitle.classList.add("is-invalid");
    document.getElementById("msgTitle")!.classList.remove("d-none");
    return false;
  }
}
function validDate(): boolean {
  const valueTime = taskDate.value;
  const msg = document.getElementById("msgDate");
  let isValid = false;
  if (valueTime) {
    const [y, m, d] = valueTime.split("-").map(Number);
    const selected = new Date(y!, m! - 1, d);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    isValid = selected >= today;
  }
  if (isValid) {
    taskDate.classList.add("is-valid");
    taskDate.classList.remove("is-invalid");
    msg!.classList.add("d-none");
    return true;
  } else {
    taskDate.classList.remove("is-valid");
    taskDate.classList.add("is-invalid");
    msg!.classList.remove("d-none");
    return false;
  }
}
taskDate.addEventListener("input", function () {
  validDate();
});

addbtn.addEventListener("click", function () {
  if (validTitle() && validDate()) {
    addTask();
    modal.hide();
    taskTitle.classList.remove("is-valid");
    taskTitle.classList.remove("is-invalid");
  }
});
document.getElementById("savebtn")?.addEventListener("click", function () {
  if (validTitle() && validDate()) {
    udateItem();
    modal.hide();
    taskTitle.classList.remove("is-valid");
    taskTitle.classList.remove("is-invalid");
    taskDate.classList.remove("is-valid");
    taskDate.classList.remove("is-invalid");
  }
});

document.getElementById("cancelbtn")!.addEventListener("click", function () {
  clearData();
  modal.hide();
  taskTitle.classList.remove("is-valid");
  taskTitle.classList.remove("is-invalid");
  taskDate.classList.remove("is-valid");
  taskDate.classList.remove("is-invalid");
  document.getElementById("msgTitle")!.classList.add("d-none");
  document.getElementById("savebtn")?.classList.add("d-none");
  document.getElementById("msgDate")?.classList.add("d-none");
  addbtn.classList.remove("d-none");
});
document.getElementById("btn-close")!.addEventListener("click", function () {
  clearData();
  modal.hide();
  taskTitle.classList.remove("is-valid");
  taskTitle.classList.remove("is-invalid");
  document.getElementById("msgTitle")!.classList.add("d-none");
  document.getElementById("savebtn")?.classList.add("d-none");
  document.getElementById("msgDate")?.classList.add("d-none");
  addbtn.classList.remove("d-none");
});
