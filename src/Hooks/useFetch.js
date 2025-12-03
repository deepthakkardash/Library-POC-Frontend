import { useEffect, useState } from 'react';
import axios from 'axios';

function useFetch(api) {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; 

    axios.get(api, {
      withCredentials: true
    })
      .then((response) => {
        if (isMounted) {
          setData(response.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });


    return () => {
      isMounted = false;
    };
  }, [api]); 

  return { data, loading, error };
}

export default useFetch;