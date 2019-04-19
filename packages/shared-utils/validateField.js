export function validateField(value, uitype) {
  console.log(uitype);
  switch (uitype) {
    case "13": //Email
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(String(value).toLowerCase())) {
        return "Email is not valid!";
      }
      return "";
      break;
    default:
  }
}
