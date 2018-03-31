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
let tableBody = $('#tableBody');
let data;
let nextArrival;
let minutesAway;
let row;
let col1;
let col2;
let col3;
let col4;
let col5;

// Functions

const arrival = function(firstArrival, arrivalFrequency) {
    let minutesSinceFirstArrival = moment().diff(moment(firstArrival, 'HH:mm'), 'minutes');
    minutesAway = minutesSinceFirstArrival % arrivalFrequency;
    nextArrival = 0;
};

// Function Calls

$('#submitButton').on("click", function(event){
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
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    };
    database.ref().push(train);
    $('#employeeName').val('');
    $('#role').val('');
    $('#startDate').val('');
    $('#monthlyRate').val('');
});

database.ref().orderByChild('dateAdded').limitToLast(1).on('child_added', function(snapshot) {
    data = snapshot.val();
    arrival(data.firstTrainTime, data.frequency);
    row = $('<tr>');
    col1 = $(`<td>${data.name}</td>`);
    col2 = $(`<td>${data.destination}</td>`);
    col3 = $(`<td>${data.frequency}</td>`);
    col4 = $(`<td>${nextArrival}</td>`);
    col5 = $(`<td>${minutesAway}</td>`);
    row.append(col1, col2, col3, col4, col5);
    tableBody.append(row);
});