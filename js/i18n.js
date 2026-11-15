/* i18n.js · Textos de la interfaz EN / ES (inglés por defecto) */
'use strict';
let LANG='en';
const T={
en:{sub:'Forgotten hardware on Earth, the Moon, Mars and deep space',cat:'Catalog',pause:'⏸ Pause',resume:'▶ Resume',slow:'🐢 Slow motion',audio:'🔊 Audio',tour:'Guided tour by EVI-E…',full:'▶ Full tour ({n} stops)',go:'Go to: ',stop:'■ Stop tour',earth:'Earth',moon:'Moon',mars:'Mars',all:'Global view',close:'✕',
 float:'Floating',fly:'Flying to ',talk:'Narrating',back:'Returning',L1:'LAYER 1 · RECORD',L2:'LAYER 2 · SCIENCE',L3:'LAYER 3 · LAST TRANSMISSION',dis:'Poetic interpretation based on mission telemetry — not a real message.',src:'Official sources',
 wt:'Welcome, explorer!',wh:'Type a nickname (not your full name). Finish a story and your nickname joins that mission’s Explorers list.',wp:'Your nickname',wb:'Start',board:'Explorers',first:'Be the first explorer here!',anon:'Explorer',intro:'Welcome',next:'Continue →',music:'🎵 Music',m_title:'Mini tour',
 m_earth:'First stop: Earth, our home. Right above our heads, old satellites are still circling in silence, like Vanguard 1, launched in 1958.',m_mars:'Next, Mars, the red planet. Robot rovers and landers rest on its dusty plains. Most of them are silent now, though Curiosity is still exploring.',m_moon:'Last, the Moon. Astronauts left landers, a science station and even moon buggies here, parked forever.',
 chT:'How do you want to explore?',chP:'Finish a story and your nickname joins that mission’s Explorers list.',chTour:'▶ Full guided tour with EVI-E',chFree:'🧭 Explore on my own',
 z_orbit:'Earth orbit',z_moon:'Moon',z_mars:'Mars',z_deep:'Deep space'},
es:{sub:'Hardware olvidado en la Tierra, la Luna, Marte y el espacio profundo',cat:'Catálogo',pause:'⏸ Pausar',resume:'▶ Reanudar',slow:'🐢 Cámara lenta',audio:'🔊 Audio',tour:'Tour guiado por EVI-E…',full:'▶ Tour completo ({n} paradas)',go:'Ir a: ',stop:'■ Detener tour',earth:'Tierra',moon:'Luna',mars:'Marte',all:'Vista global',close:'✕',
 float:'Flotando',fly:'Volando a ',talk:'Narrando',back:'Regresando',L1:'CAPA 1 · REGISTRO',L2:'CAPA 2 · CIENCIA',L3:'CAPA 3 · ÚLTIMA TRANSMISIÓN',dis:'Interpretación poética basada en telemetría de la misión — no es un mensaje real.',src:'Fuentes oficiales',
 wt:'¡Bienvenido, explorador!',wh:'Escribe un apodo (no tu nombre completo). Si terminas una historia, tu apodo entra en la lista de Exploradores de esa misión.',wp:'Tu apodo',wb:'Comenzar',board:'Exploradores',first:'¡Sé el primer explorador aquí!',anon:'Explorador',intro:'Bienvenida',next:'Continuar →',music:'🎵 Música',m_title:'Mini recorrido',
 m_earth:'Primera parada: la Tierra, nuestro hogar. Justo sobre nuestras cabezas, satélites antiguos siguen dando vueltas en silencio, como el Vanguard 1, lanzado en 1958.',m_mars:'Ahora, Marte, el planeta rojo. Rovers y módulos robóticos descansan en sus llanuras de polvo. Casi todos están en silencio, aunque Curiosity sigue explorando.',m_moon:'Por último, la Luna. Los astronautas dejaron aquí módulos de aterrizaje, una estación científica e incluso coches lunares, estacionados para siempre.',
 chT:'¿Cómo quieres explorar?',chP:'Si terminas una historia, tu apodo entra en la lista de Exploradores de esa misión.',chTour:'▶ Tour completo guiado por EVI-E',chFree:'🧭 Explorar por mi cuenta',
 z_orbit:'Órbita terrestre',z_moon:'Luna',z_mars:'Marte',z_deep:'Espacio profundo'}};
const t=k=>T[LANG][k];
