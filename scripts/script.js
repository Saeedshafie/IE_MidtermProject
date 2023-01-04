const $ = document;

// connecting to html tags
const image = $.querySelector(".image");
const userName = $.querySelector(".name");
const address = $.querySelector(".address");
const userLocation = $.querySelector(".location");
const leftBio = $.querySelector(".left-bio");
const alertText = $.querySelector(".alert");
const form = $.querySelector(".form");
const input = $.querySelector(".input");
const btn = $.querySelector(".btn");

const submitHandler = (e) => {
   e.preventDefault();
   if (input.value.trim()) {
      alertText.style.visibility = "visible";
      alertText.innerHTML = "Loading ...";
      let isSearched = localStorage.getItem(input.value.trim());

      if (isSearched) {
         // geting the searched item from localstorage
         let userData = JSON.parse(localStorage.getItem(input.value));
         putUserInfos(userData, "old");
      } else {
         // fetch the data from api
         fetch(`https://api.github.com/users/${input.value.trim()}`)
            .then((res) => {
               if (res.status === 200) {
                  return res.json();
               } else if (res.status === 404) {
                  alertText.innerHTML = "No such user found";
                  image.setAttribute("src", "utils/images/no-picture.jpg");
                  userName.innerHTML = "";
                  userLocation.innerHTML = "";
                  address.innerHTML = "";
                  leftBio.innerHTML = "";
               } else {
                  alertText.innerHTML = "Something went wrong";
               }
            })
            .then((data) => {
               if (data) {
                  // setting the searched item to localstorage
                  localStorage.setItem(input.value.trim(), JSON.stringify(data));
                  putUserInfos(data, "new");
               }
            })
            .catch((err) => (alertText.innerHTML = "No conection . check you're internet and try with VPN"));
      }
   }
};

// placing gotten data to html
const putUserInfos = (data, status) => {
   image.setAttribute("src", data.avatar_url || "utils/images/no-picture.jpg");
   userName.innerHTML = data.login || "No user name";
   userLocation.innerHTML = data.location || "No location";
   address.innerHTML = data.url || "No url";
   leftBio.innerHTML = data.bio || "No bio";

   alertText.style.visibility = status === "new" && "hidden";
   alertText.innerHTML = status === "new" ? "" : "You have serached this user before.";
   input.value = "";
};

form.addEventListener("submit", (e) => submitHandler(e));
