import "./App.css";
import { GuestRoute, PrivateRoute } from "./AuthRoute";
import Main from "./components/Main";
import NotFound from "./components/NotFound";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import client from "./apolloClient";
import { ApolloProvider } from "@apollo/client";

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PrivateRoute children={<Main />} />} />
          <Route
            path="/signin"
            element={<GuestRoute children={<SignIn />} />}
          />
          <Route
            path="/signup"
            element={<GuestRoute children={<SignUp />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
