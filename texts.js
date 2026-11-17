/*
 * Textos per al Mode Adult.
 * Tots són obres de domini públic (autors morts fa més de 70 anys),
 * extretes de Project Gutenberg (gutenberg.org). Es conserva l'ortografia
 * original de cada edició; la puntuació tipogràfica (cometes corbes, guions
 * llargs, «») es normalitza en temps d'execució perquè es pugui teclejar.
 *
 * Camps: id, lang ('ca' | 'en'), author, work, year, era ('clàssic' | 'modern'),
 *        source (número d'ebook de Gutenberg), note (opcional), text.
 * Per afegir-ne: copia un objecte i canvia els camps. Els salts de línia (\n)
 * es teclegen amb la tecla Retorn.
 */
window.ADULT_TEXTS = [
    // ------------------------------------------------------------ CATALÀ
    {
        id: 'ca-rusinol-auca', lang: 'ca', era: 'modern',
        author: 'Santiago Rusiñol', work: "L'auca del senyor Esteve", year: 1907, source: 56856,
        text: "Les compradores batxilleres, semblava que s'havien avingut, per no deixar-lo complir com a pare, i alli a «La Puntual», la botiga de betes i fils de més credit i de més giro de quatre carrers de llarg a llarg, qu'ara una cana de trencilla, qu'ara una ruixa, qu'ara quatre pams de floc, entre compra i tafaneria, el van tenir entretingut a darrera del taulell, mentres la pobra muller, alli sobre, a l'entressol, complia la missió materna de donar fruit a n'en Ramon, am la llevadora a l'alcoba, i dugues veines a la sala.\nA fòra de l'alcoba, plovia: una pluja fina, una polsina d'humitat qu'anava enfangant el carrer, l'acera, i «La Puntual». Al devant, a n'el quartel d'artilleria, no hi havia ni aquell centinella, ni aquells oficials qu'es gronxen a n'els balancins de la porta."
    },
    {
        id: 'ca-bertrana-pellini', lang: 'ca', era: 'modern',
        author: 'Prudenci Bertrana', work: 'El meu amic Pellini', year: 1923, source: 74649,
        text: "No era pas un gegant veritable, però era un home que s'obirava de lluny. En Pellini no es distingia solament per la seva estatura, sinó també per la seva construcció. Semblava tallat en fusta, una fusta nuada i revessa, la duresa de la qual no havia consentit fineses escultòriques ni acuraments anatòmics. Tenia, encara, deixant de banda el seu aspecte d'escalaborn humà, una mena d'aixafament característic. Li mancava gruix, com si l'escultor, en modelar-lo, en comptes d'un bloc de dimensions proporcionades no hagués disposat d'altra cosa que d'un tauló. Però allí on l'esmotxadura esdevenia característica era en l'occípit, envaït pels muscles del clatell, un clatell nervut de gladiador, ample i aplanat com una carretera. L'home, mirat de cara o d'esquena, oferia un aspecte formidable; mirat de cantell semblava desnarit, vincladís i aperxallat."
    },
    {
        id: 'ca-bertrana-herois', lang: 'ca', era: 'modern',
        author: 'Prudenci Bertrana', work: 'Els herois', year: 1920, source: 17583,
        text: "Per això el seu contacte divinitza; i, per això també, els homes que s'han criat en el seu si, en mig de la seva impassibilitat maternal, tenen dret a la nostra reverència. Són així com uns personatges evangèlics; i ningú, en els temps presents, gosarà discutir-los el dictat d'Herois. Almenys no s'oposarà massa formalment que un escriptor de la meva modèstia, gaiament democràtica, els qualifiqui de tals, atorgant-los però, ben entès, una jerarquia inferior a la que es mereixen ells, atenent-me a l'admiració que els professo.\nMes cap respecte humà podria fer de mi un ingrat, ni cap esplendidesa de progrés, cultura o civisme fóra prou abassegadora perquè jo els tingués en oblit."
    },
    {
        id: 'ca-casellas-histories', lang: 'ca', era: 'modern',
        author: 'Raimon Casellas', work: "Llibre d'històries", year: 1909, source: 20253,
        text: "Entre el florir i el marcir-se de les sensacions diàries que l'espectacle de la vida vos promou, us salta de vegades als sentits una feta, una dita, una visió que, més que per curiosa o rara, per susceptible d'ulteriors transformacions, sentiu ànsia de contar als demés. Sembla que servant el cas únicament per a vosaltres no us trobeu prou complaguts, sinó que l'haveu de trametre al proïsme per a gaudir-lo del tot. Una part d'aquest afany, ja es veu que és necessitat humana d'expansió; però una altra part, i de segur la més grossa, probablement s'ha de pendre per propensió a la mímesi, per instint imitatiu, per tendència artística, literària.\nPerquè el cert és que, en comunicant als altres el què ha mogut un moment el nostre esperit, pel regular es posa cura en rimar la feta, en ordenar-la, en enquadrar-la, en decorar-la segons lleis d'art que cada contaire porta a dintre. Veniu a fer com el músic que harmonitza la melodia salvatge."
    },
    {
        id: 'ca-ruyra-parada', lang: 'ca', era: 'modern',
        author: 'Joaquim Ruyra', work: 'La Parada', year: 1919, source: 14768,
        text: "Quants d'anys han passat, amics lectors, d'ençà que a les portes del meu primer i darrer llibre de proses ens coneguérem, tot llegint-hi la mateixa devota inscripció, que encapçala el present! Aleshores, en acomiadar-me, us vaig prometre que, si Déu Nostre Senyor em mantenia el delit i vosaltres trobàveu agradosa la meva obra, no trigaria a posar-vos-en d'altres a les mans. I, certament, vosaltres la rebéreu amb tant d'entusiasme que jo no podia pas desitjar més. Si me'n vaig sentir d'elogis! Si en vaig heure d'enhorabones! Doncs bé, això, que en vosaltres era tot generositat i noblesa, fou sense dubte un mal per a mi, perquè (vull confessar públicament aquest secret del meu cor) va estufar-se'm en tanta de manera la vanitat, que ja el rei no m'era bon mosso, ni cap barret prou lluent. Mireu si n'era de presumptuós! Ah!... però era un estat d'esperit molt agradable."
    },
    {
        id: 'ca-maragall-gari', lang: 'ca', era: 'clàssic',
        author: 'Joan Maragall', work: 'Joan Garí (Visions & Cants)', year: 1900, source: 52409,
        note: 'Poema: cada vers acaba amb Retorn.',
        text: "A la montanya miracle\nuna llegenda ha florit:\nla llegenda del diable\ni de Fra Joan Garí.\nFra Joan fa penitencia\nenfilat a dalt d'un cim.\nLi duien una donzella\nque tenia ls mals esprits.\nMontserrat, montanya santa,\nla montanya de cent cims.\nFra Joan dintre la cova\nestava fent oració:\nRiquilda se li presenta\nvestida de temptació.\nFra Joan clou les parpelles,\nmés la veu contra-claror.\nMontserrat és ple de boira:\nRiquilda és un raig de sol."
    },
    {
        id: 'ca-oller-escanyapobres', lang: 'ca', era: 'clàssic',
        author: 'Narcís Oller', work: "L'escanya-pobres", year: 1884, source: 72856,
        note: 'Ortografia anterior a les Normes de Fabra.',
        text: "Los mercats de Pratbell, d'antiga nomenada, arribaren á son més gran esplendor pe'ls encontorns del any 50 de la present centuria. Acabava d'estrenarse'l tros de carretera de Madrid á la Granada qu'atravessa á Pratbell, y essent aquesta vila cap de jornada ó de rellevo,'n tocá'ls resultats ben prompte. Los blats d'Urgell y d'Aragó hi abocavan á torrentadas los carros, y era negoci gras no deixarlos passar endevant, provehit com estava'l país de salts d'aygua y bons molíns."
    },

    // ------------------------------------------------------------ ENGLISH
    {
        id: 'en-austen-pride', lang: 'en', era: 'clàssic',
        author: 'Jane Austen', work: 'Pride and Prejudice', year: 1813, source: 1342,
        text: "It is a truth universally acknowledged, that a single man in possession of a good fortune must be in want of a wife.\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered as the rightful property of some one or other of their daughters.\n\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\nMr. Bennet replied that he had not.\n\"But it is,\" returned she; \"for Mrs. Long has just been here, and she told me all about it.\"\nMr. Bennet made no answer."
    },
    {
        id: 'en-melville-moby', lang: 'en', era: 'clàssic',
        author: 'Herman Melville', work: 'Moby-Dick', year: 1851, source: 2701,
        text: "Call me Ishmael. Some years ago - never mind how long precisely - having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off - then, I account it high time to get to sea as soon as I can."
    },
    {
        id: 'en-dickens-cities', lang: 'en', era: 'clàssic',
        author: 'Charles Dickens', work: 'A Tale of Two Cities', year: 1859, source: 98,
        text: "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way - in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only."
    },
    {
        id: 'en-bronte-eyre', lang: 'en', era: 'clàssic',
        author: 'Charlotte Brontë', work: 'Jane Eyre', year: 1847, source: 1260,
        text: "There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner (Mrs. Reed, when there was no company, dined early) the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further outdoor exercise was now out of the question.\nI was glad of it: I never liked long walks, especially on chilly afternoons: dreadful to me was the coming home in the raw twilight, with nipped fingers and toes, and a heart saddened by the chidings of Bessie, the nurse, and humbled by the consciousness of my physical inferiority to Eliza, John, and Georgiana Reed."
    },
    {
        id: 'en-shelley-frankenstein', lang: 'en', era: 'clàssic',
        author: 'Mary Shelley', work: 'Frankenstein', year: 1818, source: 84,
        text: "You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.\nI am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid."
    },
    {
        id: 'en-wilde-dorian', lang: 'en', era: 'clàssic',
        author: 'Oscar Wilde', work: 'The Picture of Dorian Gray', year: 1890, source: 174,
        text: "The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.\nFrom the corner of the divan of Persian saddle-bags on which he was lying, smoking, as was his custom, innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet and honey-coloured blossoms of a laburnum, whose tremulous branches seemed hardly able to bear the burden of a beauty so flamelike as theirs. The dim roar of London was like the bourdon note of a distant organ."
    },
    {
        id: 'en-doyle-scandal', lang: 'en', era: 'clàssic',
        author: 'Arthur Conan Doyle', work: 'A Scandal in Bohemia', year: 1891, source: 1661,
        text: "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position. He never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer - excellent for drawing the veil from men's motives and actions."
    },
    {
        id: 'en-conrad-darkness', lang: 'en', era: 'modern',
        author: 'Joseph Conrad', work: 'Heart of Darkness', year: 1899, source: 219,
        text: "The Nellie, a cruising yawl, swung to her anchor without a flutter of the sails, and was at rest. The flood had made, the wind was nearly calm, and being bound down the river, the only thing for it was to come to and wait for the turn of the tide. The sea-reach of the Thames stretched before us like the beginning of an interminable waterway. In the offing the sea and the sky were welded together without a joint, and in the luminous space the tanned sails of the barges drifting up with the tide seemed to stand still in red clusters of canvas sharply peaked, with gleams of varnished sprits. A haze rested on the low shores that ran out to sea in vanishing flatness."
    },
    {
        id: 'en-joyce-dead', lang: 'en', era: 'modern',
        author: 'James Joyce', work: 'Dubliners - The Dead', year: 1914, source: 2814,
        text: "A few light taps upon the pane made him turn to the window. It had begun to snow again. He watched sleepily the flakes, silver and dark, falling obliquely against the lamplight. The time had come for him to set out on his journey westward. Yes, the newspapers were right: snow was general all over Ireland. It was falling on every part of the dark central plain, on the treeless hills, falling softly upon the Bog of Allen and, farther westward, softly falling into the dark mutinous Shannon waves. It was falling, too, upon every part of the lonely churchyard on the hill where Michael Furey lay buried. It lay thickly drifted on the crooked crosses and headstones, on the spears of the little gate, on the barren thorns. His soul swooned slowly as he heard the snow falling faintly through the universe and faintly falling, like the descent of their last end, upon all the living and the dead."
    },
    {
        id: 'en-joyce-portrait', lang: 'en', era: 'modern',
        author: 'James Joyce', work: 'A Portrait of the Artist as a Young Man', year: 1916, source: 4217,
        text: "Once upon a time and a very good time it was there was a moocow coming down along the road and this moocow that was coming down along the road met a nicens little boy named baby tuckoo...\nHis father told him that story: his father looked at him through a glass: he had a hairy face.\nHe was baby tuckoo. The moocow came down the road where Betty Byrne lived: she sold lemon platt.\nWhen you wet the bed, first it is warm then it gets cold. His mother put on the oilsheet. That had the queer smell.\nHis mother had a nicer smell than his father. She played on the piano the sailor's hornpipe for him to dance."
    },
    {
        id: 'en-mansfield-garden', lang: 'en', era: 'modern',
        author: 'Katherine Mansfield', work: 'The Garden Party', year: 1922, source: 1429,
        text: "And after all the weather was ideal. They could not have had a more perfect day for a garden-party if they had ordered it. Windless, warm, the sky without a cloud. Only the blue was veiled with a haze of light gold, as it is sometimes in early summer. The gardener had been up since dawn, mowing the lawns and sweeping them, until the grass and the dark flat rosettes where the daisy plants had been seemed to shine. As for the roses, you could not help feeling they understood that roses are the only flowers that impress people at garden-parties; the only flowers that everybody is certain of knowing. Hundreds, yes, literally hundreds, had come out in a single night; the green bushes bowed down as though they had been visited by archangels."
    },
    {
        id: 'en-fitzgerald-gatsby', lang: 'en', era: 'modern',
        author: 'F. Scott Fitzgerald', work: 'The Great Gatsby', year: 1925, source: 64317,
        text: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\"Whenever you feel like criticizing anyone,\" he told me, \"just remember that all the people in this world haven't had the advantages that you've had.\"\nHe didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgements, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. Reserving judgements is a matter of infinite hope."
    }
];
