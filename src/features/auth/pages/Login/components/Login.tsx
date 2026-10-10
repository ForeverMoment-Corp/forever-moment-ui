import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import loginCover from '@/assets/login-cover.jpg';
import { ADMIN_CONFIG } from '@/config/constants';
import '../../css/styles.scss';

interface LoginProps {
    loading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<any>;
}

const occasions = ['Anniversary', 'Birthday', 'Candlelight Dinner', 'Baby & Kids', 'Festivals'];

const Login = ({ loading, error, login }: LoginProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/admin';

    const handleLogin = async (credentials: any) => {
        try {
            await login(credentials);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by Redux state
        }
    };

    return (
        <div className="loginPageWrapper">
            {/* LEFT PANEL */}
            <div className="leftPanel">
                <img className="coverImage" src={loginCover} alt="" aria-hidden="true" />
                <div className="coverOverlay"></div>

                <div className="brandMark">
                    <span className="brandLogo">F</span>
                    <span className="brandName">{ADMIN_CONFIG.name}</span>
                </div>

                <div className="leftContent">
                    <div className="tagPill">Admin Console</div>
                    <h1 className="leftTitle">
                        Crafting moments,
                        <br />
                        <em>beautifully managed.</em>
                    </h1>
                    <p className="leftDesc">
                        Curate experiences, manage bookings and coordinate vendors for every celebration, all from one place.
                    </p>
                    <div className="occasionRow">
                        {occasions.map((o) => (
                            <span key={o} className="occasionChip">{o}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="rightPanel">
                <div className="mobileBrand">
                    <span className="brandLogo">F</span>
                    <span className="brandName">{ADMIN_CONFIG.name}</span>
                </div>
                <div className="formCard">
                    <LoginForm
                        loading={loading}
                        error={error}
                        onSubmit={handleLogin}
                    />
                </div>
                <p className="rightFooter">© {new Date().getFullYear()} Forever Moment. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Login;
