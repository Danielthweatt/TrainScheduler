'use strict';

// Initialize Firebase

let config = {
    apiKey: "AIzaSyCx-fHsW9UkBjolcjDwnBjWhPm7TTE-Ddc",
    authDomain: "train-scheduler-bdb37.firebaseapp.com",
    databaseURL: "https://train-scheduler-bdb37.firebaseio.com",
    projectId: "train-scheduler-bdb37",
    storageBucket: "train-scheduler-bdb37.appspot.com",
    messagingSenderId: "396639600787"
};

firebase.initializeApp(config);

// Variables

const database = firebase.database();
let tName;
let tDestination;
let tFirstArrival;
let tArrivalFrequency;
let train;
let trainTrackerIndex;
let tableBody = $('#tableBody');
let data;
let minutesSinceFirstArrival;
let nextArrival;
let minutesAway;
let secondSinceFirstArrival;
let secondsAway;
let nextArrivalInSeconds;
let row;
let col1;
let col2;
let col3;
let col4;
let col5;

// Function Declarations

const calculateArrivalInformation = function(object) {
    minutesSinceFirstArrival = moment().diff(moment(object.firstTrainTime, 'HH:mm'), 'minutes');
    if (minutesSinceFirstArrival < 0) {
        nextArrival = moment(object.firstTrainTime, 'HH:mm').format('hh:mm A');
        minutesAway = minutesSinceFirstArrival * -1;
    } else {
        minutesAway = object.frequency - (minutesSinceFirstArrival % object.frequency);
        secondSinceFirstArrival = minutesSinceFirstArrival * 60;
        secondsAway = minutesAway * 60;
        nextArrivalInSeconds = parseInt(moment(object.firstTrainTime, 'HH:mm').format('X')) + secondSinceFirstArrival + secondsAway;
        nextArrival = moment(nextArrivalInSeconds, 'X').format('hh:mm A');
    };
};

// Function Calls

database.ref().once('value', function(snapshot) {
    trainTrackerIndex = snapshot.numChildren();
});

$('#submitButton').on("click", function(event) {
    event.preventDefault();
    tName = $('#trainName').val().trim();
    tDestination = $('#destination').val().trim();
    tFirstArrival = $('#firstTrainTime').val().trim();
    tArrivalFrequency = $('#frequency').val().trim();
    train = {
        name: tName,
        destination: tDestination,
        firstTrainTime: tFirstArrival,
        frequency: tArrivalFrequency,
        index: trainTrackerIndex
    };
    database.ref().push(train);
    trainTrackerIndex++;
    $('#trainName').val('');
    $('#destination').val('');
    $('#firstTrainTime').val('');
    $('#frequency').val('');
});

database.ref().on('value', function(snapshot) {
    tableBody.empty();
    snapshot.forEach(function(childSnapshot) {
        data = childSnapshot.val();
        calculateArrivalInformation(data);
        row = $('<tr>');
        col1 = $(`<td>${data.name}</td>`);
        col2 = $(`<td>${data.destination}</td>`);
        col3 = $(`<td>${data.frequency}</td>`);
        col4 = $(`<td id="arrivalTimeFor${data.index}">${nextArrival}</td>`);
        col5 = $(`<td id="intervalFor${data.index}">${minutesAway}</td>`);
        row.append(col1, col2, col3, col4, col5);
        tableBody.append(row);
        setInterval(function() {
            calculateArrivalInformation(childSnapshot.val())
            $(`#arrivalTimeFor${childSnapshot.val().index}`).text(nextArrival);
            $(`#intervalFor${childSnapshot.val().index}`).text(minutesAway);
        }, 60000);
    });
});