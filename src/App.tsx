import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";

const api_url = "https://3gcxrtjq-3006.usw3.devtunnels.ms";

export interface Monster {
  id: number;
  name: string;
  attributes: Attributes;
}
export interface Attributes {
  type: string;
  hp: number;
  traits: Traits;
}
export interface Traits {
  canCatch: boolean;
  canEvolve: boolean;
  isBoss: boolean;
}

function App() {
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<Monster>(
    {} as Monster
  );

  useEffect(() => {
    // Check local storage for monsters
    const localData = localStorage.getItem('monsters');
    if (localData) {
      setMonsters(JSON.parse(localData));
    } else {
      setMonsters([]);
    }

    // Always fetch from API and update local storage
    axios.get(api_url + '/monsters')
      .then((res) => {
        setMonsters(res.data);
        localStorage.setItem('monsters', JSON.stringify(res.data));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleMonsterClick = (monster: Monster) => {
    setSelectedMonster(monster);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMonster({} as Monster);
  };

  const handleSave = async () => {
    if (!selectedMonster) return;
    try {
      await axios.patch(`${api_url}/monster/${selectedMonster.id}/attributes`, selectedMonster);
      setModalOpen(false);
      setSelectedMonster({} as Monster);
      // Refresh monsters from API and update local storage
      const res = await axios.get(api_url + '/monsters');
      setMonsters(res.data);
      localStorage.setItem('monsters', JSON.stringify(res.data));
    } catch (error) {
      console.error('Error saving monster:', error);
    }
  };

  return (
    <>
      <div>
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
            {monsters.map((monster) => (
              <tr key={monster.id}>
                <td>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "blue",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => handleMonsterClick(monster)}
                  >
                    {monster.name}
                  </button>
                </td>
                <td>{monster.attributes.type}</td>
                <td>
                  Catch: {monster.attributes.traits.canCatch ? "Yes" : "No"},
                  Evolve: {monster.attributes.traits.canEvolve ? "Yes" : "No"},
                  Boss: {monster.attributes.traits.isBoss ? "Yes" : "No"}
                </td>
                <td>{monster.attributes.hp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal */}
        {modalOpen && selectedMonster && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                background: "#181818",
                color: "#fff",
                padding: 24,
                borderRadius: 8,
                minWidth: 300,
                boxShadow: "0 4px 32px rgba(0,0,0,0.8)",
                border: "1px solid #333",
              }}
            >
              <h2 style={{ color: '#fff' }}>Edit Monster</h2>
              <label style={{ color: '#fff' }}>
                Name:
                <input
                  name="name"
                  value={selectedMonster.name}
                  disabled
                  style={{ background: '#222', color: '#fff', border: '1px solid #444', marginLeft: 8 }}
                />
              </label>
              <br />
              <label style={{ color: '#fff' }}>
                Type:
                <input
                  name="type"
                  value={selectedMonster.attributes.type}
                  onChange={e => setSelectedMonster({ ...selectedMonster, attributes: { ...selectedMonster.attributes, type: e.target.value } })}
                  style={{ background: '#222', color: '#fff', border: '1px solid #444', marginLeft: 8 }}
                />
              </label>
              <br />
              <label style={{ color: '#fff' }}>
                Hitpoints:
                <input
                  name="hp"
                  type="number"
                  value={selectedMonster.attributes.hp}
                  onChange={e => setSelectedMonster({ ...selectedMonster, attributes: { ...selectedMonster.attributes, hp: Number(e.target.value) } })}
                  style={{ background: '#222', color: '#fff', border: '1px solid #444', marginLeft: 8 }}
                />
              </label>
              <br />
              <label style={{ color: '#fff' }}>
                Can Catch:
                <input
                  type="checkbox"
                  checked={selectedMonster.attributes.traits.canCatch}
                  onChange={e => setSelectedMonster({ ...selectedMonster, attributes: { ...selectedMonster.attributes, traits: { ...selectedMonster.attributes.traits, canCatch: e.target.checked } } })}
                  style={{ marginLeft: 8 }}
                />
              </label>
              <br />
              <label style={{ color: '#fff' }}>
                Can Evolve:
                <input
                  type="checkbox"
                  checked={selectedMonster.attributes.traits.canEvolve}
                  onChange={e => setSelectedMonster({ ...selectedMonster, attributes: { ...selectedMonster.attributes, traits: { ...selectedMonster.attributes.traits, canEvolve: e.target.checked } } })}
                  style={{ marginLeft: 8 }}
                />
              </label>
              <br />
              <label style={{ color: '#fff' }}>
                Is Boss:
                <input
                  type="checkbox"
                  checked={selectedMonster.attributes.traits.isBoss}
                  onChange={e => setSelectedMonster({ ...selectedMonster, attributes: { ...selectedMonster.attributes, traits: { ...selectedMonster.attributes.traits, isBoss: e.target.checked } } })}
                  style={{ marginLeft: 8 }}
                />
              </label>
              <br />
              <button onClick={handleModalClose} style={{ background: '#333', color: '#fff', border: '1px solid #444', marginRight: 8, padding: '6px 16px', borderRadius: 4 }}>Close</button>
              <button onClick={handleSave} style={{ background: '#0078d4', color: '#fff', border: 'none', padding: '6px 16px', borderRadius: 4 }}>Save</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
