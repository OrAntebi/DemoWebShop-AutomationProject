export default {
    usernameInput: [
        '#Email',
        'input[name="Email"]',
        'form[action="/login"] input[type="text"]',
    ],
    passwordInput: [
        '#Password',
        'input[name="Password"]',
        'form[action="/login"] input[type="password"]',
    ],
    signInButton: [
        'input.button-1.login-button',
        'form[action="/login"] input[type="submit"]',
        'input[value="Log in"]',
    ],
};
