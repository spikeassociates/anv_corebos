import AppModule from "./app";
import ListViewModule, { PlainListView } from "feature-listview";
import DetailViewModule from "feature-detailview";
import AuthenticationViewModule from "feature-authentication";
import ModalViewModule from "feature-modal";
import FormViewModule from "feature-form";
import FormBuilderModule from "feature-form-builder";

const ListViewForm = FormViewModule(PlainListView());
const ListViewModal = ModalViewModule(ListViewForm);

const DetailViewForm = FormViewModule(PlainListView());
const DetailViewModal = ModalViewModule(DetailViewForm);

const ModalViewForm = FormViewModule(PlainListView());

const ModalView = ModalViewModule(ModalViewForm);
const ListView = ListViewModule(ListViewModal);
const DetailView = DetailViewModule(PlainListView(), DetailViewModal);
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
