import {BrowserRouter as Router, Route} from 'react-router-dom';

import NavBar from './components/NavBar';
import HomePage from './pages/HomePage.js';
import ExplorePage from './pages/ExplorePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AccountPage from './pages/AccountPage.js';
import PlatformPage from './pages/PlatformPage.js';
import GamePage from './pages/GamePage';
import AccountSettingsPage from './pages/AccountSettingsPage.js';
import {AuthProvider} from './context/auth'
import PlatformSettingsPage from './pages/PlatformSettingsPage.js';
import DesignPage from './pages/DesignPage';
import PlayPage from './pages/PlayPage';
import CreatedPlatforms from './pages/CreatedPlatforms';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CreatePlatformPage from './pages/CreatePlatformPage';
import BookmarkedPlatforms from './pages/BookmarkedPlatforms';
import RecentlyPlayed from './pages/RecentlyPlayed';
import MultipleChoiceActivity from './components/MultipleChoiceActivity';
function App() {
  return (
    <AuthProvider>
      <Router>
      <NavBar />
      <Route exact path = '/' component = {HomePage}/>
      <Route exact path = '/explore' component = {ExplorePage}/>
      <Route exact path = '/login' component = {LoginPage}/>
      <Route exact path = '/signup' component = {SignUpPage}/>
      <Route exact path = '/account/:username' component = {AccountPage}/>
      <Route exact path = '/platform/:platformID' component = {PlatformPage}/>
      <Route exact path = '/game/:gameID' component = {GamePage}/>
      <Route exact path = '/platform/:parentPlatform/game/:gameID/design' component = {DesignPage} />
      <Route exact path = '/platform/:parentPlatform/game/:gameID/play' component = {PlayPage} />
      <Route exact path = '/platform/:parentPlatform/game/:gameID' component = {GamePage}/>
      <Route exact path = '/account/:username/settings' component = {AccountSettingsPage} />
      <Route exact path = '/platform/:platformID/settings' component = {PlatformSettingsPage} />
      <Route exact path = '/createplatform' component = {CreatePlatformPage} />
      <Route exact path = '/createdplatforms' component = {CreatedPlatforms} />
      <Route exact path = '/bookmarkedplatforms' component = {BookmarkedPlatforms} />
      <Route exact path = '/playedplatforms' component = {RecentlyPlayed} />
      <Route exact path = '/platform/:parentPlatform/game/:gameID/start' component = {MultipleChoiceActivity} />

    </Router>
    </AuthProvider>
  );
}

export default App;
