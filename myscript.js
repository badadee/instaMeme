shortcut = {
	'all_shortcuts':{},//All the shortcuts are stored in this array
	'add': function(shortcut_combination,callback,opt) {
		//Provide a set of default options
		var default_options = {
			'type':'keydown',
			'propagate':false,
			'disable_in_input':false,
			'target':document,
			'keycode':false
		}
		if(!opt) opt = default_options;
		else {
			for(var dfo in default_options) {
				if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
			}
		}

		var ele = opt.target;
		if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
		var ths = this;
		shortcut_combination = shortcut_combination.toLowerCase();

		//The function to be called at keypress
		var func = function(e) {
			e = e || window.event;
			
			if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
				var element;
				if(e.target) element=e.target;
				else if(e.srcElement) element=e.srcElement;
				if(element.nodeType==3) element=element.parentNode;

				if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
			}
	
			//Find Which key is pressed
			if (e.keyCode) code = e.keyCode;
			else if (e.which) code = e.which;
			var character = String.fromCharCode(code).toLowerCase();
			
			if(code == 188) character=","; //If the user presses , when the type is onkeydown
			if(code == 190) character="."; //If the user presses , when the type is onkeydown

			var keys = shortcut_combination.split("+");
			//Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
			var kp = 0;
			
			//Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
			var shift_nums = {
				"`":"~",
				"1":"!",
				"2":"@",
				"3":"#",
				"4":"$",
				"5":"%",
				"6":"^",
				"7":"&",
				"8":"*",
				"9":"(",
				"0":")",
				"-":"_",
				"=":"+",
				";":":",
				"'":"\"",
				",":"<",
				".":">",
				"/":"?",
				"\\":"|"
			}
			//Special Keys - and their codes
			var special_keys = {
				'esc':27,
				'escape':27,
				'tab':9,
				'space':32,
				'return':13,
				'enter':13,
				'backspace':8,
	
				'scrolllock':145,
				'scroll_lock':145,
				'scroll':145,
				'capslock':20,
				'caps_lock':20,
				'caps':20,
				'numlock':144,
				'num_lock':144,
				'num':144,
				
				'pause':19,
				'break':19,
				
				'insert':45,
				'home':36,
				'delete':46,
				'end':35,
				
				'pageup':33,
				'page_up':33,
				'pu':33,
	
				'pagedown':34,
				'page_down':34,
				'pd':34,
	
				'left':37,
				'up':38,
				'right':39,
				'down':40,
	
				'f1':112,
				'f2':113,
				'f3':114,
				'f4':115,
				'f5':116,
				'f6':117,
				'f7':118,
				'f8':119,
				'f9':120,
				'f10':121,
				'f11':122,
				'f12':123
			}
	
			var modifiers = { 
				shift: { wanted:false, pressed:false},
				ctrl : { wanted:false, pressed:false},
				alt  : { wanted:false, pressed:false},
				meta : { wanted:false, pressed:false}	//Meta is Mac specific
			};
                        
			if(e.ctrlKey)	modifiers.ctrl.pressed = true;
			if(e.shiftKey)	modifiers.shift.pressed = true;
			if(e.altKey)	modifiers.alt.pressed = true;
			if(e.metaKey)   modifiers.meta.pressed = true;
                        
			for(var i=0; k=keys[i],i<keys.length; i++) {
				//Modifiers
				if(k == 'ctrl' || k == 'control') {
					kp++;
					modifiers.ctrl.wanted = true;

				} else if(k == 'shift') {
					kp++;
					modifiers.shift.wanted = true;

				} else if(k == 'alt') {
					kp++;
					modifiers.alt.wanted = true;
				} else if(k == 'meta') {
					kp++;
					modifiers.meta.wanted = true;
				} else if(k.length > 1) { //If it is a special key
					if(special_keys[k] == code) kp++;
					
				} else if(opt['keycode']) {
					if(opt['keycode'] == code) kp++;

				} else { //The special keys did not match
					if(character == k) kp++;
					else {
						if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
							character = shift_nums[character]; 
							if(character == k) kp++;
						}
					}
				}
			}
			
			if(kp == keys.length && 
						modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
						modifiers.shift.pressed == modifiers.shift.wanted &&
						modifiers.alt.pressed == modifiers.alt.wanted &&
						modifiers.meta.pressed == modifiers.meta.wanted) {
				callback(e);
	
				if(!opt['propagate']) { //Stop the event
					//e.cancelBubble is supported by IE - this will kill the bubbling process.
					e.cancelBubble = true;
					e.returnValue = false;
	
					//e.stopPropagation works in Firefox.
					if (e.stopPropagation) {
						e.stopPropagation();
						e.preventDefault();
					}
					return false;
				}
			}
		}
		this.all_shortcuts[shortcut_combination] = {
			'callback':func, 
			'target':ele, 
			'event': opt['type']
		};
		//Attach the function with the event
		if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
		else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
		else ele['on'+opt['type']] = func;
	},

	//Remove the shortcut - just specify the shortcut and I will remove the binding
	'remove':function(shortcut_combination) {
		shortcut_combination = shortcut_combination.toLowerCase();
		var binding = this.all_shortcuts[shortcut_combination];
		delete(this.all_shortcuts[shortcut_combination])
		if(!binding) return;
		var type = binding['event'];
		var ele = binding['target'];
		var callback = binding['callback'];

		if(ele.detachEvent) ele.detachEvent('on'+type, callback);
		else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
		else ele['on'+type] = false;
	}
}


