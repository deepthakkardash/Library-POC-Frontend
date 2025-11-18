// import axios from 'axios'
// import { useState } from 'react';

// function useFetch(api)
// {

//     let [data,updateData]=useState([]);

//     let [error,setError]=useState(null);
//     let [loading,setLoading]=useState(true);

//     axios.get(api)
//     .then((response)=>{
//         updateData(data=response.data.data);
        
//         setLoading(loading=false);
//     })
//     .catch((err)=>{
//         setError(error=err);
//     })

//     return {data,loading,error};
// }

// export default useFetch

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