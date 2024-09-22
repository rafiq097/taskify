import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userAtom } from "../state/userAtom";
import NavBar from "../components/NavBar";

function HomePage() {
  const [userData, setUserData] = useRecoilState(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/verify", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserData(res.data.user);
        })
        .catch((err) => {
          console.log(err.message);
          localStorage.removeItem("token");
          setUserData(null);
        });
    } else {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, []);

  return (
    <>
        <h1 className="text-red-900">HomePage</h1>
    </>
  );
}

export default HomePage;
