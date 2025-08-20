let map = L.map('map').setView([0, 0], 2); // mapa centrado en [0,0] al inicio

// Agregamos capa de mapa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let marker;
let polyline = L.polyline([], { color: 'red' }).addTo(map);
let watchId;
let historyList = document.getElementById("history");

// Iniciar seguimiento
document.getElementById("start").addEventListener("click", () => {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;

        // Centrar mapa y agregar marcador
        if (!marker) {
          marker = L.marker([lat, lon]).addTo(map);
        } else {
          marker.setLatLng([lat, lon]);
        }

        map.setView([lat, lon], 16);

        // Agregar al historial visual
        let li = document.createElement("li");
        li.textContent = `Lat: ${lat.toFixed(5)}, Lon: ${lon.toFixed(5)}`;
        historyList.appendChild(li);

        // Guardar en la polilínea (recorrido)
        polyline.addLatLng([lat, lon]);
      },
      (error) => {
        alert("Error al obtener la ubicación: " + error.message);
      },
      { enableHighAccuracy: true }
    );
  } else {
    alert("Geolocalización no soportada en este navegador.");
  }
});

// Detener seguimiento
document.getElementById("stop").addEventListener("click", () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    alert("Seguimiento detenido");
  }
});

// Limpiar historial
document.getElementById("clear").addEventListener("click", () => {
  historyList.innerHTML = "";
  polyline.setLatLngs([]); // limpiar recorrido
  if (marker) {
    map.removeLayer(marker);
    marker = null;
  }
});