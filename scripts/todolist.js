
let userStatus;
userStatus = getCookieByName('status');
if (userStatus !== 'logged In') {
  window.location.href = 'login.html'
}

function getCookieByName(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
      }
  }
  return null;
}

let data = '';

data = getCookieByName('token');
loadTasksFromServer();


let todoList = [];
function loadTasksFromServer() {
  console.log("running")
  const tasksUrl = 'https://sam-task-manager.srv656652.hstgr.cloud/tasks';
  const getRequest = fetch(tasksUrl,{
    headers: {"Content-Type": "application/json","Authorization": `Bearer ${data}`}
  });

  getRequest.then((response) => {
    return response.json();

  }).then((json) => {

    todoList = json.data;
    renderTodoList();
    console.log('finished')

  }).then(() => {

    console.log(todoList);
    todoList.forEach(({taskID,checked}) => {
      console.log(taskID);
      

      const checkElement = document.getElementById(`${taskID}`);
      checkElement.addEventListener('click', () => {
    
        if (!checked) {
          const patchRequest = fetch('https://sam-task-manager.srv656652.hstgr.cloud/tasks/' + taskID, {
            method: "PATCH",
            body: JSON.stringify({
              checked: true
            }),
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${data}`}
          })
          patchRequest.then((response) => {
            console.log('second!')
            return response.json() ;
          }).then((json) => {
            console.log(json);
            console.log('finished')
            console.log(todoList);
            return json;
          }).then(() => {
            todoList.map((object) => {
              if (object.taskID === `${taskID}`) {
                object.checked = true;
              }
            });
            console.log(todoList);



            renderTodoList();

          })
        }
        else if(checked){
          const patchRequest = fetch('https://sam-task-manager.srv656652.hstgr.cloud/tasks/' + taskID, {
            method: "PATCH",
            body: JSON.stringify({
              checked: false
            }),
            headers: {"Content-Type": "application/json","Authorization": `Bearer ${data}`}
          })
          patchRequest.then((response) => {
            console.log('second');
            return response.json() ;
          }).then((json) => {
            console.log(json);
            
            console.log('finished')
            console.log(todoList);
            return json;
          }).then(() => {
            todoList.map((object) => {
              if (object.taskID === `${taskID}`) {
                object.checked= false;
              }
            });
            console.log(todoList);


            renderTodoList();
          })
        }
      })    
    })
  })
}


function renderTodoList() {
  console.log(todoList);

  let todoListHTML = '';
  todoList.forEach((todoObject, index) => {
    const name = todoObject.name;
    const id = todoObject.taskID;
    const rawDate = todoObject.createdAt;
    // const date = rawDate.split("T")[0] , this or :
    const date = rawDate.substring(0,10); 

    let isChecked;
    const {checked} = todoObject;
    if (checked) {
      isChecked = 'checked';
    }
    else {
      isChecked = ' ';
    }

    let html = `
      <div class="todo p-2 gx-0 px-lg-5 px-3 d-flex align-items-center">
        <label class="custom-checkbox me-3">
          <input ${isChecked} type="checkbox" class="check-box js-input-check" id="${id}">
          <span class="checkmark"></span>
        </label>
        <p class="todo-text m-0 me-auto pt-1">${name}</p>
        <p class="todo-text m-0 pt-1">${date}</p>
        <button class="delete-button ms-4" onclick="
          deleteTodoServer('${id}');
        ">&#8211</button>
      </div>
      
    `
    
    todoListHTML += html;
     
  })
  
  document.querySelector('.todo-container').innerHTML = todoListHTML;
}



document.querySelector('.js-add-button').addEventListener('click',addTodoServer);

const inputElement = document.querySelector('.js-input-todo');

inputElement.addEventListener('click', () => {
  inputElement.classList.add('.new-todoAddContainer');
})


function deleteTodoServer(id) {
  const deleteRequest = fetch('https://sam-task-manager.srv656652.hstgr.cloud/tasks/' + id , {
    method: "DELETE",
    headers :{"Content-Type": "application/json","Authorization": `Bearer ${data}`}
  })
  deleteRequest.then((response) => {
    return response;
  }).then((json) => {
    const deletedTask = todoList.find(({taskID}) => taskID === id);

    taskIndex = todoList.findIndex((task) => task === deletedTask);
    todoList.splice(taskIndex, 1);
    
    renderTodoList();
  })
}



function addTodoServer() {
  const inputElement = document.querySelector('.js-input-todo');
  const nameValue = inputElement.value;

  postToServer(nameValue);
}

function postToServer(nameValue) {
  const nameObj = {
    name: nameValue
  };
  console.log(JSON.stringify(nameObj))
  const tasksUrl = 'https://sam-task-manager.srv656652.hstgr.cloud/tasks'
  const postRequest = fetch(tasksUrl, {
    method: "POST",
    body: JSON.stringify(nameObj),
    headers: {"Content-Type": "application/json","Authorization": `Bearer ${data}`}
  })
  postRequest.then((response) => {
    return response.json();
  }).then((json) => { 
    console.log(json);
    inputElement.value = '';
    todoList.push(json.data);
  }).then(() => {
    renderTodoList();
  })
}
const logoutButton = document.querySelector('.logout-button');
logoutButton.addEventListener('click', logout);

function logout() {
  deleteCookie('token');
  deleteCookie('status');
  window.location.href = 'login.html';
  console.log(document.cookie);
}


function deleteCookie(name) {
  makeCookie(name,null,null);
}
function makeCookie (name, value, daysToLive) {
  let date = new Date();
  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie=`${name}=${value}; ${expires}; path=/`
}














