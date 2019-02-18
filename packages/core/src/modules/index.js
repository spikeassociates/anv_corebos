import AppModule from "./app";
import ListViewModule, { PlainListView } from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";
import ModalViewModule from "feature-modal";
import FormBuilderModule from "feature-form-builder";

const ListViewModal = ModalViewModule(PlainListView());
const ModalView = ModalViewModule(PlainListView());
const ListView = ListViewModule(ListViewModal);
const DetailView = DetailViewModule();
const AuthenticationView = AuthenticationViewModule();
const FormBuilderView = FormBuilderModule();

const App = AppModule(
  AuthenticationView,
  ListView,
  DetailView,
  ModalView,
  FormBuilderView
);

export default App;
