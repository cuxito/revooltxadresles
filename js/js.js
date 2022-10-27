let fecha_entrega = document.getElementById("delivery_day")
let rangos_entrega = document.getElementById("delivery_time_id")

const corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
const url = "https://api-dev.revoolt.me/v3/"

var OptionsRangos = {
		method: 'POST',
		headers: {
            "Authorization": "Basic YWRyZXNsZXNfY29lbGxvQHJldm9vbHQubWU6QWRyZXNsZXMuQ29lbGxvLjE=",
        }
};


//deshabilitar fechas anteriores a la actual
let today = new Date();
let month = today.getMonth() + 1;  
let day = today.getDate();
let year = today.getFullYear();

if(month < 10){
  month = '0' + month.toString();
}
if(day < 10){
  day = '0' + day.toString();
}

let minDate = year + '-' + month + '-' + day
fecha_entrega.setAttribute('min', minDate);


//controlamos cuando el cliente elige una fecha de entrega
fecha_entrega.addEventListener("change", (event)=>{
	fecha_act = new Date()
	fecha_ent = new Date(event.target.value)
	if(fecha_ent.getDay() == 0){
		alert("Domingos no disponibles. Selecciona otra fecha.");
	  }
	if(fecha_ent>fecha_act){

		//comprobamos si ya ha elegido un diay si es asi borramos los rangos ya cargados
		if(rangos_entrega.childElementCount>1){
			for(i=1; i<=rangos_entrega.childElementCount; i++){
				rangos_entrega.removeChild(rangos_entrega.lastChild)
			}
		}

		//si la fecha de entrega es mayor a la fecha actual hacemos la llamada para ver los rangos horarios
		fetch(corsAnywhere+url+"slots", OptionsRangos)
			.then(response => response.json())
			.then(result => {
				//extraemos los rangos horarios de cada dia y los filtramos segun el dia seleccionado por el cliente
				rangos_dias_select = result.response.filter(rangos => rangos.day == fecha_ent.getDay())
				rangos_dias_select.forEach(rango => {
					// creamos un option por cada rango horario q obtenemos
					opcion = document.createElement("OPTION")
					opcion.setAttribute("value", rango.id)
					opcion.textContent = rango.from_hour.slice(0, -3) + ' - ' + rango.to_hour.slice(0, -3)
					rangos_entrega.appendChild(opcion)
				});
			})
	}else {
		// crear mensaje de error para q introduzca una fecha valida
		
	}
	
})

//controlamos cuando se pulsa el boton enviar
const handleFormSubmit = (event) => {
	event.preventDefault();
   
	const data = new FormData(event.target);
   
	let results = document.querySelector(".preview");

	var Options = {
		method: 'GET',
		headers: {
			"Authorization": "Basic YWRyZXNsZXNfY29lbGxvQHJldm9vbHQubWU6QWRyZXNsZXMuQ29lbGxvLjE=",
			"Content-Type": "application/json",
			"Accept": "*/*",
			"Conecction": "keep-alive"
		},
		redirect : "follow"
		
	}
   
	// Objetos
	const customer = {
	  name_surname: data.get("name_surname"),
	  phone_number: data.get("phone_number"),
	  email: data.get("email"),
	  allow_notifications: data.get("allow_notifications"),
	};
   
	const address = {
	  route: data.get("route"),
	  street_number: data.get("street_number"),
	  address_line2: data.get("address_line2"),
	  postal_code: data.get("postal_code"),
	  locality: data.get("city"),
	  city: data.get("city"),
	  state_province: data.get("state_province"),
	  easy_access: data.get("easy_access"),
	};
   
	const packages = {
	  dry_box: data.get("dry_box"),
	  dry_bag: data.get("dry_bag"),
	  dry_pack: data.get("dry_pack"),
	  fresh_box: null,
	  fresh_bag: null,
	  fresh_pack: null,
	  frozen_box: null,
	  frozen_bag: null,
	  frozen_pack: null,
	  warm_box: null,
	  warm_bag: null,
	  warm_pack: null,
	};
   
	// Crea un objeto JSON con todos los datos
   
	const datos = {
	  delivery_time_id: data.get("delivery_time_id"),
	  delivery_day: data.get("delivery_day"),
	  last_status: 0,
	  customer,
	  address,
	  packages,
	  notes: data.get("notes"),
	  cash_on_delivery: data.get("cash_on_delivery"),
	  value: 10,
	  agent_id: 1234,
	  ticket_id: 4321,
	  bags: 0,
	};
   
	//Imprime los resultados
	body = datos;
	console.log(body)

	let OptionsPedidos = Object.assign(Options, {body})

	results.textContent = JSON.stringify(body)
  }
   
  const form = document.querySelector(".contact-form");
  form.addEventListener("submit", handleFormSubmit);
   
  