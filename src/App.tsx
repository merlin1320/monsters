import axios from "axios";
import { useEffect, useState } from "react";
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import "./index.css";
import Monsters from './Monsters';
import RandomMonster from './RandomMonster';

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

  return (
    <HashRouter>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 40 }}>
        <h1>Monsters</h1>
        <div style={{ margin: 24 }}>
          <Link to="/monsters">
            <button style={{ marginRight: 16 }}>Full Monster List</button>
          </Link>
          <Link to="/random">
            <button>Random Monster</button>
          </Link>
        </div>
        <Routes>
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/random" element={<RandomMonster />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
