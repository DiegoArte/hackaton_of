(function($) {
  'use strict';
  $(function() {
    // Remove pro banner on close
    document.querySelector('#bannerClose').addEventListener('click',function() {
      document.querySelector('#proBanner').classList.add('d-none');
    });
    
    

    //clima start
    const apiUrl = "http://api.weatherstack.com/current?access_key=904a264d05f02ab08b88308e98df95e9&query=Tlaltenango";

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
        var speed=db[0]['valor']*2;
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
    

    //battery star

    function initBattery() {
      const batteryLiquid=document.querySelector('.battery_liquid'),
            batteryStatus=document.querySelector('.battery_status'),
            batteryPer=document.querySelector('.battery_per');
      let updateBattery;

      navigator.getBattery().then((batt)=>{
        updateBattery=() =>{
          let level=Math.floor(batt.level*100);
          batteryPer.innerHTML=level+ '%';
          batteryLiquid.style.height=`${parseInt(batt.level*100)}%`;
          if(level==100) {
            batteryStatus.innerHTML=`Bateria completa <i class="ri-battery-2-fill green-color"></i>`;
            batteryLiquid.style.height='103%';
          } else if(level<=20 &! batt.charging) {
            batteryStatus.innerHTML=`Bateria baja <i class="ri-plug-line animated-red"></i>`;
          } else if(batt.charging) {
            batteryStatus.innerHTML=`Cargando <i class="ri-flashlight-line animated-green"></i>`;
          } else {
            batteryStatus.innerHTML='';
          }

          if(level<=20) {
            batteryLiquid.classList.add('gradient-color-red');
            batteryLiquid.classList.remove('gradient-color-orange', 'gradient-color-yellow', 'gradient-color-green');
          } else if(level <=40){
            batteryLiquid.classList.add('gradient-color-orange');
            batteryLiquid.classList.remove('gradient-color-red', 'gradient-color-yellow', 'gradient-color-green');
          } else if(level <=80){
            batteryLiquid.classList.add('gradient-color-yellow');
            batteryLiquid.classList.remove('gradient-color-red', 'gradient-color-orange', 'gradient-color-green');
          } else if(level <=100){
            batteryLiquid.classList.add('gradient-color-green');
            batteryLiquid.classList.remove('gradient-color-red', 'gradient-color-yellow', 'gradient-color-orange');
          }
        }
        updateBattery();

        batt.addEventListener('chargingchange', ()=>{updateBattery()});
        batt.addEventListener('levelchange', ()=>{updateBattery()});
      })
    }

    initBattery();


    //battery end
    
  });
})(jQuery);