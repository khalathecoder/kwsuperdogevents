var events = [{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 240000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 250000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "New York",
    state: "New York",
    attendance: 257000,
    date: "06/01/2019",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 130000,
    date: "06/01/2017",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 140000,
    date: "06/01/2018",
},
{
    event: "ComicCon",
    city: "San Diego",
    state: "California",
    attendance: 150000,
    date: "06/01/2019",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 40000,
    date: "06/01/2017",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 45000,
    date: "06/01/2018",
},
{
    event: "HeroesCon",
    city: "Charlotte",
    state: "North Carolina",
    attendance: 50000,
    date: "06/01/2019",
},
];

//build dropdown for specific city
function buildDropDown() {
    let dropdownMenu = document.getElementById('eventDropDown');
    dropdownMenu.innerHTML = ''; //clears out the current city values above

    let currentEvents = getEventData(); 

    let cityNames = currentEvents.map(
        function(event) {
            return event.city;
        }
    ) //map method requries anon function, gives each item of array one item at a time
    // you can also write it like: let cityNames = currentEvents.map(event => event.city);

    let citiesSet = new Set(cityNames); //Set objects are a collection of values to ensure NO DUPLICATES
    let distinctCities = [...citiesSet]; // converts set to array with the []: ['Charlotte', 'San Diego', 'New York'] // ...spread operator

    const dropdownTemplate = document.getElementById('dropdownItemTemplate');

    //copy the template
    let dropdownItemNode = document.importNode(dropdownTemplate.content, true); //false would include li parent tag but no child elements inside

    //make our changes
    let dropdownItemLink = dropdownItemNode.querySelector('a')
    dropdownItemLink.innerText = 'All Cities';
    dropdownItemLink.setAttribute('data-string', 'All');

    //add out copy to the page
    dropdownMenu.appendChild(dropdownItemNode);

    for(let i = 0; i < distinctCities.length; i += 1) {
        //get the city name
        let cityName = distinctCities[i];

            //generate a dropdown element
            let dropdownItemNode = document.importNode(dropdownTemplate.content, true);
            let dropdownItemLink = dropdownItemNode.querySelector('a');
            dropdownItemLink.innerText = cityName;
            dropdownItemLink.setAttribute('data-string', cityName);
            
        //append to dropdown menu
        dropdownMenu.appendChild(dropdownItemNode);
    }

    displayEventData(currentEvents);
    displayStats(currentEvents);
    document.getElementById('location').innerText = 'All Events';
}

function displayEventData(currentEvents) {
       // get the table
    const eventTable = document.getElementById('eventTable');
    const template = document.getElementById('tableRowTemplate');

    eventTable.innerHTML = '';

    for (let i = 0; i < currentEvents.length; i++) {
        let event = currentEvents[i];

        let tableRow = document.importNode(template.content, true);

        tableRow.querySelector('[data-id="event"]').textContent = event.event;
        tableRow.querySelector('[data-id="city"]').textContent = event.city;
        tableRow.querySelector('[data-id="state"]').textContent = event.state;
        tableRow.querySelector('[data-id="attendance"]').textContent = event.attendance.toLocaleString();
        tableRow.querySelector('[data-id="date"]').textContent = new Date(event.date).toLocaleDateString();

        //display results
        eventTable.appendChild(tableRow);
    }
}

function calculateStats(currentEvents) {
    let total = 0;
    let average = 0;
    let most = 0;
    let least = currentEvents[0].attendance;

    for(let i = 0; i < currentEvents.length; i++) {
        let currentAttendance = currentEvents[i].attendance;

        total += currentAttendance; // total = total + currentAttendance;

        if (currentAttendance > most) {
            most = currentAttendance;
        }

        if (currentAttendance < least) {
            least = currentAttendance;
        }  
    }

    average = total / currentEvents.length;


    // created 1 object stats for the values above to be able to return
    let stats = { 
        total: total,
        average: average,
        most: most,
        least: least
    }

    return stats;
}

function displayStats(currentEvents) {
    let statistics = calculateStats(currentEvents); //giving the stats object since that is what it is returning from calculateStats(currentEvents)

    //get the elements where the stats go
    //set their text to be the correct stat form statistics
    document.getElementById('total').textContent = statistics.total.toLocaleString();
    document.getElementById('average').textContent = Math.round(statistics.average).toLocaleString();
    document.getElementById('most').textContent = statistics.most.toLocaleString();
    document.getElementById('least').textContent = statistics.least.toLocaleString();
}

function getEventData() {
    let data = localStorage.getItem('kwSuperStarEventData'); //pick a string name unique to you to store in data variable

    if (data == null) {
        localStorage.setItem('kwSuperStarEventData', JSON.stringify(events))
    }

    let currentEvents = data == null ? events : JSON.parse(data);

    // AKA if (data == null) {
    //     currentEvents = events;
    // } else {
    //     currentEvents = JSON.parse(data);
    // }

    return currentEvents;
}

function viewFilteredEvents(dropdownItem) {
    let cityName = dropdownItem.getAttribute('data-string');

    // get all my events
    let allEvents = getEventData();

    if (cityName == 'All') {
        displayStats(allEvents);
        displayEventData(allEvents);
        document.getElementById('location').innerText = 'All Events';
    }

    // filter those events to just selected city
    let filteredEvents = allEvents.filter(event => event.city.toLowerCase() == cityName.toLowerCase()); 

    // display the stats for those events
    displayStats(filteredEvents);

    // change the stats header
    document.getElementById('location').innerText = cityName;

    // display only those events in the table
    displayEventData(filteredEvents);
}

function saveNewEvent() {
    //get the form input values
    let name = document.getElementById('newEventName').value;
    let city = document.getElementById('newCityName').value;
    let attendance = parseInt(document.getElementById('newEventAttendance').value, 10);

    let dateValue = document.getElementById('newEventDate').value;
    dateValue = new Date(dateValue);

    let date = dateValue.toLocaleDateString();

    let stateSelect = document.getElementById('newEventState');
    let selectedIndex = stateSelect.selectedIndex;
    let state = stateSelect.options[selectedIndex].text;

    // create a new event object
    let newEvent = {
        event: name,
        city: city,
        state: state,
        attendance: attendance,
        date: date,
    }

    //add it to the array of current events
    let events = getEventData();
    events.push(newEvent);

    //the, save the array with the new event
    localStorage.setItem('kwSuperStarEventData', JSON.stringify(events)); //you can only store a string in local storage, reason for stringify

    buildDropDown();
}