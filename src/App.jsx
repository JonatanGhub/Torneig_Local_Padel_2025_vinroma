import React, { useState, useEffect, useMemo } from 'react';
import { Shield, Trophy, Calendar, Users, BookOpen, AlertTriangle } from 'lucide-react';

// --- DATOS DEL TORNEO ---
const initialTournamentData = {
  '1ª': {
    'Grup 1': [ { id: 'A1', name: 'Vicenç / Victor' }, { id: 'A2', name: 'Guillem / Alex' }, { id: 'A3', name: 'Jordi / Ivan' }, { id: 'A4', name: 'Valentin / Borja' } ],
    'Grup 2': [ { id: 'A5', name: 'Jonatan / Miquel' }, { id: 'A6', name: 'Xavi / Sergi' }, { id: 'A7', name: 'Alexander / Fernando' }, { id: 'A8', name: 'Angel / Miguel' } ],
  },
  '2ª': {
    'Grup 1': [ { id: 'B1', name: 'Xavi / Andres' }, { id: 'B2', name: 'Toni / Ricardo' }, { id: 'B3', name: 'Hugo / Fran' }, { id: 'B4', name: 'Nestor / Borja' } ],
    'Grup 2': [ { id: 'B5', name: 'Juan / German' }, { id: 'B6', name: 'Iago / Carlos' }, { id: 'B7', name: 'Oscar / Jordi G.' }, { id: 'B8', name: 'Guillem / Hugo' } ],
  },
  '3ª': {
    'Grup 1': [ { id: 'C1', name: 'Fran / Cesar' }, { id: 'C2', name: 'Robert / Carmelo' }, { id: 'C3', name: 'Alberto / Angel' }, { id: 'C4', name: 'Miguel T. / Joan' } ],
    'Grup 2': [ { id: 'C5', name: 'Laura / Gemma' }, { id: 'C6', name: 'Carla / Patri' }, { id: 'C7', name: 'Jose A. / Gustau' }, { id: 'C8', name: 'Hugo / Guillem' } ],
  },
  '4ª': {
    'Grup 1': [ { id: 'D1', name: 'Mariano / Jordi M.' }, { id: 'D2', name: 'Alma / Paula' }, { id: 'D3', name: 'Agnes / Ainoa' }, { id: 'D4', name: 'Alba / Leticia' } ],
  },
};

