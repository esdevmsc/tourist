let api_key = "159c16ba-5792-4509-b4bb-434c511cd601";

let routes = [];
let requests = [];
let page = 1;

let duration = 0;
let persons = 0;
let option =  false;
let option2 =  false;
let price = 0;
let cost = 0;
//Функция получения списка маршрутов (чтобы получить названия)
function get_routes(){
    let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes";
    fetch(url + "?api_key=" + api_key)
    .then(response => response.json())
    .then(data => {
        if(data.error === undefined){
          data.forEach(function(item, i, data) {
            routes[item.id] = item.name;
          });
          get_requests();
        }
        else{
          console.log(data.error);
        }
    })
    .catch(error => {
        console.error(error);
    });
  }

//Функция получения списка оставленных заявок, выводим таблицу и запоминаем список (массив requests)
function get_requests(){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders";
  fetch(url + "?api_key=" + api_key)
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){
        let tbody = document.getElementById('requests_tbody');        
        tbody.innerHTML = "";

        data.forEach(function(item, i, data) {
          requests[i] = item;
          let tr = document.createElement('tr');

          tr.setAttribute('id', 'request_tr_' + i);
          tr.clasName = "request_tr";
          let td_n = document.createElement('td');
          td_n.innerHTML = i + 1;

          let td_name_route = document.createElement('td');
          td_name_route.innerHTML = routes[item.route_id];          
          
          let td_date = document.createElement('td');
          td_date.innerHTML = item.date;

          let td_price = document.createElement('td');
          td_price.innerHTML = item.price + ' р.';

          let td_buttons = document.createElement('td');
          td_buttons.innerHTML = '<i class="bi bi-eye-fill req_view" data-id="' + i + '" data-bs-toggle="modal" data-bs-target="#view"></i><i class="bi bi-pencil-fill req_edit" style="margin: 0 5px;" data-id="' + i + '" data-bs-toggle="modal" data-bs-target="#edit"></i><i class="bi bi-trash-fill req_delete" data-id="' + i + '" data-bs-toggle="modal" data-bs-target="#delete"></i>';

          tr.append(td_n);
          tr.append(td_name_route);
          tr.append(td_date);
          tr.append(td_price);
          tr.append(td_buttons);

          tbody.append(tr);          
          //console.log(item);
        });
        let requests_view_for_click = document.getElementsByClassName("req_view");
        for (let i = 0; i < requests_view_for_click.length; i++) {
            requests_view_for_click[i].addEventListener('click', click_request_view, false);
        }
        let requests_edit_for_click = document.getElementsByClassName("req_edit");
        for (let i = 0; i < requests_edit_for_click.length; i++) {
            requests_edit_for_click[i].addEventListener('click', click_request_edit, false);
        }
        let requests_delete_for_click = document.getElementsByClassName("req_delete");
        for (let i = 0; i < requests_delete_for_click.length; i++) {
            requests_delete_for_click[i].addEventListener('click', click_request_delete, false);
        }
        pagination();
      }
      else{
        console.log(data.error);
      }
  })
  .catch(error => {
      console.error(error);
  });
}

//функция пагинации для списка заявок
function pagination(){    
  let item_start = page * 5 - 4;
  let item_finish = page * 5;
  let number_pages = Math.floor(requests.length/5) + 1;

  for (let i = 0; i < requests.length; i++) {    
    let tr = document.getElementById('request_tr_' + i);
    if(item_start <= (i+1) && (i+1) <= item_finish){
      tr.style.display = '';
    }
    else{
      tr.style.display = 'none';
    }
  }

  if(number_pages>1){
    let pagination_block = document.getElementById('requests_pagination');
    pagination_block.innerHTML = "";
    let requests_nav_li_prev = document.createElement('li');
    requests_nav_li_prev.dataset.id = (page == 1) ? 1 : page - 1;
    requests_nav_li_prev.className = "page-item pi_requests";
    requests_nav_li_prev.innerHTML = '<a class="page-link" href="#">Предыдущая</a>';
    pagination_block.append(requests_nav_li_prev);
  
    for(j = 1; j <= number_pages; j++){
      let requests_nav_li = document.createElement('li');
      requests_nav_li.dataset.id = j;
      requests_nav_li.className = (page == j) ? "page-item pi_requests active" : "page-item pi_requests";
      requests_nav_li.innerHTML = '<a class="page-link" href="#">' + j + '</a>';
      pagination_block.append(requests_nav_li);
    }
    let requests_nav_li_last = document.createElement('li');
    requests_nav_li_last.dataset.id = (page == number_pages) ? number_pages : page + 1;
    requests_nav_li_last.className = "page-item pi_requests";
    requests_nav_li_last.innerHTML = '<a class="page-link" href="#">Следующая</a>';
    pagination_block.append(requests_nav_li_last);
  }

  let requests_nav_li_for_click = document.getElementsByClassName("pi_requests");
  for (let i = 0; i < requests_nav_li_for_click.length; i++) {
    requests_nav_li_for_click[i].addEventListener('click', click_requests_pagination, false);
  }
}

//функция смены страницы для списка заявок
function click_requests_pagination(e){
  e.preventDefault();
  let data_page = this.getAttribute("data-id");
  page = Number(data_page);
  pagination();
}

