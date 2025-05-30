
const upName = document.querySelector('.signup-name-input');
const upMail = document.querySelector('.signup-email-input');
const upPass = document.querySelector('.signup-password-input');

function signUp() {
  const name = upName.value;
  const email = upMail.value;
  const password = upPass.value;
  if (upMail.checkValidity() && password.length >=8) {
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

  else{
    if(!upMail.checkValidity()){
      alert('you should enter a valid email');
    }
    else {
      alert('password must be at least 8 characters long');
    }
    
    
  }
  

  
}

const SignUpButton = document.querySelector('.sign-up-button');
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


