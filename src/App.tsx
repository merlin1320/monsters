import { useState } from 'react'
import './index.css'
import axios from 'axios'

const api_url = 'https://3gcxrtjq-3006.usw3.devtunnels.ms/';

export interface Monster {
  name: string;
  type: string;
  traits: string;
  hitpoints: number;
}

function App() {
  const [data, setData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<any>(null);

  // Example monster data
  const monsters = [
    {
      name: 'Goblin',
      type: 'Beast',
      traits: 'Small, Agile',
      hitpoints: 12,
    },
    // Add more monsters as needed
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(api_url);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMonsterClick = (monster: any) => {
    setSelectedMonster(monster);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMonster(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMonster({ ...selectedMonster, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div>
        <button onClick={fetchData}>Fetch Data</button>
        {data && (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
        <table>
          <thead>
            <tr>
              <th>Monster Name</th>
              <th>Monster Type</th>
              <th>Monster Traits</th>
              <th>Monster Hitpoints</th>
            </tr>
          </thead>
          <tbody>
            {monsters.map((monster, idx) => (
              <tr key={idx}>
                <td>
                  <button style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => handleMonsterClick(monster)}>
                    {monster.name}
                  </button>
                </td>
                <td>{monster.type}</td>
                <td>{monster.traits}</td>
                <td>{monster.hitpoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal */}
        {modalOpen && selectedMonster && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 24, borderRadius: 8, minWidth: 300 }}>
              <h2>Edit Monster</h2>
              <label>
                Name:
                <input name="name" value={selectedMonster.name} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Type:
                <input name="type" value={selectedMonster.type} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Traits:
                <input name="traits" value={selectedMonster.traits} onChange={handleInputChange} />
              </label>
              <br />
              <label>
                Hitpoints:
                <input name="hitpoints" value={selectedMonster.hitpoints} onChange={handleInputChange} type="number" />
              </label>
              <br />
              <button onClick={handleModalClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
