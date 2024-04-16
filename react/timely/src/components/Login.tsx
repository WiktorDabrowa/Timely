import { useEffect, useState } from 'react';
import { makeRequest } from './utils';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login() {

    const [formData, setFormData] = useState<{ name: string, password: string}>({
        name: '',
        password: '',
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (success === true) {
            navigate('/home')
        }
    }, [success])

    function handleFormChange(e: React.ChangeEvent): void {
        let element = e.target as HTMLInputElement;
        let field = element.name;
        setFormData({
            ...formData,
            [field]: element.value
        })
        }

    function validateForm() {
        if (formData.name === '') {
            setError('Name cannot be empty!')
            return false
        } else if ( formData.password === '') {
            setError('Password cannot be empty!')
            return false
        } else {
            return true
        }
    }

    async function submitForm(e: React.FormEvent) {
        e.preventDefault();
        if (validateForm()) {
            const response = await makeRequest({
                method: 'POST',
                url: 'auth/token/',
                data: {
                    username: formData.name,
                    password: formData.password
                }
            }, setLoading)
            if (response.status === 'ok') {
                switch (response.response_status) {
                    case 200 :
                        localStorage.setItem("access-token", JSON.stringify(response.data.access))
                        localStorage.setItem("refresh-token", JSON.stringify(response.data.refresh))
                        setSuccess(true);
                    case 401 :
                        setError('Invalid credentials!');
                }
            } else {
                console.log(response.err)
                setError("Unexpected error")
            }
        }
    }

    return (
        <div className={error ? 'login-form-container invalid' : 'login-form-container'}>
            <form 
                onSubmit={submitForm}
                className='card login-form'>
                <h2 className='login-form-title'>Log in</h2>
                <input 
                    type="text"
                    name='name'
                    value={formData.name}
                    onChange={handleFormChange} 
                    placeholder='Username'
                />
                <input 
                    type="password"
                    name='password'
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder='Password' 
                />
                <input type="submit" value="Log In"/>
            </form>
            {loading && <div className='loading'><div className='loader'/></div>}
            {error && <div className='error-container'>{error}</div>}
            <p>No account? Find some time to <Link to='/register'>register</Link></p>
        </div>
    )
}