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
    let data = snapshot.val();
    let row = $('<tr>');
    let col1 = $(`<td>${data.name}</td>`);
    let col2 = $(`<td>${data.destination}</td>`);
    let col3 = $(`<td>${data.frequency}</td>`);
    row.append(col1, col2, col3);
    tableBody.append(row);
});

// This will subtract the second moment (the moment of the parameter) 
// from the first (the current moment) and return the answer in years
console.log(moment().diff(moment('1995-12-12 09:30'), 'years'));