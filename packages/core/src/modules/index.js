import AppModule from "./app";
import ListViewModule from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";

const ListView = ListViewModule();
const DetailView = DetailViewModule();
const AuthenticationView = AuthenticationViewModule();

const App = AppModule(AuthenticationView, ListView, DetailView);

export default App;