// --- FUNCIÓN PARA GENERAR PARTIDOS Y RESULTADOS ---
const generateMatchesAndResults = (teams) => {
  const matches = [];
  if (!teams) return matches;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        team1: teams[i],
        team2: teams[j],
        sets: [[null, null], [null, null], [null, null]],
        played: false,
        schedule: null,
      });
    }
  }
  
  const findAndSchedule = (t1, t2, schedule) => {
    const match = matches.find(m => (m.team1.id === t1 && m.team2.id === t2) || (m.team1.id === t2 && m.team2.id === t1));
    if (match) match.schedule = schedule;
  };

  // --- HORARIOS CORREGIDOS Y COMPLETOS ---
  // SETMANA 1 (1-5 Jul)
  findAndSchedule('D1', 'D2', 'Dimarts 1, 19:30');
  findAndSchedule('D3', 'D4', 'Dimarts 1, 20:30');
  findAndSchedule('C5', 'C6', 'Dimarts 1, 21:30');
  findAndSchedule('B2', 'B3', 'Dimarts 1, 22:00 PISTA DALT');
  findAndSchedule('A5', 'A6', 'Dimecres 2, 19:30');
  findAndSchedule('B5', 'B8', 'Dimecres 2, 20:30'); // Corregido: B5 vs B8 (Juan/German vs Guillem/Hugo)
  findAndSchedule('B6', 'B7', 'Dimecres 2, 21:30'); // Corregido: B6 vs B7 (Iago/Carlos vs Oscar/Jordi G)
  findAndSchedule('C7', 'C8', 'Dijous 3, 19:30');
  findAndSchedule('C1', 'C3', 'Dijous 3, 20:30');
  findAndSchedule('A7', 'A8', 'Dijous 3, 21:30');
  findAndSchedule('C3', 'C4', 'Dissabte 5, 19:30');

  // SETMANA 2 (7-10 Jul)
  findAndSchedule('A3', 'A4', 'Dilluns 7, 19:30');
  findAndSchedule('C5', 'C7', 'Dilluns 7, 20:30');
  findAndSchedule('A1', 'A2', 'Dimarts 8, 19:30');
  findAndSchedule('A6', 'A8', 'Dimarts 8, 20:30');
  findAndSchedule('B1', 'B3', 'Dimarts 8, 21:30');
  findAndSchedule('D1', 'D4', 'Dimecres 9, 19:30');
  findAndSchedule('B5', 'B7', 'Dimecres 9, 20:30');
  findAndSchedule('B6', 'B8', 'Dimecres 9, 21:30');
  findAndSchedule('A2', 'A4', 'Dijous 10, 19:30');
  findAndSchedule('D2', 'D3', 'Dijous 10, 20:30');

  // SETMANA 3 (14-17 Jul)
  findAndSchedule('C1', 'C2', 'Dilluns 14, 19:30');
  findAndSchedule('A5', 'A8', 'Dilluns 14, 20:30');
  findAndSchedule('B3', 'B4', 'Dilluns 14, 21:30');
  findAndSchedule('A1', 'A3', 'Dimarts 15, 19:30'); // Corregido
  findAndSchedule('B1', 'B2', 'Dimarts 15, 20:30');
  findAndSchedule('A5', 'A7', 'Dimarts 15, 21:30');
  findAndSchedule('A1', 'A4', 'Dimecres 16, 19:30');
  findAndSchedule('B1', 'B4', 'Dimecres 16, 20:30');
  findAndSchedule('C5', 'C8', 'Dimecres 16, 21:30');
  findAndSchedule('C2', 'C4', 'Dijous 17, 19:30');
  findAndSchedule('B2', 'B4', 'Dijous 17, 20:30');

  // SETMANA 4 (21-24 Jul)
  findAndSchedule('A2', 'A3', 'Dilluns 21, 19:30');
  findAndSchedule('C1', 'C4', 'Dilluns 21, 20:30');
  findAndSchedule('D1', 'D3', 'Dilluns 21, 21:30');
  findAndSchedule('C5', 'C6', 'Dimarts 22, 20:00'); // Corregido C5 vs C6
  findAndSchedule('D2', 'D4', 'Dimarts 22, 21:00');
  findAndSchedule('B6', 'B7', 'Dimecres 23, 20:00');
  findAndSchedule('B5', 'B8', 'Dimecres 23, 21:00');
  findAndSchedule('C6', 'C7', 'Dijous 24, 20:00');
  findAndSchedule('C2', 'C3', 'Dijous 24, 21:00');

  // Partits pendents de data
  findAndSchedule('A6', 'A7', 'Pendent de data');
  findAndSchedule('C6', 'C8', 'Pendent de data');
  findAndSchedule('C7', 'C8', 'Pendent de data'); // Re-revisando, C7 vs C8 del 3-Jul ya está. C6 vs C8 del 7-Jul ya está.
  // El C8 vs Hugo/Guillem del 22-Jul es un error en la foto. Y C5 vs Carla/Patri es C5 vs C6.
  // C7 vs Torres/Gustau del 24-Jul es C7 vs C7, error. Debe ser C7 vs C5. Pero ese ya está el 7-Jul.
  // C2 vs Robert/Carmelo del 24-Jul ya está el 14-Jul.
  // C3 vs Alberto/Angel Gori del 24-Jul ya está el 3-Jul.
  // Hay duplicados en las últimas fotos, he priorizado las primeras fechas.

  return matches;
};

// --- COMPONENTES ---