shortcut.add("Ctrl+M", function () { 
	var memeList = [
                    "10 Guy",
                    
                    "1950s Middle Finger",
                    
                    "1990s First World Problems",
                    
                    "1st World Canadian Problems",
                    
                    "2nd Term Obama",
                    
                    "Aaaaand Its Gone",
                    
                    "Ace Primo",
                    
                    "Actual Advice Mallard",
                    
                    "Adalia Rose",
                    
                    "Admiral Ackbar Relationship Expert",
                    
                    "Advice Dog",
                    
                    "Advice God",
                    
                    "Advice Peeta",
                    
                    "Advice Yoda",
                    
                    "Aint Nobody Got Time For That",
                    
                    "Alan Greenspan",
                    
                    "Alarm Clock",
                    
                    "Albert Cagestein",
                    
                    "Albert Einstein 1",
                    
                    "Alright Gentlemen We Need A New Idea",
                    
                    "Alyssa Silent Hill",
                    
                    "Am I The Only One Around Here",
                    
                    "Ancient Aliens",
                    
                    "And everybody loses their minds",
                    
                    "Angry Asian",
                    
                    "Angry Baby",
                    
                    "Angry Birds Pig",
                    
                    "Angry Bride",
                    
                    "Angry Chef Gordon Ramsay",
                    
                    "Angry Chicken Boss",
                    
                    "Angry Dumbledore",
                    
                    "Angry Koala",
                    
                    "Angry Rant Randy",
                    
                    "Angry Toddler",
                    
                    "Annoying Childhood Friend",
                    
                    "Annoying Facebook Girl",
                    
                    "Anri Stares",
                    
                    "Anti Joke Chicken",
                    
                    "Apathetic Xbox Laser",
                    
                    "Are Your Parents Brother And Sister",
                    
                    "Are you a Wizard?",
                    
                    "Arrogant Rich Man",
                    
                    "Art Attack",
                    
                    "Art Student Owl",
                    
                    "Asshole Ref",
                    
                    "Aunt Carol",
                    
                    "Aw Yeah Rage Face",
                    
                    "Awkward Olympics",
                    
                    "BANE AND BRUCE",
                    
                    "BM Employees",
                    
                    "Babushkas On Facebook",
                    
                    "Baby Cry",
                    
                    "Baby Godfather",
                    
                    "Back In My Day",
                    
                    "Bad Advice Cat",
                    
                    "Bad Joke Eel",
                    
                    "Bad Luck Bear",
                    
                    "Bad Luck Brian",
                    
                    "Bad Luck Hannah",
                    
                    "Bad Wife Worse Mom",
                    
                    "Bah Humbug",
                    
                    "Barack And Kumar 2013",
                    
                    "Barba",
                    
                    "Barbosa And Sparrow",
                    
                    "Barney Stinson Win",
                    
                    "Baromney",
                    
                    "Baron Creater",
                    
                    "Bart Simpson Peeking",
                    
                    "Batman And Superman",
                    
                    "Batman Slapping Robin",
                    
                    "Batman Smiles",
                    
                    "Bazooka Squirrel",
                    
                    "Bear Grylls",
                    
                    "Beard Baby",
                    
                    "Bebo",
                    
                    "Because Race Car",
                    
                    "Benito",
                    
                    "Beyonce Knowles Superbowl",
                    
                    "Beyonce Knowles Superbowl Face",
                    
                    "Beyonce Superbowl Yell",
                    
                    "Big Bird",
                    
                    "Big Bird And Mitt Romney",
                    
                    "Big Bird And Snuffy",
                    
                    "Big Ego Man",
                    
                    "Big Family Comeback",
                    
                    "Bill Murray Golf",
                    
                    "Bill Nye The Science Guy",
                    
                    "Bill OReilly",
                    
                    "Billy Graham Mitt Romney",
                    
                    "Blank Colored Background",
                    
                    "Blank Yellow Sign",
                    
                    "Blue Futurama Fry",
                    
                    "Boardroom Meeting Suggestion",
                    
                    "Bonobo Lyfe",
                    
                    "Booty Warrior",
                    
                    "Bothered Bond",
                    
                    "Brace Yourselves X is Coming",
                    
                    "Brian Burke On The Phone",
                    
                    "Brian Griffin",
                    
                    "Brian Wilson Vs ZZ Top",
                    
                    "Britney Spears",
                    
                    "Bubba And Barack",
                    
                    "Buddy Christ",
                    
                    "Buddy The Elf",
                    
                    "Burn Kitty",
                    
                    "Business Cat",
                    
                    "Butthurt Dweller",
                    
                    "CASHWAG Crew",
                    
                    "CURLEY",
                    
                    "Captain Hindsight",
                    
                    "Captain Picard Facepalm",
                    
                    "Casper",
                    
                    "Castaway Fire",
                    
                    "Cel Jesuno",
                    
                    "Cereal Guy",
                    
                    "Cereal Guy Spitting",
                    
                    "Cereal Guys Daddy",
                    
                    "Chad Johnson",
                    
                    "Chainsaw Bear",
                    
                    "Challenge Accepted Rage Face",
                    
                    "Charlie Sheen Derp",
                    
                    "Chavez",
                    
                    "Chef Gordon Ramsay",
                    
                    "Chemistry Cat",
                    
                    "Chester The Cat",
                    
                    "Chief Keef",
                    
                    "Chocolate Spongebob",
                    
                    "Chubby Bubbles Girl",
                    
                    "Chuck Norris Approves",
                    
                    "Chuckchuckchuck",
                    
                    "City Bear",
                    
                    "Cleavage Girl",
                    
                    "Close Enough",
                    
                    "College Freshman",
                    
                    "College Liberal",
                    
                    "Comic Book Guy",
                    
                    "Computer Guy",
                    
                    "Computer Guy Facepalm",
                    
                    "Computer Horse",
                    
                    "Condescending Goku",
                    
                    "Condescending Wonka",
                    
                    "Confession Bear",
                    
                    "Confused Cam",
                    
                    "Confused Gandalf",
                    
                    "Confused Lebowski",
                    
                    "Confused Mel Gibson",
                    
                    "Conspiracy Keanu",
                    
                    "Consuela",
                    
                    "Contradictory Chris",
                    
                    "Cool Obama",
                    
                    "Cool Story Bro",
                    
                    "Corona",
                    
                    "Coulson",
                    
                    "Courage Wolf",
                    
                    "Crazy Dawg",
                    
                    "Crazy Girlfriend Praying Mantis",
                    
                    "Crazy Hispanic Man",
                    
                    "Creeper Dog",
                    
                    "Criana",
                    
                    "Crosseyed Goku",
                    
                    "Crying Because Of Cute",
                    
                    "Cute Puppies",
                    
                    "DJ Pauly D",
                    
                    "Dafuq Did I Just Read",
                    
                    "Dallas Cowboys",
                    
                    "Dancing Trollmom",
                    
                    "Darth Maul",
                    
                    "Darti Boy",
                    
                    "Dat Ass",
                    
                    "Dating Site Murderer",
                    
                    "Dead Space",
                    
                    "Deadpool Pick Up Lines",
                    
                    "Depressed Cat",
                    
                    "Depression Dog",
                    
                    "Derp",
                    
                    "Derpina",
                    
                    "Determined Guy Rage Face",
                    
                    "Dexter",
                    
                    "Dick Cheney",
                    
                    "Disappointed Tyson",
                    
                    "Disaster Girl",
                    
                    "Do I Care Doe",
                    
                    "Dolph Ziggler Sells",
                    
                    "Dont You Squidward",
                    
                    "DoucheBag DJ",
                    
                    "Doug",
                    
                    "Down Syndrome",
                    
                    "Downcast Dark Souls",
                    
                    "Downvoting Roman",
                    
                    "Dr Crane",
                    
                    "Dr Evil",
                    
                    "Dr Evil Laser",
                    
                    "Drunk Baby",
                    
                    "Duck Face",
                    
                    "Duck Face Chicks",
                    
                    "Dwight Schrute",
                    
                    "Dwight Schrute 2",
                    
                    "ERMAHGERD TWERLERT",
                    
                    "Edu Camargo",
                    
                    "Edward Elric 1",
                    
                    "Efrain Juarez",
                    
                    "Eighties Teen",
                    
                    "Eminem",
                    
                    "Empty Red And Black",
                    
                    "Endel Tulviste",
                    
                    "Engineering Professor",
                    
                    "Epicurist Kid",
                    
                    "Ermahgerd Berks",
                    
                    "Ermahgerd Beyonce",
                    
                    "Ermahgerd IPHERN 3GM",
                    
                    "Error 404",
                    
                    "Evil Cows",
                    
                    "Evil Otter",
                    
                    "Evil Plotting Raccoon",
                    
                    "Evil Toddler",
                    
                    "Eye Of Sauron",
                    
                    "FFFFFFFUUUUUUUUUUUU",
                    
                    "FRANGO",
                    
                    "Fabulous Frank And His Snake",
                    
                    "Facepalm Bear",
                    
                    "Fake Hurricane Guy",
                    
                    "Family Guy Brian",
                    
                    "Family Guy Peter",
                    
                    "Family Tech Support Guy",
                    
                    "Fast Furious Johnny Tran",
                    
                    "Fat Cat",
                    
                    "Fat Val Kilmer",
                    
                    "Father Ted",
                    
                    "Fear And Loathing Cat",
                    
                    "Feels Bad Frog - Feels Bad Man",
                    
                    "Felix Baumgartner",
                    
                    "Felix Baumgartner Lulz",
                    
                    "Fernando Litre",
                    
                    "Fifa E Call Of Duty",
                    
                    "Fim De Semana",
                    
                    "Fini",
                    
                    "Finn The Human",
                    
                    "First Day On The Internet Kid",
                    
                    "First World Frat Guy",
                    
                    "First World Problems",
                    
                    "First World Problems Cat",
                    
                    "First World Stoner Problems",
                    
                    "Fk Yeah",
                    
                    "Flavor Flav",
                    
                    "Foal Of Mine",
                    
                    "Folean Dynamite",
                    
                    "Forever Alone",
                    
                    "Forever Alone Christmas",
                    
                    "Forever Alone Happy",
                    
                    "Foul Bachelor Frog",
                    
                    "Foul Bachelorette Frog",
                    
                    "Friend Zone Fiona",
                    
                    "Frowning Nun",
                    
                    "Frustrated Boromir",
                    
                    "Frustrating Mom",
                    
                    "Futurama Fry",
                    
                    "Futurama Leela",
                    
                    "Futurama Zoidberg",
                    
                    "Gaga Baby",
                    
                    "Gandhi",
                    
                    "Gangnam Style",
                    
                    "Gangnam Style PSY",
                    
                    "Gangnam Style2",
                    
                    "Gangster Baby",
                    
                    "Gasp Rage Face",
                    
                    "George Bush",
                    
                    "George Washington",
                    
                    "Ghetto Jesus",
                    
                    "Ghost Nappa",
                    
                    "Giovanni Vernia",
                    
                    "Give me Karma - Beating the dead horse",
                    
                    "Gladys Falcon",
                    
                    "Gollum",
                    
                    "Good Guy Greg",
                    
                    "Good Guy Pizza Rolls",
                    
                    "Good Guy Socially Awkward Penguin",
                    
                    "Google Chrome",
                    
                    "Gordo",
                    
                    "Got Room For One More",
                    
                    "Gotta Go Cat",
                    
                    "Grandma Finds The Internet",
                    
                    "Green Day",
                    
                    "Grumpy Cat",
                    
                    "Grumpy Cat Bed",
                    
                    "Grumpy Cat Christmas",
                    
                    "Grumpy Cat Does Not Believe",
                    
                    "Grumpy Cat Mistletoe",
                    
                    "Grumpy Cat Reverse",
                    
                    "Grumpy Cat Sky",
                    
                    "Grumpy Cat Table",
                    
                    "Grumpy Cat Top Hat",
                    
                    "Grumpy Cats Father",
                    
                    "Grumpy Toad",
                    
                    "Guinness World Record",
                    
                    "Guy Fawkes",
                    
                    "Hal Jordan",
                    
                    "Hamtaro",
                    
                    "Happy Guy Rage Face",
                    
                    "Happy Minaj",
                    
                    "Happy Minaj 2",
                    
                    "Happy Star Congratulations",
                    
                    "Hardworking Guy",
                    
                    "Harmless Scout Leader",
                    
                    "Harper WEF",
                    
                    "Harry Potter Ok",
                    
                    "Hawkward",
                    
                    "He Needs The Vaccine",
                    
                    "He Will Never Get A Girlfriend",
                    
                    "Headbanzer",
                    
                    "Headless Rider DRRR",
                    
                    "Hedonism Bot",
                    
                    "Hello Kassem",
                    
                    "Helpful Tyler Durden",
                    
                    "Henry David Thoreau",
                    
                    "Hercules Hades",
                    
                    "Heres Johnny",
                    
                    "Herm Edwards",
                    
                    "Hide Yo Kids Hide Yo Wife",
                    
                    "High Dog",
                    
                    "High Expectations Asian Father",
                    
                    "Hipster Ariel",
                    
                    "Hipster Barista",
                    
                    "Hipster Kitty",
                    
                    "Hohoho",
                    
                    "Homophobic Seal",
                    
                    "Hoody Cat",
                    
                    "Hora Extra",
                    
                    "Hornist Hamster",
                    
                    "Horny Harry",
                    
                    "Hot Caleb",
                    
                    "Hot Scale",
                    
                    "Hotline Miami Richard",
                    
                    "House Bunny",
                    
                    "How About No Bear",
                    
                    "How Tough Are You",
                    
                    "Hypnotoad",
                    
                    "Hypocritical Islam Terrorist",
                    
                    "Hysterical Tom",
                    
                    "I Am Not A Gator Im A X",
                    
                    "I Forsee",
                    
                    "I Have No Idea What I Am Doing",
                    
                    "I Know Fuck Me Right",
                    
                    "I Lied 2",
                    
                    "I See Dead People",
                    
                    "I Should Buy A Boat Cat",
                    
                    "I Too Like To Live Dangerously",
                    
                    "I Will Find You And Kill You",
                    
                    "Idiot Nerd Girl",
                    
                    "Idiotaco",
                    
                    "If You Know What I Mean Bean",
                    
                    "Ill Have You Know Spongebob",
                    
                    "Ill Just Wait Here",
                    
                    "Im Curious Nappa",
                    
                    "Im Fabulous Adam",
                    
                    "Imagination Spongebob",
                    
                    "Impossibru Guy Original",
                    
                    "Inception",
                    
                    "Innocent Sasha",
                    
                    "Insanity Puppy",
                    
                    "Insanity Wolf",
                    
                    "Intelligent Dog",
                    
                    "Internet Explorer",
                    
                    "Internet Guide",
                    
                    "Interupting Kanye",
                    
                    "Invalid Argument Vader",
                    
                    "Islam Rage - Angry Muslim",
                    
                    "Its Finally Over",
                    
                    "Jack Sparrow Being Chased",
                    
                    "Jackie Chan WTF",
                    
                    "Jammin Baby",
                    
                    "Jay Knows Facts",
                    
                    "Jehovas Witness Squirrel",
                    
                    "Jerkoff Javert",
                    
                    "Jersey Santa",
                    
                    "Jessica Nigri Cosplay",
                    
                    "Jesus Talking To Cool Dude",
                    
                    "Jim Lehrer The Man",
                    
                    "Joe Biden",
                    
                    "John Riley Condescension",
                    
                    "Joker Rainbow Hands",
                    
                    "Jon Stewart Skeptical",
                    
                    "Joo Espontneo",
                    
                    "Joseph Ducreux",
                    
                    "Justin Bieber Suit",
                    
                    "Karate Kyle",
                    
                    "Keep Calm And Carry On Aqua",
                    
                    "Keep Calm And Carry On Purple",
                    
                    "Keep Calm And Carry On Red",
                    
                    "Kevin Hart The Hell",
                    
                    "Kill You Cat",
                    
                    "Kill Yourself Guy",
                    
                    "Kim Jong Il Y U No",
                    
                    "Kim Jong Un Sad",
                    
                    "Kobe",
                    
                    "Kool Kid Klan",
                    
                    "Kyon Face Palm",
                    
                    "LIGAF",
                    
                    "LOL Guy",
                    
                    "Lame Pun Coon",
                    
                    "Larfleeze",
                    
                    "Larry The Cable Guy",
                    
                    "Laughing Men In Suits",
                    
                    "Laughing Villains",
                    
                    "Laundry Viking",
                    
                    "Lazy College Senior",
                    
                    "Legal Bill Murray",
                    
                    "Lethal Weapon Danny Glover",
                    
                    "Lewandowski E Reus",
                    
                    "Liam Neeson Taken",
                    
                    "Life Sucks",
                    
                    "Lil Wayne",
                    
                    "Lion King",
                    
                    "Little Romney",
                    
                    "Look At All These",
                    
                    "Luiz Fabiano",
                    
                    "Macklemore Thrift Store",
                    
                    "Mad Money Jim Cramer",
                    
                    "Mad Moxxi",
                    
                    "Malicious Advice Mallard",
                    
                    "Mamimoe",
                    
                    "Manning Broncos",
                    
                    "Mario Hammer Smash",
                    
                    "Maroney And Obama Not Impressed",
                    
                    "Matanza",
                    
                    "Matrix Morpheus",
                    
                    "Mayu Watanabe",
                    
                    "McKayla Maroney Not Impressed",
                    
                    "McKayla Maroney Not Impressed2",
                    
                    "McMelch",
                    
                    "Mega Rage Face",
                    
                    "Meme Dad Creature",
                    
                    "Memeo",
                    
                    "Men Laughing",
                    
                    "Merida Brave",
                    
                    "Metal Jesus",
                    
                    "Mexican Pizza",
                    
                    "Minegishi Minami",
                    
                    "Minegishi Minami2",
                    
                    "Misunderstood Mitch",
                    
                    "Mitch McConnell",
                    
                    "Modern Warfare 3",
                    
                    "Molly Weasley",
                    
                    "Money Man",
                    
                    "Money Money",
                    
                    "Monkey Business",
                    
                    "Monkey OOH",
                    
                    "Morgan Freeman Good Luck",
                    
                    "Mother Of God",
                    
                    "Mozart Not Sure",
                    
                    "Mr Black Knows Everything",
                    
                    "Mr Mackey",
                    
                    "Mr T",
                    
                    "Mr T Pity The Fool",
                    
                    "Murica",
                    
                    "Muschamp",
                    
                    "Musically Oblivious 8th Grader",
                    
                    "Nabilah Jkt48",
                    
                    "Nailed It",
                    
                    "Nakagawa Haruka",
                    
                    "Natsu",
                    
                    "Neil deGrasse Tyson",
                    
                    "Net Noob",
                    
                    "Nice Guy Loki",
                    
                    "Nickleback",
                    
                    "Nicolas Cage - You don't say",
                    
                    "Nilo",
                    
                    "Nissim Ourfali",
                    
                    "No I Cant Obama",
                    
                    "No Nappa Its A Trick",
                    
                    "No Patrick",
                    
                    "Not Bad Obama",
                    
                    "Not Okay Rage Face",
                    
                    "Not a Meme, Just Boobs",
                    
                    "Nuclear Explosion",
                    
                    "OMG Karen",
                    
                    "Obama",
                    
                    "Obama Cowboy Hat",
                    
                    "Obama Romney Pointing",
                    
                    "Obi Wan Kenobi",
                    
                    "Oblivious Hot Girl",
                    
                    "Officer Cartman",
                    
                    "Oh My God Orange",
                    
                    "Oh No",
                    
                    "Okay Guy Rage Face",
                    
                    "Okay Guy Rage Face2",
                    
                    "Okay Truck",
                    
                    "Oku Manami",
                    
                    "Onde",
                    
                    "One Does Not Simply",
                    
                    "Optimistic Niall",
                    
                    "Ordinary Muslim Man",
                    
                    "Original Bad Luck Brian",
                    
                    "Original I Lied",
                    
                    "Original Stoner Dog",
                    
                    "Osabama",
                    
                    "Our Glorious Leader Nicolas Cage",
                    
                    "Over Educated Problems",
                    
                    "Overjoyed",
                    
                    "Overly Attached Father",
                    
                    "Overly Attached Girlfriend",
                    
                    "Overly Attached Nicolas Cage",
                    
                    "Overly Manly Man",
                    
                    "PTSD Clarinet Boy",
                    
                    "Packers",
                    
                    "Papa Fking John",
                    
                    "Paranoid Parrot",
                    
                    "Pat Quinn",
                    
                    "Pathetic Spidey",
                    
                    "Patrick Henry",
                    
                    "Patrick Says",
                    
                    "Patriotic Eagle",
                    
                    "Paul Ryan",
                    
                    "Paul Wonder Years",
                    
                    "Pedobear",
                    
                    "Pedophile Orochimaru",
                    
                    "Penguin Gang",
                    
                    "Pepperidge Farm Remembers",
                    
                    "Permission Bane",
                    
                    "Perturbed Portman",
                    
                    "Peter Griffin News",
                    
                    "Peter Parker Cry",
                    
                    "Philosoraptor",
                    
                    "Photogenic Scene Guy",
                    
                    "Picard Wtf",
                    
                    "Pickup Line Panda",
                    
                    "Pickup Master",
                    
                    "Pickup Professor",
                    
                    "Pillow Pet",
                    
                    "Pink Escalade",
                    
                    "Pissed Off Obama",
                    
                    "Police Officer Testifying",
                    
                    "Pony Shrugs",
                    
                    "Pope Nicolas Cage",
                    
                    "Portuguese",
                    
                    "Pothead Fry",
                    
                    "Predator",
                    
                    "Premature Pete",
                    
                    "Priority Peter",
                    
                    "Professor Oak",
                    
                    "Proper Lady",
                    
                    "Psy Horse Dance",
                    
                    "Put It Somewhere Else Patrick",
                    
                    "Question Rage Face",
                    
                    "Questionable Strategy Kobe",
                    
                    "Quit Hatin",
                    
                    "RPG Fan",
                    
                    "Rarity",
                    
                    "Rasta Science Teacher",
                    
                    "Really Evil College Teacher",
                    
                    "Rebecca Black",
                    
                    "Redditors Wife",
                    
                    "Rediculously Well Mannered Athlete",
                    
                    "Redneck Randal",
                    
                    "Reimu Hakurei",
                    
                    "Relaxed Office Guy",
                    
                    "Religious Couple",
                    
                    "Rena Matsui",
                    
                    "Rich Guy Dont Care",
                    
                    "Rich Raven",
                    
                    "Richard Benson",
                    
                    "Rick Grimes",
                    
                    "Ridiculously Photogenic Guy",
                    
                    "Ridiculously Photogenic Judge",
                    
                    "Right In The Childhood",
                    
                    "Rmoney Again",
                    
                    "Rob In The Hood",
                    
                    "Robots",
                    
                    "Rocket Raccoon",
                    
                    "Rodgers Doublecheck",
                    
                    "Romney",
                    
                    "Romney And Ryan",
                    
                    "Romney Bong",
                    
                    "Romneys Hindenberg",
                    
                    "Ron Burgundy",
                    
                    "Ron Swanson",
                    
                    "Ryan Gosling",
                    
                    "Sad Axl",
                    
                    "Sad Baby",
                    
                    "Sad Cat",
                    
                    "Sad Keanu",
                    
                    "Sad Spiderman",
                    
                    "Sad X All The Y",
                    
                    "Sadly I Am Only An Eel",
                    
                    "Samuel Jackson Glance",
                    
                    "Samuel L Jackson",
                    
                    "Sarcastic Anthony",
                    
                    "Sassy Iguana",
                    
                    "Saw Fulla",
                    
                    "Say That Again I Dare You",
                    
                    "Scary Harry",
                    
                    "Scene Wolf",
                    
                    "Scooby Doo",
                    
                    "Scott Howson",
                    
                    "Scrooge McDuck",
                    
                    "Scrooge McDuck 2",
                    
                    "Scumbag Brain",
                    
                    "Scumbag Daylight Savings Time",
                    
                    "Scumbag Girl",
                    
                    "Scumbag MSNBC",
                    
                    "Scumbag Minecraft",
                    
                    "Scumbag Miraak",
                    
                    "Scumbag Muslim",
                    
                    "Scumbag Parents",
                    
                    "Scumbag Redditor",
                    
                    "Scumbag Steve",
                    
                    "Secure Parking",
                    
                    "Self Loathing Otter",
                    
                    "Selfish Ozzy",
                    
                    "Sergeant Hartmann",
                    
                    "Serious Xzibit",
                    
                    "Seriously Face",
                    
                    "Sexual Deviant Walrus",
                    
                    "Sexually Oblivious Girlfriend",
                    
                    "Sexually Oblivious Rhino",
                    
                    "Sexy Railroad Spiderman",
                    
                    "Shaq Only Smokes The Dankest",
                    
                    "Sheltering Suburban Mom",
                    
                    "Shocked Ape",
                    
                    "Shouter",
                    
                    "Shut Up And Take My Money Fry",
                    
                    "Shutup Batty Boy",
                    
                    "Sidious Error",
                    
                    "Sigmund Freud",
                    
                    "Simba Shadowy Place",
                    
                    "Simpsons Grandpa",
                    
                    "Simsimi",
                    
                    "Since When Were You Under The Impression",
                    
                    "Sinestro",
                    
                    "Skeptical Baby",
                    
                    "Skeptical Swardson",
                    
                    "Skinhead John Travolta",
                    
                    "Skype",
                    
                    "Slenderman",
                    
                    "Slick Fry",
                    
                    "Slowpoke",
                    
                    "Small Face Romney",
                    
                    "Smilin Biden",
                    
                    "Smiling Jesus",
                    
                    "Smirk Rage Face",
                    
                    "Snape",
                    
                    "So God Made A Farmer",
                    
                    "So I Guess You Can Say Things Are Getting Pretty Serious",
                    
                    "So Many Shirts",
                    
                    "So Much Drama",
                    
                    "Socially Awesome Awkward Penguin",
                    
                    "Socially Awesome Penguin",
                    
                    "Socially Awkward Awesome Penguin",
                    
                    "Socially Awkward Couple",
                    
                    "Socially Awkward Penguin",
                    
                    "Solemn Lumberjack",
                    
                    "Sotally Tober",
                    
                    "South Park Craig",
                    
                    "Spacey Casey",
                    
                    "Spangles",
                    
                    "Sparta Leonidas",
                    
                    "Speechless Colbert Face",
                    
                    "Spiderman Camera",
                    
                    "Spiderman Computer Desk",
                    
                    "Spiderman Hospital",
                    
                    "Spiderman Laugh",
                    
                    "Spiderman Peter Parker",
                    
                    "Squidward",
                    
                    "Stephen Harper Podium",
                    
                    "Steve Harvey",
                    
                    "Steve Jobs",
                    
                    "Stoner Dog",
                    
                    "Stoner PhD",
                    
                    "Stop Cop",
                    
                    "Storytelling Grandpa",
                    
                    "Subtle Pickup Liner",
                    
                    "Success Kid",
                    
                    "Success Kid Girl",
                    
                    "Success Kid Original",
                    
                    "Successful Black Man",
                    
                    "Sudden Clarity Clarence",
                    
                    "Sudden Disgust Danny",
                    
                    "Super Birthday Squirrel",
                    
                    "Super Cool Ski Instructor",
                    
                    "Super Kami Guru Allows This",
                    
                    "Superior Wadsworth",
                    
                    "Surpised Frodo",
                    
                    "Surprised CatMan",
                    
                    "Surprised Coala",
                    
                    "Surprised Koala",
                    
                    "Surprized Vegeta",
                    
                    "Suspicious Cat",
                    
                    "Sweaty Concentrated Rage Face",
                    
                    "TED",
                    
                    "TSA Douche",
                    
                    "Table Flip Guy",
                    
                    "Take A Seat Cat",
                    
                    "Talk To Spongebob",
                    
                    "Tamou",
                    
                    "Team Rocket",
                    
                    "Tears Of Joy",
                    
                    "Tech Impaired Duck",
                    
                    "Tennis Defeat",
                    
                    "That Would Be Great",
                    
                    "The Bobs",
                    
                    "The Critic",
                    
                    "The Most Interesting Cat In The World",
                    
                    "The Most Interesting Justin Bieber",
                    
                    "The Most Interesting Man In The World",
                    
                    "The Probelm Is",
                    
                    "The Rock Driving",
                    
                    "The Rock It Doesnt Matter",
                    
                    "These Arent The Droids You Were Looking For",
                    
                    "Third World Skeptical Kid",
                    
                    "Third World Success Kid",
                    
                    "Time To Fap",
                    
                    "Tom Hardy ",
                    
                    "Tomas Rosicky",
                    
                    "Too Damn High",
                    
                    "Too Drunk At Party Tina",
                    
                    "Too Kool Kyle",
                    
                    "Torreshit",
                    
                    "Tough Guy Wanna Be",
                    
                    "Trailer Park Boys Bubbles",
                    
                    "Travelonshark",
                    
                    "Troll Face",
                    
                    "Troll Face Colored",
                    
                    "True Story",
                    
                    "Turkey",
                    
                    "USA Lifter",
                    
                    "Ugly Twins",
                    
                    "Unhappy Baby",
                    
                    "Unhelpful High School Teacher",
                    
                    "Unicorn MAN",
                    
                    "Unpopular Opinion Puffin",
                    
                    "Unwanted House Guest",
                    
                    "V For Vendetta",
                    
                    "Vali Corleone",
                    
                    "Vengeance Dad",
                    
                    "Viking Dudes",
                    
                    "Vladimir Putin",
                    
                    "WTF",
                    
                    "Warning Sign",
                    
                    "We Will Rebuild",
                    
                    "Welcome To The Internets",
                    
                    "Well That Escalated Quickly",
                    
                    "What Year Is It",
                    
                    "Whisper Sloth",
                    
                    "Why Cant I",
                    
                    "Why Is The Rum Gone",
                    
                    "Why Not Both",
                    
                    "Will Ferrell",
                    
                    "Woah Kitty",
                    
                    "Wrong Neighboorhood Cats",
                    
                    "Wrong Number Rita",
                    
                    "X All The Y",
                    
                    "X, X Everywhere",
                    
                    "Y U No",
                    
                    "Yakuza",
                    
                    "Yao Ming",
                    
                    "Yo Dawg Heard You",
                    
                    "Yo Mamas So Fat",
                    
                    "You Don't Say",
                    
                    "You Dont Want No Part Of This",
                    
                    "You Get An X And You Get An X",
                    
                    "You Should Feel Bad Zoidberg",
                    
                    "You Underestimate My Power",
                    
                    "Young And Reckless",
                    
                    "Youre Too Slow Sonic",
                    
                    "Yuko With Gun",
                    
                    "ZNMD",
                    
                    "Zoidberg Jesus",
                    
                    "Zombie Bad Luck Brian",
                    
                    "Zombie Overly Attached Girlfriend",
                    
                    "Zorg",
                    
                    "Zuckerberg",
                    
                    "Zura Janai Katsura Da"
                    
					];
	var userInput = document.activeElement;
	var meme = "";
	var caption1 = "";
	var caption2 = "";
	var returnedLink = "";
	var status = false;
	if (userInput){
		var userText = userInput.value;
		if (userText.match(/-m/g)){
			//alert(userText);
			var params = userText.split("\"");
			console.log(params);
			if (params.length != 0){
				if (params.length != 7) { 
					//alert("too many or too little params yo!");
				}else{
					meme = params[1];
					caption1 = params[3];
					caption2 = params[5];
					for (var i = 0; i < memeList.length; i++)
					{
						if (memeList[i].toLowerCase() === meme.toLowerCase()) {
							//alert(memeList[i]);
							var beforeCommand = userText.split('-m')[0];
							var afterCommand = userText.split(caption2+'"')[1];
							document.activeElement.value = "Hold Tight bro~";
							status = true;
							getMeme(memeList[i], caption1, caption2)
								.done(function(returnedLink){
									document.activeElement.value = beforeCommand + returnedLink + afterCommand; 
									
									var myElement = document.activeElement;
									var divElement = $("#" + myElement.id);
									var thisIsIt = divElement.parent().parent().parent().siblings("input");
									var newLink = returnedLink.substring(7);
									thisIsIt.val(beforeCommand + newLink + afterCommand);
								});
							
							break;
						}
					}		
					if (!status){
						alert("Meme Not Found!\nClick the instaMeme Extension Icon.");
						chrome.runtime.sendMessage({meme: meme, caption1: caption1, caption2: caption2}, function(response) {
							console.log(response.meme);
							
						});
					}
				}
			}
		}
	}
	function getMeme(meme_name, top_text, bottom_text, receiveImgurLink) {
		console.log(meme_name + " " + top_text + " " + bottom_text);
		var returnLink = $.Deferred();
		var data = '{"image" : "http://apimeme.com/meme?meme='+replaceSpace(meme_name)+'&top='+replaceSpace(top_text)+'&bottom='+replaceSpace(bottom_text)+'"}';

		console.log(data);

		$.ajax({
		type:"POST",
		beforeSend: function (request)
		{
		request.setRequestHeader('Authorization', 'Client-ID a9b43a4f9f21b99');
		},
		url: "https://api.imgur.com/3/upload",
		data: data,
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		success: function(msg) {
		console.log(msg.data.link);
		var memeLink = msg.data.link;
		returnLink.resolve(memeLink);
		}
		});

		console.log("done");
		return returnLink.promise();
	}
	
	function replaceSpace ( str){

		
		var result = str.trim().split(" ").join("+");
	
		return result;
	}
});

