
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import httpBase from '../../services/httpBase';
import { setDocuments, setLoading, setError } from '../../store/slices/documentsSlice';
import DocumentsComponent from './Documents.component';

const DocumentsContainer = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);

  const fetchDocuments = async () => {
    dispatch(setLoading(true));
    
    await httpBase.post('/documents/', {
      collection_name: "test_page_info",
      limit: 10,
      order_key: "updated_at",
      order_direction: "desc",
      start_from: null
    }, {
      successCallback: (response) => {
        dispatch(setDocuments(response.data));
      },
      failureCallback: (error) => {
        dispatch(setError(error.message));
      },
      finalCallback: () => {
        dispatch(setLoading(false));
      }
    });
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return <DocumentsComponent 
    documents={documents}
    loading={loading}
    error={error}
    onRefresh={fetchDocuments}
  />;
};

export default DocumentsContainer;
