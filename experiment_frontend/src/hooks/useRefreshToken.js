import useAuth from "./Auth";
import axios from '../api/Axios';

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async () => {
      try {
          const response = await axios.post('/auth/token/refresh', {
              refresh: localStorage.getItem("refreshToken")//TODO: replace local storage later
          });

          setAuth(prev => {
              return { ...prev, accessToken: response.data.access}
          });
          return response.data.access;
      } catch (e){
          console.log(e)
      }
    }
    return refresh;
};

export default useRefreshToken;