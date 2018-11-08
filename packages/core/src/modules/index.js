import AppModule from "./app";
import ListViewModule from "feature-listview";
import DetailViewModule from "feature-detailview";
import LoginViewModule from "feature-login";

const ListView = ListViewModule();
const DetailView = DetailViewModule();
const LoginView = LoginViewModule();

const App = AppModule(LoginView, ListView, DetailView);

export default App;
