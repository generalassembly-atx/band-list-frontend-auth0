$(document).ready(function () {

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').on('click', function (e) {
    e.preventDefault();
    logout();
  });

  if (isLoggedIn()) {
    showProfile();
  }
});

var lock = new Auth0Lock('xok7Cc3nkGe9A1gfCTv8AsFX7ivbo0Jz', 'clrksanford.auth0.com', {
  auth: {
    params: {
      scope: 'openid email'
    }
  }
});

var userProfile;

lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('id_token', authResult.idToken);

    localStorage.setItem('name', profile.name);
    localStorage.setItem('avatar', profile.picture);

    showProfile();
  });
});

function loadBands() {
  $.ajax({
    url: 'http://localhost:3000/bands'
  })
  .done(function (data) {
 //    data in this case is the array of bands
    data.forEach(function (datum) {

      // for each todo in the array, I want to add it to the <ul>
      // this is its own function because I also need to call this when
      // a new form is created
      loadBand(datum);
    });
  });
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
      data: {
        name: $('#band-name').val(),
        genre: 'pop-rock',
        corruptedByTheSystem: true
      }
    })
    .done(function (newBand) {
      loadBand(newBand)
      $('#band-name').val('').focus()
    });
  });
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

function showProfile() {
  $('.btn-login').addClass('hidden');
  $('.btn-logout').removeClass('hidden');
  $('h2').removeClass('hidden');
  $('div.hidden').removeClass('hidden');
  $('span').text(localStorage.getItem('name'));
  $('#avatar').attr('src', localStorage.getItem('avatar'));

  loadBands();
  addNewBand();
  deleteBand();
}

function isLoggedIn() {
  if(localStorage.getItem('idToken')) {
    return true;
  } else {
    return false;
  }
}

function logout() {
  localStorage.removeItem('idToken');
  localStorage.removeItem('name');
  localStorage.removeItem('avatar');
  userProfile = null;
  window.location.href = "/";
  // $('.btn-login').removeClass('hidden');
  // $('.btn-logout').addClass('hidden');
  // $('h2').addClass('hidden');
  // $('div').addClass('hidden');
}
