import { MdLogout } from "react-icons/md";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [userData, setUserData] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      setUserData(null);
      console.log("Logged Out");
      toast.success("Logged Out Successfully!");
    } catch (error) {
      console.log(`In Logout Error: ${error.message}`);
      toast.error(error.message);
    } finally {
      navigate("/login");
    }
  };

  return (
    <div className="px-3 py-2 text-white hover:bg-teal-700 rounded-lg transition duration-200 h-10 flex items-center">
      <button className="flex items-center" onClick={handleLogout}>
        <span>Logout</span>
        <MdLogout size={22} />
      </button>
    </div>
  );
};

export default Logout;
