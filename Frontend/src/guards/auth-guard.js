export function isAuth() {
  const user = JSON.parse(localStorage.getItem("user"));
  return !!user;
}
