import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

import Logo from '../assets/Logo.png';

import adminService from '../services/adminService';

export default function AdminLogin() {

    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [cookies, setCookie] = useCookies(["token"]);
    const navigate = useNavigate();

  
    useEffect(() => {

        if (cookies.token) {

            navigate(`/admin/${import.meta.env.ADMIN_URL}/home`)
            // navigate(`/admin/home`);
        }
    }, [cookies.token, navigate]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {

            const token = await adminService.login(adminEmail, adminPassword);

            setCookie("token", token, { path: '/' });
            navigate(`/admin/${import.meta.env.ADMIN_URL}/home`);
            // navigate(`/admin/home`);
        } catch (error: any) {

            toast.error(error.message);
        }
    }

    return (
        <div className='admin-login'>
            <img src={Logo} alt="Logo Reciclo3D" className="admin-login-logo" />
            <form onSubmit={handleSubmit} className='admin-login-form'>
                <div className='form-group'>
                    <label htmlFor='adminEmail'>E-mail</label>
                    <input
                        type="text"
                        id="adminEmail"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="example@example.com"
                        required
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='adminPassword'>Senha</label>
                    <input
                        type="password"
                        id="adminPassword"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        placeholder="Senha"
                        required
                    />
                </div>
                <div className='form-group'>
                    <button type="submit" className="login-button">Login</button>
                </div>
            </form>
        </div>
    )
}
