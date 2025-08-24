// src/app/page.js

export default function Home() {
  const [shiftData, setShiftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    providerId: 1, // Default to first provider
    rangeType: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchShiftData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        range_type: filters.rangeType,
        start_date: filters.startDate,
        end_date: filters.endDate
      });

      const response = await fetch(`http://localhost:8000/api/logistic-providers/${filters.providerId}/shifts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setShiftData(data.data);
      } else {
        console.error('API returned error:', data);
      }
    } catch (error) {
      console.error('Error fetching shift data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftData();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    // This div will be placed inside your main layout's <main> tag
    <div>
      <h1 className="text-4xl font-bold text-white-800 mb-4">
        Welcome to the Dashboard
      </h1>
      <p className="text-lg text-white-600">
        Select a page from the navigation bar to view logistics data.
      </p>
    </div>
  );
}