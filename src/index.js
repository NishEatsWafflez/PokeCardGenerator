import React from 'react';
import './styles.css';
import {useState} from 'react';
import ReactDOM from 'react-dom/client';
const colorList = {
	water: ["#4EBAE9", "#459abf", "#7bc3e3"],
	fire: ["#eb6607", "#731212", "#e32b2b"],
	normal: ["#E0CFB9", "#ad9f8c", "#deceb8"],
	grass: ["#7AC815", "#518709", "#a3ed40"],
	electric: ["#F3E135", "#cfbf29", "#f7e640"],
	ice:["#61C1EC", "#377e9e", "#82d1f5"],
	fighting: ["#E09230", "#b57424", "#f0a64a"],
	poison: ["#7A4F9F", "#4d2e69", "#724699"],
	ground: ["#E5750D", "#a8570a", "#de7e23"],
	flying: ["#EBECE6", "#bbbdb5", "#ecede8"],
	psychic: ["#AF72B3", "#8b548f", "#b98cbd"],
	bug: ["#B6D36C", "#8aa34b", "#c9e386"],
	rock: ["#E08830", "#a15e1b", "#e6a05a"],
	ghost: ["#A84DC2", "#6d2e80", "#a756bf"],
	dark: ["#355e69", "#152f36", "#2d525c"],
	dragon: ["#AFAA13", "#7a770f", "#9e9a1c"],
	steel: ["#8F968F", "#717571", "#a8ada8"],
	fairy: ["#DC4785", "#9c305d", "#bf4176"]
}
const Move = (props) => {
	return(
		<div class = "pokeMove"> 
			<div class = "moveName "> {props.name}</div>
				{props.Desc}
		</div>

	)
}
const Movelist = (props) =>{
	return(
			<div class = "pokeMoves">
				<Move name = {`Ability: ${props.ability}`} Desc = {props.abilityDesc} />
				<Move name = {props.move1} Desc = {props.move1Desc} />
				{props.singleMove ?
					<div class = "pokeMove"> </div>:
					<Move name = {props.move2} Desc = {props.move2Desc} />
				}	
			</div>

	)
}
const Pokemondisplay = (props) =>{
	return(
		<div class = "card" style={{backgroundColor: props.color[0]}}>
			<div class = "header">
				<div class = "pokeName"> {toTitleCase(props.name)} </div>
				{props.singleType ?
					<div class = "pokeTypes">
					<img class = "pokeType" src={require(`./${props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)}type.ico`)} />
					</div>
					:
					<div class = "pokeTypes">
					<img class = "pokeType" src={require(`./${props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)}type.ico`)} />
					<img class = "pokeType" src={require(`./${props.type2.charAt(0).toUpperCase()+ props.type2.slice(1)}type.ico`)} />
					</div>
					/*<div class = "pokeType"> {props.type1.charAt(0).toUpperCase()+ props.type1.slice(1)} {props.type2.charAt(0).toUpperCase() + props.type2.slice(1)}</div>*/
				}
			</div>
			<div class = "pokeBox" style={{backgroundImage: `linear-gradient(to left, ${props.color[1]}, ${props.color[2]})`}}>
				<img class = "pokeImage" src = {props.image} />
			</div>
			<Movelist ability = {props.ability} move1 = {props.move1} move2 = {props.move2} abilityDesc ={props.abilityDesc} move1Desc = {props.move1Desc} move2Desc = {props.move2Desc} singleMove = {props.singleMove}/>
		</div>
	)
}
const InputForm = () => {
	const [title, updateTitle] = useState(''); //allows user input to be visible in text box
	const [image, updateImage] = useState(''); //url to pokemon sprite
	const [name, updateName] = useState(''); // Pokemon name
	const [ability, updateAbility] = useState(null); // Pokemon ability
	const [abilityDesc, updateAbilityDesc] = useState(null); //Pokemon ability description
	const [move1, updateMove] = useState(''); //Pokemon move 1 name
	const [move2, updateMove2] = useState(''); // Pokemon move 2 name
	const [move1Desc, updateMove1Desc] = useState(''); // Pokemon move 1 description
	const [move2Desc, updateMove2Desc] = useState(''); // move 2 description
	const [type, updateType] = useState(''); //Pokemon type
	const [type2, updateType2] = useState(''); // Pokemon second type
	const [singleType, updateSingularType] = useState(true); //checks if pokemon has 1 type or 2
	const [displayCard, updateDisplay] = useState(false); // checks if pokemon card is being displayed
	const [singleMove, updateSingle] = useState(false); //checks if pokemon has more than 1 move (ex: ditto)
	const [cardColor, changeColor] = useState("normal"); //Checks card color (based on type 1)
	const [error, setError] = useState(null); //checks if any errors exist
	const handleError = response => {
		if (!response.ok) { 
			throw Error(response.statusText);
		} else {
			return response.json();
		}
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {title};
		console.log(data);
		fetch(`https://pokeapi.co/api/v2/pokemon/${hyphenate(title)}`)
			.then(response => {
				if (!response.ok){
					throw Error('Sorry. Something went wrong. \n Please check your spelling or try a different Pokemon');
				}
				return response.json();
			})
			.then(data => {
				console.log(data);
				if (data.sprites == undefined) {
					throw Error("Sorry. Something went wrong. Please check your spelling or try a different Pokemon");
				}
				if (data.sprites.other.dream_world.front_default){
					updateImage(data.sprites.other.dream_world.front_default);
				}
				else if (data.sprites.other["official-artwork"].front_default){
					updateImage(data.sprites.other["official-artwork"].front_default);
				}else{
					updateImage(data.sprites.front_default);
				}
				changeColor(data.types[0].type.name);
				//updateImage(`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${data.id}.svg`);
				updateName(data.name);
				let ability = data.abilities[Math.floor(Math.random()*data.abilities.length)].ability;
				updateAbility(toTitleCase(ability.name));
					fetch(ability.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let abilityDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								abilityDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateAbilityDesc(abilityDesc);
						});
				if (data.types.length == 2){
					let type1 = data.types[0].type.name;
					let type2 = data.types[1].type.name;
					updateType(type1);
					updateType2(type2);
					updateSingularType(false);
				} else{
					console.log(data.types[0].type.name)
					const types = data.types[0].type.name;
					updateType(types);
					updateSingularType(true);
				}
				if (data.moves.length == 1){
					updateSingle(true);
					const move = data.moves[0].move;
					move.name = move.name.replace(/-/g, ' ');
					let moveDesc;
					fetch(move.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let moveDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								moveDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove1Desc(moveDesc);
						});
					updateMove(toTitleCase(move.name));
					updateDisplay(true);
				}else{
					updateSingle(false);
					let move = data.moves[Math.floor(Math.random()*data.moves.length)].move;
					let move2 = data.moves[Math.floor(Math.random()*data.moves.length)].move;
					while (move2 == move){
						move2 = data.moves[Math.floor(Math.random()*data.moves.length)].move.name;
					}
					fetch(move.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let i = 0;
							let moveDesc = data.flavor_text_entries[i].flavor_text;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								moveDesc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove1Desc(moveDesc);
						});
					fetch(move2.url)
						.then(response => response.json())
						.then(data =>{
							console.log(data.flavor_text_entries[1].flavor_text);
							let move2Desc = data.flavor_text_entries[1].flavor_text;
							let i = 0;
							while (data.flavor_text_entries[i].language.name != "en"){
								i++;
								move2Desc = data.flavor_text_entries[i].flavor_text;
							}
							updateMove2Desc(move2Desc);
						});
					console.log(move2);
					move.name = move.name.replace(/-/g, ' ');
					move2.name = move2.name.replace(/-/g, ' ');
					updateMove(toTitleCase(move.name));
					updateMove2(toTitleCase(move2.name));
					updateDisplay(true);

				}
			})
			.catch(err => {
				updateDisplay(false);
				setError(err.message);
			});
	}
		return(
			<div>
				<div class = "welcome"> 
			<div>Welcome to the Pokemon Card Generator.</div> 
			<div> To use, simply type the name of any Pokemon and press the Pokeball to generate a Pokemon Card. </div>
			</div>
			<div class = "mainDiv">
				<div>
			{displayCard ? 
			
				<div>
					<Pokemondisplay singleType = {singleType} move1Desc = {move1Desc} singleMove = {singleMove} move2Desc = {move2Desc} type1 = {type} 
					type2 = {type2} name = {name} image = {image} color = {colorList[cardColor]} move1 = {move1} move2 = {move2} ability = {ability} abilityDesc = {abilityDesc}/>
				</div>
				:
				 <div> {error} </div>
			}
			<div>
				<form class = "submitForm" onSubmit={handleSubmit}>
					<div class = "inputForm" >
						<input 
							type="text" 
							placeholder = "name" 
							value = {title}
							onChange={(e)=>updateTitle(e.target.value)}
						/>
					</div>
					<div class = "button">
			        <input type = "image" src = {require("./pokeball.jpg")} class = "button" alt = "Submit"/>
					</div>
				</form>
			</div>			
			</div>			
			</div>
			</div>
		)	
}

function toTitleCase(str) {
  str = str.replace(/-/g, ' ');
  return (str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  ));
}
function hyphenate(str){
	str = str.split('.').join("");
	return (str.replace(/\s+/g, "-").toLowerCase());
}
const root = ReactDOM.createRoot(document.getElementById('root'));
const element = <InputForm/>;
root.render(element);
