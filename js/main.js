var lock = new Auth0Lock('c4pFobE96YavypEEihgQRK7VDNrcT2dv', 'jordanwade.auth0.com', {
   auth: {
     params: {
       scope: 'openid email'
     }
   }
 });

lock.on('authenticated',function (authResult) {
  console.log(authResult);
  localStorage.setItem('idToken', authResult.idToken);
  showProfile();
})

function showProfile() {
  $('#starter-text').hide();
  $('#login-text').show();
  lock.getProfile(localStorage.getItem('idToken'),function(err, profile) {
    if (err) {
      logout();
    } else {
      console.log('profile', profile);
    }
  })

}
function logout() {
  localStorage.removeItem('idToken');
  window.location.href = '/'
  $('#login-text').hide()
  $('#starter-text').show()
}


$(document).ready(function () {
  $('#btn-login').on('click', function (e) {
    e.preventDefault()
    lock.show();
  })
  $('#btn-logout').on('click',function (e) {
    console.log('hello');
    e.preventDefault();
    logout();
  })
  function isLoggedIn() {
    if (localStorage.getItem('idToken')) {
      loadBands();
      showProfile();
    }
  }
  if (isLoggedIn()) {
    showProfile();
  }

  loadBands();
  addNewBand();
  deleteBand();
})

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
