const apiKey = "9cc4e122504b4b47b09125635253108"; // provided API key

    const form = document.getElementById('searchForm');
    const input = document.getElementById('locationInput');
    const results = document.getElementById('results');
    const errorDiv = document.getElementById('error');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if(!q) return;
      errorDiv.style.display = 'none';
      results.style.display = 'none';

      try{
        const resp = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(q)}&aqi=yes`);

        if(!resp.ok) throw new Error('Network response was not ok');
        const data = await resp.json();
        // populate
        document.getElementById('locName').textContent = data.location.name;
        document.getElementById('locRegion').textContent = data.location.region + ' — ' + data.location.localtime;
        document.getElementById('country').textContent = data.location.country;
        document.getElementById('temp').textContent = data.current.temp_c + ' °C';
        document.getElementById('humidity').textContent = data.current.humidity + ' %';
        document.getElementById('wind').textContent = data.current.wind_kph + ' kph, ' + data.current.wind_dir;
        // air quality object values might vary
        const aqi = data.current.air_quality || {};
        const aqiParts = [];
        if(aqi['us-epa-index']) aqiParts.push('EPA index: ' + aqi['us-epa-index']);
        if(aqi.pm2_5) aqiParts.push('PM2.5: ' + Math.round(aqi.pm2_5 * 100) / 100);
        if(aqi.pm10) aqiParts.push('PM10: ' + Math.round(aqi.pm10 * 100) / 100);
        if(aqiParts.length===0) document.getElementById('aqi').textContent = 'N/A';
        else document.getElementById('aqi').textContent = aqiParts.join(' • ');

        results.style.display = 'block';
      }catch(err){
        console.error(err);
        errorDiv.textContent = 'Could not fetch weather for that location. Make sure the location is valid.';
        errorDiv.style.display = 'block';
      }
    });
