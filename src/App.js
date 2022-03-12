import styles from "./App.module.css";
import "./api/axiosDefaults";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import PropertyListPage from "./pages/properties/PropertyListPage";
import PropertyCreateForm from "./pages/properties/PropertyCreateForm";
import PropertyEditForm from "./pages/properties/PropertyEditForm";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import PropertyPage from "./pages/properties/PropertyPage";

function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Row>
          <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
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
              <Route
                exact
                path="/properties/:id"
                render={() => <PropertyPage />}
              />
              <Route
                exact
                path="/properties/:id/edit"
                render={() => <PropertyEditForm />}
              />
              <Route
                exact
                path="/profiles/:id"
                render={() => <ProfilePage />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
