let api_key = "159c16ba-5792-4509-b4bb-434c511cd601";

function get_routes(){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes";
  fetch(url + "?api_key=" + api_key)
  .then(response => response.json())
  .then(data => {      
      if(data.error === undefined){
        let tbody = document.getElementById('routes_tbody');
        let tooltips = {};
        data.forEach(function(item, i, data) {          
          let tr = document.createElement('tr');          
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
          td_button.innerHTML = '<button class="btn btn-outline-primary btn-sm">Выбрать</button>';
          
          tr.append(td_name);
          tr.append(td_description);
          tr.append(td_object);
          tr.append(td_button);
          tbody.append(tr);
          
          console.log(item);
        });        
      }
      else{
        console.log(data.error);
      }
  })
  .catch(error => {
      console.error(error);
  });
}

get_routes();