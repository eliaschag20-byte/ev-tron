/* HardwareData.js */
const ZONE={orbit:{lbl:'Órbita terrestre',d:2.6,sc:.22,off:.35},moon:{lbl:'Luna',d:2.6,sc:.22,off:.3},mars:{lbl:'Marte',d:3.4,sc:.4,off:.55},deep:{lbl:'Espacio profundo',d:3,sc:.3,off:.5}};
const HardwareData=[
{id:'vanguard',n:'Vanguard 1',z:'orbit',ag:'NASA / Laboratorio de Investigación Naval de EE. UU.',y:1958,state:'En órbita (sin señal desde 1964)',s:'warn',
 o:{a:6.75,b:6.63,inc:34.25,sp:.35,ph:1},
 story:'¡Hola, soy EVI! Este es Vanguard 1, lanzado por Estados Unidos el 17 de marzo de 1958. Es del tamaño de una toronja y fue de los primeros satélites con celdas solares. Dejó de transmitir en 1964, pero sigue girando alrededor de la Tierra: es el objeto hecho por humanos más antiguo que todavía está en órbita. Al estudiar su trayectoria, los científicos descubrieron que nuestro planeta tiene una forma ligeramente de pera.'},
{id:'apollo11',n:'Módulo Lunar Eagle · Base Tranquilidad (Apolo 11)',z:'moon',ag:'NASA',y:1969,state:'Inactivo (etapa de descenso en la Luna)',s:'warn',lat:.67,lon:23.47,
 story:'Estamos en la Base Tranquilidad, en el Mar de la Tranquilidad. El 20 de julio de 1969, Neil Armstrong y Buzz Aldrin aterrizaron aquí con el módulo lunar Eagle, mientras Michael Collins los esperaba en órbita. Caminaron unas dos horas y media y recogieron cerca de 21 kg de rocas. Dejaron un sismómetro, un reflector láser y una placa que dice: “Vinimos en paz en nombre de toda la humanidad”. La etapa de descenso sigue aquí.'},
{id:'lrv',n:'Rover Lunar LRV (Apolo 15)',z:'moon',ag:'NASA',y:1971,state:'Inactivo (abandonado en la Luna)',s:'warn',lat:26.13,lon:3.63,
 story:'Este es el LRV del Apolo 15, el primer vehículo con el que los astronautas manejaron en la Luna, en julio de 1971. David Scott y James Irwin recorrieron unos 28 km cerca de los Apeninos lunares, mucho más lejos de lo que se puede caminar. Iba a unos 13 km/h con baterías. Hay tres LRV abandonados en la Luna: los de los Apolos 15, 16 y 17.'},
{id:'opportunity',n:'Rover Opportunity · Meridiani Planum',z:'mars',ag:'NASA / JPL',y:2003,state:'Inactivo (misión terminada en 2019)',s:'warn',lat:-1.95,lon:-5.53,
 story:'Estamos en Meridiani Planum, Marte. Opportunity aterrizó en enero de 2004 y debía trabajar solo 90 días marcianos, ¡pero duró casi 15 años y recorrió más de 45 km! Encontró pequeñas esferas de hematita y otras pistas de que hubo agua líquida en el pasado. Una gran tormenta de polvo lo dejó sin energía en junio de 2018 y la NASA terminó su misión en febrero de 2019.'},
{id:'curiosity',n:'Rover Curiosity · Cráter Gale',z:'mars',ag:'NASA / JPL',y:2011,state:'Activo (explorando)',s:'ok',lat:-4.59,lon:137.44,
 story:'Esto es el cráter Gale. Curiosity despegó en 2011 y el 6 de agosto de 2012 fue bajado con cables por una grúa aérea. Es un laboratorio con ruedas que perfora rocas. Descubrió que hace miles de millones de años hubo aquí un lago con ingredientes para la vida microbiana, y detectó moléculas orgánicas. Sigue subiendo el Monte Sharp, leyendo sus capas de roca como un libro de historia.'}
];
HardwareData.push(
{id:'alsep',n:'Paquete científico ALSEP · Apolo 12',z:'moon',ag:'NASA',y:1969,state:'Inactivo (apagado en 1977)',s:'warn',lat:-3.01,lon:-23.42,dv:-10,
 story:'Esto es un ALSEP, un paquete de experimentos que los astronautas del Apolo 12 dejaron en el Océano de las Tormentas en noviembre de 1969. Tenía un sismómetro, un magnetómetro y otros instrumentos, y se alimentaba con un pequeño generador nuclear. Siguió enviando datos a la Tierra durante años, hasta que la NASA apagó las estaciones ALSEP en 1977. Los astronautas se fueron, pero la ciencia siguió trabajando en la Luna.'},
{id:'surveyor3',n:'Surveyor 3',z:'moon',ag:'NASA',y:1967,state:'Inactivo',s:'warn',lat:-2.94,lon:-23.34,dv:10,
 story:'Surveyor 3 aterrizó el 20 de abril de 1967 en el Océano de las Tormentas. Era un robot sin astronautas, enviado para probar que se puede aterrizar suavemente en la Luna y que el suelo aguanta peso. Tenía una cámara y una pala. En noviembre de 1969, los astronautas del Apolo 12 aterrizaron a unos 180 metros y llevaron a la Tierra piezas suyas, como la cámara, para estudiar cómo envejece el hardware en el espacio. En este mapa separé los marcadores de Surveyor 3 y del ALSEP para que puedas tocarlos.'},
{id:'viking1',n:'Módulo Viking 1 · Chryse Planitia',z:'mars',ag:'NASA',y:1975,state:'Inactivo (sin contacto desde 1982)',s:'warn',lat:22.27,lon:-47.95,
 story:'Viking 1 fue el primer módulo de EE. UU. que operó con éxito en Marte: aterrizó el 20 de julio de 1976 en Chryse Planitia, siete años después del Apolo 11. Su gemelo, Viking 2, aterrizó en septiembre en otra región, Utopia Planitia. Enviaron fotos de la superficie y buscaron señales de vida con experimentos en el suelo, sin resultados claros. Viking 1 habló con la Tierra hasta noviembre de 1982 y sigue donde aterrizó.'},
{id:'sojourner',n:'Rover Sojourner · Mars Pathfinder',z:'mars',ag:'NASA / JPL',y:1996,state:'Inactivo (estacionado desde 1997)',s:'warn',lat:19.33,lon:-33.55,
 story:'Sojourner fue el primer rover en rodar sobre Marte. Llegó dentro del módulo Pathfinder, que aterrizó el 4 de julio de 1997 en Ares Vallis. Era del tamaño de un microondas y pesaba unos 10 kg. Se pensaba que duraría una semana, pero trabajó casi tres meses analizando rocas. Pathfinder dejó de comunicarse en septiembre de 1997, y Sojourner quedó estacionado para siempre.'},
{id:'spirit',n:'Rover Spirit · Cráter Gusev',z:'mars',ag:'NASA / JPL',y:2003,state:'Inactivo (sin contacto desde 2010)',s:'warn',lat:-14.57,lon:175.47,
 story:'Spirit, gemelo de Opportunity, aterrizó en enero de 2004 en el cráter Gusev. Debía trabajar 90 días y trabajó más de seis años. Descubrió suelo rico en sílice, una pista de antiguas fuentes de agua caliente. En 2009 quedó atrapado en arena blanda y se volvió una estación fija; el frío del invierno marciano lo dejó sin energía y su última señal llegó en marzo de 2010.'},
{id:'phoenix',n:'Módulo Phoenix · Llanuras del norte',z:'mars',ag:'NASA / Universidad de Arizona',y:2007,state:'Inactivo (sin energía desde 2008)',s:'warn',lat:68.22,lon:-125.75,
 story:'Phoenix aterrizó el 25 de mayo de 2008 en las llanuras heladas del norte de Marte. Con su brazo robótico cavó el suelo y confirmó que bajo la superficie hay hielo de agua. Trabajó unos cinco meses; cuando llegó el invierno, la poca luz solar ya no bastó para cargar sus baterías y se apagó para siempre en noviembre de 2008.'},
{id:'insight',n:'Módulo InSight · Elysium Planitia',z:'mars',ag:'NASA / JPL',y:2018,state:'Inactivo (misión terminada en 2022)',s:'warn',lat:4.5,lon:135.62,
 story:'InSight llegó a Elysium Planitia en noviembre de 2018 con un sismómetro para escuchar el interior de Marte. Detectó más de 1.300 terremotos marcianos y reveló cómo son la corteza y el núcleo del planeta. El polvo fue cubriendo sus paneles solares y la NASA dio por terminada su misión en diciembre de 2022.'},
{id:'ingenuity',n:'Helicóptero Ingenuity · Cráter Jezero',z:'mars',ag:'NASA / JPL',y:2020,state:'Inactivo (dañado en 2024)',s:'warn',lat:18.44,lon:77.45,
 story:'Ingenuity viajó a Marte pegado al vientre del rover Perseverance. El 19 de abril de 2021 hizo el primer vuelo controlado con motor en otro planeta. Estaba pensado para 5 vuelos de prueba y completó 72. En enero de 2024 se dañó una de sus hélices al aterrizar y la NASA terminó su misión. Sigue en el cráter Jezero, convertido en un monumento (posición aproximada).'},
{id:'dawn',n:'Nave Dawn · Ceres',z:'deep',ag:'NASA / JPL',y:2007,state:'Inactiva (en órbita de Ceres)',s:'warn',pos:[175,8,-110],body:[.55,0x9a9a9a],
 story:'Estamos en el cinturón de asteroides (posición ilustrativa, no a escala). Dawn despegó en 2007, visitó el asteroide Vesta y luego fue la primera nave en orbitar un planeta enano, Ceres, en 2015. Se quedó sin combustible para orientarse y terminó su misión en noviembre de 2018. Hoy sigue orbitando Ceres en silencio, y lo hará durante décadas.'},
{id:'near',n:'NEAR Shoemaker · Asteroide 433 Eros',z:'deep',ag:'NASA / Johns Hopkins APL',y:1996,state:'Inactiva (posada sobre Eros)',s:'warn',pos:[-70,-3,-55],body:[.3,0x8a7a6a,true],
 story:'Este es 433 Eros, un asteroide con forma de papa (posición ilustrativa). NEAR Shoemaker, lanzada en 1996, fue la primera nave en orbitar un asteroide, en febrero de 2000. Al terminar su misión, en febrero de 2001, los ingenieros la hicieron descender sobre Eros aunque no estaba diseñada para aterrizar. Sobrevivió, siguió enviando señales unos días y quedó descansando sobre su superficie.'},
{id:'pioneer',n:'Pioneer 10 y 11',z:'deep',ag:'NASA / Centro de Investigación Ames',y:1972,state:'Sin señal (saliendo del sistema solar)',s:'warn',pos:[260,30,-190],
 story:'Estas son las sondas Pioneer 10 y 11 (posición ilustrativa: en realidad van en direcciones opuestas y mucho más lejos). Pioneer 10, de 1972, fue la primera en cruzar el cinturón de asteroides y visitar Júpiter. Pioneer 11, de 1973, visitó Júpiter y fue la primera en llegar a Saturno, en 1979. Ambas perdieron contacto con la Tierra y salen en silencio del sistema solar. Llevan una placa con un mensaje de la humanidad.'},
{id:'kepler',n:'Telescopio Espacial Kepler',z:'deep',ag:'NASA',y:2009,state:'Inactivo (sin combustible, 2018)',s:'warn',pos:[-60,4,36],
 story:'Kepler (2009) fue un telescopio cazador de planetas fuera del sistema solar (posición ilustrativa). Miró una sola zona del cielo y encontró más de 2.600 exoplanetas, y mostró que los planetas son comunes en la galaxia. Sin combustible, la NASA lo apagó en octubre de 2018. No orbita la Tierra: sigue a la deriva en una órbita alrededor del Sol parecida a la terrestre.'}
);
const NSSDCA='https://nssdc.gsfc.nasa.gov/',NM='https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=',SM='https://science.nasa.gov/mission/';
const SRC={apollo11:NM+'1969-059C',lrv:NM+'1971-063C',alsep:NM+'1969-099C',surveyor3:SM+'surveyor-3/',sojourner:SM+'mars-pathfinder/',opportunity:SM+'mars-exploration-rovers-spirit-and-opportunity/',spirit:SM+'mars-exploration-rovers-spirit-and-opportunity/',viking1:SM+'viking-1/',insight:SM+'insight/',ingenuity:SM+'mars-2020-perseverance/ingenuity-mars-helicopter/',dawn:SM+'dawn/',near:SM+'near-shoemaker/',pioneer:SM+'pioneer-10/',kepler:SM+'kepler/'};
const byId=id=>HardwareData.find(i=>i.id===id);
const N='https://nssdc.gsfc.nasa.gov/nmc/spacecraft/display.action?id=',S='https://science.nasa.gov/mission/';
const RES={
  src:{apollo11:N+'1969-059C',lrv:N+'1971-063C',opportunity:S+'mars-exploration-rovers-spirit-and-opportunity/'},
  groups:[
   {t:'Catálogo general',items:[['NSSDCA · Archivo Coordinado de Datos de Ciencias Espaciales','https://nssdc.gsfc.nasa.gov/','Catálogo público de la NASA: busca cualquier nave o instrumento, sus parámetros de misión, su lugar de descanso final y su estado operativo.']]},
   {t:'La Luna',items:[
    ['Módulos lunares del Apolo',N+'1969-059C','Las etapas de descenso, como la del Eagle (Apolo 11), quedaron como plataformas de lanzamiento.'],
    ['Vehículos lunares itinerantes (LRV)',N+'1971-063C','Tres “buggies” eléctricos conducidos por astronautas, estacionados para siempre en la Luna.'],
    ['Paquetes científicos ALSEP',N+'1969-099C','Experimentos de superficie (sismómetros, retrorreflectores…) que siguieron haciendo ciencia tras la partida de los astronautas.'],
    ['Surveyor (Surveyor 3)',S+'surveyor-3/','Sondas robóticas de los años 60 que demostraron que era posible aterrizar suavemente.']]},
   {t:'Marte y más allá',items:[
    ['Sojourner · Mars Pathfinder',S+'mars-pathfinder/','Primer rover en Marte (1997), llevado por el módulo Pathfinder.'],
    ['Spirit y Opportunity',S+'mars-exploration-rovers-spirit-and-opportunity/','Rovers gemelos que operaron durante años; hoy son monumentos inactivos.'],
    ['Viking 1 y 2',S+'viking-1/','Primeros módulos de EE. UU. en operar con éxito en Marte (1976); siguen donde aterrizaron.'],
    ['Phoenix e InSight',S+'insight/','Phoenix buscó hielo de agua; InSight escuchó los terremotos de Marte. Ambos se quedaron sin energía.'],
    ['Dawn',S+'dawn/','Mapeó Vesta y Ceres; sin combustible, queda en órbita perpetua y sin energía alrededor de Ceres.'],
    ['NEAR Shoemaker',S+'near-shoemaker/','Primera nave en orbitar y aterrizar en un asteroide: descansa sobre 433 Eros.'],
    ['Pioneer 10 y 11',S+'pioneer-10/','Primeras sondas de espacio profundo hacia los planetas exteriores; salen del sistema solar.'],
    ['Ingenuity',S+'mars-2020-perseverance/ingenuity-mars-helicopter/','Primer aeronave en otro planeta; sus rotores se dañaron y quedó como artefacto estacionario.'],
    ['Telescopio Espacial Kepler',S+'kepler/','Buscador de exoplanetas que se quedó sin combustible y deriva en una órbita parecida a la de la Tierra.']]}
  ]};