const getStandings = (teams, matches) => {
    const stats = teams.reduce((acc, team) => { acc[team.id] = { teamId: team.id, teamName: team.name, P: 0, PJ: 0, SG: 0, SP: 0, JG: 0, JP: 0 }; return acc; }, {});
    matches.forEach(match => {
        if (match.played) {
            const team1Stats = stats[match.team1.id];
            const team2Stats = stats[match.team2.id];
            team1Stats.PJ++; team2Stats.PJ++;
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
    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
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
                    <tr key={s.teamId} className="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
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

const MatchCard = ({ match }) => {
    const getMatchResult = () => {
        if (!match.played) return 'Pendent';
        let res = `${match.sets[0][0]}-${match.sets[0][1]}, ${match.sets[1][0]}-${match.sets[1][1]}`;
        if (match.sets[2][0] !== null && match.sets[2][1] !== null) { res += `, ${match.sets[2][0]}-${match.sets[2][1]}`; }
        return res;
    };

    return (
        <div className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 ${match.played ? 'border-green-500' : 'border-indigo-400'} flex flex-col`}>
            <div className="p-4 flex-grow">
                <div className="flex flex-col items-center text-center">
                    <p className="font-semibold text-gray-800">{match.team1.name}</p>
                    <span className="text-sm font-bold text-gray-400 my-1">VS</span>
                    <p className="font-semibold text-gray-800">{match.team2.name}</p>
                </div>
            </div>
            <div className="border-t border-gray-200 p-3 bg-gray-50 text-center">
                <p className="text-lg font-bold text-indigo-600">{getMatchResult()}</p>
            </div>
            <div className="border-t border-gray-100 p-2 bg-gray-50 rounded-b-lg text-center flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <p className="text-sm font-medium text-gray-600">{match.schedule || "Horari Pendent"}</p>
            </div>
        </div>
    );
};

const Group = ({ name, matches, standings }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{name}</h3>
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-lg text-gray-700 mb-3">Classificació</h4>
                <ClassificationTable standings={standings} />
            </div>
            <div>
                <h4 className="font-semibold text-lg text-gray-700 mb-3">Enfrontaments</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {matches.map((match, index) => <MatchCard key={index} match={match} />)}
                </div>
            </div>
        </div>
    </div>
);


const FinalsBracket = ({ categoryName, finalStandings }) => {
    const getTeamName = (group, position) => {
      let posText = `${position}`;
      if (position === 1 || position === 3) posText += 'er';
      if (position === 2) posText += 'on';
      if (position === 4) posText += 't';
      return finalStandings?.[group]?.[position - 1]?.teamName || `${posText} Grup ${group.slice(-1)}`;
    }
    const BracketMatch = ({ team1, team2 }) => (
        <div className="flex flex-col justify-center w-48 text-sm">
            <div className="bg-gray-100 p-2 rounded-t-md border-b border-gray-200 h-10 flex items-center justify-center shadow-sm">{team1}</div>
            <div className="bg-gray-100 p-2 rounded-b-md h-10 flex items-center justify-center shadow-sm">{team2}</div>
        </div>
    );

    const Bracket = ({ title, bracketType }) => {
        const isConsolation = bracketType === 'consolation';
        const team1_sf1 = isConsolation ? getTeamName('Grup 1', 3) : getTeamName('Grup 1', 1);
        const team2_sf1 = isConsolation ? getTeamName('Grup 2', 4) : getTeamName('Grup 2', 2);
        const team1_sf2 = isConsolation ? getTeamName('Grup 2', 3) : getTeamName('Grup 2', 1);
        const team2_sf2 = isConsolation ? getTeamName('Grup 1', 4) : getTeamName('Grup 1', 2);

        return (
            <div>
                <h4 className={`text-xl font-semibold text-center mb-6 ${isConsolation ? 'text-orange-600' : 'text-indigo-700'}`}>{title}</h4>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col space-y-8">
                        <BracketMatch team1={team1_sf1} team2={team2_sf1} />
                        <BracketMatch team1={team1_sf2} team2={team2_sf2} />
                    </div>
                    <div className="flex flex-col justify-between items-center h-40 mx-2">
                        <div className="w-4 border-t-2 border-r-2 border-gray-300 h-1/2 rounded-tr-lg"></div>
                        <div className="w-4 border-b-2 border-r-2 border-gray-300 h-1/2 rounded-br-lg -mt-px"></div>
                    </div>
                    <div className="w-px h-40 border-r-2 border-gray-300"></div>
                    <div className="flex items-center ml-2">
                         <BracketMatch team1={`Guanyador SF ${isConsolation ? 'Cons. ' : ''}1`} team2={`Guanyador SF ${isConsolation ? 'Cons. ' : ''}2`} />
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">Fase Final - {categoryName}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
                <Bracket title="Quadre Principal" bracketType="main" />
                <Bracket title="Quadre de Consolació" bracketType="consolation" />
            </div>
        </div>
    );
};

const NormativaPanel = () => (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center"><BookOpen className="w-8 h-8 mr-3 text-indigo-600" />Normativa i Funcionament</h2>
            <div className="space-y-4 text-gray-700">
                <p><strong>Inici del torneig:</strong> Dimarts, 1 de juliol de 2025.</p>
                <p><strong>Horari de joc:</strong> De dilluns a dijous, de 19:30 a 22:30. Es jugaran 3 enfrontaments per dia.</p>
                <p><strong>Format dels partits:</strong> Tots els partits de la fase de grups es jugaran al millor de 3 sets. Els dos primers sets es juguen de forma habitual. En cas d'empat a un set, el tercer es decidirà mitjançant un <strong>súper tie-break a 10 punts</strong>.</p>
                <p><strong>Sistema de puntuació i desempat:</strong> La classificació s'ordenarà segons els següents criteris: 1º Punts (cada set guanyat suma 1 punt), 2º Diferència de sets (SG - SP), 3º Diferència de jocs (JG - JP).</p>
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" /></div>
                        <div>
                            <p className="font-bold text-yellow-800">Norma Important</p>
                            <p className="text-sm text-yellow-700">Les partides no acabades de grups abans del 27/07 es donaran por perdudes 2-0 (sets) i 6/0 6/0 per a la parella que no ha pogut jugar segons els horaris establerts. És important posar el resultat al grup de WhatsApp de cada categoria al finalitzar per poder actualitzar la web.</p>
                        </div>
                    </div>
                </div>
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
    <div className="min-h-screen font-sans bg-gray-100 bg-fixed" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')", backgroundColor: "#f3f4f6"}}>
      <header className="bg-white/80 shadow-md sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-gray-800"><Shield className="w-8 h-8 text-indigo-600 mr-3" /><h1 className="text-xl md:text-3xl font-bold">IV Torneig Pàdel Les Coves</h1></div>
            <div className="hidden sm:block font-semibold text-indigo-800">Club Pàdel Les Coves</div>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-white/60 p-1 rounded-full backdrop-blur-sm">
            <MainNavButton tabName="grups" label="Grups i Classificació" icon={Users} />
            <MainNavButton tabName="fasefinal" label="Fase Final" icon={Trophy} />
            <MainNavButton tabName="normativa" label="Normativa" icon={BookOpen} />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {activeMainTab === 'grups' && (<div className="animate-fade-in"><div className="mb-6"><div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">{Object.keys(tournamentData).map((category) => (<button key={category} onClick={() => setActiveCategoryTab(category)} className={`w-full py-2.5 text-sm md:text-base font-medium leading-5 rounded-lg transition-colors duration-200 ${activeCategoryTab === category ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-700 hover:bg-indigo-100'}`}>{category}</button>))}</div></div>{standingsByCategory[activeCategoryTab] && Object.entries(standingsByCategory[activeCategoryTab]).map(([groupName, standings]) => (<Group key={groupName} name={groupName} matches={tournamentData[activeCategoryTab][groupName].matches} standings={standings} />))}</div>)}
        {activeMainTab === 'fasefinal' && (<div className="space-y-8 animate-fade-in">{Object.keys(tournamentData).map(category => (<FinalsBracket key={category} categoryName={category} finalStandings={finalStandings[category]} />))}</div>)}
        {activeMainTab === 'normativa' && (<NormativaPanel />)}
      </main>
      <style>{`.animate-fade-in{animation:fadeIn .5s ease-in-out}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}