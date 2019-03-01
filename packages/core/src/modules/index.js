import AppModule from "./app";
import ListViewModule, { PlainListView } from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";
import ModalViewModule from "feature-modal";
import FormViewModule from "feature-form";

const FormView = FormViewModule(PlainListView());
const ListViewModal = ModalViewModule(FormView);

const ModalView = ModalViewModule(FormView);
const ListView = ListViewModule(ListViewModal);
const DetailView = DetailViewModule();
const AuthenticationView = AuthenticationViewModule();

const App = AppModule(AuthenticationView, ListView, DetailView, ModalView);

export default App;
