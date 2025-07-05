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
    'Grup 2': [ { id: 'B8', name: 'Juan / German' }, { id: 'B7', name: 'Iago / Carlos' }, { id: 'B5', name: 'Oscar / Jordi G.' }, { id: 'B6', name: 'Guillem / Hugo' } ],
  },
  '3ª': {
    'Grup 1': [ { id: 'C1', name: 'Fran / Cesar' }, { id: 'C2', name: 'Robert / Carmelo' }, { id: 'C3', name: 'Alberto / Angel' }, { id: 'C4', name: 'Miguel T. / Joan' } ],
    'Grup 2': [ { id: 'C5', name: 'Laura / Gemma' }, { id: 'C6', name: 'Carla / Patri' }, { id: 'C7', name: 'Jose A. / Gustau' }, { id: 'C8', name: 'Hugo / Guillem' } ],
  },
  '4ª': {
    'Grup 1': [ { id: 'D1', name: 'Mariano / Jordi M.' }, { id: 'D2', name: 'Alma / Paula' }, { id: 'D3', name: 'Agnes / Ainoa' }, { id: 'D4', name: 'Alba / Leticia' } ],
  },
};

// --- FUNCIÓN PARA GENERAR PARTIDOS ---
const generateMatches = (teams) => {
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

            let team1SetsWon = 0;
            let team2SetsWon = 0;
            
            match.sets.forEach((set, index) => {
                if (set[0] !== null && set[1] !== null) {
                    if (set[0] > set[1]) team1SetsWon++;
                    else team2SetsWon++;
                    
                    // Solo sumar juegos de los 2 primeros sets para la diferencia de juegos
                    if (index < 2) {
                        team1Stats.JG += set[0];
                        team1Stats.JP += set[1];
                        team2Stats.JG += set[1];
                        team2Stats.JP += set[0];
                    }
                }
            });

            team1Stats.P += team1SetsWon;
            team2Stats.P += team2SetsWon;
            team1Stats.SG += team1SetsWon;
            team1Stats.SP += team2SetsWon;
            team2Stats.SG += team2SetsWon;
            team2Stats.SP += team1SetsWon;
        }
    });

    return Object.values(stats).sort((a, b) => {
        if (b.P !== a.P) return b.P - a.P;

        // Desempate por enfrentamiento directo
        const directMatch = matches.find(m => m.played && ((m.team1.id === a.teamId && m.team2.id === b.teamId) || (m.team1.id === b.teamId && m.team2.id === a.teamId)));
        if (directMatch) {
            let aSets = 0;
            directMatch.sets.forEach(set => {
                if (set[0] !== null && set[1] !== null) {
                    if (directMatch.team1.id === a.teamId && set[0] > set[1]) aSets++;
                    if (directMatch.team2.id === a.teamId && set[1] > set[0]) aSets++;
                }
            });
            if (aSets > 1) return -1; // a gana
            if (aSets < 1) return 1;  // b gana
        }

        const setDiffA = a.SG - a.SP;
        const setDiffB = b.SG - b.SP;
        if (setDiffB !== setDiffA) return setDiffB - setDiffA;

        const gameDiffA = a.JG - a.JP;
        const gameDiffB = b.JG - b.JP;
        return gameDiffB - gameDiffA;
    });
};

