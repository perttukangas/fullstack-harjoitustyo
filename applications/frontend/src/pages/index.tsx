import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('/api/22')
      .then((response) => response.json())
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      .then((data2) => setData2(data2))
      .catch((error) => console.error('Error fetching data2:', error));
  }, []);

  return (
    <div>
      <h1>Home - Basic</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
      {data2 ? <pre>{JSON.stringify(data2, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
