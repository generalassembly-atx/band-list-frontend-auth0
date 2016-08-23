var lock = new Auth0Lock(
  'HWdUFLDqCisKAriOT4f0HuwohQ9aRSph',
  'corvuscorax.auth0.com'
);

lock.on("authenticated", function(authResult) {
  // Use the token in authResult to getProfile() and save it to localStorage
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    loadBandApp()
  });
});


$(document).ready(function () {
  checkLoggedIn()
  $('#login-button').on('click', function(e) {
    e.preventDefault()
    lock.show()
  })
  $('#logout-button').on('click', function(e) {
    e.preventDefault()
  })
})

function logout() {
  localStorage.removeItem('id_token')
  showWelcome()
}


function checkLoggedIn() {
  if (isLoggedIn()) {
    loadBandApp()
  } else {
    showWelcome()
  }
}

function showWelcome() {
  $('#welcome').show()
  $('#app').hide()
}

function showApp() {
  $('#app').show()
  $('#welcome').hide()
}

function isLoggedIn() {
  var idToken=localStorage.getItem('id_token')
  if (idToken) {
  return true;
  } else {
  return false;
  }
}

function loadBandApp() {
  showApp()
  loadBands()
  addNewBand()
  deleteBand()
}



function deleteBand() {
  $(document).on('click', 'a.delete-band', function (e) {
    e.preventDefault()

    // this is the link that was clicked
    var link = $(this)

    $.ajax({
      url: link.attr('href'),
      method: 'DELETE'
    })
    .done(function () {
      // Find the li that this link belongs to and remove it from the DOM
      link.parent('li').remove()
    })
  })
}

function addNewBand() {
  $('#new-band-form').on('submit', function (e) {
    e.preventDefault()
    $.ajax({
      url: 'http://localhost:3000/bands',
      method: 'POST',
      data: $('#new-band-form').serialize()
    })
    .done(function (newBand) {
      loadBand(newBand)
      $('#band-name').val('').focus()
    })
  })
}

function loadBands() {
  $.ajax({
    url: 'http://localhost:3000/bands'
  })
  .done(function (data) {
    // data in this case is the array of todos
    data.forEach(function (datum) {
      // for each todo in the array, I want to add it to the <ul>
      // this is its own function because I also need to call this when
      // a new form is created
      loadBand(datum);
    })
  })
}

function loadBand(band) {
  // Create an li on the fly
  var li = $('<li></li>')
  // I need a space to separate the task from the delete button
  li.text(band.name + " ")
  // Create a link on the fly
  var a = $('<a>Delete</a>')
  // Add the href to the path for deleting the todo
  a.attr('href', 'http://localhost:3000/bands/' + band._id)
  // Set a class so that I can add an event listenter to links with this class
  a.addClass('delete-band')
  // Add link to the li
  li.append(a)
  // Add li to the ul
  $('#band-list').append(li)
}