const ClassificationTable = ({ standings }) => (
    <div className="overflow-x-auto rounded-lg border border-neutral-700 shadow-lg bg-neutral-800">
        <table className="w-full min-w-[800px] text-sm text-left text-neutral-300">
            <thead className="text-xs text-neutral-200 uppercase bg-neutral-700">
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
                    <tr key={s.teamId} className="bg-neutral-800 border-b border-neutral-700 hover:bg-neutral-700 transition-colors duration-200">
                        <td className="px-3 py-3 font-bold text-neutral-100">{index + 1}</td>
                        <th scope="row" className="px-4 py-4 font-medium text-neutral-100 whitespace-nowrap">{s.teamName}</th>
                        <td className="px-3 py-4 text-center font-bold text-primary-400">{s.P}</td>
                        <td className="px-3 py-4 text-center">{s.PJ}</td>
                        <td className="px-3 py-4 text-center text-green-400">{s.SG}</td>
                        <td className="px-3 py-4 text-center text-red-400">{s.SP}</td>
                        <td className={`px-3 py-4 text-center font-medium ${s.SG - s.SP >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.SG - s.SP}</td>
                        <td className="px-3 py-4 text-center text-green-400">{s.JG}</td>
                        <td className="px-3 py-4 text-center text-red-400">{s.JP}</td>
                        <td className={`px-3 py-4 text-center font-medium ${s.JG - s.JP >= 0 ? 'text-green-400' : 'text-red-400'}`}>{s.JG - s.JP}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const MatchCard = ({ match }) => {
    const getMatchResult = () => {
        if (!match.played) return { result: 'Pendent', winner: null };

        let team1SetsWon = 0;
        let team2SetsWon = 0;
        const sets = match.sets.filter(s => s[0] !== null && s[1] !== null);

        for (const set of sets) {
            if (set[0] > set[1]) {
                team1SetsWon++;
            } else {
                team2SetsWon++;
            }
        }

        const resultString = sets.map(s => `${s[0]}-${s[1]}`).join(', ');
        const winner = team1SetsWon > team2SetsWon ? match.team1 : match.team2;

        return { result: resultString, winner };
    };

    const { result, winner } = getMatchResult();

    const TeamDisplay = ({ team, isWinner }) => (
        <p className={`font-semibold text-neutral-100 ${isWinner ? 'font-bold text-lg' : ''}`}>
            {team.name}
        </p>
    );

    return (
        <div className={`bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${match.played ? 'border-primary-500' : 'border-secondary-400'} flex flex-col animate-fade-in hover:scale-105`}>
            <div className="p-4 flex-grow">
                <div className="flex flex-col items-center text-center">
                    <TeamDisplay team={match.team1} isWinner={winner?.id === match.team1.id} />
                    <span className="text-sm font-bold text-neutral-400 my-1">VS</span>
                    <TeamDisplay team={match.team2} isWinner={winner?.id === match.team2.id} />
                </div>
            </div>
            <div className="border-t border-neutral-700 p-3 bg-neutral-700 text-center">
                <p className="text-lg font-bold text-primary-400">{result}</p>
            </div>
            <div className="border-t border-neutral-600 p-2 bg-neutral-700 rounded-b-lg text-center flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                <p className="text-sm font-medium text-neutral-300">{match.schedule || "Horari Pendent"}</p>
            </div>
        </div>
    );
};

const Group = ({ name, matches, standings }) => (
    <div className="bg-neutral-800/80 backdrop-blur-sm rounded-xl shadow-lg p-4 md:p-6 mb-8 animate-slide-in-left">
        <h3 className="text-2xl font-bold text-primary-300 mb-4">{name}</h3>
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-lg text-neutral-200 mb-3">Classificació</h4>
                <ClassificationTable standings={standings} />
            </div>
            <div>
                <h4 className="font-semibold text-lg text-neutral-200 mb-3">Enfrontaments</h4>
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
            <div className="bg-neutral-700 p-2 rounded-t-md border-b border-neutral-600 h-10 flex items-center justify-center shadow-sm text-neutral-100">{team1}</div>
            <div className="bg-neutral-700 p-2 rounded-b-md h-10 flex items-center justify-center shadow-sm text-neutral-100">{team2}</div>
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
                <h4 className={`text-xl font-semibold text-center mb-6 ${isConsolation ? 'text-secondary-400' : 'text-primary-400'}`}>{title}</h4>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col space-y-8">
                        <BracketMatch team1={team1_sf1} team2={team2_sf1} />
                        <BracketMatch team1={team1_sf2} team2={team2_sf2} />
                    </div>
                    <div className="flex flex-col justify-between items-center h-40 mx-2">
                        <div className="w-4 border-t-2 border-r-2 border-neutral-600 h-1/2 rounded-tr-lg"></div>
                        <div className="w-4 border-b-2 border-r-2 border-neutral-600 h-1/2 rounded-br-lg -mt-px"></div>
                    </div>
                    <div className="w-px h-40 border-r-2 border-neutral-600"></div>
                    <div className="flex items-center ml-2">
                         <BracketMatch team1={`Guanyador SF ${isConsolation ? 'Cons. ' : ''}1`} team2={`Guanyador SF ${isConsolation ? 'Cons. ' : ''}2`} />
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-neutral-800/80 backdrop-blur-sm rounded-xl shadow-xl p-6 md:p-8 animate-fade-in">
            <h3 className="text-3xl font-bold text-neutral-100 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">Fase Final - {categoryName}</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-12">
                <Bracket title="Quadre Principal" bracketType="main" />
                <Bracket title="Quadre de Consolació" bracketType="consolation" />
            </div>
        </div>
    );
};

const NormativaPanel = () => (
    <div className="bg-neutral-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 md:p-8 space-y-8 animate-fade-in">
        <div>
            <h2 className="text-3xl font-bold text-neutral-100 mb-4 flex items-center"><BookOpen className="w-8 h-8 mr-3 text-primary-400" />Normativa i Funcionament</h2>
            <div className="space-y-4 text-neutral-300">
                <p><strong>Inici del torneig:</strong> Dimarts, 1 de juliol de 2025.</p>
                <p><strong>Horari de joc:</strong> De dilluns a dijous, de 19:30 a 22:30. Es jugaran 3 enfrontaments per dia.</p>
                <p><strong>Format dels partits:</strong> Fase de grups al millor de 3 sets (tercer súper tie-break a 10 punts). Fase final a 3 sets convencionals. El joc exterior serà permès si s'acorda entre les parelles abans de l'inici del partit.</p>
                <p><strong>Sistema de puntuació i desempat:</strong> La classificació s'ordenarà segons: 1º Punts (1 punt per set guanyat), 2º En cas d'empat entre dues parelles, resultat de l'enfrontament directe, 3º En cas de triple empat, diferència de sets (guanyats - perduts), 4º Diferència de jocs.</p>
                <div className="mt-6 bg-red-900/50 border-l-4 border-red-400 p-4 rounded-r-lg">
                    <div className="flex">
                        <div className="py-1"><AlertTriangle className="h-6 w-6 text-red-400 mr-3" /></div>
                        <div>
                            <p className="font-bold text-red-100">Norma Important</p>
                            <p className="text-sm text-red-200">Les partides no acabades de grups abans del 27/07 es donaran por perdudes 2-0 (sets) i 6/0 6/0 per a la parella que no ha pogut jugar segons els horaris establerts. És important posar el resultat al grup de WhatsApp de cada categoria al finalitzar per poder actualitzar la web.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [tournamentData, setTournamentData] = useState(() => {
    const initialData = {};
    for (const category in initialTournamentData) {
      initialData[category] = {};
      for (const group in initialTournamentData[category]) {
        const teams = initialTournamentData[category][group];
        const matches = generateMatches(teams);
        initialData[category][group] = { teams, matches };
      }
    }
    return initialData;
  });
  const [activeCategoryTab, setActiveCategoryTab] = useState('1ª');
  const [activeMainTab, setActiveMainTab] = useState('grups');

  useEffect(() => {
    const fetchSchedules = fetch('/schedules.json').then(res => res.json()).catch(err => { console.error("Failed to fetch schedules:", err); return { schedules: [] }; });
    const fetchResults = fetch('/results.json').then(res => res.json()).catch(err => { console.error("Failed to fetch results:", err); return { results: [] }; });

    Promise.all([fetchSchedules, fetchResults]).then(([schedulesData, resultsData]) => {
      setTournamentData(currentData => {
        const updatedData = JSON.parse(JSON.stringify(currentData));

        schedulesData.schedules.forEach(schedule => {
          for (const category in updatedData) {
            for (const group in updatedData[category]) {
              const match = updatedData[category][group].matches.find(m => (m.team1.id === schedule.team1Id && m.team2.id === schedule.team2Id) || (m.team1.id === schedule.team2Id && m.team2.id === schedule.team1Id));
              if (match) {
                match.schedule = schedule.schedule;
              }
            }
          }
        });

        resultsData.results.forEach(result => {
          for (const category in updatedData) {
            for (const group in updatedData[category]) {
              const match = updatedData[category][group].matches.find(m => (m.team1.id === result.team1 && m.team2.id === result.team2) || (m.team1.id === result.team2 && m.team2.id === result.team1));
              if (match) {
                let finalSets = result.sets;
                if (match.team1.id === result.team2 && match.team2.id === result.team1) {
                  finalSets = result.sets.map(set => [set[1], set[0]]);
                }
                match.sets = finalSets;
                if (finalSets.some(s => s[0] !== null || s[1] !== null)) {
                  match.played = true;
                }
              }
            }
          }
        });

        return updatedData;
      });
    });
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
            if (Object.keys(categoryGroups[group]).length === 0) { // Check if group is empty
              allMatchesPlayed = false;
              break;
            }
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

  const MainNavButton = ({ tabName, label, icon: Icon }) => (<button onClick={() => setActiveMainTab(tabName)} className={`flex-1 flex justify-center items-center px-3 py-3 text-sm font-semibold rounded-full transition-all duration-300 ${activeMainTab === tabName ? 'bg-primary-600 text-white shadow-lg' : 'text-neutral-300 hover:bg-neutral-700'}`}><Icon className="w-5 h-5 mr-2" /><span>{label}</span></button>);

  return (
    <div className="min-h-screen font-sans bg-neutral-900 text-neutral-100">
      <header className="bg-neutral-800/80 shadow-lg sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-neutral-100"><Shield className="w-8 h-8 text-primary-400 mr-3 animate-bounce-in" /><h1 className="text-xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">IV Torneig Pàdel Les Coves</h1></div>
            <div className="hidden sm:block font-semibold text-primary-300">Club Pàdel Les Coves</div>
          </div>
          <div className="mt-4 flex items-center space-x-2 bg-neutral-700/60 p-1 rounded-full backdrop-blur-sm shadow-inner">
            <MainNavButton tabName="grups" label="Grups i Classificació" icon={Users} />
            <MainNavButton tabName="fasefinal" label="Fase Final" icon={Trophy} />
            <MainNavButton tabName="normativa" label="Normativa" icon={BookOpen} />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-6">
        {activeMainTab === 'grups' && (<div className="animate-fade-in"><div className="mb-6"><div className="flex space-x-1 bg-neutral-800 p-1 rounded-lg shadow-md">{Object.keys(tournamentData).map((category) => (<button key={category} onClick={() => setActiveCategoryTab(category)} className={`w-full py-2.5 text-sm md:text-base font-medium leading-5 rounded-lg transition-colors duration-200 hover:scale-105 ${activeCategoryTab === category ? 'bg-primary-500 text-white shadow-lg' : 'text-neutral-300 hover:bg-neutral-700'}`}>{category}</button>))}</div></div>{standingsByCategory[activeCategoryTab] && Object.entries(standingsByCategory[activeCategoryTab]).map(([groupName, standings]) => (<Group key={groupName} name={groupName} matches={tournamentData[activeCategoryTab][groupName].matches} standings={standings} />))}</div>)}
        {activeMainTab === 'fasefinal' && (<div className="space-y-8 animate-fade-in">{Object.keys(tournamentData).map(category => (<FinalsBracket key={category} categoryName={category} finalStandings={finalStandings[category]} />))}</div>)}
        {activeMainTab === 'normativa' && (<NormativaPanel />)}
      </main>
    </div>
  );
}
