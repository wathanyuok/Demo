import useAuthStore from "../store/auth-store";

function Logout() {
  // JS
  const actionLogout = useAuthStore((state) => state.actionLogout);

  const hdlLogout = () => {
    // code body
    console.log("Hello, Logout");
  };

  return (
    <div className="text-white">
      <button className=" hover:cursor-pointer" 
      onClick={hdlLogout}>
        Logout
      </button>
    </div>
  );
}
export default Logout;