//функция для клика по кнопке просмотра заявки
function click_request_view(){    
    let req_id = this.getAttribute("data-id");
    let req = requests[req_id];
    let guide_id = req.guide_id;
    let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/" + guide_id;
    fetch(url + "?api_key=" + api_key)
    .then(response => response.json())
    .then(data => {
        if(data.error === undefined){
            //console.log(data);
            document.getElementById("view_guide_name").innerHTML = data.name;
        }
        else{
            console.log(data.error);
        }
    })
    .catch(error => {
        console.error(error);
    });
    document.getElementById("view_n").innerHTML = req.id;
    document.getElementById("view_route_name").innerHTML = routes[req.route_id];
    document.getElementById("view_date").innerHTML = req.date;
    document.getElementById("view_time").innerHTML = req.time;
    document.getElementById("view_duration").innerHTML = req.duration;
    document.getElementById("view_person").innerHTML = req.persons;
    if(req.optionFirst){
        document.getElementById("view_option").innerHTML = "<b>Трансфер до ближайших станций метро после экскурсии</b><br>Стоимость увеличена на 30%";
    }
    if(req.optionSecond){
        document.getElementById("view_option2").innerHTML = "<b>Интерактивный путеводитель</b><br>Стоимость увеличена в 1.5 раза";
    }

    document.getElementById("view_cost").innerHTML = req.price;
}

//функция для клика по кнопке редактирования заявки
function click_request_edit(){
    let req_id = this.getAttribute("data-id");

    document.getElementById("edit_sub").dataset.id = requests[req_id].id;
    let req = requests[req_id];
    let guide_id = req.guide_id;
    let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/guides/" + guide_id;
    fetch(url + "?api_key=" + api_key)
    .then(response => response.json())
    .then(data => {
        if(data.error === undefined){
            price = data.pricePerHour;
            duration = document.getElementById("edit_duration").value;
            persons = document.getElementById("edit_people").value;
            option = document.getElementById("edit_option").checked;
            option2 = document.getElementById("edit_option2").checked;
            get_price();
            document.getElementById("edit_guide_name").innerHTML = data.name;
        }
        else{
          console.log(data.error);
        }
    })
    .catch(error => {
        console.error(error);
    });
    document.getElementById("edit_route_name").innerHTML = routes[req.route_id];
    document.getElementById("edit_date").value = req.date;
    document.getElementById("edit_time").value = req.time;
    document.getElementById("edit_duration").value = req.duration;
    document.getElementById("edit_people").value = req.persons;
    if(req.optionFirst){
      document.getElementById("edit_option").checked = true;
    }
    if(req.optionSecond){
      document.getElementById("edit_option2").checked = true;
    }

    document.getElementById("edit_price").innerHTML = req.price;
}

//Расчет стоимости
function get_price(){   
  cost =  Number(price) * Number(duration) * Number(persons);  
  if(option === true){
    cost = cost * 1.3;
  }
  if(option2 === true){
    cost = cost * 1.5;
  }
  cost = Math.floor(cost);
  console.log(cost, price, duration, persons, option, option2);
  document.getElementById("edit_price").innerHTML = cost;
}

//изменение продолжительности
document.getElementById("edit_duration").addEventListener('change', function(e){
  duration = this.value;
  get_price();
});

//изменение количества участников
document.getElementById("edit_people").addEventListener('change', function(e){
  persons = this.value;
  get_price();
});

//изменение дополнительной опции
document.getElementById("edit_option").addEventListener('change', function(e){  
  option = this.checked;
  get_price();
});

//изменение второй дополнительной опции
document.getElementById("edit_option2").addEventListener('change', function(e){  
  option2 = this.checked;
  get_price();
});

//функция сохранения заявки при редактировании
document.getElementById("edit_sub").addEventListener('click', function(){
  let req_id = this.getAttribute("data-id");
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/" + req_id;

  let formData = new FormData();

  formData.append('date', document.getElementById("edit_date").value);
  formData.append('time', document.getElementById("edit_time").value);
  formData.append('duration', duration);
  formData.append('optionFirst', option);
  formData.append('optionSecond', option2);
  formData.append('persons', persons);
  
  formData.append('price', cost);

  fetch(url + "?api_key=" + api_key, {
    method: 'PUT',
    body: formData
  })
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){        
        get_routes();
        let alert = document.getElementById("alert");
        alert.className = "row alert alert-warning";
        let message = document.getElementById("message");
        message.innerHTML = "Изменения успешно сохранены";
      }
      else{
        let alert = document.getElementById("alert");
        alert.className = "row alert alert-warning";
        let message = document.getElementById("message");
        message.innerHTML = "Просизошла ошибка" + data.error;          
      }
  })
  .catch(error => {
    let alert = document.getElementById("alert");
    alert.className = "row alert alert-warning";
    let message = document.getElementById("message");
    message.innerHTML = "Просизошла ошибка" + error;       
  });

});

//функция для клика по кнопке удаления заявки
function click_request_delete(){
    let req_id = this.getAttribute("data-id");
    let req = requests[req_id];
    document.getElementById("delete_sub").dataset.id = req.id;
}

//функция удаления заявки
document.getElementById("delete_sub").addEventListener('click', function(){
  let id = this.getAttribute("data-id");
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders/" + id;
  fetch(url + "?api_key=" + api_key, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      if(data.error === undefined){
        get_requests();
        message("Заявка успешно удалена");
      }
      else{
        console.log(data.error);
      }
  })
  .catch(error => {
      console.error(error);
  });
});

//функция показа сообщения о действии
function message(text){
  let alert = document.getElementById("alert");
  alert.className = "row alert alert-warning";
  //alert.style.display = '';
  //alert.style.display = 'none';
  let message = document.getElementById("message");
  message.innerHTML = text;  
  //window.scrollTo(0, 0);
}

get_routes();