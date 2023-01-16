let api_key = "159c16ba-5792-4509-b4bb-434c511cd601";

let routes = [];
let requests = [];
let page = 1;

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
    console.log(req);
}

//функция для клика по кнопке редактирования заявки
function click_request_edit(){
    let req_id = this.getAttribute("data-id");
    let req = requests[req_id];
    console.log(req);
}

//функция для клика по кнопке удаления заявки
function click_request_delete(){
    let req_id = this.getAttribute("data-id");
    let req = requests[req_id];
    console.log(req);
}
          /*
//функция для кнопки выбора маршрута
function click_route_button(e){
  e.preventDefault();
  let route_trs = document.getElementsByClassName("route_tr");
  for (let i = 0; i < route_trs.length; i++) {
    route_trs[i].className = "route_tr";
  }
  let id_route = this.getAttribute("data-id");
  let tr_route = document.getElementById('route_tr_' + id_route);

  let route_name = document.getElementById('route_name');
  let modal_route_name = document.getElementById('modal_route_name');

  route_name.innerHTML = this.getAttribute("data-name");
  modal_route_name.innerHTML = this.getAttribute("data-name");
  tr_route.className = "route_tr table-warning";

  let server_id = this.getAttribute("data-server_id");
  
  route_id = server_id;
  get_guides(server_id)
}


//отправка заявки
let modal_sub = document.getElementById("modal_sub");
modal_sub.addEventListener('click', function(e){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/orders";

  let formData = new FormData();
  formData.append('guide_id', guide_id);
  formData.append('route_id', route_id);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('duration', duration);
  formData.append('id', guide_id + route_id);
  formData.append('optionFirst', option);
  formData.append('optionSecond', 0);
  formData.append('persons', people);
  formData.append('price', price);
  formData.append('student_id', 12345654321);

  fetch(url + "?api_key=" + api_key, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){
         console.log(data);
      }
      else{
        console.log(data.error);
      }
  })
  .catch(error => {
      console.error(error);
  });
 
  let alert = document.getElementById("alert");
  alert.style.display = '';
  //alert.style.display = 'none';
  let message = document.getElementById("message");
  message.innerHTML = "Заявка успешно отправлена";  
  //window.scrollTo(0, 0);
}); 
*/
get_routes();