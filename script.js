let postOffices = [];
// get users ip
async function getIP() {
  let res = await fetch("https://api64.ipify.org?format=json");
  let data = await res.json();
  return data.ip;
}
// convert it into location 
async function getUserInfo(ip) {
  let res = await fetch(`https://ipapi.co/${ip}/json/`);
  let data = await res.json();
  return data;
}
// load it into map 
function loadMap(lat, lon) {
  let mapFrame = document.getElementById("map");
  mapFrame.innerHTML = `<iframe 
    width="100%" height="300" 
    frameborder="0" style="border:0"
    src="https://maps.google.com/maps?q=${lat},${lon}&z=15&output=embed" 
    allowfullscreen>
  </iframe>`;
}
// show local time
function showTime(timezone) {
  let timeElem = document.getElementById("time");
  let now = new Date().toLocaleString("en-US", { timeZone: timezone });
  timeElem.textContent = "Current Time: " + now;
}
// fetch post office data
async function getPostOffices(pincode) {
  let res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
  let data = await res.json();
  return data[0].PostOffice;
}
// render post office cards
function renderPostOffices(list) {
  let container = document.getElementById("postOffices");
  container.innerHTML = "";
  list.forEach(office => {
    let div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <p><b>Name:</b> ${office.Name}</p>
      <p><b>Branch Type:</b> ${office.BranchType}</p>
      <p><b>Delivery Status:</b> ${office.DeliveryStatus}</p>
      <p><b>District:</b> ${office.District}</p>
      <p><b>Division:</b> ${office.Division}</p>
    `;
    container.appendChild(div);
  });
}
// searh feature -> Filters post offices in real-time by name or branch type.
document.getElementById("searchInput").addEventListener("input", (e) => {
  let query = e.target.value.toLowerCase();
  let filtered = postOffices.filter(office =>
    office.Name.toLowerCase().includes(query) ||
    office.BranchType.toLowerCase().includes(query)
  );
  renderPostOffices(filtered);
});
// Init Function (Triggered on "Get Started")
async function init() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";

  let ip = await getIP();
  document.getElementById("ip").textContent = `IP Address: ${ip}`;

  let userInfo = await getUserInfo(ip);
  document.getElementById("city").textContent = `City: ${userInfo.city}`;
  document.getElementById("region").textContent = `Region: ${userInfo.region}`;
  document.getElementById("org").textContent = `Organisation: ${userInfo.org}`;
  
  loadMap(userInfo.latitude, userInfo.longitude);
  showTime(userInfo.timezone);

  postOffices = await getPostOffices(userInfo.postal);
  renderPostOffices(postOffices);
}

// Show IP on start screen
getIP().then(ip => {
  document.getElementById("startIP").textContent = ip;
});

