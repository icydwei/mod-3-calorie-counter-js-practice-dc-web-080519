// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
const URL = "http://localhost:3000/api/v1/calorie_entries";
let totCal = 0;

document.addEventListener("DOMContentLoaded", () => {
  fetchCalorieEntries()
  newCalEntryForm()
  calListBtns()
})

//Fetch calorie entries
function fetchCalorieEntries() {
  fetch(URL)
  .then (response => response.json())
  .then (calorieEntries => {
    calorieEntries.forEach((calorieEntry) => {
      renderEntry(calorieEntry)
    })
  })
}

function renderEntry(calorieEntry) {
  let calList = document.getElementById('calories-list')
  let li = createEntry(calorieEntry)
  calList.appendChild(li)
}

//Extracted out code to be used for prepending new entries as well
function createEntry(calorieEntry) {
  let li = document.createElement("li")
  let progBar = document.querySelector(".uk-progress")
  totCal += calorieEntry.calorie
  progBar.value = totCal
  li.classList.add("calories-list-item")
  li.innerHTML = `<div class="uk-grid" id="entry-${calorieEntry.id}"> <div class="uk-width-1-6"> <strong>${calorieEntry.calorie}</strong> <span>kcal</span> </div> <div class="uk-width-4-5"> <em class="uk-text-meta">${calorieEntry.note}</em> </div> </div> <div class="list-item-menu"> <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a> <a class="delete-button" uk-icon="icon: trash"></a> </div>`
  return li
}

//Allow users to submit new calorie entries - entries should be pre-pended
function newCalEntryForm() {
  let form = document.getElementById("new-calorie-form")
  form.addEventListener("submit", createNewCalEntry)
}

function createNewCalEntry(e) {
  e.preventDefault()
  let calNum = e.currentTarget.elements[0].value
  let noteDesc = e.currentTarget.elements[1].value

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      api_v1_calorie_entry: {
        calorie: calNum,
        note: noteDesc
      }
    })
  })
  .then(response => response.json())
  .then(newEntry => {
    prependEntry(newEntry)
  })
  .catch(error => {
    alert("BAZINGA!")
  })
  e.target.reset()
}

function prependEntry(calorieEntry) {
  let calList = document.getElementById('calories-list')
  let li = createEntry(calorieEntry)
  calList.prepend(li)
}

//Cal List Edit & Delete Buttons
function calListBtns() {
  let calList = document.getElementById("calories-list")
  calList.addEventListener("click", handleCalListClicks)
}

function handleCalListClicks(e) {
  if (e.target.dataset.svg === "trash"){
    deleteCalEntry(e)
  }
}

function deleteCalEntry(e) {
  let delId = e.target.parentElement.parentElement.parentElement.children[0].id.split("-")[1]

  fetch(URL + '/' + delId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(removedEntry => {
    deleteEntry(removedEntry, e)
  })
  .catch(error => {
    alert("BAZINGA!")
  })
}

function deleteEntry(removedEntry, e) {
  let progBar = document.querySelector(".uk-progress")
  totCal -= removedEntry.calorie
  progBar.value = totCal
  e.target.parentElement.parentElement.parentElement.remove()
}
