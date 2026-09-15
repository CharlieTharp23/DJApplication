import { Navigate, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    user,
  } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <IonApp>
        <style>{`
          .auth-btn {
            padding: 14px 36px;
            font-size: 16px;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, #6a5cff, #4b8bff);
            border: none;
            border-radius: 999px;
            cursor: pointer;
            box-shadow: 0 6px 16px rgba(75, 139, 255, 0.35);
            transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
          }
          .auth-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 22px rgba(75, 139, 255, 0.45);
            filter: brightness(1.05);
          }
          .auth-btn:active {
            transform: translateY(0);
            box-shadow: 0 4px 10px rgba(75, 139, 255, 0.35);
          }
        `}</style>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            gap: '20px',
            background: 'linear-gradient(180deg, #000000, #2d2e2f)',
            fontFamily: 'sans-serif',
          }}
        >
          <h1 style={{ color: '#ffffff', fontSize: '24px', margin: 0 }}>
            My First Programming Assignment
          </h1>

          <button className="auth-btn" onClick={() => loginWithRedirect()}>
            Log In / Sign Up
          </button>
        </div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/home" element={<Home />} />

          <Route
            path="/"
            element={<Navigate to="/home" replace />}
          />
        </IonRouterOutlet>

        <div
          style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
          }}
        >
          {user?.name && <span style={{ marginRight: '10px' }}>{user.name}</span>}

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
              })
            }
          >
            Log Out
          </button>
        </div>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
