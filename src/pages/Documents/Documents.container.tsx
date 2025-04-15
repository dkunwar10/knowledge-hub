import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import httpBase from '../../services/httpBase';
import { setDocuments, setLoading, setError } from '../../store/slices/documentsSlice';
import DocumentsComponent from './Documents.component';

const DocumentsContainer = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state: RootState) => state.documents);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    dispatch(setLoading(true));
    
    if (!term.trim()) {
      fetchDocuments();
      return;
    }
    
    httpBase.post('/query', {
      collection_name: "test_page_info",
      query_text: term,
      limit: 10
    }, {
      successCallback: (response) => {
        if (response.data && response.data.source_nodes) {
          const queryResults = response.data.source_nodes.map((node: any) => ({
            text: node.text,
            metadata: node.metadata
          }));
          dispatch(setDocuments(queryResults));
        } else {
          dispatch(setDocuments([]));
        }
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
    onSearch={handleSearch}
  />;
};

export default DocumentsContainer;
