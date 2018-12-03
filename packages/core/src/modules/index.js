import AppModule from "./app";
import ListViewModule, { PlainListView } from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";
import ModalViewModule from "feature-modal";

const ModalView = ModalViewModule(PlainListView());
const ListView = ListViewModule(ModalView);
const DetailView = DetailViewModule();
const AuthenticationView = AuthenticationViewModule();

const App = AppModule(AuthenticationView, ListView, DetailView);

export default App;
