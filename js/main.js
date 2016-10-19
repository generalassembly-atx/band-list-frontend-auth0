var lock = new Auth0Lock('P5EDxUyc02sAmpwjQuOAlkrr9GXCgwrZ', 'spiders1999.auth0.com', {
    auth: {
      params: {
        scope: 'openid email'
      }
    }
  });

$(document).ready(function () {
  $('#btn-login').on('click', login);
  addNewBand()
  deleteBand()
  $('#btn-logout').on('click', logout);
})

function login(e){
  e.preventDefault();
  lock.show();
}
lock.on("authenticated", function(authResult) {
  lock.getProfile(authResult.idToken, function(error, profile) {
    if (error) {
      // Handle error
      return;
    }

    localStorage.setItem('idToken', authResult.idToken);
    $('#btn-login').hide();
    $('#band-content').show();
    loadBands()
    // Display user information

  });
});
function logout(e){
  e.preventDefault(e);
  localStorage.removeItem('idToken');
  $('#btn-login').show();
  $('#band-content').hide();

}
function deleteBand() {
  $(document).on('click', 'a.delete-band', function (e) {
    e.preventDefault()
    e.stopPropagation()
    // this is the link that was clicked
    var link = $(this)

    $.ajax({
      url: link.attr('href'),
      method: 'DELETE',
      headers:{
          'Authorization':'Bearer ' + localStorage.getItem('idToken')}
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
      data: $('#new-band-form').serialize(),
      headers:{
        'Authorization':'Bearer ' + localStorage.getItem('idToken')}
    })
    .done(function (newBand) {
      loadBand(newBand)
      $('#band-name').val('').focus()
    })
  })
}

function loadBands() {
  $.ajax({
    url: 'http://localhost:3000/bands',
    headers:{
   'Authorization':'Bearer ' + localStorage.getItem('idToken')}
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
  li.text(band.bandName + " ")
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
