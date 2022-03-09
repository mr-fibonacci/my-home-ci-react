import styles from "./App.module.css";
import "./api/axiosDefaults";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import PropertyListPage from "./pages/properties/PropertyListPage";
import PropertyCreateForm from "./pages/properties/PropertyCreateForm";
import { useCurrentUser } from "./contexts/CurrentUserContext";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => <PropertyListPage profile_id="" />}
          />
          <Route
            exact
            path="/liked"
            render={() => <PropertyListPage profile_id={profile_id} />}
          />
          <Route
            exact
            path="/properties/create"
            render={() => <PropertyCreateForm />}
          />
          <Route exact path="/signin" render={() => <SignInForm />} />
          <Route exact path="/signup" render={() => <SignUpForm />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;
