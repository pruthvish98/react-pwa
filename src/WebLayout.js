import { BrowserRouter } from 'react-router-dom';
import AppDownload from './components/layout/AppDownload';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import LoginArea from './components/layout/LoginArea';
import AllRoutes from './routes';
import ScrollToTop from "./ScrollTop";

function App(props) {
  return (
    <div >
          <Header />
            {props.children}
          <AppDownload />
          <LoginArea />
          <Footer />
          <ScrollToTop />
    </div>
  );
}

export default App;