var temp = "OMG";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (!sender.tab) {
		
		var userText = document.activeElement.value;
		
		document.activeElement.value = "Hold Tight bro~";
		status = true;
		getMeme(request.meme, request.caption1, request.caption2)
		.done(function(returnedLink){
			document.activeElement.value = returnedLink; 
			
			var myElement = document.activeElement;
			var divElement = $("#" + myElement.id);
			var thisIsIt = divElement.parent().parent().parent().siblings("input");
			var newLink = returnedLink;
			thisIsIt.val(newLink);
		});
	}
	
	
	function getMeme(meme_name, top_text, bottom_text, receiveImgurLink) {
		console.log(meme_name + " " + top_text + " " + bottom_text);
		var returnLink = $.Deferred();
		var data = '{"image" : "http://apimeme.com/meme?meme='+replaceSpace(meme_name)+'&top='+replaceSpace(top_text)+'&bottom='+replaceSpace(bottom_text)+'"}';

		console.log(data);

		$.ajax({
		type:"POST",
		beforeSend: function (request)
		{
		request.setRequestHeader('Authorization', 'Client-ID a9b43a4f9f21b99');
		},
		url: "https://api.imgur.com/3/upload",
		data: data,
		contentType:"application/json; charset=utf-8",
		dataType: "json",
		success: function(msg) {
		console.log(msg.data.link);
		var memeLink = msg.data.link;
		returnLink.resolve(memeLink);
		}
		});

		console.log("done");
		return returnLink.promise();
	}
	
	function replaceSpace ( str){

		
		var result = str.trim().split(" ").join("+");
	
		return result;
	}
  });


