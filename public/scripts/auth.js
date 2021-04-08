// listen for auth status changes
auth.onAuthStateChanged(user => {
    // console.log(user);

    if (user)
    {
        console.log("User is logged in:", user);
        // get data
        db.collection('users').onSnapshot(snap =>
        {
            // console.log(snap.docs);
            fillUsers(snap.docs);
            setupUI(user);
        }, err => console.log(err.message));
    } else {
        console.log("User is logged out");
        fillUsers([]);
        setupUI();
    }
})

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get user info
    const username = signupForm['signup-username'].value;
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // console.log(email, password);

    // signup the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);

        return db.collection('users').doc(cred.user.uid).set({
            username, email
        })
    }).then(() => {
        // close signup modal and reset the form
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
    })
})

// logout
const logout = document.getElementsByClassName('logout');
// console.log(logout);

Array.prototype.forEach.call(logout, function(element) {
    
    element.addEventListener('click', e =>
            {
                e.preventDefault();
                auth.signOut();
            })
});

// login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    // get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email, password).then(cred => {
        // console.log(cred.user);

        // close the login modal and reset the form
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    })
})