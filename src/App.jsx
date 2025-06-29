import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Trophy, Calendar, Users, BookOpen } from 'lucide-react';

// --- DATOS DEL TORNEO ---
// Grupos corregidos y actualizados según las últimas indicaciones del usuario.
const initialTournamentData = {
  '1ª': {
    'Grup 1': [ 
        { id: 'A1', name: 'Vicenç / Victor' }, 
        { id: 'A2', name: 'Guillem / Alex' }, 
        { id: 'A3', name: 'Jordi / Ivan' },
        { id: 'A4', name: 'Valentin / Borja' }
    ],
    'Grup 2': [ 
        { id: 'A5', name: 'Jonatan / Miquel' }, 
        { id: 'A6', name: 'Xavi / Sergi' }, 
        { id: 'A7', name: 'Alexander / Fernando' },
        { id: 'A8', name: 'Angel / Miguel' }
    ],
  },
  '2ª': {
    'Grup 1': [ 
        { id: 'B1', name: 'Xavi / Andres' }, 
        { id: 'B2', name: 'Toni / Ricardo' }, 
        { id: 'B3', name: 'Hugo / Fran' }, 
        { id: 'B4', name: 'Nestor / Borja' }
    ],
    'Grup 2': [ 
        { id: 'B5', name: 'Juan / German' }, 
        { id: 'B6', name: 'Iago / Carlos' },
        { id: 'B7', name: 'Oscar / Jordi G.' }
    ],
  },
  '3ª': {
    'Grup 1': [ 
        { id: 'C1', name: 'Fran / Cesar' }, 
        { id: 'C2', name: 'Robert / Carmelo' }, 
        { id: 'C3', name: 'Alberto / Angel' },
        { id: 'C4', name: 'Miguel T. / Joan' }
    ],
    'Grup 2': [ 
        { id: 'C5', name: 'Laura / Gemma' }, 
        { id: 'C6', name: 'Carla / Patri' }, 
        { id: 'C7', name: 'Jose A. / Gustau' },
        { id: 'C8', name: 'Hugo / Guillem' }
    ],
  },
  '4ª': {
    'Grup 1': [ 
        { id: 'D1', name: 'Mariano / Jordi M.' }, 
        { id: 'D2', name: 'Alma / Paula' }, 
        { id: 'D3', name: 'Agnes / Ainoa' }, 
        { id: 'D4', name: 'Alba / Leticia' } 
    ],
  },
};

// --- FUNCIÓN PARA GENERAR PARTIDOS Y RESULTADOS ---
// Se generan los partidos. Los resultados se añadirán en futuras actualizaciones.
const generateMatchesAndResults = (teams) => {
  const matches = [];
  if (!teams) return matches;

  // Generar todos los enfrentamientos posibles
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        team1: teams[i],
        team2: teams[j],
        sets: [[null, null], [null, null], [null, null]],
        played: false,
      });
    }
  }
  
  // --- ZONA DE RESULTADOS ---
  // Esta sección está vacía. Los resultados se añadirán cuando me los proporciones.

  return matches;
};


// --- COMPONENTES ---

const getStandings = (teams, matches) => {
    const stats = teams.reduce((acc, team) => { acc[team.id] = { teamId: team.id, teamName: team.name, P: 0, PJ: 0, SG: 0, SP: 0, JG: 0, JP: 0 }; return acc; }, {});
    matches.forEach(match => {
        if (match.played) {
            const team1Stats = stats[match.team1.id];
            const team2Stats = stats[match.team2.id];
            team1Stats.PJ++;
            team2Stats.PJ++;
            let team1SetsWon = 0, team2SetsWon = 0;
            for (let i = 0; i < match.sets.length; i++) {
                const set = match.sets[i];
                if (set[0] !== null && set[1] !== null) {
                    if (set[0] > set[1]) team1SetsWon++; else team2SetsWon++;
                    if (i < 2) { 
                        team1Stats.JG += set[0]; team1Stats.JP += set[1];
                        team2Stats.JG += set[1]; team2Stats.JP += set[0];
                    }
                }
            }
            team1Stats.P += team1SetsWon; team2Stats.P += team2SetsWon;
            team1Stats.SG += team1SetsWon; team1Stats.SP += team2SetsWon;
            team2Stats.SG += team2SetsWon; team2Stats.SP += team1SetsWon;
        }
    });
    return Object.values(stats).sort((a, b) => {
        if (b.P !== a.P) return b.P - a.P;
        const setDiffA = a.SG - a.SP; const setDiffB = b.SG - b.SP;
        if (setDiffB !== setDiffA) return setDiffB - setDiffA;
        const gameDiffA = a.JG - a.JP; const gameDiffB = b.JG - b.JP;
        return gameDiffB - gameDiffA;
    });
};

