const req = await fetch('https://deployment-connectbq.onrender.com/routes');
const data = await req.json();
const primeraRuta = data[0];
const paradas = primeraRuta.path;
paradas.forEach(stop => {
    console.log(stop.name + " - " + stop.coordinates.latitude + ", " + stop.coordinates.longitude);
}); 