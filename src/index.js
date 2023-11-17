import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import 'moment/locale/id';

// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';

// style + assets
import 'assets/scss/style.scss';
import config from './config';
import MultiProvider from 'config/MultiProvider';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// providers
import AuthProvider from 'contexts/AuthContext';
import TFUProvider from 'contexts/TFUContext';
import MasterDataProvider from 'contexts/MasterData';
import TPPProvider from 'contexts/TPPContext';
import HealthyHouseProvider from 'contexts/HealthyHouseContext';
import SanitaryProvider from 'contexts/SanitaryContext';
import WaterProvider from 'contexts/WaterContext';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <MultiProvider
    providers={[
      <AuthProvider />,
      <TFUProvider />,
      <MasterDataProvider />,
      <TPPProvider />,
      <HealthyHouseProvider />,
      <SanitaryProvider />,
      <WaterProvider />
    ]}
  >
    <Provider store={store}>
      <BrowserRouter basename={config.basename}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <App />
        </LocalizationProvider>
      </BrowserRouter>
    </Provider>
  </MultiProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
