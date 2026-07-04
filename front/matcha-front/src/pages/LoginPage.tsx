import InputField from '../components/InputField';
import { useState } from 'react';
import './loginPage.css';

function checkInput(credentials: string, password: string): { credentialsError?: string; passwordError?: string } {
    const errors: { credentialsError?: string; passwordError?: string } = {};
    if (!credentials) {
        errors.credentialsError = "Username or Email is required.";
    }
    if (!password) {
        errors.passwordError = "Password is required.";
    }
    return errors;
}
function handleSubmit(credentials: string, password: string) {
    //TODO: API CALLS
    console.log("Submitting login with credentials:", credentials, "and password:", password);
}

function LoginPage() {
    const [credentials, setCredentials] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const errors = checkInput(credentials, password);

    return (
        <div className="login-page">
            <div className="login-card">
                <h1>Welcome</h1>
                <p className="subtitle">Please sign in to your Matcha account.</p>

                <form>
                    <section className="social-login">
                        <button className="google-login">Google</button>
                        <button className="facebook-login">Facebook</button>
                    </section>

                    <p className='text-or'>or with Email</p>

                    <InputField
                        name="credentials"
                        label="Username or Email"
                        type="text"
                        placeholder="e.g., max@muster.de"
                        value={credentials}
                        onChange={(e) => setCredentials(e.target.value)}
                        errorMessage={isSubmitted ? errors.credentialsError : undefined}
                    />

                    <InputField
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        errorMessage={isSubmitted ? errors.passwordError : undefined}
                    />

                    <button className="login-button" type="submit" onClick={(e) => {
                        e.preventDefault();
                        if (Object.keys(errors).length === 0) {
                            handleSubmit(credentials, password);
                        } else {
                            setIsSubmitted(true);
                        }
                    }}>
                        Login
                    </button>

                    <section id="helpers">
                        <p>Forgot your password? <a href="/reset-password">Reset</a></p>
                        <p>Don't have an account? <a href="/register">Register</a></p>
                    </section>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;