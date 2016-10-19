var lock = new Auth0Lock('fFqXx1ZXREH9i36iFFPKAiwACZOS2MQV', 'gabrieldiaz.auth0.com', {
  auth: {
    params: {
      scope: 'openid email'
    }
  }
});

lock.on('authenticated', function (authResult) {
  console.log('authResult', authResult);
  // save token
  localStorage.setItem('idToken', authResult.idToken)
  loadBands()
  // instead of loadBands get it to run function to load bands-section
})


$(document).ready(function () {
  // loadBands()
  addNewBand()
  deleteBand()

  // $('#bands-section').hide()
 $('#btn-login').on('click', function (e) {
   e.preventDefault()
   lock.show()
   console.log('login works');
 })

 if (isLoggedIn()) {
    showBandsSection();
    loadBands();

  }

})

$('#btn-logout').on('click', function(e) {
    e.preventDefault()
    console.log('logout working');
    logout()
  })

function logout() {
  localStorage.removeItem('idToken')
  // refresh page
  window.location.href='/';
}


function showBandsSection() {
  console.log('showBandsSection()');
  // $('#bands-section').hide()
  lock.getProfile(localStorage.getItem('idToken'), function (error, profile) {
    if (error) {
      logout()
    } else {
      console.log('profile', profile)

    }
  })
}

function isLoggedIn() {
  if (localStorage.getItem('idToken')) {
    return isJwtValid();
  } else {
    return false;
  }
}


function isJwtValid() {
  var token = localStorage.getItem('idToken')
  if (!token) {
    return false;
  }
  var encodedPayload = token.split('.')[1]
  console.log('encodedPayload', encodedPayload);
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
