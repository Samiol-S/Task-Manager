let userStatus;
userStatus = getCookieByName('status');
if (userStatus === 'logged In') {
  window.location.href = 'index.html'
}



const inMail = document.querySelector('.login-email-input');
const inPass = document.querySelector('.login-password-input');
function login () {
  const loader = document.querySelector('.loader');
  loader.classList.toggle('d-none');
  const email = inMail.value;
  const password = inPass.value;

  const signIn = fetch('https://sam-task-manager.srv656652.hstgr.cloud/auth/login', {
    method:"POST",
    body:JSON.stringify({
      email: email,
      password: password
    }),
    headers: {"Content-Type": "application/json"}
  });

  signIn.then((response) => {
    return response.json();
  }).then((json) => {

    data = json.data;
    makeCookie('token', `${data}`, 30);
    
    return json;
  }).then((response) => {

    if(response.status === true) {
      makeCookie('status','logged In', 30);
      window.location.href = 'index.html'
    }
    else{
      makeCookie('status','logged Out', 30);
       const errorParagraph = document.querySelector('.errorParagraph');
       if(errorParagraph.classList.contains('d-none')){
        errorParagraph.classList.toggle('d-none');
       }
      
      loader.classList.toggle('d-none');

    }

  })
}

const signInButton = document.querySelector('.sign-in-button');

signInButton.addEventListener('click',login);

const upName = document.querySelector('.up-name');
const upMail = document.querySelector('.up-mail');
const upPass = document.querySelector('.up-password');

function signUp() {
  const name = upName.value;
  const email = upMail.value;
  const password = upPass.value;

  const signUpPromise = fetch('https://sam-task-manager.srv656652.hstgr.cloud/auth/signup', {
    method:"POST",
    body:JSON.stringify({
      name: name,
      email: email,
      password: password
    }),
    headers: {"Content-Type": "application/json"}
  });
  signUpPromise.then((response) => {
    return response.json();
  }).then((json) => {
    if (json.status === true) {
      alert('Account Created Successfully, Please Sign In to your account!')
    }
    else {
      alert('there has been an error creating your account :(')
    }
  })
}

const SignUpButton = document.querySelector('.up-button');
SignUpButton.addEventListener('click', signUp);











// Section of making / deleting and getting cookies.

function makeCookie (name, value, daysToLive) {
  let date = new Date();
  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();
  document.cookie=`${name}=${value}; ${expires}; path=/`
}
function getCookieByName(name) {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';');
  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
          return cookie.substring(name.length + 1);
      }
  }
  return null;
}





console.log(document.cookie);



