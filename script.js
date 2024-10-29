const socket = io();

      

      socket.on('connect', () => {
          console.log('Socket connected:', socket.id);
      });

      socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
      });

      var watchID;
      var geoLoc;

      function showLocation(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          socket.emit("send-location", { latitude, longitude });
      }

      function errorHandler(err) {
          if (err.code == 1) {
              alert("Error: Access is denied!");
          } else if (err.code == 2) {
              alert("Error: Position is unavailable!");
          }
      }

      if (navigator.geolocation) {
          var options = { timeout: 5000 };
          geoLoc = navigator.geolocation;
          watchID = geoLoc.watchPosition(showLocation, errorHandler, options);
      } else {
          alert("Sorry, browser does not support geolocation!");
      }

      const map = L.map("map").setView([0, 0], 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{y}.png", {
          attribution: "OpenStreetMap",
      }).addTo(map);

      const markers = {};
      socket.on("recive-location", (data) => {
          const { id, latitude, longitude } = data;
          map.setView([latitude, longitude], 25);
          if (markers[id]) {
              markers[id].setLatLng([latitude, longitude]);
          } else {
              markers[id] = L.marker([latitude, longitude]).addTo(map);
          }
      });

      socket.on("user-disconnect", (id) => {
          map.removeLayer(markers[id]);
          delete markers[id];
      });
    
