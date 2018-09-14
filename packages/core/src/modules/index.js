import AppModule from "./app";
import ListViewModule from "feature-listview";
import DetailViewModule from "feature-detailview";

const ListView = ListViewModule();
const DetailView = DetailViewModule();

const App = AppModule(ListView, DetailView);

export default App;
