import AppModule from "./app";
import ListViewModule, { PlainListView } from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";
import ModalViewModule from "feature-modal";

const ListViewModal = ModalViewModule(PlainListView());
const ModalView = ModalViewModule(PlainListView());
const ListView = ListViewModule(ListViewModal);
const DetailView = DetailViewModule();
const AuthenticationView = AuthenticationViewModule();

const App = AppModule(AuthenticationView, ListView, DetailView, ModalView);

export default App;
