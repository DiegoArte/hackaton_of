(function($) {
  'use strict';
  $(function() {
    // Remove pro banner on close
    document.querySelector('#bannerClose').addEventListener('click',function() {
      document.querySelector('#proBanner').classList.add('d-none');
    });
    
    

    //clima start
    const apiUrl = "http://api.weatherstack.com/current?access_key=904a264d05f02ab08b88308e98df95e9&query=Patzcuaro";

    // Hacer la solicitud a la API utilizando fetch
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("La solicitud a la API falló.");
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          throw new Error("La respuesta no es un JSON válido.");
        }
      })
      .then((data) => {
        // Aquí puedes utilizar los datos de la API
        console.log(data)
        document.querySelector(".city").textContent = data.location.name;
        document.querySelector(".weather").textContent = data.current.weather_descriptions[0];
        document.querySelector(".temp").textContent = `${data.current.temperature}°`;
        
        const temperatura = `${data.current.temperature}°`;
        const temperaturaElement = document.getElementById("temperature-chart");
        
        
        //temperaturaElement.textContent = temperatura + "°C";
        
        const velocidadViento =data.current.wind_speed;
        const velocidadElement = document.getElementById("windSpeed");
      

        velocidadElement.textContent = velocidadViento + " m/s";

        const humedad = data.current.humidity;
        const humedadElement = document.getElementById("humity");
        humedadElement.textContent = humedad + " %";
        console.log("hola"+velocidadViento+humedad);
        // Actualiza tus elementos HTML con estos datos, como se mencionó en la respuesta anterior.
      })
      .catch((error) => {
        console.error("Ocurrió un error:", error);
      });
      //clima end
    

    //hora start
    function obtenerHora() {
      var fechaActual = new Date();
      var hora = fechaActual.getHours();
      var minutos = fechaActual.getMinutes();
      var segundos = fechaActual.getSeconds();
      var horaFormateada = hora + ":" + (minutos < 10 ? "0" : "") + minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
      const horaElement = document.querySelector("#horaDash");
      horaElement.textContent=horaFormateada;
    }
    setInterval(obtenerHora, 500);
    //hora end

    //potencia start
    async function potencia() {
      try {
        const url='http://localhost:3000/php/db.php';
        const resultado = await fetch(url);
        const db = await resultado.json();
        var speed=db[0]['valor'];
        var speedCalc=Math.floor(((speed/200)-1)*10/10)*10;
        var currentScale=speedCalc/10+1;
        let newclass="speed-"+speedCalc;
        let prevclass="speed-"+prevspeed;
        console.log()
        let ej=document.getElementsByClassName("arrow-wraper")[0];
        if(ej.classList.contains(prevclass)) {
          ej.classList.remove(prevclass);
          ej.classList.add(newclass);
        }
        prevspeed=speedCalc;
        let tempClass=0;
        let el=0;
        for(let i=1; i<=currentScale; i++) {
          tempClass="speed-scale-"+i;
          el = document.getElementsByClassName(tempClass)[0];
          el.classList.add("active");
        }
        for(let i=currentScale+1; i<=19; i++) {
          tempClass="speed-scale-"+i;
          el = document.getElementsByClassName(tempClass)[0];
          if(el.classList.contains("active")) {
            el.classList.remove("active");
          }
        }
        let es=document.getElementsByClassName("wh")[0];
        es.innerText=speed.toString();

        //kwh por hora start
        const gaugeElement = document.querySelector(".gauge");

        function setGaugeValue(gauge, value) {

          gauge.querySelector(".gauge__fill").style.transform = `rotate(${
            value / 2
          }turn)`;
          var valueF=(value*10).toFixed(2);
          gauge.querySelector(".gauge__cover").textContent = `${valueF}Kwh`;
        }
        var kwh=speed*100/53/1000/10;
        setGaugeValue(gaugeElement, kwh);
        //kwh por hora end
       }catch (error) {
            console.log(error);
        }  
    }
    var prevspeed=0;
    setInterval(potencia, 500);
    //potencia end

    
  });
})(jQuery);