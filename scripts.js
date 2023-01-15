let api_key = "159c16ba-5792-4509-b4bb-434c511cd601";

function get_routes(){
  let url = "http://exam-2023-1-api.std-900.ist.mospolytech.ru/api/routes";
  fetch(url + "?api_key=" + api_key)
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
}

get_routes();