let api_key = "159c16ba-5792-4509-b4bb-434c511cd601";
let routes = {};
let guides = {};
let page = 1;
//Функция получения списка маршрутов, выводим таблицу и запоминаем список (массив routes)
function get_routes(){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes";
  fetch(url + "?api_key=" + api_key)
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){
        let tbody = document.getElementById('routes_tbody');        
        routes = data;
        data.forEach(function(item, i, data) {
          let tr = document.createElement('tr');
          tr.setAttribute('id', 'route_tr_' + i);
          tr.clasName = "route_tr";
          let td_name = document.createElement('td');
          td_name.innerHTML = item.name;
          let td_description = document.createElement('td');
          if(item.description.length > 150){
            td_description.innerHTML = item.description.substring(0, 147) + "...";
            td_description.dataset.bsToggle = "tooltip";
            td_description.dataset.bsTitle = item.description;
            new bootstrap.Tooltip(td_description);
          }
          else{
            td_description.innerHTML = item.description;
          }
          
          let td_object = document.createElement('td');
          if(item.mainObject.length > 150){
            td_object.innerHTML = item.mainObject.substring(0, 147) + "...";
            td_object.dataset.bsToggle = "tooltip";
            td_object.dataset.bsTitle = item.mainObject;
            new bootstrap.Tooltip(td_object);
          }
          else{
            td_object.innerHTML = item.mainObject;
          }
          let td_button = document.createElement('td');
          td_button.dataset.id = i;
          td_button.dataset.server_id = item.id;
          td_button.innerHTML = '<button class="btn btn-outline-primary btn-sm">Выбрать</button>';

          td_button.addEventListener('click', click_route_button, false);

          tr.append(td_name);
          tr.append(td_description);
          tr.append(td_object);
          tr.append(td_button);
          tbody.append(tr);
          
          //console.log(item);
        });
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
//функция пагинации для списка маршрутов
function pagination(){
  let item_start = page * 10 - 9;
  let item_finish = page * 10;
  routes.forEach(function(item, i, routes) {
    let tr = document.getElementById('route_tr_' + i);
    if(item_start <= i && i <= item_finish){
      tr.style.display = '';
    }
    else{
      tr.style.display = 'none';
    }
  });
  let number_pages = Math.floor(routes.length/10) + 1;
  
  let pagination_block = document.getElementById('routes_pagination');
  pagination_block.innerHTML = "";
  let routes_nav_li_prev = document.createElement('li');
  routes_nav_li_prev.dataset.id = (page == 1) ? 1 : page - 1;
  routes_nav_li_prev.className = "page-item pi_routes";
  routes_nav_li_prev.innerHTML = '<a class="page-link" href="#">Предыдущая</a>';
  pagination_block.append(routes_nav_li_prev);

  for(j = 1; j <= number_pages; j++){
    let routes_nav_li = document.createElement('li');
    routes_nav_li.dataset.id = j;
    routes_nav_li.className = (page == j) ? "page-item pi_routes active" : "page-item pi_routes";
    routes_nav_li.innerHTML = '<a class="page-link" href="#">' + j + '</a>';
    pagination_block.append(routes_nav_li);

  }
  let routes_nav_li_last = document.createElement('li');
  routes_nav_li_last.dataset.id = (page == number_pages) ? number_pages : page + 1;
  routes_nav_li_last.className = "page-item pi_routes";
  routes_nav_li_last.innerHTML = '<a class="page-link" href="#">Следующая</a>';
  pagination_block.append(routes_nav_li_last);

  let routes_nav_li_for_click = document.getElementsByClassName("pi_routes");
  for (let i = 0; i < routes_nav_li_for_click.length; i++) {
    routes_nav_li_for_click[i].addEventListener('click', click_routes_pagination, false);
  }
}

//функция смены страницы для списка маршрутов
function click_routes_pagination(e){
  e.preventDefault();
  let data_page = this.getAttribute("data-id");
  page = Number(data_page);
  pagination();
}

//функция для кнопки выбора маршрута
function click_route_button(e){
  e.preventDefault();
  let route_trs = document.getElementsByClassName("route_tr");
  for (let i = 0; i < route_trs.length; i++) {
    route_trs[i].className = "route_tr";
  }
  let id_route = this.getAttribute("data-id");
  let tr_route = document.getElementById('route_tr_' + id_route);  

  tr_route.className = "route_tr table-warning";

  let server_id = this.getAttribute("data-server_id");
  get_guides(server_id)
}

//Функция получения списка гидов, выводим таблицу и запоминаем список (массив guides)
function get_guides(route_id){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes/" + route_id + "/guides";
  fetch(url + "?api_key=" + api_key)
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){
        let guides_list = document.getElementById('guides_list'); 
        guides_list.style.display = '';
        let tbody = document.getElementById('guides_tbody');
        tbody.innerHTML = "";
        guides = data;
        data.forEach(function(item, i, data) {

          let tr = document.createElement('tr');
          tr.setAttribute('id', 'guide_tr_' + i);
          tr.clasName = "guide_tr";          

          let td_avatar = document.createElement('td');
          td_avatar.innerHTML = '<img class="img-fluid" src="avatar.jpg">';
          let td_fio = document.createElement('td');
          td_fio.innerHTML = item.name;
          let td_lang = document.createElement('td');
          td_lang.innerHTML = item.language;
          let td_exp = document.createElement('td');
          td_exp.innerHTML = item.workExperience;
          let td_price = document.createElement('td');
          td_price.innerHTML = item.pricePerHour;
          
          let td_button = document.createElement('td');
          td_button.dataset.id = i;
          td_button.innerHTML = '<button class="btn btn-outline-primary btn-sm">Оформить заявку</button>';

          td_button.addEventListener('click', click_guide_button, false);
          //let td_empty2 = document.createElement('td');

          tr.append(td_avatar);
          tr.append(td_fio);
          tr.append(td_lang);
          tr.append(td_exp);
          tr.append(td_price);
          tr.append(td_button);
          tbody.append(tr);
          //console.log(item);
        });
        //pagination();
      }
      else{
        console.log(data.error);
      }
  })
  .catch(error => {
      console.error(error);
  });
}

//функция для кнопки выбора гида
function click_guide_button(e){
  e.preventDefault();
  /*
  let route_trs = document.getElementsByClassName("route_tr");
  for (let i = 0; i < route_trs.length; i++) {
    route_trs[i].className = "route_tr";
  }
  let id_route = this.getAttribute("data-id");
  let tr_route = document.getElementById('route_tr_' + id_route);  

  tr_route.className = "route_tr table-warning";

  let server_id = this.getAttribute("data-server_id");
  get_guides(server_id)
  */
}

get_routes();