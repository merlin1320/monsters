import { useEffect, useState } from "react";
import "./index.css";
import axios from "axios";
import { Link } from 'react-router-dom';

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

function RandomMonster() {
  const [monster, setMonster] = useState<Monster | null>(null);

  useEffect(() => {
    // Check local storage for monsters
    const localData = localStorage.getItem('monsters');
    let monsters: Monster[] = [];
    if (localData) {
      monsters = JSON.parse(localData);
    }

    // Always fetch from API and update local storage
    axios.get(api_url + '/monsters')
      .then((res) => {
        monsters = res.data;
        localStorage.setItem('monsters', JSON.stringify(res.data));
        pickRandomMonster(monsters);
      })
      .catch(() => {
        // If API fails, use local data
        if (monsters.length > 0) pickRandomMonster(monsters);
      });

    // If local data exists, pick a random monster immediately
    if (monsters.length > 0) pickRandomMonster(monsters);
  }, []);

  const pickRandomMonster = (monsters: Monster[]) => {
    if (monsters.length === 0) return;
    const randomIndex = Math.floor(Math.random() * monsters.length);
    setMonster(monsters[randomIndex]);
  };

  if (!monster) return <div style={{textAlign: 'center', marginTop: 40}}>No monster found.<br /><Link to="/"><button style={{marginTop: 24}}>Back</button></Link></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
      <Link to="/">
        <button style={{ marginBottom: 24 }}>Back</button>
      </Link>
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
          <tr>
            <td>
              <span style={{ color: '#4ea1ff', fontWeight: 'bold', textShadow: '0 1px 4px #000, 0 0 2px #4ea1ff' }}>{monster.name}</span>
            </td>
            <td>{monster.attributes.type}</td>
            <td>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li>Catch: {monster.attributes.traits.canCatch ? <span style={{color: 'limegreen'}}>✔️</span> : <span style={{color: 'red'}}>❌</span>}</li>
                <li>Evolve: {monster.attributes.traits.canEvolve ? <span style={{color: 'limegreen'}}>✔️</span> : <span style={{color: 'red'}}>❌</span>}</li>
                <li>Boss: {monster.attributes.traits.isBoss ? <span style={{color: 'limegreen'}}>✔️</span> : <span style={{color: 'red'}}>❌</span>}</li>
              </ul>
            </td>
            <td>{monster.attributes.hp}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RandomMonster;
