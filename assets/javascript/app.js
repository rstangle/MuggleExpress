 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAF_U3Uk1tnrvfSrrxEzhLH1hk6c2AdxwQ",
    authDomain: "muggle-express.firebaseapp.com",
    databaseURL: "https://muggle-express.firebaseio.com",
    projectId: "muggle-express",
    storageBucket: "muggle-express.appspot.com",
    messagingSenderId: "916479449166"
  };

  firebase.initializeApp(config);

    // Create a variable to reference the database.
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destination = "";
    var firstDeparture = "";
    var frequency = 0;
    var nextArrival = 0;
    var arrivalIn = 0;

//*************************************************************************************************************************
//***  TIME VARIABLES  ****************************************************************************************************
//*************************************************************************************************************************  

    // Current Time
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("HH:mm"));

    // First Departure Time (pushed back 1 year to make sure it comes before current time) --> From In-Class Activity. 
      //Might try changing to 1-day if I can get this example to work.
    // var firstDepartureConverted = moment(firstDeparture, "HH:mm").subtract(1, "years");
    // console.log("Departure Converted: " + firstDepartureConverted);

    // // Difference between the times
    // var diffTime = moment().diff(moment(firstDepartureConverted), "minutes");
    // console.log("Difference in time (minutes): " + diffTime);


//************************************************************************************************************************
//************************************************************************************************************************
   
    // Capture Button Click
    $("#add-train").on("click", function(event) {
      // event.preventDefault();
     
      // Grabbed values from text boxes
      trainName = $("#train-name").val().trim();
      destination = $("#destination").val().trim();
      firstDeparture = $("#first-run").val().trim();
      console.log(firstDeparture);
      frequency = $("#frequency").val().trim();
      // monthlyRate = $("#monthly-rate").val().trim();

      // Code for handling the push
      database.ref().push({
        name: trainName,
        destination: destination,
        firstDeparture: firstDeparture,
        frequency: frequency,
        // monthlyRate: monthlyRate,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
      });

    });

    // Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
    database.ref().on("child_added", function(childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val().name);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().firstDeparture);
      console.log(childSnapshot.val().frequency);
      // console.log(childSnapshot.val().monthlyRate);

//***************************************************************************************************************************
//***************************************************************************************************************************

      // First Departure Time (pushed back 1 year to make sure it comes before current time) --> From In-Class Activity. 
      //Might try changing to 1-day if I can get this example to work.
      var firstDepartureConverted = moment(childSnapshot.val().firstDeparture, "HH:mm").subtract(7, "days");
      console.log("Departure Converted: " + firstDepartureConverted);

      // Difference between the times
      var diffTime = moment().diff(moment(firstDepartureConverted), "minutes");
      console.log("Difference in time (minutes): " + diffTime);

      // Time apart (remainder)
      var tRemainder = diffTime % childSnapshot.val().frequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = childSnapshot.val().frequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


//***************************************************************************************************************************
//***************************************************************************************************************************

      // full list of items to the well
      $("#entries").append("<tr><td>" + childSnapshot.val().name +
        "</td><td>" + childSnapshot.val().destination + 
        "</td><td>" + childSnapshot.val().firstDeparture +
        "</td><td>" + childSnapshot.val().frequency + " minutes" +
        "</td><td>" + nextTrain.format("HH:mm") + " (" + nextTrain.format("hh:mm a") + ")" + 
        "</td><td>" + tMinutesTillTrain + " minutes</td></tr>");

    // Handle the errors
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });

    