const ClassificationTable = ({ standings }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[800px] text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-3 py-3">#</th>
                    <th scope="col" className="px-4 py-3">Pareja</th>
                    <th scope="col" className="px-3 py-3 text-center">P</th>
                    <th scope="col" className="px-3 py-3 text-center">PJ</th>
                    <th scope="col" className="px-3 py-3 text-center">SG</th>
                    <th scope="col" className="px-3 py-3 text-center">SP</th>
                    <th scope="col" className="px-3 py-3 text-center">+/- Sets</th>
                    <th scope="col" className="px-3 py-3 text-center">JG</th>
                    <th scope="col" className="px-3 py-3 text-center">JP</th>
                    <th scope="col" className="px-3 py-3 text-center">+/- Jocs</th>
                </tr>
            </thead>
            <tbody>
                {standings.map((s, index) => (
                    <tr key={s.teamId} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-3 py-3 font-bold text-gray-900">{index + 1}</td>
                        <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">{s.teamName}</th>
                        <td className="px-3 py-4 text-center font-bold text-indigo-600">{s.P}</td>
                        <td className="px-3 py-4 text-center">{s.PJ}</td>
                        <td className="px-3 py-4 text-center text-green-600">{s.SG}</td>
                        <td className="px-3 py-4 text-center text-red-600">{s.SP}</td>
                        <td className={`px-3 py-4 text-center font-medium ${s.SG - s.SP >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{s.SG - s.SP}</td>
                        <td className="px-3 py-4 text-center text-green-600">{s.JG}</td>
                        <td className="px-3 py-4 text-center text-red-600">{s.JP}</td>
                        <td className={`px-3 py-4 text-center font-medium ${s.JG - s.JP >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>{s.JG - s.JP}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Group = ({ name, matches, standings }) => {
    const getMatchResult = (match) => {
        if (!match.played) return 'Pendent';
        let res = `${match.sets[0][0]}-${match.sets[0][1]}, ${match.sets[1][0]}-${match.sets[1][1]}`;
        if (match.sets[2][0] !== null && match.sets[2][1] !== null) { res += `, ${match.sets[2][0]}-${match.sets[2][1]}`; }
        return res;
    };
    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{name}</h3>
            <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-3">Classificació</h4>
                    <ClassificationTable standings={standings} />
                </div>
                <div>
                    <h4 className="font-semibold text-lg text-gray-700 mb-3">Enfrontaments</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {matches.map((match, index) => (
                            <div key={index} className={`bg-gray-50 p-3 rounded-lg border-l-4 ${match.played ? 'border-green-500' : 'border-gray-300'}`}>
                                <div className="text-sm font-medium text-gray-700">{match.team1.name}</div>
                                <div className="text-center font-bold text-gray-400 my-1">VS</div>
                                <div className="text-sm font-medium text-gray-700 text-right">{match.team2.name}</div>
                                <div className="mt-2 text-center text-base font-bold text-indigo-600">{getMatchResult(match)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const FinalsBracket = ({ categoryName, finalStandings }) => {
    const getTeamName = (group, position) => {
      let posText = `${position}`;
      if (position === 1 || position === 3) posText += 'er';
      if (position === 2) posText += 'on';
      if (position === 4) posText += 't';
      return finalStandings?.[group]?.[position - 1]?.teamName || `${posText} Grup ${group.slice(-1)}`;
    }
    const BracketItem = ({ top, bottom, label }) => (<div className="flex flex-col items-center"><div className="bg-gray-100 p-3 rounded-md w-44 text-center text-sm shadow-sm h-12 flex items-center justify-center">{top}</div><div className="border-l-2 border-b-2 border-gray-300 h-6 w-1/2"></div><div className="border-r-2 border-b-2 border-gray-300 h-6 w-1/2 -mt-6"></div><div className="bg-gray-100 p-3 rounded-md w-44 text-center text-sm shadow-sm h-12 flex items-center justify-center">{bottom}</div><div className="border-l-2 border-gray-300 h-10 w-px"></div><div className="bg-indigo-100 text-indigo-800 p-3 rounded-md w-44 text-center text-sm font-bold shadow-sm">{label}</div></div>);
    const FinalItem = ({ top, bottom }) => (<div className="flex flex-col items-center"><div className="bg-gray-100 p-3 rounded-md w-44 text-center text-sm shadow-sm h-12 flex items-center justify-center">{top}</div><div className="text-sm font-bold my-2">VS</div><div className="bg-gray-100 p-3 rounded-md w-44 text-center text-sm shadow-sm h-12 flex items-center justify-center">{bottom}</div></div>);
    
    // Lógica para categorías con 2 grupos de 4 (1ª, 3ª, 4ª)
    if (categoryName === '1ª' || categoryName === '3ª' || categoryName === '4ª') {
         return (
             <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                 <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Fase Final - {categoryName}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                     <div className="border-r-0 md:border-r md:pr-4 border-gray-200">
                         <h4 className="text-xl font-semibold text-center mb-6 text-indigo-700">Quadre Principal</h4>
                         <div className="flex flex-col lg:flex-row justify-around items-center"><BracketItem top={getTeamName('Grup 1', 1)} bottom={getTeamName('Grup 2', 2)} label="Semifinal 1" /><BracketItem top={getTeamName('Grup 2', 1)} bottom={getTeamName('Grup 1', 2)} label="Semifinal 2" /></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-indigo-600 mb-2">FINAL</h5><FinalItem top="Guanyador SF 1" bottom="Guanyador SF 2" /></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-gray-600 mb-2">3r i 4t Lloc</h5><FinalItem top="Perdedor SF 1" bottom="Perdedor SF 2" /></div>
                     </div>
                     <div>
                         <h4 className="text-xl font-semibold text-center mb-6 text-orange-600">Quadre de Consolació</h4>
                          <div className="flex flex-col lg:flex-row justify-around items-center"><BracketItem top={getTeamName('Grup 1', 3)} bottom={getTeamName('Grup 2', 4)} label="Semifinal Consolació 1" /><BracketItem top={getTeamName('Grup 2', 3)} bottom={getTeamName('Grup 1', 4)} label="Semifinal Consolació 2" /></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-orange-600 mb-2">FINAL CONSOLACIÓ</h5><FinalItem top="Guanyador SF Cons. 1" bottom="Guanyador SF Cons. 2" /></div>
                     </div>
                 </div>
             </div>
         );
    }

    // Lógica especial para 2ª (Grupo 1 de 4, Grupo 2 de 3)
     if (categoryName === '2ª') {
        return (
             <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                 <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Fase Final - {categoryName}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                     <div className="border-r-0 md:border-r md:pr-4 border-gray-200">
                         <h4 className="text-xl font-semibold text-center mb-6 text-indigo-700">Quadre Principal</h4>
                         <div className="flex flex-col lg:flex-row justify-around items-center"><BracketItem top={getTeamName('Grup 1', 1)} bottom={getTeamName('Grup 2', 2)} label="Semifinal 1" /><BracketItem top={getTeamName('Grup 2', 1)} bottom={getTeamName('Grup 1', 2)} label="Semifinal 2" /></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-indigo-600 mb-2">FINAL</h5><FinalItem top="Guanyador SF 1" bottom="Guanyador SF 2" /></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-gray-600 mb-2">3r i 4t Lloc</h5><FinalItem top="Perdedor SF 1" bottom="Perdedor SF 2" /></div>
                     </div>
                     <div>
                         <h4 className="text-xl font-semibold text-center mb-6 text-orange-600">Quadre de Consolació</h4>
                         <div className="flex flex-col lg:flex-row justify-around items-center"><BracketItem top={getTeamName('Grup 1', 3)} bottom={getTeamName('Grup 2', 3)} label="Semifinal Consolació 1" /><div className="bg-gray-100 p-3 rounded-md w-44 text-center text-sm shadow-sm h-12 flex items-center justify-center">{getTeamName('Grup 1', 4)} <br/>(Passa a la final)</div></div>
                         <div className="mt-8 text-center"><h5 className="text-lg font-semibold text-orange-600 mb-2">FINAL CONSOLACIÓ</h5><FinalItem top="Guanyador SF Cons. 1" bottom={getTeamName('Grup 1', 4)} /></div>
                     </div>
                 </div>
             </div>
        );
    }
    
    // Lógica para 4ª categoria (1 grupo de 4) -> Ahora se gestiona arriba
    return null;
};

const NormativaPanel = () => (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center"><BookOpen className="w-8 h-8 mr-3 text-indigo-600" />Normativa i Funcionament</h2>
            <div className="space-y-4 text-gray-700">
                <p><strong>Inici del torneig:</strong> Dimarts, 1 de juliol de 2025.</p>
                <p><strong>Horari de joc:</strong> De dilluns a dijous, de 19:30 a 22:30. Es jugaran 3 enfrontaments per dia.</p>
                <p><strong>Format dels partits:</strong> Tots els partits de la fase de grups es jugaran al millor de 3 sets. Els dos primers sets es juguen de forma habitual. En cas d'empat a un set, el tercer es decidirà mitjançant un <strong>súper tie-break a 10 punts</strong>.</p>
                <p><strong>Sistema de puntuació i desempat:</strong> La classificació s'ordenarà segons els següents criteris: 1º Punts (cada set guanyat suma 1 punt), 2º Diferència de sets (SG - SP), 3º Diferència de jocs (JG - JP).</p>
            </div>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [tournamentData, setTournamentData] = useState({});
  const [activeCategoryTab, setActiveCategoryTab] = useState('1ª');
  const [activeMainTab, setActiveMainTab] = useState('grups');

  useEffect(() => {
    const processedData = {};
    for (const category in initialTournamentData) {
      processedData[category] = {};
      for (const group in initialTournamentData[category]) {
        const teams = initialTournamentData[category][group];
        processedData[category][group] = { teams: teams, matches: generateMatchesAndResults(teams) };
      }
    }
    setTournamentData(processedData);
  }, []);

  const standingsByCategory = useMemo(() => {
    const allStandings = {};
    for (const category in tournamentData) {
        allStandings[category] = {};
        for (const group in tournamentData[category]) {
            const { teams, matches } = tournamentData[category][group];
            allStandings[category][group] = getStandings(teams, matches);
        }
    }
    return allStandings;
  }, [tournamentData]);

  const finalStandings = useMemo(() => {
    const finalData = {};
    for (const category in tournamentData) {
        const categoryGroups = tournamentData[category];
        let allMatchesPlayed = true;
        for (const group in categoryGroups) {
            if (categoryGroups[group].matches.some(m => !m.played)) {
                allMatchesPlayed = false;
                break;
            }
        }
        if (allMatchesPlayed) {
            finalData[category] = standingsByCategory[category];
        }
    }
    return finalData;
  }, [tournamentData, standingsByCategory]);

  const MainNavButton = ({ tabName, label, icon: Icon }) => (<button onClick={() => setActiveMainTab(tabName)} className={`flex-1 flex justify-center items-center px-3 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${activeMainTab === tabName ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-200'}`}><Icon className="w-5 h-5 mr-2" /><span>{label}</span></button>);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-800"><Shield className="w-8 h-8 text-indigo-600 mr-3" /><h1 className="text-xl md:text-3xl font-bold">IV Torneig Pàdel Les Coves</h1></div>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
            <MainNavButton tabName="grups" label="Grups i Classificació" icon={Users} /><MainNavButton tabName="horaris" label="Horaris" icon={Calendar} /><MainNavButton tabName="fasefinal" label="Fase Final" icon={Trophy} /><MainNavButton tabName="normativa" label="Normativa" icon={BookOpen} />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {activeMainTab === 'grups' && (<div className="animate-fade-in"><div className="mb-6"><div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">{Object.keys(tournamentData).map((category) => (<button key={category} onClick={() => setActiveCategoryTab(category)} className={`w-full py-2.5 text-sm md:text-base font-medium leading-5 rounded-lg ${activeCategoryTab === category ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200/50'}`}>{category}</button>))}</div></div>{standingsByCategory[activeCategoryTab] && Object.entries(standingsByCategory[activeCategoryTab]).map(([groupName, standings]) => (<Group key={groupName} name={groupName} matches={tournamentData[activeCategoryTab][groupName].matches} standings={standings} />))}</div>)}
        {activeMainTab === 'horaris' && (<div className="bg-white rounded-xl shadow-lg p-6 md:p-8 text-center animate-fade-in"><Calendar className="w-16 h-16 mx-auto text-indigo-500 mb-4" /><h2 className="text-2xl font-bold text-gray-800 mb-2">Horaris dels Partits</h2><p className="text-gray-600">Els horaris dels enfrontaments estan pendents de confirmació. Es publicaran pròximament.</p></div>)}
        {activeMainTab === 'fasefinal' && (<div className="space-y-8 animate-fade-in">{Object.keys(tournamentData).map(category => (<FinalsBracket key={category} categoryName={category} finalStandings={finalStandings[category]} />))}</div>)}
        {activeMainTab === 'normativa' && (<NormativaPanel />)}
      </main>
      <style>{`.animate-fade-in{animation:fadeIn .5s ease-in-out}@keyframes fadeIn{from{opacity:0}to{opacity:1}}.animate-slide-up{animation:slideUp .3s ease-out}@keyframes slideUp{from{transform:translateY(20px);opacity:.5}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
