import { useQuery } from 'react-query';
import axios from 'axios';
import urlStore from '../stores/urlStore';

const useGetRegion = () => {
  const { API_URL } = urlStore();

  const { data } = useQuery('get-region', () =>
    axios.get(`${API_URL}/region`)
  );

  return data;
};

export default useGetRegion;
