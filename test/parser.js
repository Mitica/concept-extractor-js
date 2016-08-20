'use strict';

let parser = require('../lib/parser');
let assert = require('assert');

let concepts;
let text = 'fsg fgsdfg Moldova cum Partidul \tDemocrat dfsdfgd sfd hd hd\nPartidul Socialiștilor din R. Moldova (PSRM) îndeamnă cetățenii să organizeze proteste pașnice împotriva actualei guvernări. Anunțul a fost făcut astăzi, în cadrul unei conferințe de presă, de către liderul PSRM, Igor Dodon.\nDupă cum informează TRIBUNA, Igor Dodon a declarat că, R. Moldova se află într-o situație foarte dificilă.\n”Vin cu mesaj către cetățenii: haideți să nu tăcem, să nu temem, să protestăm împreună. Noi, socialiștii susținem orice protest împotriva guvernării, dar fără ideologii. Trebuie să luptăm cu actuala guvernare, trebuie să protestăm în continuarea, deoarece ei se tem de proteste”, a precizat el.\nTotodată, Dodon a menționat că, socialiștii insistă în continuare pentru a fi demiși: Guvernatorul, Dorin Drăguțanu, Procurorul General, Corneliu Gurin, dar și șeful Centrului Național Anticorupție (CNA), Viorel Chetraru.\nÎn același context, liderul PSRM a venit și cu un mesaj către cetățeni , ca în alegerile din 14 iunie curent, să nu voteze pentru candidații înaintați de partidele de la guvernare.\n”Pe data de 14 iunie nici un vot oligarhilor, așa ne va fi mai ușor să îi dăm jos de la guvernare. Trebuie să ne pregătim de alegeri anticipate, aceasta e unica soluție Corneliu Gurin”, a mai spus Dodon. Eurovision 2016.';

describe('parser', function() {

	it('simple concepts', function() {
		concepts = parser.parse({
			text: `Europa este un continent. R. Moldova este parte din Europa.`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(3, concepts.length);
		assert.equal('Europa', concepts[0].value);
		assert.equal('R. Moldova', concepts[1].value);
		assert.equal('Europa', concepts[2].value);
	});

	it('connect words: Bosnia and Herzegovina', function() {
		concepts = parser.parse({
			text: 'sometimes called Bosnia-Herzegovina or Bosnia & Herzegovina, abbreviated BiH or B&H, and, in short, often known informally as Bosnia, is a country in Southeastern Europe located on the Balkan Peninsula',
			lang: 'en'
		});
		// console.log(concepts);
		assert.equal(7, concepts.length);
	});

	it('connect with number: Eurovision 2016', function() {
		concepts = parser.parse({
			text: 'La Eurovision 2016 vor concura 10 participanti.',
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Eurovision 2016', concepts[0].value);
	});

	it('invalid connect with 2 numbers: Eurovision 2016 18', function() {
		concepts = parser.parse({
			text: 'La Eurovision 2016 18 vor concura 10 participanti.',
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Eurovision 2016', concepts[0].value);
	});

	it('parse', function() {
		concepts = parser.parse({
			text: text,
			lang: 'ro',
			country: 'md'
		});
		// console.log('concepts', concepts);
		assert.equal(21, concepts.length);
		assert.equal('Republica Moldova', concepts[0].name);
	});

	it('remove prefixes', function() {
		concepts = parser.parse({
			text: 'UNIMEDIA amintește că PLDM respinge acuzațiile că liberal-democrații ar avea înțelegeri cu șeful statului, Nicolae Timofti, cu privire la candidatul la funcția de prim-ministru.\nPreședintele Nicolae Timofti nu a comentat deocamdată situația.',
			lang: 'ro',
			country: 'md'
		});
		assert.equal('Nicolae Timofti', concepts[concepts.length - 1].atonic);
	});

	it('parse 100 times', function() {
		this.timeout(500);
		for (let i = 0; i < 100; i++) {
			parser.parse({
				text: 'Președintele Partidului Democrat, Marian Lupu dă de înțeles într-un interviu acordat Infotag că urmează să vadă în ce măsură președintele Nicolae Timofti s-ar afla în capitivitate.\nDe asemenea, Marian Lupu susține că acesta ar face un joc murdar și vrea să ducă țara în haos.\n„Problema nu este însa Sturza, nu el este subiectul, ci PLDM şi preşedintele Timofti, care dacă vor face un astfel de joc murdar, practic aruncă ţara într-un haos total. Când noi ne-am dus la preşedinte şi i-am spus clar că avem voturile să desemnăm premierul şi să facem guvern pro european, el nesocoteşte această propunere şi vine cu o candidatură care nu adună mai mult de 10 voturi, înseamnă că în mod premeditat, conştient, el aruncă ţara într-o criză totală, o pune în pericol. Şi atunci urmează să vedem în ce măsură preşedintele Timofti este captiv, cum cei care îl presează au luat în captivitate instituţia prezidenţială, pentru că deja discutăm inclusiv de o problemă de securitate naţională. Iar răspunderea o vor purta şi regizorii, dar şi executanţii”, afirmă Lupu.\nTotodată, liderul PD este convins că președintele va aduce țara la alegeri anticipate.\n„După ce preşedintele va face o nominalizare împotriva întregului Parlament aproape, după ce va bloca definitiv negocierile dintre partidele pro europene, după ce va arunca ţara în anticipate, vom avea un preşedinte responsabil direct de declanşarea anticipatelor şi criza pe care o provoacă. Iar un preşedinte care face asta fiind conştient de situaţia dezastruoasă pe care o creează, nu mai reprezintă ţara, ci un partid sau un grup de interese‎. Vom avea un preşedinte aflat în captivitate şi va trebuie să găsim în primul rând soluţii să scoatem instutuţia prezidenţială din captivitatea în care este. Soluţii sunt sigur că sunt, dar să nu anticipăm acum care vor fi acestea”, mai adaugă liderul PD.\nUNIMEDIA amintește că PLDM respinge acuzațiile că liberal-democrații ar avea înțelegeri cu șeful statului, Nicolae Timofti, cu privire la candidatul la funcția de prim-ministru.\nPreședintele Nicolae Timofti nu a comentat deocamdată situația. ',
				lang: 'ro',
				country: 'md'
			});
		}
	});
});
