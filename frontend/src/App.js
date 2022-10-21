import "./App.css";
import Dropzone from "./components/Dropzone";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <h3>{window.REACT_APP_BACKEND_URL}</h3>*/}
      {/*<h3>{process.env.REACT_APP_BACKEND_URL}</h3>*/}
      <BrowserRouter>
        <Routes>
          <Route
            render={({ location }) =>
              //This array includes pages on which user will
              // not be redirected
                location.pathname === "/"
               ? null : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>

      <Dropzone />
    </div>
  );
}

export default App;
